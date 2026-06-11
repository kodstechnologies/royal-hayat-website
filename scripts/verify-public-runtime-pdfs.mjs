import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Legacy URL path (encoded) → dist static filename (no spaces). */
const REQUIRED_DIST_FILES = [
  "Runtime/uploads/Birth_plan_booklet_27May2021_final.pdf",
];

const missing = REQUIRED_DIST_FILES.filter(
  (relativePath) => !fs.existsSync(path.join(root, "dist", relativePath)),
);

if (missing.length > 0) {
  console.error("Build is missing required Runtime PDF(s) in dist/:");
  for (const file of missing) {
    console.error(`  - ${file}`);
  }
  console.error(
    "Ensure the file exists under public/ before build, then redeploy.",
  );
  process.exit(1);
}

console.log("Runtime PDF static assets verified in dist/.");
