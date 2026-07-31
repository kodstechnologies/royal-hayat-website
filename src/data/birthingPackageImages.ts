export type BirthingPackageItem = {
  image: string;
  /** Public PDF path — can differ per language and desktop/mobile */
  pdfUrl: string;
};

export const BIRTHING_PACKAGES_DESKTOP_EN: BirthingPackageItem[] = [
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012566-BIRTHING_PACKAGES_WEBSITE_3.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012201-BIRTHING_PACKAGES_WEBSITE_1.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-insurance-patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012396-BIRTHING_PACKAGES_WEBSITE_2.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-noninsurance-patients.pdf",
  },
];

export const BIRTHING_PACKAGES_DESKTOP_AR: BirthingPackageItem[] = [
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473479980-BIRTHING_PACKAGES_WEBSITE_6.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473477564-BIRTHING_PACKAGES_WEBSITE_4.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-insurance-patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473479306-BIRTHING_PACKAGES_WEBSITE_5.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-noninsurance-patients.pdf",
  },
];

export const BIRTHING_PACKAGES_MOBILE_EN: BirthingPackageItem[] = [
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012566-BIRTHING_PACKAGES_WEBSITE_3.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012201-BIRTHING_PACKAGES_WEBSITE_1.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-insurance-patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c27a3c53f5bb0fba98edb/1785473012396-BIRTHING_PACKAGES_WEBSITE_2.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-noninsurance-patients.pdf",
  },
];

export const BIRTHING_PACKAGES_MOBILE_AR: BirthingPackageItem[] = [
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473479980-BIRTHING_PACKAGES_WEBSITE_6.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473477564-BIRTHING_PACKAGES_WEBSITE_4.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-insurance-patients.pdf",
  },
  {
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a6c299c23c5a768a6380087/1785473479306-BIRTHING_PACKAGES_WEBSITE_5.jpg",
    pdfUrl:
      "/Runtime/uploads/Birthing-Packages-for-Visiting-Inhouse-Physicians-for-noninsurance-patients.pdf",
  },
];

export function getBirthingPackageImages(
  lang: "en" | "ar",
  variant: "desktop" | "mobile",
): BirthingPackageItem[] {
  if (variant === "desktop") {
    return lang === "ar" ? BIRTHING_PACKAGES_DESKTOP_AR : BIRTHING_PACKAGES_DESKTOP_EN;
  }
  return lang === "ar" ? BIRTHING_PACKAGES_MOBILE_AR : BIRTHING_PACKAGES_MOBILE_EN;
}
