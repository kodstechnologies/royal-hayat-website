import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const FAQ = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'faq' | 'disclaimer' | 'terms'>('faq');
  useEffect(() => {
    const hash = location.hash;
    if (hash === '#disclaimer') setActiveTab('disclaimer');
    else if (hash === '#terms') setActiveTab('terms');
    else setActiveTab('faq');
    window.scrollTo(0, 0);
  }, [location.hash]);
  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
    { q: t("faqQ6"), a: t("faqA6") },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const getPageTitle = () => {
    if (activeTab === 'disclaimer') return t("disclaimerTitle");
    if (activeTab === 'terms') return t("termsPrivacy");
    return t("faqTitle");
  };
  const getHeroLabel = () => {
    if (activeTab === 'disclaimer') return lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer';
    if (activeTab === 'terms') return t("termsPrivacy");
    return t("faq");
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {}
      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{getHeroLabel()}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">{getPageTitle()}</h1>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      {activeTab === 'faq' && (
        <section className="py-20" id="faq">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl font-serif text-foreground mb-8">{t("faqGeneral")}</h2>
            </ScrollAnimationWrapper>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <ScrollAnimationWrapper key={i} delay={i * 0.05}>
                  <div className="border border-border/50 rounded-xl overflow-hidden bg-popover">
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left"
                    >
                      <span className="font-body text-sm font-medium text-foreground pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-96 pb-5" : "max-h-0"}`}>
                      <p className="px-6 font-body text-sm text-muted-foreground leading-relaxed text-justify">{faq.a}</p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}
      {}
      {activeTab === 'disclaimer' && (
        <section className="py-20 bg-background" id="disclaimer">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl font-serif text-foreground mb-6">{t("disclaimerTitle")}</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify">{t("disclaimerText")}</p>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      {}
      {activeTab === 'terms' && (
        <section className="py-20 bg-background" id="terms">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl font-serif text-foreground mb-6">{t("termsPrivacy")}</h2>
              <div className="font-body text-sm text-muted-foreground leading-relaxed text-justify space-y-4">
                <p>{t("termsPrivacyIntro")}</p>
                <p>{t("termsPrivacySubtitle")}</p>
                {lang === "ar" ? (
                  <ul className="list-disc space-y-3 ps-5">
                    {[t("termsPrivacyP1"), t("termsPrivacyP2"), t("termsPrivacyP3"), t("termsPrivacyP4"), t("termsPrivacyP5"), t("termsPrivacyP6"), t("termsPrivacyP7")].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p>{t("termsPrivacyP1")}</p>
                    <p>{t("termsPrivacyP2")}</p>
                    <p>{t("termsPrivacyP3")}</p>
                    <p>{t("termsPrivacyP4")}</p>
                  </>
                )}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default FAQ;
