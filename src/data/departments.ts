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
  mainCategory: MainCategory;
  subs?: { name: string; nameAr: string }[];
}

export const MAIN_CATEGORIES: { key: MainCategory; label: string; labelAr: string }[] = [
  { key: "Clinical Speciality",       label: "Clinical Speciality",       labelAr: "التخصصات السريرية" },
  { key: "Clinical Support Service",  label: "Clinical Support Service",  labelAr: "خدمات الدعم السريري" },
  { key: "Home Care Service",         label: "Home Care Service",         labelAr: "خدمات الرعاية المنزلية" },
];

export const departments: Department[] = [
  // ── CLINICAL SPECIALITY ──────────────────────────────────────────────
  {
    id: 1, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Obstetrics & Gynecology", nameAr: "التوليد وأمراض النساء", slug: "obstetrics-gynecology",
    desc: "Complete maternity care from prenatal through postpartum recovery, supported by healthcare professionals.",
    descAr: "رعاية أمومة شاملة من ما قبل الولادة حتى التعافي بعدها، بدعم من أكثر من 600 متخصص.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776418841/2_kdo31l.jpg",
    subs: [
      { name: "Women's Health", nameAr: "صحة المرأة" },
      { name: "Urogynecology", nameAr: "أمراض المسالك البولية النسائية" },
      { name: "Cosmetic Gynecology", nameAr: "أمراض النساء التجميلية" },
      { name: "Gynecologic Oncology", nameAr: "أورام النساء" },
      { name: "Physiotherapy", nameAr: "العلاج الطبيعي" },
      { name: "Parent and Childbirth Education", nameAr: "تثقيف الوالدين والولادة" },
    ],
  },
  {
    id: 4, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Neonatal", nameAr: "حديثي الولادة", slug: "neonatal",
    desc: "Level III Neonatal Unit — the highest in Kuwait's private sector — offering specialized care for premature and critically ill infants.",
    descAr: "وحدة حديثي الولادة من المستوى الثالث — الأعلى في القطاع الخاص بالكويت.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341286/1_cig453.jpg",
  },
  {
    id: 3, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Pediatrics", nameAr: "طب الأطفال", slug: "pediatrics",
    desc: "World-class pediatric care with warmth and a child-centered approach, from infancy through adolescence.",
    descAr: "رعاية أطفال عالمية المستوى بدفء ونهج محوره الطفل.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341215/2_zdqayn.jpg",
  },
  {
    id: 6, icon: Scissors, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "General & Laparoscopic Surgery", nameAr: "الجراحة العامة والمنظار", slug: "general-laparoscopic-surgery",
    desc: "Exceptional surgical care blending expert skills with advanced technology for precision, safety, and quick recovery.",
    descAr: "رعاية جراحية استثنائية تجمع بين المهارات والتكنولوجيا المتقدمة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341611/1_jbry60.jpg",
    subs: [
      { name: "Obesity Bariatric Surgery", nameAr: "جراحة السمنة" },
      { name: "Breast Surgical Oncology", nameAr: "أورام الثدي الجراحية" },
      { name: "Abdominal Wall Reconstruction", nameAr: "إعادة بناء جدار البطن" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "التغذية السريرية" },
    ],
  },
  {
    id: 13, icon: Stethoscope, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "Anesthesia", nameAr: "التخدير", slug: "anesthesia",
    desc: "Top-tier anesthesia services ensuring patient safety and comfort for all surgical and childbirth procedures.",
    descAr: "خدمات تخدير عالية المستوى تضمن سلامة المريض وراحته.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342086/1_ucnzxm.jpg",
  },
  {
    id: 5, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Internal Medicine", nameAr: "الطب الباطني", slug: "internal-medicine",
    desc: "Comprehensive diagnosis and treatment of complex adult diseases with personalized health check programs.",
    descAr: "تشخيص وعلاج شامل لأمراض البالغين المعقدة مع برامج فحص صحي مخصصة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776410489/1_eb6qdw.jpg",
    subs: [
      { name: "Cardiology", nameAr: "أمراض القلب" },
      { name: "Nephrology", nameAr: "أمراض الكلى" },
      { name: "Gastroenterology", nameAr: "أمراض الجهاز الهضمي" },
      { name: "Endocrinology & Metabolism", nameAr: "الغدد الصماء والتمثيل الغذائي" },
      { name: "Rheumatology", nameAr: "أمراض الروماتيزم" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "التغذية السريرية" },
    ],
  },
  {
    id: 10, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Family Medicine", nameAr: "طب الأسرة", slug: "family-medicine",
    desc: "Continuous, personalized care for individuals and families of all ages with coordinated health management.",
    descAr: "رعاية مستمرة ومخصصة للأفراد والعائلات من جميع الأعمار.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776410298/1_vcivez.jpg",
  },
  {
    id: 9, icon: Stethoscope, category: "Head & Neck", mainCategory: "Clinical Speciality",
    name: "ENT (Ear, Nose & Throat)", nameAr: "الأنف والأذن والحنجرة", slug: "ent",
    desc: "Expert care for conditions affecting the ear, nose, throat, head, and neck with both medical and surgical expertise.",
    descAr: "رعاية متخصصة لأمراض الأنف والأذن والحنجرة والرأس والرقبة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341874/1_muikcx.jpg",
  },
  {
    id: 7, icon: Scissors, category: "Cosmetic", mainCategory: "Clinical Speciality",
    name: "Plastic Surgery & Cosmetology", nameAr: "الجراحة التجميلية", slug: "plastic-surgery",
    desc: "Internationally certified physicians offering advanced surgical and non-surgical cosmetic and reconstructive solutions.",
    descAr: "أطباء معتمدون دولياً يقدمون حلولاً تجميلية وترميمية متقدمة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341728/3_b7dnxl.jpg",
  },
  {
    id: 2, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Reproductive Medicine & IVF", nameAr: "الطب التناسلي وأطفال الأنابيب", slug: "reproductive-medicine-ivf",
    desc: "Advanced fertility treatments blending expertise with cutting-edge technology, including IVF, ICSI, and genetic diagnosis.",
    descAr: "علاجات خصوبة متقدمة تجمع بين الخبرة والتكنولوجيا المتطورة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776421052/2_f1yt2d.jpg",
  },
  {
    id: 8, icon: Smile, category: "Skin", mainCategory: "Clinical Speciality",
    name: "Dermatology", nameAr: "الأمراض الجلدية", slug: "dermatology",
    desc: "Expert care for all dermatological needs combining clinical excellence with the latest advances for adults and children.",
    descAr: "رعاية متخصصة لجميع احتياجات الأمراض الجلدية مع أحدث التطورات.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341783/1_h3erol.jpg",
  },
  {
    id: 11, icon: Smile, category: "Dental", mainCategory: "Clinical Speciality",
    name: "Dental Clinic", nameAr: "عيادة الأسنان", slug: "dental-clinic",
    desc: "Exceptional dental care in a luxurious setting with specialized dentists using advanced technology for all ages.",
    descAr: "رعاية أسنان استثنائية في بيئة فاخرة مع أطباء متخصصين.",
    img: "/images/Department/Dental.jpg",
  },
  {
    id: 12, icon: Pill, category: "Wellness", mainCategory: "Clinical Speciality",
    name: "Pain Management", nameAr: "إدارة الألم", slug: "pain-management",
    desc: "Comprehensive program offering advanced, compassionate care for acute and chronic pain to restore comfort and functionality.",
    descAr: "برنامج شامل يقدم رعاية متقدمة ورحيمة للألم الحاد والمزمن.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776341973/1_euvkse.jpg",
  },

  // ── CLINICAL SUPPORT SERVICE ─────────────────────────────────────────
  {
    id: 16, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Laboratory Services", nameAr: "خدمات المختبر", slug: "laboratory-services",
    desc: "CAP-accredited laboratory providing gold-standard diagnostic testing and pathology services.",
    descAr: "مختبر معتمد من CAP يقدم فحوصات تشخيصية وخدمات علم الأمراض بأعلى المعايير.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342209/1_z8wzox.jpg",
  },
  {
    id: 15, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Center for Diagnostic Imaging", nameAr: "مركز التصوير التشخيصي", slug: "center-for-diagnostic-imaging",
    desc: "Advanced diagnostic and image-guided therapeutic services combining expert professionals with state-of-the-art technology.",
    descAr: "خدمات تشخيصية وعلاجية موجهة بالتصوير تجمع بين متخصصين وتقنيات حديثة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342167/1_tgiqtq.jpg",
  },
  {
    id: 14, icon: AlertCircle, category: "Emergency", mainCategory: "Clinical Support Service",
    name: "Intensive Care", nameAr: "العناية المركزة", slug: "intensive-care",
    desc: "Round-the-clock monitoring and care for severe, life-threatening conditions with cutting-edge technology.",
    descAr: "مراقبة ورعاية على مدار الساعة للحالات الحرجة المهددة للحياة.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342130/1_lc2cxx.jpg",
  },
  {
    id: 17, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Clinical Pharmacy", nameAr: "الصيدلة السريرية", slug: "clinical-pharmacy",
    desc: "Expert pharmaceutical care integrated with clinical teams for optimal medication therapy outcomes.",
    descAr: "رعاية صيدلانية متخصصة مدمجة مع الفرق السريرية.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342251/1_ygmlze.jpg",
  },
  {
    id: 20, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Royale Hayat Pharmacy", nameAr: "صيدلية رويال حياة", slug: "royale-hayat-pharmacy",
    desc: "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs.",
    descAr: "تقع صيدلية رويال حياة في الطابق الأرضي، ويعمل بها صيادلة مؤهلون تأهيلاً عالياً متاحون على مدار الساعة طوال أيام الأسبوع.",
    img: "/images/Department/Pharmacy.jpg",
  },
  {
    id: 19, icon: Shield, category: "Premium", mainCategory: "Clinical Support Service",
    name: "Al Safwa HealthCare", nameAr: "الصفوة للرعاية الصحية", slug: "al-safwa-healthcare",
    desc: "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle.",
    descAr: "تحكم في صحتك بسهولة من خلال برنامجنا المخصص. سجل عن طريق إكمال نموذج تسجيل سريع، وتقديم لمحة عن تاريخك الطبي ونمط حياتك.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
  },

  // ── HOME CARE SERVICE ────────────────────────────────────────────────
  {
    id: 18, icon: Home, category: "Wellness", mainCategory: "Home Care Service",
    name: "Royale Home Health", nameAr: "رويال للرعاية المنزلية", slug: "home-health",
    desc: "Royale Home Health is an exclusive extension of Royale Hayat Hospital, offering exceptional health and wellness support delivered directly to your home.",
    descAr: "رويال للرعاية المنزلية هي امتداد حصري لمستشفى رويال حياة، تقدم دعماً استثنائياً للصحة والعافية مباشرة في منزلك.",
    img: "/images/Department/home-health.jpg",
  },
  {
    id: 22, icon: Activity, category: "Physiotherapy", mainCategory: "Home Care Service",
    name: "Physiotherapy", nameAr: "العلاج الطبيعي", slug: "physiotherapy",
    desc: "Advanced physiotherapy treatments tailored for recovery, rehabilitation, and long-term wellness.",
    descAr: "علاجات طبيعية متقدمة مصممة للتعافي وإعادة التأهيل والعافية على المدى الطويل.",
    img: "https://res.cloudinary.com/dwhc8kzpv/image/upload/q_auto/f_auto/v1776342388/1_ogzrki.jpg",
  },
];

// Maps department name → doctor department/specialty values for filtering
export const deptDoctorAliases: Record<string, string[]> = {
  "Obstetrics & Gynecology": ["Obstetrics & Gynecology"],
  "Reproductive Medicine & IVF": ["IVF", "Reproductive Medicine"],
  "Pediatrics": ["Pediatric", "Pediatrics"],
  "Neonatal": ["Neonatal"],
  "Internal Medicine": ["Internal Medicine"],
  "General & Laparoscopic Surgery": ["General Surgery"],
  "Plastic Surgery & Cosmetology": ["La Cosmetique", "Plastic Surgery"],
  "Dermatology": ["Dermatology"],
  "ENT (Ear, Nose & Throat)": ["ENT (Ear, Nose & Throat)", "ENT"],
  "Family Medicine": ["Family Medicine"],
  "Dental Clinic": ["Dental", "Dental Clinic"],
  "Pain Management": ["Pain Management"],
  "Anesthesia": ["Anesthesia", "Anesthesia & Intensive Care"],
  "IVF & Reproductive Medicine": ["IVF", "Reproductive Medicine", "IVF & Reproductive Medicine"],
  "Intensive Care": ["Intensive Care"],
  "Center for Diagnostic Imaging": ["Radiology"],
  "Laboratory Services": ["Laboratory"],
  "Clinical Pharmacy": ["Clinical Pharmacy"],
  "Royale Home Health": ["Royale Home Health"],
  "Al Safwa HealthCare": ["Al Safwa"],
  "Royale Hayat Pharmacy": [],
  "Physiotherapy": ["Physiotherapy"],
};
