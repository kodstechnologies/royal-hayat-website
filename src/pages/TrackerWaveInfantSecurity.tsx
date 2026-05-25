import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Baby, Shield, Lock, Search, Users, Radio, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrackerWaveInfantSecurity = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8 text-primary" />
            </div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {lang === "ar" ? "سلامة المواليد" : "Newborn Safety"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {lang === "ar" ? "نظام أمان الرضّع" : "Infant Security System"}
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto">
              {lang === "ar"
                ? "في مستشفى رويال حياة، سلامة كل مولود هي أولويتنا القصوى. نستخدم نظام RTLS، وهو نظام مراقبة متطور يعمل في الوقت الفعلي مصمم لتوفير حماية شاملة على مدار الساعة لكل رضيع في رعايتنا."
                : "At Royale Hayat Hospital, the safety of every newborn is our highest priority. We utilize the RTLS, a sophisticated real-time monitoring system designed to provide comprehensive, 24/7 protection for every infant in our care."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-muted/30">
              <div className="aspect-video relative">
                <video
                  src="https://res.cloudinary.com/dqznbmfja/video/upload/v1775822694/RHH_TRACKER_WAVE_F_F_1_m9ojmp.mp4"
                  playsInline
                  autoPlay
                  muted
                  loop
                  disablePictureInPicture
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Infant Security */}
      <section className="py-12 md:py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">
                {lang === "ar" ? "أمان متقدم للرضّع" : "Advanced Infant Security"}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                {lang === "ar"
                  ? "يتم تزويد كل رضيع بعلامة إلكترونية خفيفة الوزن وآمنة على البشرة تتكامل بسلاسة مع البنية التحتية الأمنية على مستوى المستشفى:"
                  : "Every infant is equipped with a lightweight, skin-safe electronic tag that integrates seamlessly with our hospital-wide security infrastructure:"}
              </p>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lock,
                  title: lang === "ar" ? "حماية محيطية نشطة" : "Active Perimeter Protection",
                  desc: lang === "ar"
                    ? "يراقب النظام جميع المخارج ونقاط العبور. أي حركة غير مصرح بها نحو المصاعد أو السلالم تؤدي إلى قفل الأبواب فوراً وتنبيهات أمنية عالية الأولوية."
                    : "The system monitors all exits and transit points. Any unauthorized movement toward elevators or stairwells triggers immediate door locks and high-priority security alerts.",
                },
                {
                  icon: Shield,
                  title: lang === "ar" ? "تقنية استشعار العبث" : "Tamper-Sensing Technology",
                  desc: lang === "ar"
                    ? "توفر علاماتنا الذكية إشعاراً فورياً لمحطة التمريض إذا تم فك أو إزالة السوار دون إذن."
                    : "Our smart tags provide instant notification to the nursing station if a band is loosened or removed without authorization.",
                },
                {
                  icon: Search,
                  title: lang === "ar" ? "خدمات تحديد الموقع في الوقت الفعلي" : "Real-Time Location Services",
                  desc: lang === "ar"
                    ? "تحافظ الفرق السريرية والأمنية على رؤية مستمرة لموقع كل رضيع من خلال واجهة مراقبة رقمية مركزية."
                    : "Clinical and security teams maintain constant visibility of every infant's location through a centralized digital monitoring interface.",
                },
              ].map((item, i) => (
                <ScrollAnimationWrapper key={i}>
                  <div className="bg-popover border border-border/50 rounded-2xl p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mother-Infant Matching */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <div className="bg-popover border border-border/50 rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                      {lang === "ar" ? "مطابقة الأم والرضيع الآلية" : "Automated Mother-Infant Matching"}
                    </h2>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {lang === "ar"
                    ? "لضمان سلامة الرابطة بين الأم والطفل بشكل مطلق، يستخدم نظامنا الاقتران الرقمي المشفر:"
                    : "To ensure the absolute integrity of the mother-child bond, our system utilizes encrypted digital pairing:"}
                </p>
                <div className="space-y-3">
                  {(lang === "ar"
                    ? [
                      "يتم ربط الأمهات والرضّع إلكترونياً لضمان أعلى مستويات الدقة والأمان",
                      "يتم التحقق الفوري من هوية المولود عند كل عملية نقل أو تسليم",
                      "تنبيهات تلقائية في حال حدوث أي عدم تطابق في النظام",
                    ]
                    : [
                      "Mothers and infants are electronically linked to ensure the highest levels of accuracy and security",
                      "Instant identity verification of the newborn at every transfer or handover",
                      "Automatic alerts in case of any system mismatch",
                    ]
                  ).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-primary/5 rounded-xl px-5 py-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Key Benefits Summary */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-8">
                {lang === "ar" ? "لماذا؟" : "Why?"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {(lang === "ar"
                  ? [
                    { label: "حماية على مدار الساعة", icon: Shield },
                    { label: "تتبع في الوقت الفعلي", icon: Radio },
                    { label: "مطابقة الأم والرضيع", icon: Users },
                    { label: "استشعار فوري للعبث", icon: Lock },
                  ]
                  : [
                    { label: "24/7 Protection", icon: Shield },
                    { label: "Real-Time Tracking", icon: Radio },
                    { label: "Mother-Infant Match", icon: Users },
                    { label: "Instant Tamper Alert", icon: Lock },
                  ]
                ).map((item, i) => (
                  <div key={i} className="bg-popover border border-border/50 rounded-xl p-5 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-body text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrackerWaveInfantSecurity;
