import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/contexts/LanguageContext.tsx"), "utf8");
const start = src.indexOf("const translations: Translations = {");
const end = src.indexOf("};", start) + 2;
const block = src.slice(start, end);

// Evaluate translations object (trusted local source file)
const translations = new Function(`${block.replace("const translations: Translations = ", "return ")}`)();

const en = {};
const ar = {};
for (const [key, value] of Object.entries(translations)) {
  en[key] = value.en;
  ar[key] = value.ar;
}

const outDir = join(root, "src/i18n");
mkdirSync(outDir, { recursive: true });

writeFileSync(
  join(outDir, "en.ts"),
  `export const en = ${JSON.stringify(en, null, 2)} as const;\n\nexport type TranslationKey = keyof typeof en;\n`,
);
writeFileSync(join(outDir, "ar.ts"), `export const ar = ${JSON.stringify(ar, null, 2)} as const;\n`);
console.log("i18n split:", Object.keys(en).length, "keys");
