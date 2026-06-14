import fs from 'fs';
import { execSync } from 'child_process';

const repo = 'd:/PRAJWALA/Royal-hayat-main/RoyalHayat';
const target = `${repo}/src/data/departments.ts`;
const snapshot = execSync('git show af4d9d2:src/data/departments.ts', { cwd: repo }).toString();

// Obstetrics copy from 30538d7 (matches screenshot long text)
const obSnapshot = execSync('git show 30538d7:src/data/departments.ts', { cwd: repo }).toString();
const obMatch = obSnapshot.match(
  /name: "Obstetrics & Gynecology"[\s\S]*?desc: "([^"]+)",\s*\n\s*descAr:\s*\n?\s*"([^"]+)"/
);
if (!obMatch) throw new Error('ObGyn block not found in 30538d7');

function patchDesc(content, name, desc, descAr) {
  const blockRe = new RegExp(
    `(name: "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)(desc: ")[^"]+(",\\s*\\n\\s*descAr:\\s*\\n?\\s*")([^"]+)(")`,
    'm'
  );
  if (!blockRe.test(content)) {
    // descAr on one line
    const blockRe2 = new RegExp(
      `(name: "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)(desc: ")[^"]+(",\\s*\\n\\s*descAr: ")([^"]+)(")`,
      'm'
    );
    if (!blockRe2.test(content)) throw new Error(`Block not found: ${name}`);
    return content.replace(blockRe2, `$1$2${desc}$3${descAr}$5`);
  }
  return content.replace(blockRe, `$1$2${desc}$3${descAr}$5`);
}

let content = fs.readFileSync(target, 'utf8');
const names = [...snapshot.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);

for (const name of names) {
  const block = snapshot.match(new RegExp(`name: "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?desc: "([^"]+)"[\\s\\S]*?descAr:\\s*\\n?\\s*"([^"]+)"`));
  if (!block) continue;
  let [, desc, descAr] = block;
  if (name === 'Obstetrics & Gynecology') {
    desc = obMatch[1];
    descAr = obMatch[2];
  }
  content = patchDesc(content, name, desc, descAr);
}

fs.writeFileSync(target, content);
console.log('Restored desc/descAr from af4d9d2 (+ ObGyn from 30538d7)');
