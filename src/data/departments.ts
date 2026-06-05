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
  { key: "Clinical Speciality", label: "Clinical Speciality", labelAr: "Ø§Ù„ØªØ®ØµØµØ§Øª Ø§Ù„Ø·Ø¨ÙŠØ©" },
  { key: "Clinical Support Service", label: "Clinical Support Service", labelAr: "Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ø¯Ø§Ø¹Ù…Ø©" },
  { key: "Home Care Service", label: "Home Care Service", labelAr: "Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ù…Ù†Ø²Ù„ÙŠØ©" },
];
export const departments: Department[] = [
  {
    id: 1, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Obstetrics & Gynecology", nameAr: "Ù‚Ø³Ù… Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ù†Ø³Ø§Ø¡ ÙˆØ§Ù„ÙˆÙ„Ø§Ø¯Ø©", slug: "obstetrics-gynecology",
    desc: "Complete maternity care from prenatal through postpartum recovery, supported by healthcare professionals.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ø£Ù…ÙˆÙ…Ø© Ø´Ø§Ù…Ù„Ø© Ù…Ù† Ù…Ø§ Ù‚Ø¨Ù„ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø© Ø­ØªÙ‰ Ø§Ù„ØªØ¹Ø§ÙÙŠ Ø¨Ø¹Ø¯Ù‡Ø§ØŒ Ø¨Ø¯Ø¹Ù… Ù…Ù† Ø£ÙƒØ«Ø± Ù…Ù† 600 Ù…ØªØ®ØµØµ.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Obstetrics+%26+Gynecology/2.JPG",
    clinicCode: "R002OBG",
    subs: [
      { name: "Women's Health", nameAr: "ØµØ­Ø© Ø§Ù„Ù…Ø±Ø£Ø©" },
      { name: "Urogynecology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ù…Ø³Ø§Ù„Ùƒ Ø§Ù„Ø¨ÙˆÙ„ÙŠØ© Ø§Ù„Ù†Ø³Ø§Ø¦ÙŠØ©" },
      { name: "Cosmetic Gynecology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ù†Ø³Ø§Ø¡ Ø§Ù„ØªØ¬Ù…ÙŠÙ„ÙŠØ©" },
      { name: "Gynecologic Oncology", nameAr: "Ø£ÙˆØ±Ø§Ù… Ø§Ù„Ù†Ø³Ø§Ø¡" },
      { name: "Physiotherapy", nameAr: "Ø§Ù„Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ" },
      { name: "Parent and Childbirth Education", nameAr: "ØªØ«Ù‚ÙŠÙ Ø§Ù„ÙˆØ§Ù„Ø¯ÙŠÙ† ÙˆØ§Ù„ÙˆÙ„Ø§Ø¯Ø©" },
    ],
  },
  {
    id: 4, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Neonatal", nameAr: "Ù‚Ø³Ù… Ø­Ø¯ÙŠØ«ÙŠ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©", slug: "neonatal",
    desc: "Level III Neonatal Unit â€” the highest in Kuwait's private sector â€” offering specialized care for premature and critically ill infants.",
    descAr: "ÙˆØ­Ø¯Ø© Ø­Ø¯ÙŠØ«ÙŠ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø© Ù…Ù† Ø§Ù„Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ø«Ø§Ù„Ø« â€” Ø§Ù„Ø£Ø¹Ù„Ù‰ ÙÙŠ Ø§Ù„Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ø§Ù„ÙƒÙˆÙŠØª.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Neonatal/1.jpg",
    clinicCode: "R01NEO",
  },
  {
    id: 3, icon: Baby, category: "Children", mainCategory: "Clinical Speciality",
    name: "Pediatrics", nameAr: "Ù‚Ø³Ù… Ø·Ø¨ Ø§Ù„Ø£Ø·ÙØ§Ù„", slug: "pediatrics",
    desc: "World-class pediatric care with warmth and a child-centered approach, from infancy through adolescence.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ø£Ø·ÙØ§Ù„ Ø¹Ø§Ù„Ù…ÙŠØ© Ø§Ù„Ù…Ø³ØªÙˆÙ‰ Ø¨Ø¯ÙØ¡ ÙˆÙ†Ù‡Ø¬ Ù…Ø­ÙˆØ±Ù‡ Ø§Ù„Ø·ÙÙ„.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Pediatrics/2.JPG",
    clinicCode: "R002PED",
  },
  {
    id: 6, icon: Scissors, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "General & Laparoscopic Surgery", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø¬Ø±Ø§Ø­Ø© Ø§Ù„Ø¹Ø§Ù…Ø© ÙˆØ§Ù„Ù…Ù†Ø¸Ø§Ø±", slug: "general-laparoscopic-surgery",
    desc: "Exceptional surgical care blending expert skills with advanced technology for precision, safety, and quick recovery.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ø¬Ø±Ø§Ø­ÙŠØ© Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ© ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ø§Ù„Ù…Ù‡Ø§Ø±Ø§Øª ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ù…ØªÙ‚Ø¯Ù…Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/General+%26+Laparoscopic+Surgery/1.JPG",
    clinicCode: "GI 1",
    subs: [
      { name: "Obesity Bariatric Surgery", nameAr: "Ø¬Ø±Ø§Ø­Ø§Øª Ø§Ù„Ø³Ù…Ù†Ø© Ø§Ù„Ù…ÙØ±Ø·Ø©" },
      { name: "Breast Surgical Oncology", nameAr: "Ø¬Ø±Ø§Ø­Ø© Ø£ÙˆØ±Ø§Ù… Ø§Ù„Ø«Ø¯ÙŠ" },
      { name: "Abdominal Wall Reconstruction", nameAr: "Ø¥Ø¹Ø§Ø¯Ø© ØªØ±Ù…ÙŠÙ… Ø¬Ø¯Ø§Ø± Ø§Ù„Ø¨Ø·Ù†" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "Ø§Ù„ØªØºØ°ÙŠØ© Ø§Ù„Ø¹Ù„Ø§Ø¬ÙŠØ© ÙˆØ§Ù„Ø­Ù…ÙŠØ©" },
    ],
  },
  {
    id: 13, icon: Stethoscope, category: "Surgery", mainCategory: "Clinical Speciality",
    name: "Anesthesia", nameAr: "Ù‚Ø³Ù… Ø§Ù„ØªØ®Ø¯ÙŠØ±", slug: "anesthesia",
    desc: "Top-tier anesthesia services ensuring patient safety and comfort for all surgical and childbirth procedures.",
    descAr: "Ø®Ø¯Ù…Ø§Øª ØªØ®Ø¯ÙŠØ± Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ù…Ø³ØªÙˆÙ‰ ØªØ¶Ù…Ù† Ø³Ù„Ø§Ù…Ø© Ø§Ù„Ù…Ø±ÙŠØ¶ ÙˆØ±Ø§Ø­ØªÙ‡.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Anesthesia/1.JPG",
    clinicCode: "R002ANA",
  },
  {
    id: 5, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Internal Medicine", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠØ©", slug: "internal-medicine",
    desc: "Comprehensive diagnosis and treatment of complex adult diseases with personalized health check programs.",
    descAr: "ØªØ´Ø®ÙŠØµ ÙˆØ¹Ù„Ø§Ø¬ Ø´Ø§Ù…Ù„ Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø¨Ø§Ù„ØºÙŠÙ† Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø© Ù…Ø¹ Ø¨Ø±Ø§Ù…Ø¬ ÙØ­Øµ ØµØ­ÙŠ Ù…Ø®ØµØµØ©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Internal+Medicine/1.jpg",
    clinicCode: "R01ERC",
    subs: [
      { name: "Cardiology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ù‚Ù„Ø¨" },
      { name: "Nephrology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„ÙƒÙ„Ù‰" },
      { name: "Gastroenterology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ù‡Ø¶Ù…ÙŠ" },
      { name: "Endocrinology & Metabolism", nameAr: "Ø§Ù„ØºØ¯Ø¯ Ø§Ù„ØµÙ…Ø§Ø¡ ÙˆØ§Ù„ØªÙ…Ø«ÙŠÙ„ Ø§Ù„ØºØ°Ø§Ø¦ÙŠ" },
      { name: "Rheumatology", nameAr: "Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø±ÙˆÙ…Ø§ØªÙŠØ²Ù…" },
      { name: "Clinical Nutrition & Dietetics", nameAr: "Ø§Ù„ØªØºØ°ÙŠØ© Ø§Ù„Ø¹Ù„Ø§Ø¬ÙŠØ© ÙˆØ§Ù„Ø­Ù…ÙŠØ©" },
    ],
  },
  {
    id: 10, icon: Activity, category: "General", mainCategory: "Clinical Speciality",
    name: "Family Medicine", nameAr: "Ù‚Ø³Ù… Ø·Ø¨ Ø§Ù„Ø¹Ø§Ø¦Ù„Ø©", slug: "family-medicine",
    desc: "Continuous, personalized care for individuals and families of all ages with coordinated health management.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ù…Ø³ØªÙ…Ø±Ø© ÙˆÙ…Ø®ØµØµØ© Ù„Ù„Ø£ÙØ±Ø§Ø¯ ÙˆØ§Ù„Ø¹Ø§Ø¦Ù„Ø§Øª Ù…Ù† Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ø¹Ù…Ø§Ø±.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Family+Medicine/1.jpg",
    clinicCode: "R01FMC",
  },
  {
    id: 9, icon: Stethoscope, category: "Head & Neck", mainCategory: "Clinical Speciality",
    name: "ENT (Ear, Nose & Throat)", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø£Ù†Ù ÙˆØ§Ù„Ø£Ø°Ù† ÙˆØ§Ù„Ø­Ù†Ø¬Ø±Ø©", slug: "ent",
    desc: "Expert care for conditions affecting the ear, nose, throat, head, and neck with both medical and surgical expertise.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ù…ØªØ®ØµØµØ© Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø£Ù†Ù ÙˆØ§Ù„Ø£Ø°Ù† ÙˆØ§Ù„Ø­Ù†Ø¬Ø±Ø© ÙˆØ§Ù„Ø±Ø£Ø³ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/ENT+(Ear%2C+Nose+%26+Throat)/1.jpg",
    clinicCode: "R01ENT",
  },
  {
    id: 7, icon: Scissors, category: "Cosmetic", mainCategory: "Clinical Speciality",
    name: "Plastic Surgery & Cosmetology", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø¬Ø±Ø§Ø­Ø© Ø§Ù„ØªØ¬Ù…ÙŠÙ„ÙŠØ© ÙˆØ§Ù„ØªØ¬Ù…ÙŠÙ„", slug: "plastic-surgery",
    desc: "Internationally certified physicians offering advanced surgical and non-surgical cosmetic and reconstructive solutions.",
    descAr: "Ø£Ø·Ø¨Ø§Ø¡ Ù…Ø¹ØªÙ…Ø¯ÙˆÙ† Ø¯ÙˆÙ„ÙŠØ§Ù‹ ÙŠÙ‚Ø¯Ù…ÙˆÙ† Ø­Ù„ÙˆÙ„Ø§Ù‹ ØªØ¬Ù…ÙŠÙ„ÙŠØ© ÙˆØªØ±Ù…ÙŠÙ…ÙŠØ© Ù…ØªÙ‚Ø¯Ù…Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Plastic+Surgery/3.JPG",
    clinicCode: "R060COS",
  },
  {
    id: 2, icon: Heart, category: "Women's Health", mainCategory: "Clinical Speciality",
    name: "Reproductive Medicine & IVF", nameAr: "Ù‚Ø³Ù… Ø·Ø¨ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø¨ ÙˆØ£Ø·ÙØ§Ù„ Ø§Ù„Ø£Ù†Ø§Ø¨ÙŠØ¨", slug: "reproductive-medicine-ivf",
    desc: "Advanced fertility treatments blending expertise with cutting-edge technology, including IVF, ICSI, and genetic diagnosis.",
    descAr: "Ø¹Ù„Ø§Ø¬Ø§Øª Ø®ØµÙˆØ¨Ø© Ù…ØªÙ‚Ø¯Ù…Ø© ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ø§Ù„Ø®Ø¨Ø±Ø© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ù…ØªØ·ÙˆØ±Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Reproductive+Medicine+%26+IVF/2.jpg",
    clinicCode: "R002IVF",
  },
  {
    id: 8, icon: Smile, category: "Skin", mainCategory: "Clinical Speciality",
    name: "Dermatology", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©", slug: "dermatology",
    desc: "Expert care for all dermatological needs combining clinical excellence with the latest advances for adults and children.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ù…ØªØ®ØµØµØ© Ù„Ø¬Ù…ÙŠØ¹ Ø§Ø­ØªÙŠØ§Ø¬Ø§Øª Ø§Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ© Ù…Ø¹ Ø£Ø­Ø¯Ø« Ø§Ù„ØªØ·ÙˆØ±Ø§Øª.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Dermatology/1.JPG",
    clinicCode: "R01DER",
  },
  {
    id: 11, icon: Smile, category: "Dental", mainCategory: "Clinical Speciality",
    name: "Dental Clinic", nameAr: "Ù‚Ø³Ù… Ø·Ø¨ Ø§Ù„Ø£Ø³Ù†Ø§Ù†", slug: "dental-clinic",
    desc: "Exceptional dental care in a luxurious setting with specialized dentists using advanced technology for all ages.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© Ø£Ø³Ù†Ø§Ù† Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ© ÙÙŠ Ø¨ÙŠØ¦Ø© ÙØ§Ø®Ø±Ø© Ù…Ø¹ Ø£Ø·Ø¨Ø§Ø¡ Ù…ØªØ®ØµØµÙŠÙ†.",
    img: "/images/Department/Dental.jpg",
    clinicCode: "R002DEN",
  },
  {
    id: 12, icon: Pill, category: "Wellness", mainCategory: "Clinical Speciality",
    name: "Pain Management", nameAr: "ÙˆØ­Ø¯Ø© Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø£Ù„Ù…", slug: "pain-management",
    desc: "Comprehensive program offering advanced, compassionate care for acute and chronic pain to restore comfort and functionality.",
    descAr: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø´Ø§Ù…Ù„ ÙŠÙ‚Ø¯Ù… Ø±Ø¹Ø§ÙŠØ© Ù…ØªÙ‚Ø¯Ù…Ø© ÙˆØ±Ø­ÙŠÙ…Ø© Ù„Ù„Ø£Ù„Ù… Ø§Ù„Ø­Ø§Ø¯ ÙˆØ§Ù„Ù…Ø²Ù…Ù†.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Pain+Management/1.jpg",
    clinicCode: "R002PAI",
  },
  {
    id: 16, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Laboratory Services", nameAr: "Ù‚Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù…Ø®Ø¨Ø±ÙŠØ©", slug: "laboratory-services",
    desc: "CAP-accredited laboratory providing gold-standard diagnostic testing and pathology services.",
    descAr: "Ù…Ø®ØªØ¨Ø± Ù…Ø¹ØªÙ…Ø¯ Ù…Ù† CAP ÙŠÙ‚Ø¯Ù… ÙØ­ÙˆØµØ§Øª ØªØ´Ø®ÙŠØµÙŠØ© ÙˆØ®Ø¯Ù…Ø§Øª Ø¹Ù„Ù… Ø§Ù„Ø£Ù…Ø±Ø§Ø¶ Ø¨Ø£Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ±.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Laboratory+Services/1.jpg",
    clinicCode: "R07LABH",
  },
  {
    id: 15, icon: Microscope, category: "Diagnostics", mainCategory: "Clinical Support Service",
    name: "Center for Diagnostic Imaging", nameAr: "Ù…Ø±ÙƒØ² Ø§Ù„Ø£Ø´Ø¹Ø© Ø§Ù„ØªØ´Ø®ÙŠØµÙŠØ©", slug: "center-for-diagnostic-imaging",
    desc: "Advanced diagnostic and image-guided therapeutic services combining expert professionals with state-of-the-art technology.",
    descAr: "Ø®Ø¯Ù…Ø§Øª ØªØ´Ø®ÙŠØµÙŠØ© ÙˆØ¹Ù„Ø§Ø¬ÙŠØ© Ù…ÙˆØ¬Ù‡Ø© Ø¨Ø§Ù„ØªØµÙˆÙŠØ± ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ù…ØªØ®ØµØµÙŠÙ† ÙˆØªÙ‚Ù†ÙŠØ§Øª Ø­Ø¯ÙŠØ«Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Center+for+Diagnostic+Imaging/1.JPG",
    clinicCode: "R010DIE",
  },
  {
    id: 14, icon: AlertCircle, category: "Emergency", mainCategory: "Clinical Support Service",
    name: "Intensive Care", nameAr: "ÙˆØ­Ø¯Ø© Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù…Ø±ÙƒØ²Ø©", slug: "intensive-care",
    desc: "Round-the-clock monitoring and care for severe, life-threatening conditions with cutting-edge technology.",
    descAr: "Ù…Ø±Ø§Ù‚Ø¨Ø© ÙˆØ±Ø¹Ø§ÙŠØ© Ø¹Ù„Ù‰ Ù…Ø¯Ø§Ø± Ø§Ù„Ø³Ø§Ø¹Ø© Ù„Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø­Ø±Ø¬Ø© Ø§Ù„Ù…Ù‡Ø¯Ø¯Ø© Ù„Ù„Ø­ÙŠØ§Ø©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Intensive+Care/1.jpg",
    clinicCode: "R001SCN",
  },
  {
    id: 17, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Clinical Pharmacy", nameAr: "Ø§Ù„ØµÙŠØ¯Ù„Ø© Ø§Ù„Ø¥ÙƒÙ„ÙŠÙ†ÙŠÙƒÙŠØ©", slug: "clinical-pharmacy",
    desc: "Expert pharmaceutical care integrated with clinical teams for optimal medication therapy outcomes.",
    descAr: "Ø±Ø¹Ø§ÙŠØ© ØµÙŠØ¯Ù„Ø§Ù†ÙŠØ© Ù…ØªØ®ØµØµØ© Ù…Ø¯Ù…Ø¬Ø© Ù…Ø¹ Ø§Ù„ÙØ±Ù‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©.",
    img: "https://royal-hayat.s3.eu-central-1.amazonaws.com/department/Department+Photos/Department+Photos/Clinical+Pharmacy/1.jpg",
  },
  {
    id: 20, icon: Pill, category: "Pharmacy", mainCategory: "Clinical Support Service",
    name: "Royale Hayat Pharmacy", nameAr: "ØµÙŠØ¯Ù„ÙŠØ© Ø±ÙˆÙŠØ§Ù„ Ø­ÙŠØ§Ø©", slug: "royale-hayat-pharmacy",
    desc: "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs.",
    descAr: "ØªÙ‚Ø¹ ØµÙŠØ¯Ù„ÙŠØ© Ø±ÙˆÙŠØ§Ù„ Ø­ÙŠØ§Ø© ÙÙŠ Ø§Ù„Ø·Ø§Ø¨Ù‚ Ø§Ù„Ø£Ø±Ø¶ÙŠØŒ ÙˆÙŠØ¹Ù…Ù„ Ø¨Ù‡Ø§ ØµÙŠØ§Ø¯Ù„Ø© Ù…Ø¤Ù‡Ù„ÙˆÙ† ØªØ£Ù‡ÙŠÙ„Ø§Ù‹ Ø¹Ø§Ù„ÙŠØ§Ù‹ Ù…ØªØ§Ø­ÙˆÙ† Ø¹Ù„Ù‰ Ù…Ø¯Ø§Ø± Ø§Ù„Ø³Ø§Ø¹Ø© Ø·ÙˆØ§Ù„ Ø£ÙŠØ§Ù… Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹.",
    img: "/images/Department/Pharmacy.jpg",
  },
  {
    id: 19, icon: Shield, category: "Premium", mainCategory: "Clinical Support Service",
    name: "Al Safwa HealthCare", nameAr: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØµÙÙˆØ© Ù„Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ©", slug: "al-safwa-healthcare",
    desc: "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle.",
    descAr: "ØªØ­ÙƒÙ… ÙÙŠ ØµØ­ØªÙƒ Ø¨Ø³Ù‡ÙˆÙ„Ø© Ù…Ù† Ø®Ù„Ø§Ù„ Ø¨Ø±Ù†Ø§Ù…Ø¬Ù†Ø§ Ø§Ù„Ù…Ø®ØµØµ. Ø³Ø¬Ù„ Ø¹Ù† Ø·Ø±ÙŠÙ‚ Ø¥ÙƒÙ…Ø§Ù„ Ù†Ù…ÙˆØ°Ø¬ ØªØ³Ø¬ÙŠÙ„ Ø³Ø±ÙŠØ¹ØŒ ÙˆØªÙ‚Ø¯ÙŠÙ… Ù„Ù…Ø­Ø© Ø¹Ù† ØªØ§Ø±ÙŠØ®Ùƒ Ø§Ù„Ø·Ø¨ÙŠ ÙˆÙ†Ù…Ø· Ø­ÙŠØ§ØªÙƒ.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
  },
  {
    id: 18, icon: Home, category: "Wellness", mainCategory: "Home Care Service",
    name: "Royale Home Health", nameAr: "Ø±ÙˆÙŠØ§Ù„ Ù‡ÙˆÙ… Ù‡ÙŠÙ„Ø« Ù„Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ù…Ù†Ø²Ù„ÙŠØ©", slug: "home-health",
    desc: "Royale Home Health is an exclusive extension of Royale Hayat Hospital, offering exceptional health and wellness support delivered directly to your home.",
    descAr: "Ø±ÙˆÙŠØ§Ù„ Ù„Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ù…Ù†Ø²Ù„ÙŠØ© Ù‡ÙŠ Ø§Ù…ØªØ¯Ø§Ø¯ Ø­ØµØ±ÙŠ Ù„Ù…Ø³ØªØ´ÙÙ‰ Ø±ÙˆÙŠØ§Ù„ Ø­ÙŠØ§Ø©ØŒ ØªÙ‚Ø¯Ù… Ø¯Ø¹Ù…Ø§Ù‹ Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ§Ù‹ Ù„Ù„ØµØ­Ø© ÙˆØ§Ù„Ø¹Ø§ÙÙŠØ© Ù…Ø¨Ø§Ø´Ø±Ø© ÙÙŠ Ù…Ù†Ø²Ù„Ùƒ.",
    img: "/images/Department/home-health.jpg",
  },
  {
    id: 22, icon: Activity, category: "Physiotherapy", mainCategory: "Home Care Service",
    name: "Physiotherapy", nameAr: "Ø§Ù„Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ", slug: "physiotherapy",
    desc: "Advanced physiotherapy treatments tailored for recovery, rehabilitation, and long-term wellness.",
    descAr: "Ø¹Ù„Ø§Ø¬Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© Ù…ØªÙ‚Ø¯Ù…Ø© Ù…ØµÙ…Ù…Ø© Ù„Ù„ØªØ¹Ø§ÙÙŠ ÙˆØ¥Ø¹Ø§Ø¯Ø© Ø§Ù„ØªØ£Ù‡ÙŠÙ„ ÙˆØ§Ù„Ø¹Ø§ÙÙŠØ© Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¯Ù‰ Ø§Ù„Ø·ÙˆÙŠÙ„.",
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
  "Intensive Care": ["Intensive Care"],
  "Center for Diagnostic Imaging": ["Radiology"],
  "Laboratory Services": ["Laboratory"],
  "Clinical Pharmacy": ["Clinical Pharmacy"],
  "Royale Home Health": ["Royale Home Health"],
  "Al Safwa HealthCare": ["Al Safwa"],
  "Royale Hayat Pharmacy": ["Pharmacy"],
  "Physiotherapy": ["Physiotherapy"],
};
export function doctorMatchesDepartment(
  deptName: string,
  doc: { department: string; specialty: string },
  extraTerms: string[] = []
): boolean {
  if (deptName === "Royale Hayat Pharmacy") {
    return doc.department === "Pharmacy";
  }
  const aliases = deptDoctorAliases[deptName];
  const matchTerms = [...(aliases && aliases.length > 0 ? aliases : [deptName]), ...extraTerms];
  return matchTerms.some((alias) => doc.department.includes(alias) || doc.specialty.includes(alias));
}
