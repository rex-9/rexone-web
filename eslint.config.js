import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import babelParser from '@babel/parser'
import globals from 'globals'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { __unstable__loadDesignSystem } = require('@tailwindcss/node')

const cssPath = path.join(__dirname, 'src/index.css')
const originalLog = console.log
let designSystem
try {
  console.log = () => {}
  designSystem = await __unstable__loadDesignSystem(
    fs.readFileSync(cssPath, 'utf8'),
    { base: path.dirname(cssPath) },
  )
} finally {
  console.log = originalLog
}

const canonicalCache = new Map()

function getCanonicalClass(token) {
  if (!token.includes('-') && !token.includes('[') && !token.includes('!')) {
    return token
  }
  if (
    token.startsWith('http') ||
    token.startsWith('/') ||
    token.startsWith('.') ||
    token.endsWith(':') ||
    token.includes('=') ||
    token.includes('?') ||
    token.includes('$') ||
    !/^[!-]?[a-zA-Z0-9_:/\-[\].%#(),!]+$/.test(token)
  ) {
    return token
  }
  const cached = canonicalCache.get(token)
  if (cached !== undefined) {
    return cached
  }
  const css = designSystem.candidatesToCss([token])
  let result = token
  if (css && css[0]) {
    const canonical = designSystem.canonicalizeCandidates([token], { rem: 16 })
    if (canonical && canonical[0]) {
      result = canonical[0]
    }
  }
  canonicalCache.set(token, result)
  return result
}

const tailwindCanonicalPlugin = {
  rules: {
    'canonical-classes': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce canonical Tailwind CSS v4 class names',
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        function checkTextNode(node, rawValue) {
          const parent = node.parent
          if (
            parent &&
            (parent.type === 'ImportDeclaration' ||
              parent.type === 'ExportAllDeclaration' ||
              (parent.type === 'ExportNamedDeclaration' && parent.source === node) ||
              (parent.type === 'Property' && parent.key === node && !parent.computed))
          ) {
            return
          }

          const tokens = rawValue.split(/\s+/).filter(Boolean)
          for (const token of tokens) {
            const canonical = getCanonicalClass(token)
            if (canonical !== token) {
              context.report({
                node,
                message: `Non-canonical Tailwind class "${token}". Use "${canonical}" instead.`,
                fix(fixer) {
                  const sourceText = context.sourceCode.getText(node)
                  const updatedText = sourceText.replace(token, canonical)
                  return fixer.replaceText(node, updatedText)
                },
              })
            }
          }
        }

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              checkTextNode(node, node.value)
            }
          },
          TemplateElement(node) {
            checkTextNode(node, node.value.cooked ?? node.value.raw)
          },
        }
      },
    },
  },
}

const babelTsParser = {
  parseForESLint(code, options = {}) {
    const filePath = options.filePath || ''
    const isTsx = filePath.endsWith('.tsx') || !filePath.endsWith('.ts')
    const ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['estree', 'typescript', ...(isTsx ? ['jsx'] : [])],
      ranges: true,
      tokens: true,
      errorRecovery: true,
    })
    const program = ast.program
    program.tokens = (ast.tokens || [])
      .filter((t) => typeof t.type === 'object' && t.type.label !== 'eof')
      .map((t) => ({
        type: t.type.label,
        value: code.slice(t.start, t.end),
        range: [t.start, t.end],
        loc: t.loc,
      }))
    program.comments = (ast.comments || []).map((c) => ({
      type: c.type === 'CommentBlock' ? 'Block' : 'Line',
      value: c.value,
      range: [c.start, c.end],
      loc: c.loc,
    }))
    return {
      ast: program,
      services: {},
      scopeManager: null,
      visitorKeys: null,
    }
  },
}

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: babelTsParser,
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      tailwindcss: tailwindCanonicalPlugin,
    },
    rules: {
      'tailwindcss/canonical-classes': 'error',
    },
  },
]
