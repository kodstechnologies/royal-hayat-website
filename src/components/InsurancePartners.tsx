import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import alAhleiaLogo from "@/assets/insurance/al-ahleia.png";
import mshLogo from "@/assets/insurance/msh-international.png";
import nextcareLogo from "@/assets/insurance/nextcare.webp";
import nationalLifeLogo from "@/assets/insurance/national-life.png";
import nasLogo from "@/assets/insurance/nas.png";
import saicoLogo from "@/assets/insurance/saico.png";
import tricareLogo from "@/assets/insurance/tricare.png";

const partners = [
  { name: "Al Ahleia Insurance", nameAr: "الأهلية للتأمين", logo: alAhleiaLogo },
  { name: "MSH International", nameAr: "MSH الدولية", logo: mshLogo },
  { name: "NEXtCARE", nameAr: "نكست كير", logo: nextcareLogo },
  { name: "National Life & General Insurance", nameAr: "الوطنية للتأمين على الحياة والعام", logo: nationalLifeLogo },
  { name: "NAS Insurance", nameAr: "ناس للتأمين", logo: nasLogo },
  { name: "SAICO", nameAr: "سايكو للتأمين", logo: saicoLogo },
  { name: "Tricare", nameAr: "ترايكير", logo: tricareLogo },
];

// Double the list for seamless loop
const marqueePartners = [...partners, ...partners];

type InsurancePartnersProps = {
  /** Footer copy on Patients & Visitors → Health Insurance tab */
  variant?: "default" | "patients-insurance";
};

const InsurancePartners = ({ variant = "default" }: InsurancePartnersProps) => {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-background overflow-hidden" id="insurance">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-10">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center">{t("trustedBy")}</p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">{t("insurancePartners")}</h2>
          </div>
        </ScrollAnimationWrapper>
      </div>

      {/* Marquee ticker - row 1 */}
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
              <div>
                <p className="font-body text-sm font-medium text-foreground whitespace-nowrap">{lang === "ar" ? p.nameAr : p.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-body mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />{t("verified")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee ticker - row 2 (reverse direction) */}
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
              <div>
                <p className="font-body text-sm font-medium text-foreground whitespace-nowrap">{lang === "ar" ? p.nameAr : p.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-body mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />{t("verified")}
                </span>
              </div>
            </div>
          ))}
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
