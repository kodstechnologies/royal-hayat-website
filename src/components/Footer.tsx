import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/rhh-logo-full.png";
import { useLanguage } from "@/contexts/LanguageContext";
const Footer = () => {
  const { lang, t } = useLanguage();
  const quickLinks = [
    { labelKey: "faq", href: "/faq", isRoute: true },
    { labelKey: "disclaimer", href: "/faq#disclaimer", isRoute: true },
    { labelKey: "internationalPatients", href: "/international-patient", isRoute: false },
    { labelKey: "termsPrivacy", href: "/faq#terms", isRoute: true },
    { labelKey: "medicalRepVisitBooking", href: "/medical-rep-visit-booking", isRoute: true },
    { labelKey: "medicalRecordsRequestForm", href: "/medical-records-request", isRoute: true },
  ];
  const deptNames = [
    { en: "Obstetrics & Gynecology", ar: "التوليد وأمراض النساء", slug: "obstetrics-gynecology" },
    { en: "Pediatrics", ar: "طب الأطفال", slug: "pediatrics" },
    { en: "Internal Medicine", ar: "الطب الباطني", slug: "internal-medicine" },
    { en: "General & Laparoscopic Surgery", ar: "الجراحة العامة والمنظار", slug: "general-laparoscopic-surgery" },
    { en: "Royale Hayat Dental", ar: "عيادة رويال حياة للأسنان", slug: "dental-clinic" },
    { en: "Dermatology", ar: "الأمراض الجلدية", slug: "dermatology" },
  ];
  return (
    <footer className="bg-primary pt-14 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12 mb-10">
          <div className="space-y-5 flex flex-col items-center text-center">
            <img src={logo} alt="Royale Hayat Hospital" className="h-20 w-auto brightness-0 invert opacity-90" />
            <p
              className="text-primary-foreground/70 font-body text-sm leading-relaxed !text-center tracking-normal"
              style={{ wordSpacing: "normal", textAlign: "center" }}
            >
              {t("footerDesc")}
            </p>
            <div className="flex items-center gap-3">
              {[
                { key: "instagram", icon: Instagram, href: "#", type: "outline" },
                { key: "facebook", icon: Facebook, href: "#", type: "filled" },
                { key: "x", href: "#", type: "x" },
                { key: "youtube", href: "#", type: "youtube" },
              ].map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors"
                  aria-label={social.key}
                >
                  {social.type === "filled" && social.icon ? (
                    <social.icon className="w-5 h-5" fill="currentColor" />
                  ) : social.type === "youtube" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="currentColor"/>
                      <path d="M9.545 15.568V8.432L15.818 12L9.545 15.568z" fill="#8b1c4a"/>
                    </svg>
                  ) : social.type === "x" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ) : (
                    social.icon && <social.icon className="w-5 h-5" />
                  )}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-primary-foreground font-body text-xs tracking-[0.3em] uppercase mb-6">{t("quickLinks")}</h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((l) =>
                l.isRoute ? (
                  <Link key={l.labelKey} to={l.href} className="text-primary-foreground/70 font-body text-sm hover:text-accent transition-colors">{t(l.labelKey)}</Link>
                ) : (
                  <a key={l.labelKey} href={l.href} className="text-primary-foreground/70 font-body text-sm hover:text-accent transition-colors">{t(l.labelKey)}</a>
                )
              )}
            </nav>
          </div>
          <div>
            <h4 className="text-primary-foreground font-body text-xs tracking-[0.3em] uppercase mb-6">{t("departments")}</h4>
            <nav className="flex flex-col gap-3">
              {deptNames.map((d) => (
                <Link key={d.en} to={`/medical-services/${d.slug}`} className="text-primary-foreground/70 font-body text-sm hover:text-accent transition-colors">
                  {lang === "ar" ? d.ar : d.en}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-primary-foreground font-body text-xs tracking-[0.3em] uppercase mb-6">{t("contact")}</h4>
            <div className="space-y-4 font-body text-sm">
              <div className="flex items-start gap-3">
                <Send  className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Link to="/contact-us" className="text-primary-foreground font-medium hover:text-accent transition-colors">
                    {t("contactUsFooter")}
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground font-medium">{t("hotline247")}</p>
                  <p className="text-primary-foreground/70">
                    <span className="inline-block [direction:ltr] [unicode-bidi:isolate]">+965 2536 0000</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <p className="text-primary-foreground/70">info@royalehayat.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-primary-foreground/70">P.O. Box 179, Hawalli 32002, Kuwait</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                <p className="text-accent text-xs tracking-wider uppercase">{t("emergencyServices247")}</p>
              </div>
              <div className="border-t border-secondary/10 pt-3 mt-1">
                {[{ key: "privacyPolicy" }].map((l) => (
                  <a key={l.key} href="#" className="text-primary-foreground/50 font-body text-xs hover:text-accent transition-colors">
                    {t(l.key)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary/10 pt-5 pb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 font-body text-xs text-center md:text-left">{t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
