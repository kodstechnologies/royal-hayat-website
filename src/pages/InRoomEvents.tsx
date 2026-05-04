import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChatButton from "@/components/ChatButton";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Sparkles, Phone, CheckCircle2, Image, Video, Gift, UtensilsCrossed, UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type InRoomEventsProps = {
  galleryImages: string[];
};

const InRoomEvents = ({ galleryImages }: InRoomEventsProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات الضيافة" : "Hospitality Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {isAr ? "تجارب الاحتفال داخل الجناح" : "In-Suite Celebration Experiences"}
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto">
              {isAr
                ? "احتفل بلحظاتك الخاصة في راحة وخصوصية جناحك."
                : "Create meaningful celebrations in the comfort and privacy of your own suite."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video bg-muted/30 rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                <p className="font-serif text-lg text-foreground mb-1">
                  {isAr ? "فيديو خدمات الفعاليات" : "In-Room Events Video"}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  {isAr ? "سيتم إضافة الفيديو قريباً" : "Video coming soon"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3 text-center">
                {isAr ? "خدماتنا" : "Our Services"}
              </h2>
              <p className="font-body text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-10">
                {isAr
                  ? "نقدم مجموعة شاملة من الخدمات لجعل مناسبتك لا تُنسى"
                  : "We offer a comprehensive range of services to make your occasion truly unforgettable"}
              </p>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Gift,
                  title: isAr ? "التصميم والديكور المخصص" : "Custom Design & Décor",
                  desc: isAr
                    ? "سنحوّل جناحك ليعكس الطابع والأسلوب الفريد لمناسبتك. من البالونات والزهور إلى الإضاءة والأقمشة، كل التفاصيل مصممة خصيصاً لتناسب رؤيتك."
                    : "We will transform your suite to reflect the unique theme and style of your occasion. From balloons and flowers to lighting and fabrics, every detail is custom-designed to match your vision.",
                },
                {
                  icon: UtensilsCrossed,
                  title: isAr ? "المأكولات الراقية" : "Gourmet Catering",
                  desc: isAr
                    ? "استمتع بمجموعة من الأطباق المعدة خصيصاً من مطبخنا الراقي. من المقبلات الفاخرة إلى الحلويات الشهية، نقدم تجربة طعام استثنائية."
                    : "Enjoy a selection of specially crafted dishes from our top-tier kitchen. From exquisite appetizers to delectable desserts, we deliver an exceptional dining experience.",
                },
                {
                  icon: UserCheck,
                  title: isAr ? "خدمة الخادم الشخصي" : "Butler Service",
                  desc: isAr
                    ? "سيكون خدمنا المحترفون في خدمتك لتلبية كل احتياجاتك. من الاستقبال إلى التنظيف، نضمن تجربة سلسة ومريحة."
                    : "Our professional butlers will be on hand to assist with every need. From reception to cleanup, we ensure a seamless and comfortable experience.",
                },
              ].map((item, i) => (
                <ScrollAnimationWrapper key={i}>
                  <div className="bg-popover border border-border/50 rounded-2xl p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
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

      {/* What We Offer */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                    {isAr ? "مناسبات نخدمها" : "Occasions We Serve"}
                  </h2>
                  <div className="space-y-3">
                    {(isAr
                      ? ["احتفالات المواليد الجدد", "أعياد الميلاد والذكرى السنوية", "حفلات الاستقبال والتجمعات العائلية", "مفاجآت شخصية للمرضى والضيوف", "أي مناسبة خاصة تستحق الاحتفال"]
                      : ["Newborn celebrations", "Birthdays and anniversaries", "Reception parties and family gatherings", "Personalized surprises for patients and guests", "Any special occasion worth celebrating"]
                    ).map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="aspect-square bg-muted/30 rounded-2xl border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="font-body text-xs text-muted-foreground">{isAr ? "صور الفعاليات قريباً" : "Event images coming soon"}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Gallery Placeholder */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-8 text-center">
                {isAr ? "معرض الصور" : "Photo Gallery"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((src, i) => (
                  <div key={src} className="aspect-[4/3] rounded-xl border border-border overflow-hidden bg-muted/20">
                    <img
                      src={src}
                      alt={isAr ? `صورة فعالية ${i + 1}` : `Event photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {isAr ? "احجز فعاليتك اليوم" : "Book Your Event Today"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              {isAr
                ? "فريقنا المتخصص جاهز لمساعدتك في التخطيط لمناسبة لا تُنسى."
                : "Our dedicated team is ready to help you plan an unforgettable occasion."}
            </p>
            <a href="tel:+96525360573" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" />
              +965 2536 0573
            </a>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default InRoomEvents;
