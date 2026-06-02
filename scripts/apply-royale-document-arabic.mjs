/**
 * Applies Arabic fields from royale-hayat-parsed.json to src/data/doctors.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const doctorsPath = path.join(__dirname, '..', 'src', 'data', 'doctors.ts');
const parsedPath = path.join(__dirname, 'royale-hayat-parsed.json');

const EXCLUDED = new Set([
  'dr-nada-al-ibrahim',
  'dr-nourah-al-ibrahim',
  'dr-ahmed-al-mulla',
  // Document Arabic is corrupted or has line-break artifacts; keep manual entries in doctors.ts
  'fatme-khreis',
  'heba-ben-salamah',
]);

function norm(s) {
  return s
    .toUpperCase()
    .replace(/[‎\u200e]/g, '')
    .replace(/^DR\.?\s*/i, '')
    .replace(/^PROF\.?\s*/i, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatStringArray(items, indent = '    ') {
  const lines = items.map((item) => `${indent}  '${escapeTs(item)}',`);
  return `[\n${lines.join('\n')}\n${indent}]`;
}

function extractDoctorBlock(content, id) {
  const marker = `id: '${id}'`;
  const idx = content.indexOf(marker);
  if (idx === -1) return null;
  let start = content.lastIndexOf('\n  {', idx);
  if (start === -1) start = content.indexOf('{', idx);
  let depth = 0;
  let end = -1;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth += 1;
    if (content[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return null;
  return { start, end, block: content.slice(start, end) };
}

function replaceStringField(block, field, value) {
  const re = new RegExp(`(${field}:\\s*)'(?:\\\\'|[^'])*'`);
  if (!re.test(block)) return block;
  return block.replace(re, `$1'${escapeTs(value)}'`);
}

function replaceArrayField(block, field, value) {
  const re = new RegExp(`${field}:\\s*\\[[\\s\\S]*?\\],`);
  if (!re.test(block)) return block;
  return block.replace(re, `${field}: ${formatStringArray(value)},`);
}

// When document omits Arabic name, use known display names
const FALLBACK_NAME_AR = {
  'dr-anny-qaisser': 'د. آني قيصر',
  'dr-rabee-harb': 'د. ربيع حرب',
  'dr-mohammad-mohammad-hasan-alkandari': 'الدكتور محمد محمد حسن الكندري',
};

const MANUAL_OVERRIDES = {
  'dr-husain-alqattan': {
    nameAr: 'د. حسيــن القطــان',
  },
  'dr-mohamad-hassoun': {
    nameAr: 'د. محمد حسون',
    titleAr: 'استشاري طب الأطفال وحديثي الولادة',
  },
};

function patchDoctorBlock(block, update) {
  let next = block;
  if (update.nameAr) next = replaceStringField(next, 'nameAr', update.nameAr);
  if (update.titleAr !== undefined) next = replaceStringField(next, 'titleAr', update.titleAr);
  if (update.qualificationsAr?.length)
    next = replaceArrayField(next, 'qualificationsAr', update.qualificationsAr);
  if (update.expertiseAr?.length) next = replaceArrayField(next, 'expertiseAr', update.expertiseAr);
  return next;
}

// Manual overrides for headers that do not match doctor.name cleanly
const HEADER_TO_ID = {
  'MUSTAFA ALFIKI': 'dr-mustafa-alfiki',
  'AHMAD ABDULRAHMAN AL MULLA': 'dr-ahmad-abdulrahman-al-mulla',
  'AHMED AL QALLAF': 'dr-ahmed-al-qallaf',
  'AHMED AL MULLA': 'dr-ahmed-al-mulla',
  'ALI IBRAHIM ALDEI': 'dr-ali-ibrahim-aldei',
  'ANNY QAISSER': 'dr-anny-qaisser',
  'ANNY QAISSER': 'dr-anny-qaisser',
  'ANNY QAISSER‬': 'dr-anny-qaisser',
  'ABDULAZIZ RAMADHAN': 'dr-abdulaziz-ramadhan',
  'ABDULAZIZ RAMADHAN': 'dr-abdulaziz-ramadhan',
  'ABDULLAH ALBADER BMBCH, FRCSC, FARS': 'dr-abdullah-albader',
  'ABDULLAH ALBADER': 'dr-abdullah-albader',
  'DEEPAK VASUDEV': 'dr-deepak-vasudev',
  'EHAB ATTEYA': 'dr-ehab-atteya',
  'EYHAB BADER': 'dr-eyhab-bader',
  'EMAN ALSAYEGH': 'dr-eman-alsayegh',
  'ESSAM SAKR': 'dr-essam-sakr',
  'FARAH HACHEM': 'farah-hachem',
  'FATME KHREIS': 'fatme-khreis',
  'HEBA BEN SALAMAH': 'heba-ben-salamah',
  'HAMOUD ABDULLAH ALAROUJ': 'dr-hamoud-abdullah-alarouj',
  'HANAFI ABDELSALAM': 'dr-hanafi-abdelsalam',
  'HUMOUD ALRASHEEDI': 'dr-humoud-alrasheedi',
  'HUSSEIN FAOUR': 'dr-hussein-faour',
  'MOHAMMAD EBRAHIM': 'dr-mohammad-ebrahim',
  'MOHAMMAD ALTURKI BMBCH, RCPC, ABIM': 'dr-mohammad-alturki',
  'MOHAMMAD ALTURKI': 'dr-mohammad-alturki',
  'MOHAMMAD MOHAMMAD HASAN ALKANDARI': 'dr-mohammad-mohammad-hasan-alkandari',
  'MOHAMMAD RAZZAK': 'dr-mohammad-razzak',
  'MOHAMED HASSOUN': 'dr-mohamad-hassoun',
  'MOHAMAD HASSOUN': 'dr-mohamad-hassoun',
  'NADA AL IBRAHIM': 'dr-nada-al-ibrahim',
  'NOURAH AL IBRAHIM': 'dr-nourah-al-ibrahim',
  'NOURAH ADNAN SAAD ALRUBAIAN': 'dr-nourah-adnan-saad-alrubaian',
  'RAJESH R. PATIL BDS, MDS': 'dr-rajesh-r-patil',
  'RAJENDRA C. MISHRA': 'dr-rajendra-c-mishra',
  'SANKETA PATIL‬, M.D.S. PERIODONTOLOGY‬': 'dr-sanketa-patil',
  'SANKETA PATIL': 'dr-sanketa-patil',
  'SALMA IBRAHIM MBBS- DFSRH-FRCOG': 'dr-salma-ibrahim',
  'ZEINAB SHOLKANY M.SAAD': 'dr-zeinab-sholkany-m-saad',
  'WADHA ABDULAZIZ AL-JASER': 'dr-wadha-abdulaziz-al-jaser',
  'YASSMIN OTHMAN': 'dr-yassmin-othman',
  'YOMNA ABDELAAL HUSSEINY': 'dr-yomna-abdelaal-husseiny',
  'ABUBAKR ELMARDI': 'dr-abubakr-elmardi',
  'ABUBAKR ELMARDI': 'dr-abubakr-elmardi',
  'ADEL AL-ALI, M.D.': 'dr-adel-al-ali',
  'ADEL AL-ALI': 'dr-adel-al-ali',
  'OSAMA AL SAEED': 'dr-osama-al-saeed',
  'NASER AL-AZEMI': 'dr-naser-al-azemi',
  'MIRVAT SAMEER GHANEM': 'dr-mirvat-sameer-ghanem',
  'BROOK ASSEFA AYELE': 'dr-brook-assefa-ayele',
  'FATEMAH FARAS': 'dr-fatemah-faras',
  'GIE VANDEHULT': 'dr-gie-vandehult',
  'HELEN KAMIL ALKAABI': 'dr-helen-kamil-alkaabi',
  'HUSAIN ALQATTAN': 'dr-husain-alqattan',
  'OMAR EL KHATEEB': 'prof-omar-el-khateeb',
  'HAMID GHADERI': 'dr-hamid-ghaderi',
  'ANOOD YOUSEF ALJASSER ALRAJAHI': 'dr-anood-yousef-aljasser-alrajahi',
  'KHALED N. AL AWADHI': 'dr-khaled-n-al-awadhi',
  'SALMAN BEN NAKHI': 'dr-salman-ben-nakhi',
  'SURAJ V. DAVIS': 'dr-suraj-v-davis',
  'MUSHEERA M. ALI': 'dr-musheera-m-ali',
  'MAHA AL-GILANI': 'dr-maha-al-gilani',
  'RABEE HARB': 'dr-rabee-harb',
  'DHERAR M. ALROUDHAN': 'dr-dherar-m-alroudhan',
  'RAED AL SWAIT': 'dr-raed-al-swait',
  'SAID AHMED OODA': 'dr-said-ahmed-ooda',
  'NOHA ALSALEH': 'dr-noha-alsaleh',
  'SARAH AL YOUHA': 'dr-sarah-al-youha',
  'SULAIMAN ALMAZEEDI': 'dr-sulaiman-almazeedi',
  'FAHED ABDULAZIZ ALJASER': 'dr-fahed-abdulaziz-aljaser',
  'OMAR ALKANDARI': 'dr-omar-alkandari',
  'ROLAND WAKED': 'dr-roland-waked',
  'WASMI AL FADHLI': 'dr-wasmi-al-fadhli',
  'MAZEN ALESSA': 'dr-mazen-alessa',
  'ALIA ALI IBRAHIM': 'dr-alia-ali-ibrahim',
  'NAJAT ROUHALDEEN': 'dr-najat-rouhaldeen',
  'SALAH AL-WUHAIB': 'dr-salah-al-wuhaib',
  'ALAA ABDULLAH': 'dr-alaa-abdullah',
  'ELISAVET ANGELAKI': 'dr-elisavet-angelaki',
  'HAFSAH HUSSAIN': 'dr-hafsah-hussain',
  'FATIMA SULTAN': 'dr-fatima-sultan',
  'KHALIDA AL MUJAIBEL': 'dr-khalida-al-mujaibel',
  'LOBNA IBRAHIM BASSIOUNI': 'dr-lobna-ibrahim-bassiouni',
  'MONA ABOU TAAM': 'dr-mona-abou-taam',
  'SAMAR NAGATY': 'dr-samar-nagaty',
  'FARIBA VADOUDI': 'dr-fariba-vadoudi',
  'YASSER HAGGAG': 'dr-yasser-haggag',
};

const parsed = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));
let content = fs.readFileSync(doctorsPath, 'utf8');

// Build id index from doctors.ts
const idIndex = new Map();
for (const m of content.matchAll(/id: '([^']+)'[\s\S]*?name: '([^']+)'/g)) {
  idIndex.set(m[1], norm(m[2]));
}

const normToIds = new Map();
for (const [id, n] of idIndex) {
  if (!normToIds.has(n)) normToIds.set(n, []);
  normToIds.get(n).push(id);
}

function resolveId(entry) {
  const key = norm(entry.nameEn);
  if (HEADER_TO_ID[key.replace(/\s+/g, ' ')]) return HEADER_TO_ID[key.replace(/\s+/g, ' ')];
  // try without suffix credentials
  const short = key.split(' BMBCH')[0].split(' MBBS')[0].trim();
  if (HEADER_TO_ID[short]) return HEADER_TO_ID[short];

  const ids = normToIds.get(key) || normToIds.get(short);
  if (ids?.length === 1) return ids[0];

  // fuzzy: find id whose norm name is contained in key or vice versa
  for (const [id, n] of idIndex) {
    if (key.includes(n) || n.includes(key)) return id;
  }
  return null;
}

let updated = 0;
const unmatched = [];
const skipped = [];

for (const entry of parsed) {
  const id = resolveId(entry);
  if (!id) {
    unmatched.push(entry.nameEn);
    continue;
  }
  if (EXCLUDED.has(id)) {
    skipped.push(id);
    continue;
  }
  const loc = extractDoctorBlock(content, id);
  if (!loc) {
    unmatched.push(`${entry.nameEn} -> ${id} (no block)`);
    continue;
  }
  const manual = MANUAL_OVERRIDES[id] || {};
  const update = {
    nameAr: manual.nameAr || entry.nameAr || FALLBACK_NAME_AR[id] || '',
    titleAr: manual.titleAr ?? entry.titleAr ?? '',
    qualificationsAr: manual.qualificationsAr || entry.qualificationsAr,
    expertiseAr: manual.expertiseAr || entry.expertiseAr,
  };
  if (!update.nameAr && !update.titleAr && !update.qualificationsAr.length) continue;
  const patched = patchDoctorBlock(loc.block, update);
  if (patched !== loc.block) {
    content = content.slice(0, loc.start) + patched + content.slice(loc.end);
    updated++;
  }
}

fs.writeFileSync(doctorsPath, content, 'utf8');
console.log(`Updated ${updated} doctors. Skipped excluded: ${skipped.length}`);
if (unmatched.length) {
  console.log('Unmatched (' + unmatched.length + '):');
  console.log(unmatched.slice(0, 30).join('\n'));
}
