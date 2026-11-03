#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import babelParser from "@babel/parser";

const root = process.cwd();
const sourceRoot = path.join(root, "src");

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const args = process.argv.slice(2);
const showUnused = args.includes("--unused") || args.includes("-u") || args.includes("--verbose");
const showHardcoded = args.includes("--hardcoded") || args.includes("-h") || args.includes("--verbose");

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

const sourceFiles = walk(sourceRoot).filter(
  (file) => /\.(ts|tsx)$/.test(file) && !/\.(test|spec)\.(ts|tsx)$/.test(file),
);

const developerUiFiles = new Set([
  path.join(sourceRoot, "design/examples.tsx"),
  path.join(sourceRoot, "modules/log/components/DevTestButtons.tsx"),
]);

const relative = (file) => path.relative(root, file).replaceAll(path.sep, "/");

const flatten = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? flatten(child, next)
      : [[next, child]];
  });

console.log(`${colors.bold}${colors.cyan}🌐 RexOne Locales Diagnostic & Integrity Checker${colors.reset}\n`);

// ---------------------------------------------------------------------------
// 1. Language Parity: en.json <-> my.json
// ---------------------------------------------------------------------------
const enPath = path.join(sourceRoot, "locales/en.json");
const myPath = path.join(sourceRoot, "locales/my.json");

if (!fs.existsSync(enPath) || !fs.existsSync(myPath)) {
  console.error(`${colors.red}❌ Critical: en.json or my.json is missing from src/locales!${colors.reset}`);
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const my = JSON.parse(fs.readFileSync(myPath, "utf8"));

const enKeys = new Set(flatten(en).map(([key]) => key));
const myKeys = new Set(flatten(my).map(([key]) => key));

const parityErrors = [];
for (const key of enKeys) {
  if (!myKeys.has(key)) {
    parityErrors.push({ type: "missing-in-my", key, message: `Key in en.json missing in my.json: "${key}"` });
  }
}
for (const key of myKeys) {
  if (!enKeys.has(key)) {
    parityErrors.push({ type: "missing-in-en", key, message: `Key in my.json missing in en.json: "${key}"` });
  }
}

// ---------------------------------------------------------------------------
// 2. AppLocales TypeScript Constants <-> JSON Parity
// ---------------------------------------------------------------------------
const constantsPath = path.join(sourceRoot, "locales/app_locales.ts");
if (!fs.existsSync(constantsPath)) {
  console.error(`${colors.red}❌ Critical: src/locales/app_locales.ts is missing!${colors.reset}`);
  process.exit(1);
}

const constantsSource = fs.readFileSync(constantsPath, "utf8");
const constantsAst = babelParser.parse(constantsSource, {
  sourceType: "module",
  plugins: ["typescript"],
});

const constants = new Map(); // "AppLocales.Auth.Shared.EmailLabel" -> "auth.shared.email_label"

const propertyName = (node) => {
  if (!node) return null;
  if (node.type === "Identifier") return node.name;
  if (node.type === "StringLiteral") return node.value;
  return null;
};
const unwrap = (node) =>
  node && (node.type === "TSAsExpression" || node.type === "TSTypeAssertion")
    ? unwrap(node.expression)
    : node;

const collectConstants = (object, prefix = []) => {
  for (const property of object.properties) {
    if (property.type !== "ObjectProperty") continue;
    const name = propertyName(property.key);
    if (!name) continue;
    const next = [...prefix, name];
    const init = unwrap(property.value);
    if (init && init.type === "ObjectExpression") {
      collectConstants(init, next);
    } else if (init && init.type === "StringLiteral") {
      constants.set(`AppLocales.${next.join(".")}`, init.value);
    }
  }
};

for (const stmt of constantsAst.program.body) {
  const declStmt = stmt.type === "ExportNamedDeclaration" ? stmt.declaration : stmt;
  if (!declStmt || declStmt.type !== "VariableDeclaration") continue;
  for (const declaration of declStmt.declarations) {
    if (
      declaration.id.type === "Identifier" &&
      declaration.id.name === "AppLocales" &&
      declaration.init
    ) {
      const init = unwrap(declaration.init);
      if (init && init.type === "ObjectExpression") {
        collectConstants(init);
      }
    }
  }
}

const constantErrors = [];
const mappedKeys = new Set(constants.values());

// Check if AppLocales constants point to non-existent JSON keys
for (const [constant, key] of constants) {
  if (!enKeys.has(key)) {
    constantErrors.push({
      type: "unknown-constant-target",
      constant,
      key,
      message: `Constant ${constant} targets "${key}" which does not exist in en.json`,
    });
  }
}

// Check if en.json keys are missing from AppLocales
for (const key of enKeys) {
  if (!mappedKeys.has(key)) {
    constantErrors.push({
      type: "missing-in-app-locales",
      key,
      message: `Key "${key}" exists in en.json but is missing from AppLocales in app_locales.ts`,
    });
  }
}

// ---------------------------------------------------------------------------
// 3. Scan Source Code for Usages, Loose Fallbacks, Raw Keys, and Hardcoded Text
// ---------------------------------------------------------------------------
const usedConstants = new Set();
const looseFallbacks = [];
const rawKeys = [];
const hardcoded = [];
const visibleAttributes = new Set([
  "aria-label",
  "label",
  "placeholder",
  "title",
]);

for (const file of sourceFiles) {
  if (file === constantsPath) continue;
  const content = fs.readFileSync(file, "utf8");
  const name = relative(file);

  // Fast scan for referenced AppLocales constants
  for (const match of content.matchAll(/AppLocales(?:\.[A-Za-z_$][\w$]*)+/g)) {
    usedConstants.add(match[0]);
  }

  if (developerUiFiles.has(file)) continue;

  const ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", ...(file.endsWith("x") ? ["jsx"] : [])],
    errorRecovery: true,
  });

  const inspect = (node, parent = null) => {
    if (!node || typeof node !== "object") return;

    // Detect t() or translate() calls
    if (node.type === "CallExpression") {
      const expr = node.callee;
      const fnName =
        expr.type === "Identifier"
          ? expr.name
          : expr.type === "MemberExpression" && expr.property.type === "Identifier"
            ? expr.property.name
            : null;

      if (fnName === "t" || fnName === "translate") {
        const lineNum = node.loc?.start.line ?? 1;
        const colNum = (node.loc?.start.column ?? 0) + 1;
        const loc = `${name}:${lineNum}:${colNum}`;
        const nodeText = content.slice(node.start, node.end);

        // 1. Raw string keys: t("some.key")
        const firstArg = node.arguments[0];
        if (firstArg && firstArg.type === "StringLiteral") {
          rawKeys.push({
            loc,
            key: firstArg.value,
            snippet: nodeText,
          });
        }

        // 2. Loose fallback: second argument string literal t(key, "fallback")
        if (node.arguments.length > 1) {
          const secondArg = node.arguments[1];
          if (secondArg && secondArg.type === "StringLiteral") {
            looseFallbacks.push({
              loc,
              type: "argument-fallback",
              snippet: nodeText,
              detail: `Second argument fallback string: "${secondArg.value}"`,
            });
          } else if (secondArg && secondArg.type === "ObjectExpression") {
            // Check defaultValue in options object
            for (const prop of secondArg.properties) {
              if (
                prop.type === "ObjectProperty" &&
                propertyName(prop.key) === "defaultValue"
              ) {
                looseFallbacks.push({
                  loc,
                  type: "default-value-fallback",
                  snippet: nodeText,
                  detail: `defaultValue option fallback: ${content.slice(prop.value.start, prop.value.end)}`,
                });
              }
            }
          }
        }

        // 3. Loose fallback: binary operator t(key) || "fallback" or ?? "fallback"
        if (
          parent &&
          parent.type === "LogicalExpression" &&
          (parent.operator === "||" || parent.operator === "??") &&
          parent.left === node
        ) {
          looseFallbacks.push({
            loc,
            type: "binary-fallback",
            snippet: content.slice(parent.start, parent.end),
            detail: `Binary fallback operator (${parent.operator}): ${content.slice(parent.right.start, parent.right.end)}`,
          });
        }
      }
    }

    // Detect hardcoded visible text in JSX
    if (node.type === "JSXText") {
      const text = node.value.replace(/\s+/g, " ").trim();
      if (/[A-Za-z]{2}/.test(text)) {
        const line = node.loc?.start.line ?? 1;
        hardcoded.push({ loc: `${name}:${line}`, text });
      }
    }
    if (node.type === "JSXAttribute") {
      const attrName =
        node.name.type === "JSXIdentifier"
          ? node.name.name
          : content.slice(node.name.start, node.name.end);
      if (
        visibleAttributes.has(attrName) &&
        node.value &&
        node.value.type === "StringLiteral" &&
        /[A-Za-z]{2}/.test(node.value.value)
      ) {
        const line = node.loc?.start.line ?? 1;
        hardcoded.push({
          loc: `${name}:${line}`,
          text: `${attrName}="${node.value.value}"`,
        });
      }
    }

    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "LeadingComments" || key === "trailingComments" || key === "innerComments" || key === "extra") continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item.type === "string") {
            inspect(item, node);
          }
        }
      } else if (child && typeof child.type === "string") {
        inspect(child, node);
      }
    }
  };
  inspect(ast.program);
}

const unusedConstants = [...constants.keys()].filter(
  (constant) => !usedConstants.has(constant),
);

// ---------------------------------------------------------------------------
// 4. Formatted Diagnostic Reporting
// ---------------------------------------------------------------------------

let hasFailures = false;

// Section 1: Language Parity
console.log(`${colors.bold}${colors.blue}━━━ [1/4] Language Parity (${enKeys.size} keys en.json <-> ${myKeys.size} keys my.json) ━━━${colors.reset}`);
if (parityErrors.length > 0) {
  hasFailures = true;
  console.log(`${colors.red}${colors.bold}FAILED: ${parityErrors.length} parity mismatch(es) found:${colors.reset}`);
  for (const err of parityErrors) {
    console.log(`  ${colors.red}✗${colors.reset} ${err.message}`);
  }
} else {
  console.log(`  ${colors.green}✓${colors.reset} 100% key parity between en.json and my.json (${enKeys.size} keys each).`);
}
console.log();

// Section 2: AppLocales Constant Parity
console.log(`${colors.bold}${colors.blue}━━━ [2/4] AppLocales Constant Mapping (${constants.size} constants) ━━━${colors.reset}`);
if (constantErrors.length > 0) {
  hasFailures = true;
  console.log(`${colors.red}${colors.bold}FAILED: ${constantErrors.length} mapping issue(s) found:${colors.reset}`);
  for (const err of constantErrors) {
    console.log(`  ${colors.red}✗${colors.reset} ${err.message}`);
  }
} else {
  console.log(`  ${colors.green}✓${colors.reset} 100% 1-to-1 sync between AppLocales constants and en.json keys.`);
}
console.log();

// Section 3: Loose Fallbacks & Raw Translation Keys
console.log(`${colors.bold}${colors.blue}━━━ [3/4] Translation Call Integrity & Loose Fallbacks ━━━${colors.reset}`);
if (rawKeys.length > 0) {
  hasFailures = true;
  console.log(`${colors.red}${colors.bold}FAILED: ${rawKeys.length} raw string key(s) detected (must use AppLocales.*):${colors.reset}`);
  for (const r of rawKeys) {
    console.log(`  ${colors.red}✗${colors.reset} ${r.loc} -> t("${r.key}")`);
  }
} else {
  console.log(`  ${colors.green}✓${colors.reset} Zero raw translation strings (all calls use canonical AppLocales).`);
}

if (looseFallbacks.length > 0) {
  hasFailures = true;
  console.log(`${colors.red}${colors.bold}FAILED: ${looseFallbacks.length} loose fallback(s) detected:${colors.reset}`);
  for (const lf of looseFallbacks) {
    console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${lf.loc}${colors.reset}`);
    console.log(`    ${colors.yellow}${lf.detail}${colors.reset}`);
    console.log(`    ${colors.dim}${lf.snippet}${colors.reset}`);
  }
} else {
  console.log(`  ${colors.green}✓${colors.reset} Zero loose fallbacks (no ||, ??, second argument, or defaultValue masking translations).`);
}
console.log();

// Section 4: Diagnostics & Warnings (Unused Constants, Unlocalized UI Text)
console.log(`${colors.bold}${colors.blue}━━━ [4/4] Usage Diagnostics & Visibility ━━━${colors.reset}`);
console.log(`  • AppLocales constants: ${colors.bold}${constants.size}${colors.reset} total, ${colors.bold}${usedConstants.size}${colors.reset} directly referenced, ${colors.yellow}${unusedConstants.length}${colors.reset} unreferenced directly.`);

if (showUnused && unusedConstants.length > 0) {
  console.log(`\n  ${colors.yellow}Unreferenced AppLocales Constants (${unusedConstants.length}):${colors.reset}`);
  for (const c of unusedConstants) {
    console.log(`    - ${c}`);
  }
} else if (unusedConstants.length > 0) {
  console.log(`    ${colors.dim}(Run with --unused to list all unreferenced constants)${colors.reset}`);
}

console.log(`  • Unlocalized JSX text: ${colors.yellow}${hardcoded.length}${colors.reset} elements detected across UI files.`);
if (showHardcoded && hardcoded.length > 0) {
  console.log(`\n  ${colors.yellow}Unlocalized JSX Strings (${hardcoded.length}):${colors.reset}`);
  for (const h of hardcoded) {
    console.log(`    - ${h.loc}: ${h.text}`);
  }
} else if (hardcoded.length > 0) {
  console.log(`    ${colors.dim}(Run with --hardcoded to list all unlocalized strings)${colors.reset}`);
}
console.log();

// ---------------------------------------------------------------------------
// 5. Final Result Banner & Exit Code
// ---------------------------------------------------------------------------
if (hasFailures) {
  console.error(`${colors.bold}${colors.red}❌ Locale integrity check FAILED. Please resolve the errors above.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.bold}${colors.green}✅ All locale integrity checks PASSED successfully!${colors.reset}\n`);
  process.exit(0);
}
