import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@/assets/rhh-logo-full.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { lang, t } = useLanguage();

  const quickLinks = [
    { labelKey: "faq", href: "/faq", isRoute: true },
    { labelKey: "disclaimer", href: "/faq#disclaimer", isRoute: true },
    // { labelKey: "exchangeLogin", href: "#", isRoute: false },
    // { labelKey: "sitemailLogin", href: "#", isRoute: false },
    { labelKey: "internationalPatients", href: "#", isRoute: false },
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
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">{t("footerDesc")}</p>
            <div className="flex items-center gap-3">
              {[
                { key: "facebook", icon: Facebook, href: "#" },
                { key: "instagram", icon: Instagram, href: "#" },
                { key: "youtube", icon: Youtube, href: "#" },
                { key: "x", icon: Twitter, href: "#" },
              ].map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors"
                  aria-label={social.key}
                >
                  <social.icon className="w-4 h-4" />
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
                  <p className="text-primary-foreground/70">+965 2536 0000</p>
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
              {/* <div className="flex items-center gap-3 pt-2">
                <Ambulance className="w-4 h-4 text-accent flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground font-medium">{t("callAmbulance")}</p>
                  <a href="tel:+96525360001" className="text-primary-foreground/70 hover:text-accent transition-colors">+965 2536 0001</a>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/10 pt-5 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 font-body text-xs">{t("allRightsReserved")}</p>
          <div className="flex items-center gap-6">
            {[{ key: "privacyPolicy" }].map((l) => (
              <a key={l.key} href="#" className="text-primary-foreground/50 font-body text-xs hover:text-accent transition-colors">{t(l.key)}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;