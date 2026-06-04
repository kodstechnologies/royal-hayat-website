import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcriptPath = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'd-PRAJWALA-Royal-hayat-main',
  'agent-transcripts',
  '671944a8-e9dd-4016-b69d-e22ca2384027',
  '671944a8-e9dd-4016-b69d-e22ca2384027.jsonl',
);
const outPath = path.join(__dirname, 'royale-hayat-document.txt');
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
let best = '';
for (const line of lines) {
  if (!line.includes('Royale Hayat Hospital - Doctors Content')) continue;
  try {
    const row = JSON.parse(line);
    const text = row.message?.content?.find((c) => c.type === 'text')?.text || '';
    const idx = text.indexOf('Royale Hayat Hospital');
    if (idx === -1) continue;
    const chunk = text.slice(idx);
    if (chunk.length > best.length) best = chunk;
  } catch {
  }
}
if (!best) {
  console.error('Document not found in transcript');
  process.exit(1);
}
fs.writeFileSync(outPath, best, 'utf8');
console.log('Wrote', outPath, 'chars:', best.length);
