/** Legacy QR PDF paths — same paths as old royalehayat.com (use as href, no domain) */

export type RuntimePdfItem = {
  id: string;
  label: string;
  path: string;
};

export type RuntimePdfGroup = {
  id: string;
  title: string;
  items: RuntimePdfItem[];
};

/** All legacy QR / Runtime PDF groups */
export const RUNTIME_PDF_GROUPS: RuntimePdfGroup[] = [
  {
    id: "runtime-uploads",
    title: "Runtime /uploads",
    items: [
      { id: "alliwan-menu-2021", label: "Al Liwan Menu 2021", path: "/Runtime/uploads/AlLiwan_%20menu_2021.pdf" },
      { id: "birth-plan-booklet", label: "Birth Plan Booklet", path: "/Runtime/uploads/Birth_plan_booklet_27May2021_final.pdf" },
      { id: "birthing-orchid", label: "Birthing Packages — Royale Orchid & Orchid Patients", path: "/Runtime/uploads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf" },
      { id: "birthing-insurance", label: "Birthing Packages — Visiting Physicians (Insurance)", path: "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-insurance-patients.pdf" },
      { id: "birthing-noninsurance", label: "Birthing Packages — Visiting Physicians (Non-Insurance)", path: "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-noninsurance-patients.pdf" },
      { id: "breast-cancer-ar", label: "Breast Cancer Awareness Handbook (AR)", path: "/Runtime/uploads/BreastCancerAwarenessHandbookAR.pdf" },
      { id: "breast-cancer-en", label: "Breast Cancer Awareness Handbook (EN)", path: "/Runtime/uploads/BreastCancerAwarenessHandbookEN.pdf" },
      { id: "certificate-completion", label: "Certificate of Completion", path: "/Runtime/uploads/certificatSe_of_completion_htmlS.pdf" },
      { id: "dental-post-ar", label: "Dental Post Procedure Care (AR)", path: "/Runtime/uploads/Dental-Post-Procedure-Care-ar1.pdf" },
      { id: "dental-post-en", label: "Dental Post Procedure Care (EN)", path: "/Runtime/uploads/Dental-Post-Procedure-Care-en.pdf" },
      { id: "dental-post", label: "Dental Post Procedure Care", path: "/Runtime/uploads/Dental-Post-Procedure-Care.pdf" },
      { id: "elements-spa-ar", label: "Elements Spa Menu (AR)", path: "/Runtime/uploads/Elements_spa%20menu_arb.pdf" },
      { id: "elements-spa-en", label: "Elements Spa Menu (EN)", path: "/Runtime/uploads/Elements_spa%20menu_Eng.pdf" },
      { id: "ghtettet", label: "Ghtettet", path: "/Runtime/uploads/ghtettet.pdf" },
      { id: "healthy-menu", label: "Healthy Menu", path: "/Runtime/uploads/Healthy_menu.pdf" },
      { id: "home-health-mini", label: "Home Health Mini Book Services 2025", path: "/Runtime/uploads/home_health_mini_book_services_2025.pdf" },
      { id: "in-room-events", label: "In Room Events Packages", path: "/Runtime/uploads/In-Room-Events-Packages.pdf" },
      { id: "lost-found", label: "Lost and Found Guide", path: "/Runtime/uploads/Lost-and-found-guide.pdf" },
      { id: "new-halls-events", label: "New Halls Events Packages", path: "/Runtime/uploads/New-Halls-Events-Packages.pdf" },
      { id: "new-home-care", label: "New Home Care Packages", path: "/Runtime/uploads/New-Home-Care-Packages.pdf" },
      { id: "iv-iron-leaflet", label: "Patient Information Leaflet — IV Iron Therapy", path: "/Runtime/uploads/PATIENT%20INFORMATION%20LEAFLET%20for%20IV%20Iron%20Therapy_V1.1.pdf" },
      { id: "post-surgery", label: "Post Surgery Packages", path: "/Runtime/uploads/Post-Surgery-Packages.pdf" },
      { id: "ala-carte-mar-2021", label: "RHH À La Carte Menu (Mar 2021)", path: "/Runtime/uploads/RHH_A%20La%20Carte%20menu_Mar%202021.pdf" },
      { id: "celebrating-birth", label: "RHH Celebrating My Birth Support", path: "/Runtime/uploads/RHH_Celebrating%20my%20Birth%20Support.pdf" },
      { id: "discharge-qr-mar2021", label: "RHH Discharge Instructions — Postpartum (QR Mar 2021)", path: "/Runtime/uploads/RHH_Discharge%20Instructions%20for%20Postpartum%20Patients_QR%20coded_Mar2021.pdf" },
      { id: "discharge-postpartum", label: "RHH Discharge Instructions — Postpartum Patients", path: "/Runtime/uploads/RHH_Discharge%20Instructions%20for%20Postpartum%20Patients.pdf" },
      { id: "ebook-jan-2023", label: "RHH eBook (30 Jan 2023)", path: "/Runtime/uploads/RHH_ebook_30_Jan_2023.pdf" },
      { id: "vbac", label: "RHH VBAC", path: "/Runtime/uploads/rhh_vbac.pdf" },
      { id: "my-birth-plan-2021", label: "RHH My Birth Plan 2021", path: "/Runtime/uploads/RHH-My-birth-plan-2021.pdf" },
      { id: "dental-pricelist-oct-2022", label: "Royale Hayat Dental Pricelist (Oct 2022)", path: "/Runtime/uploads/Royale%20Hayat%20Dental_Pricelist_3%20Oct%202022.pdf" },
      { id: "dental-pricelist", label: "Royale Hayat Dental Pricelist", path: "/Runtime/uploads/RoyaleHayatDentalPricelist.pdf" },
      { id: "spa-menu-ar", label: "SPA Menu (AR)", path: "/Runtime/uploads/SPA_MENU_AR.pdf" },
      { id: "cafe-menu-2022", label: "The Café Menu 2022", path: "/Runtime/uploads/The-Cafe-Menu-2022.pdf" },
      { id: "patient-safety-day", label: "World Patient Safety Day Invitation", path: "/Runtime/uploads/world_patient_safety_day_invitation.pdf" },
    ],
  },
  {
    id: "runtime-uploads-files",
    title: "Runtime /uploads/files",
    items: [
      { id: "kids-menu", label: "Kids Menu Inside", path: "/Runtime/uploads/files/Kids-menu-inside.pdf" },
      { id: "hh-cosmetic", label: "Royale Home Health — Cosmetic Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Cosmetic-Packages.pdf" },
      { id: "hh-dental", label: "Royale Home Health — Dental Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Dental-Packages.pdf" },
      { id: "hh-geriatric", label: "Royale Home Health — Geriatric Care Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Geriatric-Care-Packages.pdf" },
      { id: "hh-ivf", label: "Royale Home Health — IVF Packages", path: "/Runtime/uploads/files/Royale-Home-Health-IVF-Packages.pdf" },
      { id: "hh-mother-baby", label: "Royale Home Health — Mother & Baby Care Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Mother-and-baby-care-Packages.pdf" },
      { id: "hh-new-home-care", label: "Royale Home Health — New Home Care Packages", path: "/Runtime/uploads/files/Royale-Home-Health-New-Home-Care-Packages.pdf" },
      { id: "hh-physio", label: "Royale Home Health — Physiotherapy Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Physiotherapy-Packages.pdf" },
      { id: "hh-circumcision", label: "Royale Home Health — Post Circumcision Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Post-Circumcision-Packages.pdf" },
      { id: "hh-post-surgery", label: "Royale Home Health — Post Surgery Packages", path: "/Runtime/uploads/files/Royale-Home-Health-Post-Surgery-Packages.pdf" },
    ],
  },
  {
    id: "runtime-uploads-hospitality",
    title: "Runtime /uploads/Hospitality",
    items: [
      { id: "hospitality-ebook", label: "RHH Hospitality eBook", path: "/Runtime/uploads/Hospitality/RHH_Hospitality-Ebook.pdf" },
    ],
  },
  {
    id: "runtime-uploads-suites",
    title: "Runtime /uploads/Suites",
    items: [
      { id: "table-measurements", label: "RHH Table Measurements in Suites and Halls", path: "/Runtime/uploads/Suites/RHH-Table-Measurements-in-Suites-and-Halls-Final.pdf" },
    ],
  },
  {
    id: "runtime-uploads-ucc",
    title: "Runtime /uploads/UCC-PDF",
    items: [
      { id: "umbilical-cord", label: "RHH Umbilical Cord Care", path: "/Runtime/uploads/UCC-PDF/RHH-Umbilical-cord-care.pdf" },
    ],
  },
  {
    id: "wp-content-uploads",
    title: "wp-content /uploads",
    items: [
      { id: "night-menu-ar", label: "Night Menu QR (AR)", path: "/wp-content/uploads/2026/01/NIGHT_MENU_QR_AR.pdf" },
      { id: "night-menu-en", label: "Night Menu QR (EN)", path: "/wp-content/uploads/2026/01/NIGHT_MENU_QR_EN.pdf" },
      { id: "night-menu-ar1", label: "Night Menu QR (AR1)", path: "/wp-content/uploads/2026/01/NIGHT_MENU_QR_AR1.pdf" },
      { id: "rhh-night-menu", label: "RHH Night Menu", path: "/wp-content/uploads/2025/11/RHH_NIGHT_Menu.pdf" },
      { id: "alliwan-qr-food", label: "Al Liwan QR Food Menu", path: "/wp-content/uploads/2026/04/Al_Liwan_QR_Food_Menu.pdf" },
      { id: "5th-floor-food", label: "RHH 5th Floor Food Menu", path: "/wp-content/uploads/2026/04/RHH_5th_Floor_Food_Menu.pdf" },
      { id: "qr-food-menu", label: "RHH QR Food Menu", path: "/wp-content/uploads/2026/04/RHH_QR_Food_Menu.pdf" },
      { id: "allergy-patch-guide", label: "Allergy Patch Testing Quick Guide 2026", path: "/wp-content/uploads/2026/04/Allergy_Patch_Testing_Quick_Guide_2026.pdf" },
      { id: "allergy-skin-prick", label: "Patient Instructions — Allergy Skin Prick Test 2026", path: "/wp-content/uploads/2026/04/Patient_Instructions_for_Allergy_Skin_Prick_Test_2026.pdf" },
      { id: "alliwan-may-2026", label: "Al Liwan Menu (May 2026)", path: "/wp-content/uploads/2026/05/AL_LIWAN_MENU_May_2026.pdf" },
      { id: "ask-me-march-2026", label: "Ask Me Flyers (March 2026)", path: "/wp-content/uploads/2026/03/Ask_Me_Flyers_March_2026.pdf" },
      { id: "clinical-awareness-march-2026", label: "Clinical Awareness Flyers (March 2026)", path: "/wp-content/uploads/2026/03/Clinical_Awareness_Flyers_March_2026.pdf" },
      { id: "qr-food-dec-2025", label: "RHH QR Food Menu (Dec 2025)", path: "/wp-content/uploads/2025/12/RHH_QR_Food_Menu_Dec_2025.pdf" },
      { id: "5th-floor-dec-2025", label: "5th Floor QR Food Menu (Dec 2025)", path: "/wp-content/uploads/2025/12/5th_FLOOR_QR_Food_Menu_Dec_2025.pdf" },
      { id: "5th-floor-nov-2025", label: "5th Floor QR Food Menu (Nov 2025)", path: "/wp-content/uploads/2025/11/5th_FLOOR_QR_Food_Menu.pdf" },
      { id: "5th-floor-cafe-june-2026", label: "5th Floor Café Menu (June 2026)", path: "/wp-content/uploads/2026/06/5th_Floor_Cafe_Menu.pdf" },
      { id: "ala-carte-june-2026", label: "À La Carte Menu (June 2026)", path: "/wp-content/uploads/2026/06/ALa_Carte_Menu.pdf" },
      { id: "ask-me-june-2026", label: "Ask Me Flyers (June 2026)", path: "/wp-content/uploads/2026/06/Ask_Me_Flyers_June_2026.pdf" },
      { id: "clinical-awareness-june-2026", label: "Clinical Awareness Flyers (June 2026)", path: "/wp-content/uploads/2026/06/Clinical_Awareness_Flyers_June_2026.pdf" },
    ],
  },
];

/** Flat list of every legacy PDF */
export const ALL_RUNTIME_PDFS: RuntimePdfItem[] = RUNTIME_PDF_GROUPS.flatMap((g) => g.items);

/** Relative legacy paths — use buildRuntimePdfUrl() for same-origin links */
export const RUNTIME_PDF_PATHS = {
  alLiwanMenu: "/Runtime/uploads/AlLiwan_%20menu_2021.pdf",
  birthPlanBooklet: "/Runtime/uploads/Birth_plan_booklet_27May2021_final.pdf",
  fifthFloorCafeMenuJune2026: "/wp-content/uploads/2026/06/5th_Floor_Cafe_Menu.pdf",
  alaCarteMenuJune2026: "/wp-content/uploads/2026/06/ALa_Carte_Menu.pdf",
  askMeFlyersJune2026: "/wp-content/uploads/2026/06/Ask_Me_Flyers_June_2026.pdf",
  clinicalAwarenessFlyersJune2026:
    "/wp-content/uploads/2026/06/Clinical_Awareness_Flyers_June_2026.pdf",
  alLiwanQrFoodMenu: "/wp-content/uploads/2026/04/Al_Liwan_QR_Food_Menu.pdf",
  fifthFloorFoodMenu: "/wp-content/uploads/2026/04/RHH_5th_Floor_Food_Menu.pdf",
  rhhNightMenu: "/wp-content/uploads/2025/11/RHH_NIGHT_Menu.pdf",
} as const;

/** @deprecated Use RUNTIME_PDF_PATHS with buildRuntimePdfUrl() */
export const RUNTIME_PDF_URLS = RUNTIME_PDF_PATHS;
