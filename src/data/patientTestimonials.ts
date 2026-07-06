export type PatientTestimonial = {
  name: string;
  nameAr: string;
  text: string;
  textAr: string;
  stars: number;
};

export const patientTestimonials: PatientTestimonial[] = [
  {
    name: "Entesar",
    nameAr: "انتصار",
    stars: 5,
    text: "I truly appreciated how the doctors took the time to explain each step of the process, which made me feel safe, confident, and in good hands",
    textAr:
      "أقدّر كثيرًا حرص الأطباء على شرح كل خطوة من خطوات العلاج بوضوح، مما منحني شعورًا بالأمان والثقة والاطمئنان طوال فترة الرعاية",
  },
  {
    name: "Hamad",
    nameAr: "حمد",
    stars: 5,
    text: 'The patient\'s mother expressed, "The doctors and the care were absolutely wonderful. May God reward you for your attention, which we have not seen in other hospitals"',
    textAr:
      "أعربت والدة المريض عن امتنانها قائلة: «كان الأطباء والرعاية المقدمة على مستوى رائع للغاية. جزاكم الله خيرًا على اهتمامكم ومتابعتكم المميزة التي لم نلمسها في مستشفيات أخرى»",
  },
  {
    name: "Fatima",
    nameAr: "فاطمة",
    stars: 5,
    text: "The doctors are great",
    textAr: "الأطباء يتمتعون بكفاءة عالية ومهنية استثنائية",
  },
  {
    name: "Moudhi",
    nameAr: "موضي",
    stars: 5,
    text: "The doctors were excellent",
    textAr: "كان الأطباء على درجة عالية من التميز والاحترافية",
  },
  {
    name: "Haya",
    nameAr: "هيا",
    stars: 5,
    text: "The doctors explained everything clearly, and I could tell they genuinely cared about my well-being",
    textAr:
      "حرص الأطباء على شرح جميع التفاصيل بوضوح، وكان واضحًا اهتمامهم الحقيقي بصحتي وراحتي طوال رحلة العلاج",
  },
  {
    name: "Moudhi",
    nameAr: "موضي",
    stars: 5,
    text: "",
    textAr: "تميز الأطباء بخبرتهم وكفاءتهم العالية، مما عزز ثقتي بجودة الرعاية المقدمة",
  },
  {
    name: "Haya",
    nameAr: "هيا",
    stars: 5,
    text: "",
    textAr:
      "شرح الأطباء كافة الإجراءات بشكل واضح ومطمئن، وشعرت باهتمامهم الصادق وحرصهم على تقديم أفضل رعاية ممكنة",
  },
];

/** Arabic-only variants share English with an earlier entry; hide them in English UI. */
export function filterPatientTestimonialsForLang(
  items: PatientTestimonial[],
  lang: "en" | "ar",
): PatientTestimonial[] {
  return items.filter((item) => (lang === "ar" ? item.textAr : item.text).trim());
}
