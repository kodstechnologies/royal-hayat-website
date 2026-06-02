import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const doc = fs.readFileSync(path.join(__dirname, 'royale-hayat-document.txt'), 'utf8');

const clean = (s) => s.replace(/\u200e|‎|\r/g, '').trim();
const hasArabic = (s) => /[\u0600-\u06FF]/.test(s);
const isEnglishLeak = (line) => /^[A-Za-z]/.test(line) && !hasArabic(line);

const lines = doc.split('\n');
const segments = [];
let i = 0;

const isHeader = (line) =>
  /^(DR\.|PROF\.|FARAH HACHEM|FATME KHREIS|HEBA BEN SALAMAH)/i.test(clean(line));

while (i < lines.length) {
  if (isHeader(lines[i])) {
    const start = i;
    i++;
    while (i < lines.length && !isHeader(lines[i])) i++;
    segments.push(lines.slice(start, i));
  } else {
    i++;
  }
}

const isTitleOnlyNameAr = (line) =>
  /^(استشاري|إستشاري|أخصائي|اختصاصي|رئيس|المدير|طبيب|أخصائية)/.test(line) &&
  !/^الدكتور/.test(line);

function parseSegment(segLines) {
  const nameEn = clean(segLines[0]);
  let titleEn = '';
  const qualificationsEn = [];
  const expertiseEn = [];
  let nameAr = '';
  let titleAr = '';
  const qualificationsAr = [];
  const expertiseAr = [];
  let mode = 'titleEn';

  for (let j = 1; j < segLines.length; j++) {
    const line = clean(segLines[j]);
    if (!line || line === ' ') continue;

    if (mode === 'expertiseEn' && hasArabic(line)) {
      if (!nameAr) {
        nameAr = line;
        mode = 'titleAr';
        continue;
      }
      mode = 'qualificationsAr';
      // fall through
    }
    if (mode === 'expertiseAr' && isEnglishLeak(line)) {
      break;
    }

    if (line === 'QUALIFICATIONS:') {
      mode = 'qualificationsEn';
      continue;
    }
    if (line === 'EXPERIENCED IN:') {
      mode = 'expertiseEn';
      continue;
    }
    if (line === 'المؤهلات:') {
      mode = 'qualificationsAr';
      continue;
    }
    if (line === 'الخبرات :' || line === 'الخبرات:') {
      mode = 'expertiseAr';
      continue;
    }

    const looksLikeArName =
      !nameAr &&
      (/^(د\.|البروفيسور|الدكتورة|الدكتور|فـ|هبه|فاطم)/.test(line) ||
        (/^د\s/.test(line) && hasArabic(line)));

    if (looksLikeArName) {
      nameAr = line;
      mode = 'titleAr';
      continue;
    }

    if (mode === 'titleEn' && !titleEn) titleEn = line;
    else if (mode === 'qualificationsEn') qualificationsEn.push(line);
    else if (mode === 'expertiseEn') expertiseEn.push(line);
    else if (mode === 'titleAr' && !titleAr) titleAr = line;
    else if (mode === 'qualificationsAr') qualificationsAr.push(line);
    else if (mode === 'expertiseAr') expertiseAr.push(line);
  }

  // Document sometimes uses title as first Arabic line (no د.)
  if (nameAr && isTitleOnlyNameAr(nameAr) && !titleAr) {
    titleAr = nameAr;
    nameAr = '';
  }

  const filterAr = (arr) => arr.filter((l) => hasArabic(l) && !isEnglishLeak(l));
  const filterEn = (arr) => arr.filter((l) => !hasArabic(l) && l.length > 0);

  return {
    nameEn,
    titleEn,
    qualificationsEn: filterEn(qualificationsEn),
    expertiseEn: filterEn(expertiseEn),
    nameAr,
    titleAr,
    qualificationsAr: filterAr(qualificationsAr),
    expertiseAr: filterAr(expertiseAr),
  };
}

const parsed = segments.map(parseSegment).filter((p) => p.qualificationsAr.length || p.expertiseAr.length);

const byKey = new Map();
for (const p of parsed) {
  byKey.set(p.nameEn.toUpperCase().replace(/[‎\u200e‬]/g, '').trim(), p);
}
const unique = [...byKey.values()];

fs.writeFileSync(
  path.join(__dirname, 'royale-hayat-parsed.json'),
  JSON.stringify(unique, null, 2),
  'utf8',
);
console.log('Segments:', segments.length, 'Unique:', unique.length);
console.log(
  'No Arabic quals:',
  unique.filter((p) => !p.qualificationsAr.length).map((p) => p.nameEn).slice(0, 5),
);
