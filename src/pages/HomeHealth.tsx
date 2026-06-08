import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Home, Heart, Activity, Baby, Syringe, Stethoscope, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
const HomeHealth = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const ltrPhoneClass = "inline-block [direction:ltr] [unicode-bidi:isolate] tabular-nums tracking-normal";
  const whatsAppDisplay = "+965 6632 0717";
  const callDisplay = "+965 2536 0500";
  const rehabServices = isAr ? [
    "صحة المرأة والتعافي بعد الولادة",
    "التأهيل القلبي",
    "التأهيل بعد الجلطات والسكتات الدماغية",
    "علاج آلام الظهر",
    "مشكلات الجهاز العضلي والحركي",
    "تقوية العضلات وتحسين الحركة",
    "العلاج بالتدليك العلاجي",
    "تأهيل الأطفال",
  ] : [
    "Women's health, wellness, and recovery",
    "Cardiac rehabilitation",
    "Stroke rehabilitation",
    "Back pain management",
    "Musculoskeletal and mobility issues",
    "Strength training and mobility optimization",
    "Therapeutic massage",
    "Pediatric rehabilitation",
  ];
  const shortTermServices = isAr ? [
    "الحقن والرعاية المتعلقة بعلاجات الإخصاب",
    "العلاج الوريدي مثل تعويض السوائل والمضادات الحيوية",
    "العناية بالجروح وتغيير الضمادات",
    "متابعة الأنابيب الطبية وسحب عينات الدم",
    "الرعاية بعد الولادة",
    "إدارة الألم والرعاية التلطيفية",
    "تركيب القسطرة البولية",
    "تخطيط القلب",
    "تخطيط نبضات الجنين وتقلصات الرحم",
    "التغذية المعوية والوريدية",
    "العناية بفتحات الإخراج الجراحية",
    "العلاج بجهاز البخار",
    "متابعة مستوى السكر والعلامات الحيوية",
  ] : [
    "Injections and IVF-related care",
    "IV therapy (fluid replacement, antibiotics)",
    "Wound care and dressing changes",
    "Drain checks and blood draws",
    "Post-natal care",
    "Pain management and palliative care",
    "Urinary catheterization",
    "Electrocardiography (ECG)",
    "Cardiotocography (CTG)",
    "Enteral and parenteral feeding",
    "Ostomy care",
    "Nebulization",
    "Blood sugar and vital signs monitoring",
  ];
  const longTermServices = isAr ? [
    "رعاية الأطفال وحديثي الولادة",
    "رعاية كبار السن",
  ] : [
    "Baby care and newborn monitoring",
    "Senior (geriatric) care",
  ];
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      {}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
              <Home className="w-8 h-8 text-accent" />
            </div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("careAtHome")}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {isAr ? "رويال هوم هيلث للرعاية المنزلية" : t("royaleHomeHealth")}
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {isAr ? "رويال هوم هيلث للرعاية المنزلية" : "Royale Home Health"}
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
              {isAr
                ? "تُعد خدمات الرعاية الصحية المنزلية في مستشفى رويال حياة امتدادًا حصريًا لخدمات المستشفى، حيث توفر رعاية صحية وعلاجية متكاملة داخل المنزل، تجمع بين الجودة الطبية العالية ومستوى الضيافة والرعاية الراقية التي تتميز بها رويال حياة. ويشرف على هذه الخدمات فريق متعدد التخصصات من الكوادر الطبية المؤهلة لتقديم رعاية شخصية وإنسانية وفق أعلى المعايير العالمية."
                : "Royale Home Health is an exclusive extension of Royale Hayat Hospital, offering exceptional health and wellness support delivered directly to your home. Our services blend high-quality medical care with the signature luxury and hospitality that Royale Hayat is known for. Backed by a multi-disciplinary team of healthcare professionals, we provide personalized, compassionate, and expert care aligned with the highest international standards."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "خدمات التأهيل والعلاج الطبيعي" : "Rehabilitation Services"}</h2>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 ml-15">
              {isAr
                ? "تم تصميم برامج التأهيل المنزلي للمساعدة في استعادة الصحة وتحسين الحركة وجودة الحياة لمختلف الحالات، وتشمل:"
                : "Our home-based rehabilitation programs are designed to restore health, enhance mobility, and improve quality of life across a range of conditions:"}
            </p>
          </ScrollAnimationWrapper>
          <div className="grid gap-3 max-w-3xl mx-auto">
            {rehabServices.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-3.5">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "خدمات التمريض المتخصصة" : "Specialized Nursing Services"}</h2>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-8 ml-15">
              {isAr
                ? "يقدم فريق التمريض خدمات طبية متكاملة داخل المنزل تشمل:"
                : "Our specialized nursing team offers comprehensive medical services in the comfort of your home, including:"}
            </p>
          </ScrollAnimationWrapper>
          {}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Syringe className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg font-bold text-foreground">{isAr ? "الزيارات قصيرة المدى" : "Short-Term Visits"}</h3>
            </div>
            <div className="grid gap-3 max-w-3xl mx-auto">
              {shortTermServices.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-3.5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-lg font-bold text-foreground">{isAr ? "الزيارات طويلة المدى والرعاية على مدار الساعة" : "Long-Term Visits (24/7 Care)"}</h3>
            </div>
            <div className="grid gap-3 max-w-3xl mx-auto">
              {longTermServices.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-3.5">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <section className="pb-12 mt-10">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                  <ScrollAnimationWrapper>
                    <div className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 text-center">
                      <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                        {isAr ? "للاستفسار" : "Enquire Now"}
                      </h2>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                          href="https://wa.me/96566320717"
                          className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs hover:bg-primary/90 transition-colors ${isAr ? "tracking-normal normal-case" : "tracking-[0.2em] uppercase"}`}
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          {isAr ? (
                            <>واتساب: <span className={ltrPhoneClass}>{whatsAppDisplay}</span></>
                          ) : (
                            <>WhatsApp: <span className={ltrPhoneClass}>{whatsAppDisplay}</span></>
                          )}
                        </a>
                        <a
                          href="tel:+96525360500"
                          className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs hover:bg-primary/90 transition-colors ${isAr ? "tracking-normal normal-case" : "tracking-[0.2em] uppercase"}`}
                        >
                          <Phone className="w-4 h-4 shrink-0" />
                          {isAr ? (
                            <>الهاتف: <span className={ltrPhoneClass}>{callDisplay}</span></>
                          ) : (
                            <>Call: <span className={ltrPhoneClass}>{callDisplay}</span></>
                          )}
                        </a>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default HomeHealth;
