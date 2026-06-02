/**
 * Applies royale-hayat-parsed.json to src/data/doctors.ts
 * Run: node scripts/extract-document-from-transcript.mjs
 *      node scripts/parse-royale-document.mjs
 *      node scripts/apply-royale-document-arabic.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Use apply-royale-document-arabic.mjs after parse-royale-document.mjs');
