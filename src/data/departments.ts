import {
  Heart, Baby, Activity, Smile, Stethoscope,
  Scissors, Pill, Microscope, AlertCircle, Home, Shield
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export type MainCategory = "Clinical Speciality" | "Clinical Support Service" | "Home Care Service";
export interface Department {
  id: number;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  img: string;
  slug: string;
  icon: LucideIcon;
  category: string;
  clinicCode?: string;
  mainCategory?: MainCategory;
  mongoId?: string;
  medicalField?: string;
  medicalFieldAr?: string;
  subs?: {
    name: string;
    nameAr: string;
    subspecialityId?: string;
    description?: string;
    customBlocks?: { subHeading?: string; explanations: string[] }[];
  }[];
  departmentContentBlocks?: { subHeading?: string; explanations: string[] }[];
}
export const MAIN_CATEGORIES: { key: MainCategory; label: string; labelAr: string }[] = [
  { key: "Clinical Speciality", label: "Clinical Speciality", labelAr: "التخصصات الطبية" },
  { key: "Clinical Support Service", label: "Clinical Support Service", labelAr: "الخدمات الطبية الداعمة" },
  { key: "Home Care Service", label: "Home Care Service", labelAr: "خدمات الرعاية المنزلية" },
];
export const departments: Department[] = [
  {
    id: 1, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Obstetrics & Gynecology", nameAr: "أمراض النساء والولادة", slug: "obstetrics-gynecology",
    desc: "Complete maternity care from prenatal through postpartum recovery, supported by healthcare professionals.",
    descAr: "رعاية أمومة شاملة من ما قبل الولادة حتى التعافي بعدها، بدعم من أكثر من 600 متخصص.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Obstetrics+%26+Gynecology/2.JPG",
    clinicCode: "R002OBG",
    subs: [
      { name: "Women's Health", nameAr: "صحة المرأة" },
      { name: "Urogynecology", nameAr: "أمراض المسالك البولية النسائية" },
      { name: "Cosmetic Gynecology", nameAr: "التجميل النسائي" },
      { name: "Gynecologic Oncology", nameAr: "الأورام النسائية" },
      { name: "Physiotherapy", nameAr: "العلاج الطبيعي" },
      { name: "Parent and Childbirth Education", nameAr: "تثقيف الوالدين والولادة" },
    ],
  },
  {
    id: 4, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Neonatal", nameAr: "حديثي الولادة", slug: "neonatal",
    desc: "Level III Neonatal Unit — the highest in Kuwait's private sector — offering specialized care for premature and critically ill infants.",
    descAr: "وحدة حديثي الولادة من المستوى الثالث — الأعلى في القطاع الخاص بالكويت.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Neonatal/1.jpg",
    clinicCode: "R01NEO",
  },
  {
    id: 3, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Pediatrics", nameAr: "طب الأطفال", slug: "pediatrics",
    desc: "World-class pediatric care with warmth and a child-centered approach, from infancy through adolescence.",
    descAr: "رعاية أطفال عالمية المستوى بدفء ونهج محوره الطفل، من الرضاعة حتى المراهقة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Pediatrics/2.JPG",
    clinicCode: "R002PED",
  },
  {
    id: 6, icon: Scissors, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "General & Laparoscopic Surgery", nameAr: "الجراحة العامة والمنظار", slug: "general-laparoscopic-surgery",
    desc: "Exceptional surgical care blending expert skills with advanced technology. Our internationally recognized surgeons focus on precision, safety, and quick recovery.",
    descAr:
      "رعاية جراحية متقدمة تجمع بين الخبرة الجراحية العالية وأحدث التقنيات، مع تركيز على الدقة والأمان وسرعة التعافي.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/General+%26+Laparoscopic+Surgery/1.JPG",
    clinicCode: "GI 1",
    subs: [
      { name: "Obesity Bariatric Surgery", nameAr: "جراحات السمنة المفرطة" },
      { name: "Breast Surgical Oncology", nameAr: "جراحة أورام الثدي" },
      { name: "Abdominal Wall Reconstruction", nameAr: "إعادة ترميم جدار البطن" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "التغذية العلاجية والحمية" },
    ],
  },
  {
    id: 13, icon: Stethoscope, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "Anesthesia", nameAr: "التخدير", slug: "anesthesia",
    desc: "Top-tier anesthesia services ensuring patient safety and comfort for all surgical and childbirth procedures.",
    descAr: "خدمات تخدير عالية المستوى تضمن سلامة المريض وراحته لجميع الإجراءات الجراحية والولادة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Anesthesia/1.JPG",
    clinicCode: "R002ANA",
  },
  {
    id: 5, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Internal Medicine", nameAr: "الأمراض الباطنية", slug: "internal-medicine",
    desc: "Comprehensive diagnosis and treatment of complex adult diseases with personalized health check programs.",
    descAr: "تشخيص وعلاج شامل لأمراض البالغين المعقدة مع برامج فحص صحي مخصصة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Internal+Medicine/1.jpg",
    clinicCode: "R01ERC",
    subs: [
      { name: "Cardiology", nameAr: "أمراض القلب" },
      { name: "Nephrology", nameAr: "أمراض الكلى" },
      { name: "Gastroenterology", nameAr: "أمراض الجهاز الهضمي" },
      { name: "Endocrinology & Metabolism", nameAr: "الغدد الصماء والتمثيل الغذائي" },
      { name: "Rheumatology", nameAr: "أمراض الروماتيزم" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "التغذية العلاجية والحمية" },
    ],
  },
  {
    id: 10, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Family Medicine", nameAr: "طب العائلة", slug: "family-medicine",
    desc: "Continuous, personalized care for individuals and families of all ages with coordinated health management.",
    descAr: "رعاية مستمرة ومخصصة للأفراد والعائلات من جميع الأعمار مع إدارة صحية منسقة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Family+Medicine/1.jpg",
    clinicCode: "R01FMC",
  },
  {
    id: 9, icon: Stethoscope, category: "Head & Neck", mainCategory: "Clinical Speciality",
    name: "ENT (Ear, Nose & Throat)", nameAr: "الأنف والأذن والحنجرة", slug: "ent",
    desc: "Expert care for conditions affecting the ear, nose, throat, head, and neck with both medical and surgical expertise.",
    descAr: "رعاية متخصصة لأمراض الأنف والأذن والحنجرة والرأس والرقبة بخبرات طبية وجراحية.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/ENT+(Ear%2C+Nose+%26+Throat)/1.jpg",
    clinicCode: "R01ENT",
  },
  {
    id: 7, icon: Scissors, category: "Cosmetic", mainCategory: "Clinical Speciality",
    name: "Plastic Surgery & Cosmetology", nameAr: "الجراحة التجميلية والتجميل", slug: "plastic-surgery",
    desc: "Internationally certified physicians offering advanced surgical and non-surgical cosmetic and reconstructive solutions.",
    descAr: "أطباء معتمدون دولياً يقدمون حلولاً تجميلية وترميمية جراحية وغير جراحية متقدمة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Plastic+Surgery/3.JPG",
    clinicCode: "R060COS",
  },
  {
    id: 2, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Reproductive Medicine & IVF", nameAr: "طب الإنجاب وأطفال الأنابيب", slug: "reproductive-medicine-ivf",
    desc: "Advanced fertility treatments blending expertise with cutting-edge technology, including IVF, ICSI, and genetic diagnosis.",
    descAr: "علاجات خصوبة متقدمة تجمع بين الخبرة والتكنولوجيا المتطورة، بما في ذلك أطفال الأنابيب والحقن المجهري.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Reproductive+Medicine+%26+IVF/2.jpg",
    clinicCode: "R002IVF",
  },
  {
    id: 8, icon: Smile, category: "Skin", mainCategory: "Clinical Speciality",
    name: "Dermatology", nameAr: "الأمراض الجلدية", slug: "dermatology",
    desc: "Expert care for all dermatological needs combining clinical excellence with the latest advances for adults and children.",
    descAr: "رعاية متخصصة لجميع احتياجات الأمراض الجلدية مع أحدث التطورات.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Dermatology/1.JPG",
    clinicCode: "R01DER",
  },
  {
    id: 11, icon: Smile, category: "Dental", mainCategory: "Clinical Speciality",
    name: "Dental Clinic", nameAr: "طب الأسنان", slug: "dental-clinic",
    desc: "Exceptional dental care in a luxurious setting with specialized dentists using advanced technology for all ages.",
    descAr: "رعاية أسنان متكاملة ضمن بيئة راقية، مع أطباء متخصصين وأحدث التقنيات لجميع الفئات العمرية.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a26b876f25fc9ca16d4cf74/1780922709717-Dental.jpeg",
    clinicCode: "R002DEN",
  },
  {
    id: 12, icon: Pill, category: "Wellness", mainCategory: "Clinical Speciality",
    name: "Pain Management", nameAr: "علاج الألم", slug: "pain-management",
    desc: "Comprehensive program offering advanced, compassionate care for acute and chronic pain to restore comfort and functionality.",
    descAr: "برنامج شامل يقدم رعاية متقدمة ورحيمة للألم الحاد والمزمن لاستعادة الراحة والوظائف.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Pain+Management/1.jpg",
    clinicCode: "R002PAI",
  },
  {
    id: 16, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Laboratory Services", nameAr: "الخدمات المخبرية", slug: "laboratory-services",
    desc: "CAP-accredited laboratory providing gold-standard diagnostic testing and pathology services.",
    descAr: "مختبر معتمد من CAP يقدم فحوصات تشخيصية وخدمات علم الأمراض بأعلى المعايير.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Laboratory+Services/1.jpg",
    clinicCode: "R07LABH",
  },
  {
    id: 15, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Center for Diagnostic Imaging", nameAr: "الأشعة التشخيصية", slug: "center-for-diagnostic-imaging",
    desc: "Advanced diagnostic and image-guided therapeutic services combining expert professionals with state-of-the-art technology.",
    descAr: "في مستشفى رويال حياة، يقدم مركز الأشعة التشخيصية خدمات متقدمة في التشخيص والتدخلات العلاجية الموجهة بالتصوير الطبي، من خلال الجمع بين الخبرات الطبية المتخصصة وأحدث التقنيات لضمان دقة التشخيص وسرعة تقديم الرعاية المناسبة.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Center+for+Diagnostic+Imaging/1.JPG",
    clinicCode: "R010DIE",
  },
  {
    id: 14, icon: AlertCircle, category: "Emergency", mainCategory: "Clinical Support Service",
    name: "Intensive Care", nameAr: "العناية المركزة", slug: "intensive-care",
    desc: "At Royale Hayat Hospital, our ICU offers round-the-clock monitoring and care for severe, life-threatening conditions with cutting-edge technology.",
    descAr: "في مستشفى رويال حياة، توفر وحدة العناية المركزة رعاية طبية متقدمة ومراقبة دقيقة على مدار الساعة للحالات الحرجة والمهددة للحياة، باستخدام أحدث التقنيات والأجهزة الطبية لضمان أعلى مستويات الرعاية والأمان.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Intensive+Care/1.jpg",
    clinicCode: "R001SCN",
  },
  {
    id: 17, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Clinical Pharmacy", nameAr: "الصيدلة الإكلينيكية", slug: "clinical-pharmacy",
    desc: "Expert pharmaceutical care integrated with clinical teams for optimal medication therapy outcomes.",
    descAr: "رعاية صيدلانية متخصصة مدمجة مع الفرق السريرية لتحقيق أفضل نتائج العلاج الدوائي.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Clinical+Pharmacy/1.jpg",
  },
  {
    id: 20, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Royale Hayat Pharmacy", nameAr: "صيدلية رويال حياة", slug: "royale-hayat-pharmacy",
    desc: "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs. Our pharmacists collaborate closely with clinical and nursing teams to ensure the highest standard of pharmaceutical care.",
    descAr: "تقع صيدلية مستشفى رويال حياة في الطابق الأرضي، وتعمل على مدار الساعة بإشراف نخبة من الصيادلة المؤهلين لتقديم الاستشارات الدوائية والدعم المتخصص لجميع الاحتياجات العلاجية. كما يتعاون فريق الصيدلة بشكل وثيق مع الكوادر الطبية والتمريضية لضمان أعلى مستويات الرعاية الدوائية.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a26b876f25fc9ca16d4cf74/1780922706831-Pharmacy.jpeg",
  },
  {
    id: 19, icon: Shield, category: "Premium", mainCategory: "Clinical Support Service",
    name: "Al Safwa HealthCare", nameAr: "برنامج الصفوة للرعاية الصحية", slug: "al-safwa-healthcare",
    desc: "Personalized executive health program with premium screening, dedicated coordinators, and elegant private suites.",
    descAr: "برنامج صحي تنفيذي مخصص مع فحوصات متميزة ومنسقين مخصصين وأجنحة خاصة أنيقة.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
  },
  {
    id: 18, icon: Home, category: "Wellness", mainCategory: "Home Care Service",
    name: "Royale Home Health", nameAr: "رويال هوم هيلث للرعاية المنزلية", slug: "home-health",
    desc: "Premium medical care delivered in the comfort and privacy of your home by certified professionals.",
    descAr: "رعاية طبية متميزة تُقدم في راحة وخصوصية منزلك من قبل متخصصين معتمدين.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a26b876f25fc9ca16d4cf74/1780922709062-RHH_health.jpeg",
  },
  {
    id: 22, icon: Activity, category: "Physiotherapy", mainCategory: "Home Care Service",
    name: "Physiotherapy", nameAr: "العلاج الطبيعي", slug: "physiotherapy",
    desc: "We offer advanced physiotherapy treatments tailored to support women's health throughout life. We collaborate with other departments for comprehensive recovery and rehabilitation.",
    descAr: "في مستشفى رويال حياة، نقدم خدمات علاج طبيعي متقدمة مصممة لدعم صحة المرأة في مختلف مراحل الحياة، مع التعاون المستمر بين الأقسام الطبية المختلفة لضمان رعاية متكاملة وخطط علاجية فعالة للتعافي وإعادة التأهيل.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Physiotherapy/1.jpg",
  },
];
export const deptDoctorAliases: Record<string, string[]> = {
  "Obstetrics & Gynecology": ["Obstetrics & Gynecology"],
  "Reproductive Medicine & IVF": ["Reproductive Medicine & IVF", "IVF", "Reproductive Medicine"],
  "Pediatrics": ["Pediatric", "Pediatrics"],
  "Neonatal": ["Neonatal"],
  "Internal Medicine": ["Internal Medicine", "Nutricare"],
  "General & Laparoscopic Surgery": ["General Surgery"],
  "Plastic Surgery & Cosmetology": ["La Cosmetique", "Plastic Surgery"],
  "Dermatology": ["Dermatology"],
  "ENT (Ear, Nose & Throat)": ["ENT (Ear, Nose & Throat)", "ENT"],
  "Family Medicine": ["Family Medicine"],
  "Dental Clinic": ["Dental", "Dental Clinic"],
  "Pain Management": ["Pain Management"],
  "Anesthesia": ["Anesthesia", "Anesthesia & Intensive Care"],
  "IVF & Reproductive Medicine": ["IVF", "Reproductive Medicine", "IVF & Reproductive Medicine"],
  "Intensive Care": ["Intensive Care", "Anesthesia"],
  "Center for Diagnostic Imaging": ["Radiology"],
  "Laboratory Services": ["Laboratory"],
  "Clinical Pharmacy": ["Clinical Pharmacy"],
  "Royale Home Health": ["Royale Home Health"],
  "Al Safwa HealthCare": ["Al Safwa"],
  "Royale Hayat Pharmacy": ["Pharmacy"],
  "Physiotherapy": ["Physiotherapy"],
};
export const ROYALE_HAYAT_PHARMACY_DOCTOR_IDS = [
  "dr-mirvat-sameer-ghanem",
] as const;
export const CLINICAL_PHARMACY_DOCTOR_IDS = [
  "dr-mustafa-alfiki",
] as const;
export const PAIN_MANAGEMENT_DOCTOR_IDS = [
  "dr-hamid-ghaderi",
] as const;
export function doctorMatchesDepartment(
  deptName: string,
  doc: { id?: string; department: string; specialty: string },
  extraTerms: string[] = []
): boolean {
  if (deptName === "Royale Hayat Pharmacy") {
    return doc.id != null && (ROYALE_HAYAT_PHARMACY_DOCTOR_IDS as readonly string[]).includes(doc.id);
  }
  if (deptName === "Clinical Pharmacy") {
    return doc.id != null && (CLINICAL_PHARMACY_DOCTOR_IDS as readonly string[]).includes(doc.id);
  }
  if (deptName === "Pain Management") {
    return doc.id != null && (PAIN_MANAGEMENT_DOCTOR_IDS as readonly string[]).includes(doc.id);
  }
  const aliases = deptDoctorAliases[deptName];
  const matchTerms = [...(aliases && aliases.length > 0 ? aliases : [deptName]), ...extraTerms];
  return matchTerms.some((alias) => doc.department.includes(alias) || doc.specialty.includes(alias));
}
