#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const failures = [];

const require = createRequire(path.join(root, "package.json"));
const { __unstable__loadDesignSystem } = require("@tailwindcss/node");
const cssPath = path.join(sourceRoot, "index.css");

const originalLog = console.log;
let designSystem;
try {
  console.log = () => {};
  designSystem = await __unstable__loadDesignSystem(
    fs.readFileSync(cssPath, "utf8"),
    { base: path.dirname(cssPath) },
  );
} finally {
  console.log = originalLog;
}

const canonicalCache = new Map();

function getCanonicalClass(token) {
  if (!token.includes("-") && !token.includes("[") && !token.includes("!")) {
    return token;
  }
  if (
    token.startsWith("http") ||
    token.startsWith("/") ||
    token.startsWith(".") ||
    token.endsWith(":") ||
    token.includes("=") ||
    token.includes("?") ||
    token.includes("$") ||
    !/^[!-]?[a-zA-Z0-9_:/\-[\].%#(),!]+$/.test(token)
  ) {
    return token;
  }
  const cached = canonicalCache.get(token);
  if (cached !== undefined) {
    return cached;
  }
  const css = designSystem.candidatesToCss([token]);
  let result = token;
  if (css && css[0]) {
    const canonical = designSystem.canonicalizeCandidates([token], { rem: 16 });
    if (canonical && canonical[0]) {
      result = canonical[0];
    }
  }
  canonicalCache.set(token, result);
  return result;
}

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

const sourceFiles = walk(sourceRoot).filter((file) => /\.(ts|tsx)$/.test(file));
const relative = (file) => path.relative(root, file).replaceAll(path.sep, "/");

const exceptions = {
  storage: new Set([
    "src/services/api.service.ts",
    "src/services/atom.service.ts",
    "src/modules/log/log.controller.ts",
    "src/modules/log/components/DevTestButtons.tsx",
  ]),
  fetch: new Set(["src/modules/log/components/DevTestButtons.tsx"]),
  datePresentation: new Set([
    "src/helpers/date.helper.tsx",
    "src/hooks/useBrowserTimeZone.ts",
  ]),
};

for (const file of sourceFiles) {
  const name = relative(file);
  const content = fs.readFileSync(file, "utf8");

  if (/\b(?:localStorage|sessionStorage)\s*(?:\.|\[)/.test(content) && !exceptions.storage.has(name)) {
    failures.push(`Direct browser storage access: ${name}`);
  }
  if (/\bdocument\.cookie\b/.test(content) && !exceptions.storage.has(name)) {
    failures.push(`Direct document.cookie access: ${name}`);
  }
  if (/\bfetch\s*\(/.test(content) && !name.endsWith(".service.ts") && !exceptions.fetch.has(name)) {
    failures.push(`Direct fetch outside a service: ${name}`);
  }
  if (/\.(?:toLocaleDateString|toLocaleTimeString)\s*\(|new\s+Intl\.(?:DateTimeFormat|RelativeTimeFormat)/.test(content) && !exceptions.datePresentation.has(name)) {
    failures.push(`Raw date/time presentation outside the shared helper: ${name}`);
  }

  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("import ") || trimmed.startsWith("//") || trimmed.startsWith("*")) {
      continue;
    }
    const stringMatches = line.matchAll(/(["'`])((?:\\.|(?!\1).)*)\1/g);
    for (const match of stringMatches) {
      const strContent = match[2].replace(/\$\{[^}]*\}/g, " ");
      const tokens = strContent.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        const canonical = getCanonicalClass(token);
        if (canonical !== token) {
          failures.push(
            `Non-canonical Tailwind class in ${name}:${i + 1}: "${token}" -> use "${canonical}"`,
          );
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`Architecture checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Architecture checks passed (${sourceFiles.length} source files).`);
