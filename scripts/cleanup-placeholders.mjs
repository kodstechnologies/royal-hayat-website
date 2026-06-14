import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const root = new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (extname(path) === ".tsx") files.push(path);
  }
  return files;
}

let jsxCleaned = 0;
for (const file of walk(root)) {
  const original = readFileSync(file, "utf8");
  const updated = original.replace(/^\s*\{\}\s*\r?\n/gm, "");
  if (updated !== original) {
    writeFileSync(file, updated);
    jsxCleaned++;
  }
}

const langPath = join(root, "contexts", "LanguageContext.tsx");
let lang = readFileSync(langPath, "utf8");
lang = lang
  .replace(/^\s*\/\/ [^\n]+\r?\n/gm, (line) =>
    line.includes("ignore storage failures") ? line : "",
  )
  .replace(/\n{3,}/g, "\n\n");
writeFileSync(langPath, lang);

console.log(`Removed JSX {} placeholders from ${jsxCleaned} files`);
console.log("Cleaned LanguageContext section comments");
