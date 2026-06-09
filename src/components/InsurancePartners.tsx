import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
const S3_BASE =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a2005476231e1dda956d829";
const partners = [
  {
    name: "Al Ahleia Insurance",
    nameAr: "الأهلية للتأمين",
    logo: `${S3_BASE}/1780484004213-Al_Alhelia.png`,
  },
  {
    name: "MSH International",
    nameAr: "MSH الدولية",
    logo: `${S3_BASE}/1780484878927-MSH-International.png`,
  },
  {
    name: "NEXTCARE",
    nameAr: "نكست كير",
    logo: `${S3_BASE}/1780484706169-Next_care.png`,
  },
  {
    name: "National Life & General Insurance",
    nameAr: "الوطنية للتأمين على الحياة والعام",
    logo: `${S3_BASE}/1780484856314-National_life-General_insurance.png`,
  },
  {
    name: "NAS Insurance",
    nameAr: "ناس للتأمين",
    logo: `${S3_BASE}/1780484794375-NAS.png`,
  },
  {
    name: "SAICO",
    nameAr: "سايكو للتأمين",
    logo: `${S3_BASE}/1780483440665-RHH_Insurance_Logos_1.png`,
  },
  {
    name: "Tricare",
    nameAr: "ترايكير",
    logo: `${S3_BASE}/1780484900786-Tricare.png`,
  },
  {
    name: "International Sos",
    nameAr: "إنترناشيونال SOS",
    logo: `${S3_BASE}/1780484668772-Internationa_sos.png`,
  },
  {
    name: "Cigna",
    nameAr: "سيغنا",
    logo: `${S3_BASE}/1780484756926-Cigna.png`,
  },
  {
    name: "Globemed",
    nameAr: "جلوب ميد",
    logo: `${S3_BASE}/1780484773517-Globe-med.png`,
  },
  {
    name: "Wapmed",
    nameAr: "وابميد",
    logo: `${S3_BASE}/1780484922588-WAPMED.png`,
  },
  {
    name: "Allianz",
    nameAr: "أليانز",
    logo: `${S3_BASE}/1780484640257-Allianz.png`,
  },
  {
    name: "GIG Kuwait",
    nameAr: "جيج الكويت",
    logo: `${S3_BASE}/1780484740910-Gig_kuwait.png`,
  },
];
const marqueePartners = [...partners, ...partners];
type InsurancePartnersProps = {
  variant?: "default" | "patients-insurance";
};
const InsurancePartners = ({ variant = "default" }: InsurancePartnersProps) => {
  const { lang, t } = useLanguage();
  return (
    <section
      className={`insurance-partners-section py-16 bg-background overflow-hidden ${
        variant === "patients-insurance"
          ? "w-screen max-w-[100vw] [margin-inline:calc(50%-50vw)]"
          : ""
      }`}
      id="insurance"
    >
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="insurance-partners-heading mb-10 flex w-full flex-col items-center justify-center text-center">
            <p
              className="insurance-partners-title text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 w-full"
              style={{ textAlign: "center", textAlignLast: "center" }}
            >
              {t("trustedBy")}
            </p>
            <h2
              className="insurance-partners-title text-3xl md:text-4xl font-serif font-normal text-foreground w-full"
              style={{ textAlign: "center", textAlignLast: "center" }}
            >
              {t("insurancePartners")}
            </h2>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <div className="insurance-marquee-ltr" dir="ltr">
      <div className="relative w-full overflow-hidden mb-4">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {marqueePartners.map((p, i) => (
            <div
              key={`row1-${p.name}-${i}`}
              className="flex-shrink-0 mx-4 bg-popover border border-border/30 rounded-2xl px-8 py-6 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              {p.logo ? (
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src={p.logo} alt={p.name} className="max-h-12 w-auto object-contain" loading="lazy" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <span className="font-serif text-2xl text-foreground">{p.name.charAt(0)}</span>
                </div>
              )}
              <div dir={lang === "ar" ? "rtl" : "ltr"}>
                <p className="font-body text-sm font-medium text-foreground whitespace-nowrap">{lang === "ar" ? p.nameAr : p.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-body mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />{t("verified")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full overflow-hidden mb-8">
        <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
          {marqueePartners.map((p, i) => (
            <div
              key={`row2-${p.name}-${i}`}
              className="flex-shrink-0 mx-4 bg-popover border border-border/30 rounded-2xl px-8 py-6 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              {p.logo ? (
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src={p.logo} alt={p.name} className="max-h-12 w-auto object-contain" loading="lazy" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <span className="font-serif text-2xl text-foreground">{p.name.charAt(0)}</span>
                </div>
              )}
              <div dir={lang === "ar" ? "rtl" : "ltr"}>
                <p className="font-body text-sm font-medium text-foreground whitespace-nowrap">{lang === "ar" ? p.nameAr : p.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-body mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />{t("verified")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className="container mx-auto px-6">
        <p className="text-center !text-center text-muted-foreground font-body text-sm">
          {variant === "patients-insurance" ? (
            <>
              {t("dontSeeInsurancePatients")}
              <a
                href="tel:+96525360453"
                className="text-accent hover:underline font-semibold"
              >
                25360453
              </a>
              {lang === "en" ? "." : ""}
            </>
          ) : (
            <>
              {t("dontSeeInsurance")}{" "}
              <Link
                to="/patients-visitors?tab=insurance#insurance-operating-hours"
                className="text-primary underline hover:text-accent transition-colors"
              >
                {t("contactUs")}
              </Link>{" "}
              {t("toVerifyCoverage")}
            </>
          )}
        </p>
      </div>
    </section>
  );
};
export default InsurancePartners;
