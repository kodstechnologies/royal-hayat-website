import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Stethoscope, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
const HomeBookingBlock = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const cards = [
    {
      icon: Building2,
      title: lang === "ar" ? "اختر القسم" : "Select Department",
      desc: lang === "ar" ? "ابدأ باختيار القسم ثم الطبيب" : "Start by choosing a department, then a doctor",
      path: "primary",
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Stethoscope,
      title: lang === "ar" ? "أعرف طبيبي" : "I Know My Doctor",
      desc: lang === "ar" ? "انقر هنا إذا كنت تعرف طبيبك" : "Click here if you know your doctor",
      path: "doctor",
      color: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: Brain,
      title: lang === "ar" ? "لست متأكداً؟" : "Not Sure?",
      desc: lang === "ar" ? "لست متأكداً من الطبيب أو القسم؟ تحقق من الأعراض" : "Not sure about doctor or department? Check with symptoms",
      path: "symptoms",
      color: "bg-secondary/40",
      iconColor: "text-foreground",
    },
  ];
  return (
    <section className="py-14 bg-primary" id="book">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-primary-foreground mb-2">
              {t("bookYourAppointment")}
            </h2>
            <p className="text-secondary/70 font-body max-w-xl mx-auto text-sm">
              {lang === "ar" ? "اختر طريقة الحجز المناسبة لك" : "Choose how you'd like to book"}
            </p>
          </div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {cards.map((card) => (
              <motion.button
                key={card.path}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/book-appointment?path=${card.path}`)}
                className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-accent/40"
              >
                <div className={`w-14 h-14 rounded-full ${card.color} flex items-center justify-center mx-auto mb-4`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{card.title}</h3>
                <p className="font-body text-xs text-muted-foreground">{card.desc}</p>
              </motion.button>
            ))}
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};
export default HomeBookingBlock;
