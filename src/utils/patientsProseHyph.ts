export const SHY = "\u00AD";
export const NBSP = "\u00A0";
const PHRASE_NBSP: readonly (readonly [string, string])[] = [
  ["an in-house", `an${NBSP}in-house`],
  ["or external", `or${NBSP}external`],
  ["Guest Services", `Guest${NBSP}Services`],
  ["patient services", `patient${NBSP}services`],
  ["a private", `a${NBSP}private`],
  ["check in", `check${NBSP}in`],
  ["Lost & Found", `Lost${NBSP}&${NBSP}Found`],
  ["Pan-Asian", `Pan${NBSP}Asian`],
  ["award-winning", `award${NBSP}winning`],
  ["medical history", `medical${NBSP}history`],
  ["you are taking", `you${NBSP}are${NBSP}taking`],
];
function hyphenateWord(word: string): string {
  if (word.length <= 4 || word.includes(SHY)) return word;
  if (/^\d/.test(word)) return word;
  if (word.includes("-")) {
    return word.split("-").map((part) => hyphenateWord(part)).join("-");
  }
  const lower = word.toLowerCase();
  const chunks: string[] = [];
  let start = 0;
  for (let i = 1; i < word.length - 2; i++) {
    const since = i - start;
    if (since >= 2 && /[aeiouy]/.test(lower[i]) && /[bcdfghjklmnpqrstvwxz]/i.test(word[i + 1])) {
      chunks.push(word.slice(start, i + 1));
      chunks.push(SHY);
      start = i + 1;
    }
  }
  chunks.push(word.slice(start));
  if (!chunks.includes(SHY) && word.length > 6) {
    const parts: string[] = [];
    let pos = 0;
    while (pos < word.length) {
      const remaining = word.length - pos;
      const size = remaining <= 3 ? remaining : 3;
      parts.push(word.slice(pos, pos + size));
      pos += size;
      if (pos < word.length) parts.push(SHY);
    }
    return parts.join("");
  }
  return chunks.join("");
}
function hyphenateToken(token: string): string {
  const match = token.match(/^([(\["'“”]*)([A-Za-z0-9&']+)([.,;:!?)\]"'“”—–]*)$/);
  if (!match) return token;
  const [, lead, core, trail] = match;
  return `${lead}${hyphenateWord(core)}${trail}`;
}
export function hyphEn(text: string): string {
  if (!text) return text;
  let result = text
    .split(/(\s+)/)
    .map((segment) => (/^\s+$/.test(segment) ? segment : hyphenateToken(segment)))
    .join("");
  for (const [phrase, replacement] of PHRASE_NBSP) {
    result = result.split(phrase).join(replacement);
  }
  return result;
}
export const ADMISSION_HOW_INTRO_EN = hyphEn(
  "Admission is arranged in advance through coordination with our hospital team. Patients are admitted based on:"
);
export const ADMISSION_HOW_ITEMS_EN = [
  `A re${SHY}fer${SHY}ral from an${NBSP}in-house or${NBSP}ex${SHY}ter${SHY}nal doc${SHY}tor`,
  `A con${SHY}firmed date of ad${SHY}mis${SHY}sion is sche${SHY}duled through our pa${SHY}tient${NBSP}ser${SHY}vices team`,
];
export const INSURANCE_ASSISTANCE_EN = {
  intro: hyphEn(
    "Our experienced insurance team is here to guide you through every step of the process. Services include:"
  ),
  items: [
    hyphEn("Educating patients on insurance policy details"),
    hyphEn("Assistance with registration and financial estimates"),
    hyphEn("Coordinating pre-approvals for inpatient admissions and surgical procedures"),
  ],
};
export const INSURED_PATIENTS_EN = {
  intro: `If you are cov${SHY}ered by a${NBSP}pri${SHY}vate health in${SHY}sur${SHY}ance pro${SHY}vider, our Med${SHY}i${SHY}cal In${SHY}sur${SHY}ance De${SHY}part${SHY}ment will sup${SHY}port you in se${SHY}cur${SHY}ing pre-ap${SHY}prov${SHY}al and fa${SHY}cil${SHY}i${SHY}tat${SHY}ing di${SHY}rect bill${SHY}ing.`,
  detailPrefix: hyphEn("Be sure to review the"),
  detailSuffix: hyphEn("for more detailed information and contact points."),
};
export const ROOM_SERVICE_PRIVATE_DINING_EN = hyphEn(
  "Savor gourmet dishes from our extensive menu, featuring Continental, Mediterranean, Pan-Asian, and personalized cuisine—all prepared by our award-winning executive chefs."
);
export const ROOM_SERVICE_HOUSEKEEPING_EN = hyphEn(
  "Enjoy 24-hour housekeeping service with daily room refresh. You may also schedule service at a time that suits you best."
);
export const ROOM_SERVICE_LOST_FOUND_EN = hyphEn(
  "If you misplace an item, our Guest Services team is here to help. Please contact us to file a Lost & Found report with the Security Department. While we are not liable for personal items, we will make every effort to assist in locating them."
);
export const PATIENT_RESPONSIBILITIES_EN = [
  hyphEn("Follow the rules and regulations of RHH.").split(" ").join(NBSP),
  `Give us com${SHY}plete and ac${SHY}cu${SHY}rate in${SHY}for${SHY}ma${SHY}tion about your health, in${SHY}clud${SHY}ing pre${SHY}vi${SHY}ous medical history and all the med${SHY}i${SHY}ca${SHY}tions you are taking.`,
  hyphEn(
    "Submit documents required as per the law/protocol before admission or undergoing specific procedures."
  ),
  hyphEn("Inform our clinical staff of changes in your condition or symptoms, including pain."),
  hyphEn("Let us know if you don't understand the information we give about your condition or treatment."),
  hyphEn("Pay your bills in full before discharge and meet all financial obligations arising from your care."),
  hyphEn("Keep appointments and notify the hospital or physician when you are unable to do so."),
  hyphEn(
    "Leave your personal belongings at home or have family members take all valuables home while you are hospitalized, or use the safety box available in your room for safe custody."
  ),
  hyphEn(
    "Be considerate towards the rights of other patients and hospital personnel and avoid any sort of inconvenience to others."
  ),
  hyphEn(
    "Actively participate in your care plan and follow the treatment plan established by your physician, including instructions from nurses and other healthcare professionals."
  ),
  hyphEn("Take preventive measures in case of infectious diseases."),
  hyphEn("Treat doctors, nurses, and hospital staff with respect."),
  hyphEn("Realize that priority will be given to emergency cases."),
  hyphEn(
    "Preserve and maintain hospital property like medical equipment, furniture, fittings, etc., including medical records."
  ),
  hyphEn("Keep us informed if you want to change hospital or service provider."),
  hyphEn(
    "Share the responsibility in maintaining the safety of the patient from any harm or injury, as explained by the service providers."
  ),
];
export const PATIENT_RIGHTS_EN = [
  hyphEn(
    "Know, in a language you understand, all information about your condition, your care, and the reasons for all investigations, diagnostic procedures, and the charges made to your account."
  ),
  hyphEn(
    "Accept or refuse to sign a consent for any operative or diagnostic procedure."
  ),
  hyphEn(
    "Receive compassionate and respectful care at all times regardless of age, gender, ethnicity, culture, national origin, language, sexual orientation, socioeconomic status, physical or mental ability, religion, or diagnosis."
  ),
  hyphEn(
    "Have a comfortable stay in a clean, safe environment, free from verbal or physical abuse, and enjoy personal privacy."
  ),
  hyphEn(
    "Be informed of the process to raise complaints appropriately, either verbally or in writing, to the Manager on Duty (Mob: 66321214) or Patient Advocate (Mob: 67051626)."
  ),
  hyphEn("Privacy and confidentiality of information regarding your condition."),
  hyphEn(
    "Obtain any information or documents, such as Medical Report, Sick Leave, Discharge Summary, etc."
  ),
  hyphEn("Expect continuity of care till discharge and follow-up."),
  hyphEn(
    "Obtain a second opinion from a physician holding a valid license, whether working in Royale Hayat Hospital or any other medical facility, either private or public, provided that you meet the additional expenses, if any."
  ),
  hyphEn(
    "Be referred to another healthcare organization if the medical condition warrants, and/or on the request of the patient/legal guardian."
  ),
  hyphEn(
    'Leave the hospital even against the advice of the physician after signing the "Discharge Against Medical Advice (DAMA)" form.'
  ),
  hyphEn(
    "Know the names and professional titles of your caregivers and be called by your proper name."
  ),
  hyphEn(
    "Receive well-explained information about charges that you may be responsible for, and any potential limitations to your insurance coverage."
  ),
  hyphEn(
    "Involve you and your family or legal representative in your treatment, expected as well as unexpected outcomes, risk & service decisions."
  ),
  hyphEn(
    "Know the safety measures to be taken after the assessment that include clinical, physical, and psychological status, i.e., risk of fall, medications, drug reaction, cross-infection, etc."
  ),
  hyphEn("Be informed about any unanticipated adverse outcomes."),
  hyphEn("Give or refuse consent before filming or recording images."),
];
