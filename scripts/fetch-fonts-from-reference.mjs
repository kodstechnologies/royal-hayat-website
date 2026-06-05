import { mkdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "fonts-source");
const host = process.env.REFERENCE_FONT_HOST ?? "10.132.0.107";
const ports = (process.env.REFERENCE_FONT_PORTS ?? "3000,5173,8080,4173,80")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const files = [
  "Avenir-Book.woff2",
  "Avenir-Medium.woff2",
  "Avenir-Heavy.woff2",
  "Garamond-Regular.woff2",
  "Garamond-SemiBold.woff2",
  "Garamond-Bold.woff2",
  "GEDinarOne-Light.woff2",
  "GEDinarOne-Medium.woff2",
  "GEDinarOne-Bold.woff2",
];

mkdirSync(sourceDir, { recursive: true });

function download(url, target) {
  const result = spawnSync(
    "curl.exe",
    ["-fsSL", "--connect-timeout", "3", "--max-time", "8", url, "-o", target],
    { stdio: "pipe", encoding: "utf8" },
  );
  return result.status === 0;
}

let ok = 0;

for (const file of files) {
  const target = join(sourceDir, file);
  let saved = false;

  for (const port of ports) {
    const base = port === "80" ? `http://${host}` : `http://${host}:${port}`;
    const url = `${base}/fonts/${file}`;
    if (download(url, target)) {
      try {
        if (statSync(target).size > 500) {
          ok += 1;
          saved = true;
          console.log(`[fetch-fonts] ${file} <- ${url}`);
          break;
        }
      } catch {
        // try next port
      }
    }
  }

  if (!saved) {
    console.warn(`[fetch-fonts] Missing: ${file}`);
  }
}

if (ok === 0) {
  console.error("[fetch-fonts] Could not download fonts from the reference server.");
  console.error("[fetch-fonts] Copy the .woff2 files manually into fonts-source/, then run: npm run prepare-fonts");
  process.exit(1);
}

const prepare = spawnSync(process.execPath, [join(root, "scripts", "prepare-fonts.mjs")], {
  stdio: "inherit",
  cwd: root,
});

process.exit(prepare.status ?? 1);
