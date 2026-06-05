import { copyFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "fonts");
const sourceDir = join(root, "fonts-source");

const licensedFonts = [
  "Avenir-Book.woff2",
  "Avenir-Medium.woff2",
  "Avenir-Heavy.woff2",
  "GEDinarOne-Light.woff2",
  "GEDinarOne-Medium.woff2",
  "GEDinarOne-Bold.woff2",
];

const garamondFonts = [
  "Garamond-Regular.woff2",
  "Garamond-SemiBold.woff2",
  "Garamond-Bold.woff2",
];

mkdirSync(outDir, { recursive: true });
mkdirSync(sourceDir, { recursive: true });

let copied = 0;
let missing = 0;

for (const filename of licensedFonts) {
  const source = join(sourceDir, filename);
  const target = join(outDir, filename);
  if (!existsSync(source)) {
    missing += 1;
    if (existsSync(target)) {
      unlinkSync(target);
      console.warn(`[prepare-fonts] Removed placeholder font until licensed file is provided: ${filename}`);
    }
    console.warn(`[prepare-fonts] Missing licensed font: fonts-source/${filename}`);
    continue;
  }
  copyFileSync(source, target);
  copied += 1;
  console.log(`[prepare-fonts] ${filename}`);
}

for (const filename of garamondFonts) {
  const source = join(sourceDir, filename);
  const target = join(outDir, filename);
  if (!existsSync(source)) {
    continue;
  }
  copyFileSync(source, target);
  copied += 1;
  console.log(`[prepare-fonts] ${filename}`);
}

const optionalFonts = ["Avenir-Light.woff2"];
for (const filename of optionalFonts) {
  const source = join(sourceDir, filename);
  const target = join(outDir, filename);
  if (existsSync(source)) {
    copyFileSync(source, target);
    console.log(`[prepare-fonts] ${filename}`);
  } else if (existsSync(target)) {
    unlinkSync(target);
  }
}

if (missing > 0) {
  console.warn(
    "[prepare-fonts] Place the original Avenir and GE Dinar One .woff2 files in fonts-source/ then run npm run prepare-fonts again.",
  );
} else {
  console.log("[prepare-fonts] All licensed fonts are ready.");
}
