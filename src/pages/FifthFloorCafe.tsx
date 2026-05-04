import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChatButton from "@/components/ChatButton";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Coffee, CheckCircle2, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FifthFloorCafe = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const menuItems = isAr
    ? ["قهوة مختصة طازجة", "تشكيلة من الساندويتشات", "سلطات طازجة", "حلويات شهية"]
    : ["Freshly brewed specialty coffee", "A selection of sandwiches", "Fresh salads", "Indulgent desserts"];

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />

      {/* Hero */}
      <section className="py-8 md:py-10 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات الضيافة" : "Hospitality Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
              {isAr ? "كافيه الطابق الخامس" : "The 5th Floor Café"}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {isAr ? "مساحة مريحة للقهوة والمرطبات" : "A cozy space for light bites and refreshments"}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Main content — image placeholder left, content right */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — image placeholder */}
            <div className="aspect-[5/4] rounded-2xl overflow-hidden bg-muted/30 border border-border flex items-center justify-center">
              <div className="text-center">
                <Image className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                  {isAr ? "صور قريباً" : "Photos Coming Soon"}
                </p>
              </div>
            </div>

            {/* RIGHT — content */}
            <ScrollAnimationWrapper>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                    {isAr ? "كافيه الطابق الخامس" : "The 5th Floor Café"}
                  </h2>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {isAr
                    ? "يقع كافيه الطابق الخامس في الطابق الخامس، ويوفر مساحة مريحة وترحيبية للضيوف للاسترخاء أثناء انتظار المواعيد أو زيارة أحبائهم. مصمم بعناية للعائلات التي تنتظر قدوم مولود جديد أو اكتمال إجراء طبي، يوفر بيئة هادئة ومطمئنة. يمكن للضيوف الاستمتاع بالقهوة المعدة طازجاً، وتشكيلة من الساندويتشات، والسلطات الطازجة، والحلويات الشهية — كل ذلك في أجواء مريحة تجمع بين الراحة والملاءمة."
                    : "The Fifth Café, located on the 5th floor, offers a welcoming and comfortable space for guests to relax while waiting for appointments or visiting loved ones. Thoughtfully designed for families awaiting the arrival of a newborn or the completion of a procedure, it provides a calm and reassuring environment. Guests can enjoy freshly brewed coffee, a selection of sandwiches, fresh salads, and indulgent desserts — all served in a cozy setting that blends comfort with convenience."}
                </p>

                <h3 className="font-serif text-base text-foreground mb-3">
                  {isAr ? "ما نقدمه:" : "What We Offer:"}
                </h3>
                <div className="space-y-2 mb-6">
                  {menuItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="font-body text-sm text-muted-foreground">
                  {isAr ? "الطابق الخامس — مستشفى رويال حياة" : "5th Floor — Royale Hayat Hospital"}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default FifthFloorCafe;
