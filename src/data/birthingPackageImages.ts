export const BIRTHING_PACKAGES_DESKTOP_EN = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901105062-BirthingPackagesfor_PCVersion_Eng_1.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901106898-BirthingPackagesfor_PCVersion_Eng_2.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901107444-BirthingPackagesfor_PCVersion_Eng_3.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901107948-BirthingPackagesfor_PCVersion_Eng_4.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901108305-BirthingPackagesfor_PCVersion_Eng_5.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901108629-BirthingPackagesfor_PCVersion_Eng_6.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2664cb810af839cc9b0d62/1780901109096-BirthingPackagesfor_PCVersion_Eng_7.jpg",
];

export const BIRTHING_PACKAGES_DESKTOP_AR = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901170718-BirthingPackagesfor_PCVersion_AR_1.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901173231-BirthingPackagesfor_PCVersion_AR_2.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901173812-BirthingPackagesfor_PCVersion_AR_3.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901174229-BirthingPackagesfor_PCVersion_AR_4.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901174586-BirthingPackagesfor_PCVersion_AR_5.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266518810af839cc9b0dca/1780901175070-BirthingPackagesfor_PCVersion_AR_6.jpg",
];

export const BIRTHING_PACKAGES_MOBILE_AR = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902035532-BirthingPackagesfor_MobileVersion_AR_1.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902037242-BirthingPackagesfor_MobileVersion_AR_2.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902037726-BirthingPackagesfor_MobileVersion_AR_3.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902037980-BirthingPackagesfor_MobileVersion_AR_4.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902038242-BirthingPackagesfor_MobileVersion_AR_5.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902038614-BirthingPackagesfor_MobileVersion_AR_6.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266871810af839cc9b0ff4/1780902038928-BirthingPackagesfor_MobileVersion_AR_7.jpg",
];

export const BIRTHING_PACKAGES_MOBILE_EN = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902589874-BirthingPackagesfor_MobileVersion_Eng_1.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902591550-BirthingPackagesfor_MobileVersion_Eng_2.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902592398-BirthingPackagesfor_MobileVersion_Eng_3.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902592823-BirthingPackagesfor_MobileVersion_Eng_4.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902593356-BirthingPackagesfor_MobileVersion_Eng_5.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902593891-BirthingPackagesfor_MobileVersion_Eng_6.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a266aa2810af839cc9b10c5/1780902594358-BirthingPackagesfor_MobileVersion_Eng_7.jpg",
];

export function getBirthingPackageImages(lang: "en" | "ar", variant: "desktop" | "mobile") {
  if (variant === "desktop") {
    return lang === "ar" ? BIRTHING_PACKAGES_DESKTOP_AR : BIRTHING_PACKAGES_DESKTOP_EN;
  }
  return lang === "ar" ? BIRTHING_PACKAGES_MOBILE_AR : BIRTHING_PACKAGES_MOBILE_EN;
}
