import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const voices = [
  {
    text: "Royale Hayat is more than a workplace — it’s a family. Every day I feel respected, supported and proud of the care we deliver together.",
    textAr: "رويال حياة أكثر من مجرد مكان عمل — إنها عائلة. كل يوم أشعر بالاحترام والدعم والفخر بالرعاية التي نقدمها معاً.",
    name: "Maria S.", nameAr: "ماريا س.", role: "Senior Nurse", roleAr: "ممرضة أولى",
  },
  {
    text: "The leadership truly invests in our growth. Continuous training and exposure to international standards have shaped my career.",
    textAr: "تستثمر القيادة حقاً في نمونا. ساهم التدريب المستمر والاطلاع على المعايير الدولية في تشكيل مسيرتي المهنية.",
    name: "Ahmed K.", nameAr: "أحمد ك.", role: "Clinical Pharmacist", roleAr: "صيدلي إكلينيكي",
  },
  {
    text: "What makes Royale Hayat special is the people. Multicultural, kind, and united by purpose — I belong here.",
    textAr: "ما يميز رويال حياة هو الناس. متعددو الثقافات، لطفاء، وموحّدون بهدف واحد — أنتمي إلى هنا.",
    name: "Priya R.", nameAr: "بريا ر.", role: "Guest Relations", roleAr: "علاقات الضيوف",
  },
  {
    text: "Recognition isn’t a slogan here — it’s lived. From Employee of the Month to small daily thank-yous, effort is seen.",
    textAr: "التقدير ليس شعاراً هنا — بل ممارسة يومية. من موظف الشهر إلى كلمات الشكر اليومية البسيطة، يُرى الجهد.",
    name: "Khaled M.", nameAr: "خالد م.", role: "Operations Lead", roleAr: "قائد العمليات",
  },
  {
    text: "I joined as a junior and grew into a leadership role. Royale Hayat truly walks with you as you build your career.",
    textAr: "انضممت كموظفة مبتدئة وتطورت إلى دور قيادي. تسير رويال حياة معك حقاً وأنت تبني مسيرتك.",
    name: "Lina A.", nameAr: "لينا أ.", role: "Quality Coordinator", roleAr: "منسقة الجودة",
  },
  {
    text: "Professionalism meets kindness here. We deliver world-class medicine with genuine warmth — that’s our promise.",
    textAr: "تلتقي الاحترافية مع اللطف هنا. نقدم طباً عالمي المستوى بدفء حقيقي — هذا هو وعدنا.",
    name: "Dr. Hassan T.", nameAr: "د. حسن ت.", role: "Specialist Physician", roleAr: "طبيب اختصاصي",
  },
];

const duplicated = [...voices, ...voices];

const VoicesFromOurPeople = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="py-20 bg-popover overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">
              {isAr ? "كلمات من فريقنا" : "Testimonials"}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              {isAr ? "أصوات من فريقنا" : "Voices from Our People"}
            </h2>
          </div>
        </ScrollAnimationWrapper>
      </div>

      <div
        ref={containerRef}
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-6 w-max px-6"
          animate={{ x: isAr ? ["0%", "50%"] : ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" } }}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {duplicated.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              whileHover={{ y: -6 }}
              className="bg-background rounded-2xl p-6 md:p-8 border border-border/50 w-[300px] sm:w-[360px] flex-shrink-0"
            >
              <Quote className="w-6 h-6 text-accent mb-4" />
              <p className="text-foreground font-body leading-relaxed mb-6 text-sm">
                "{isAr ? item.textAr : item.text}"
              </p>
              <div>
                <p className="font-serif text-foreground text-sm">{isAr ? item.nameAr : item.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {isAr ? item.roleAr : item.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VoicesFromOurPeople;
