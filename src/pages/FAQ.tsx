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
    
    // Scroll to top when tab changes
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
    if (activeTab === 'terms') return lang === 'ar' ? 'الشروط والخصوصية' : 'Terms & Privacy';
    return t("faq");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{getHeroLabel()}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">{getPageTitle()}</h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* Disclaimer Section */}
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

      {/* Terms Section */}
      {activeTab === 'terms' && (
        <section className="py-20 bg-background" id="terms">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl font-serif text-foreground mb-6">{t("termsPrivacy")}</h2>
              <div className="font-body text-sm text-muted-foreground leading-relaxed text-justify space-y-4">
                <p>Welcome to the Royale Hayat Hospital website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</p>
                <p>The use of this website is subject to the following terms of use:</p>
                <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.</p>
                <p>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
                <p>All trademarks reproduced in this website that are not the property of, or licensed to, the operator are acknowledged on the website. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offence.</p>
                <p>From time to time, this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</p>
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
