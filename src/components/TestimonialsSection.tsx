import { Star, X, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  createHospitalFeedback,
  getAllHospitalFeedbacks,
  type HospitalFeedbackRecord,
} from "@/api/feedback";
const testimonials = [
  {
    stars: 5,
    text: "The care I received at Royale Hayat was truly exceptional. From the moment I arrived, the staff treated me with warmth and professionalism. The VIP suite was like a five-star hotel.",
    textAr: "كانت الرعاية التي تلقيتها في رويال حياة استثنائية حقاً. منذ لحظة وصولي، عاملني الطاقم بدفء واحترافية. كان الجناح الفاخر كفندق خمس نجوم.",
    name: "Sarah Al-Mutairi", nameAr: "سارة المطيري",
  },
  {
    stars: 5,
    text: "Dr. Al-Shammari and her team made my pregnancy journey stress-free and comfortable. The neonatal unit gave us complete peace of mind. Highly recommend their maternity services.",
    textAr: "جعلت د. الشمري وفريقها رحلة حملي خالية من التوتر ومريحة. وحدة حديثي الولادة منحتنا راحة بال تامة. أوصي بشدة بخدمات الأمومة لديهم.",
    name: "Fatima Al-Rashidi", nameAr: "فاطمة الرشيدي",
  },
  {
    stars: 5,
    text: "World-class medical care in Kuwait. The international accreditations speak volumes about their quality standards. My entire family trusts Royale Hayat for all our healthcare needs.",
    textAr: "رعاية طبية عالمية المستوى في الكويت. الاعتمادات الدولية تتحدث عن معايير الجودة لديهم. عائلتي بأكملها تثق في رويال حياة لجميع احتياجاتنا الصحية.",
    name: "Ahmed Al-Sabah", nameAr: "أحمد الصباح",
  },
  {
    stars: 5,
    text: "The pediatric department was outstanding. My children felt comfortable and safe. The doctors were incredibly patient and thorough with their examinations.",
    textAr: "كان قسم الأطفال متميزاً. شعر أطفالي بالراحة والأمان. كان الأطباء صبورين للغاية ودقيقين في فحوصاتهم.",
    name: "Noura Al-Hajri", nameAr: "نورة الهاجري",
  },
  {
    stars: 5,
    text: "From consultation to recovery, every step was handled with care and precision. The surgical team was world-class and the post-operative care was exceptional.",
    textAr: "من الاستشارة إلى التعافي، تم التعامل مع كل خطوة بعناية ودقة. كان الفريق الجراحي عالمي المستوى والرعاية بعد العملية كانت استثنائية.",
    name: "Mohammed Al-Enezi", nameAr: "محمد العنزي",
  },
  {
    stars: 5,
    text: "I traveled from abroad specifically for treatment here. The international patient services made everything seamless. Truly a premium healthcare experience.",
    textAr: "سافرت من الخارج خصيصاً للعلاج هنا. خدمات المرضى الدوليين جعلت كل شيء سلساً. تجربة رعاية صحية فاخرة حقاً.",
    name: "Layla Hassan", nameAr: "ليلى حسن",
  },
];

type DisplayTestimonial = {
  stars: number;
  text: string;
  textAr: string;
  name: string;
  nameAr: string;
};

const hasText = (value?: string) => Boolean(value?.trim());

const mapHospitalFeedbackToDisplay = (
  item: HospitalFeedbackRecord,
  language: "en" | "ar"
): DisplayTestimonial | null => {
  const text = item.feedback ?? "";
  const textAr = item.arabicFeedback ?? "";
  const name = item.userName ?? "";
  const nameAr = item.arabicUserName ?? "";

  if (language === "ar") {
    if (!hasText(textAr)) return null;
    return {
      stars: item.stars ?? 5,
      text: hasText(text) ? text : textAr,
      textAr,
      name: hasText(nameAr) ? nameAr : name,
      nameAr: hasText(nameAr) ? nameAr : name,
    };
  }

  if (!hasText(text)) return null;
  return {
    stars: item.stars ?? 5,
    text,
    textAr: hasText(textAr) ? textAr : text,
    name: hasText(name) ? name : nameAr,
    nameAr: hasText(nameAr) ? nameAr : name,
  };
};

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { lang, t } = useLanguage();
  const [hospitalFeedbacks, setHospitalFeedbacks] = useState<DisplayTestimonial[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    feedback: "",
    stars: 0,
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoadingFeedbacks(true);

        const response = await getAllHospitalFeedbacks();
        const list = (response?.data ?? response ?? []) as HospitalFeedbackRecord[];

        const formattedFeedbacks = list
          .filter((item) => item.shownOnWebsite === true)
          .map((item) => mapHospitalFeedbackToDisplay(item, lang))
          .filter((item): item is DisplayTestimonial => item !== null);

        setHospitalFeedbacks(
          formattedFeedbacks.length ? formattedFeedbacks : testimonials
        );
      } catch (error) {
        console.error(error);
        setHospitalFeedbacks(testimonials);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedbacks();
  }, [lang]);
  const handleAddFeedback = async () => {

    if (!feedbackForm.name || !feedbackForm.feedback) {
      return;
    }

    try {

      setSubmittingFeedback(true);

      const payload =
        lang === "ar"
          ? {
            arabicUserName: feedbackForm.name,
            arabicFeedback: feedbackForm.feedback,
            stars: feedbackForm.stars || 5,
          }
          : {
            userName: feedbackForm.name,
            feedback: feedbackForm.feedback,
            stars: feedbackForm.stars || 5,
          };

      await createHospitalFeedback(payload, { addedBy: "patient" });

      const refresh = await getAllHospitalFeedbacks();
      const list = (refresh?.data ?? refresh ?? []) as HospitalFeedbackRecord[];
      const formattedFeedbacks = list
        .filter((item) => item.shownOnWebsite === true)
        .map((item) => mapHospitalFeedbackToDisplay(item, lang))
        .filter((item): item is DisplayTestimonial => item !== null);

      if (formattedFeedbacks.length) {
        setHospitalFeedbacks(formattedFeedbacks);
      }

      setFeedbackForm({
        name: "",
        feedback: "",
        stars: 0,
      });

      setShowThankYou(true);

      setTimeout(() => {
        setShowThankYou(false);
        setIsFeedbackOpen(false);
      }, 2000);

    } catch (error) {

      console.error(error);

    } finally {

      setSubmittingFeedback(false);
    }
  };
  return (
    <section className="py-24 bg-popover overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">

            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("testimonials")}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">{t("patientFeedback")}</h2>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <div className="flex justify-end mb-8 px-6">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsFeedbackOpen(true)}
          className="
      bg-primary
      text-primary-foreground
      px-6
      py-3.5
      rounded-2xl
      text-sm
      font-medium
      tracking-wide
      shadow-lg
      hover:shadow-xl
      hover:bg-primary/90
      transition-all
      duration-300
      flex
      items-center
      gap-2
    "
        >
          <MessageCircleHeart className="w-5 h-5 text-white drop-shadow-sm" />

          {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
        </motion.button>
      </div>
      <div ref={containerRef} className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <motion.div className="flex gap-6 w-max px-6"
          animate={{ x: lang === "ar" ? ["0%", "50%"] : ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}>
          {[...hospitalFeedbacks, ...hospitalFeedbacks].map((item, i) => (
            <motion.div key={`${item.name}-${i}`} whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(74,20,35,0.1)" }}
              className="bg-background rounded-2xl p-6 md:p-8 border border-border/50 w-[300px] sm:w-[360px] flex-shrink-0">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground font-body leading-relaxed mb-6 text-sm">"{lang === "ar" ? item.textAr : item.text}"</p>
              <p className="font-serif text-foreground text-sm">{lang === "ar" ? item.nameAr : item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
  bg-background/95
  backdrop-blur-xl
  w-full
  max-w-md
  rounded-3xl
  border
  border-border/50
  shadow-[0_25px_80px_rgba(0,0,0,0.25)]
  p-5
  sm:p-6
  relative
  max-h-[90vh]
  overflow-y-auto
"
          >
            {/* Close */}
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-">
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageCircleHeart className="w-8 h-8 text-primary drop-shadow-sm" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-1">
                {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
              </h2>

              <p className="text-muted-foreground text-sm font-body">
                {lang === "ar"
                  ? "شارك تجربتك مع المستشفى"
                  : "Share your experience with the hospital"}
              </p>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                {lang === "ar" ? "الاسم" : "Your Name"}
              </label>

              <input
                type="text"
                value={feedbackForm.name}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    name: e.target.value,
                  })
                }
                placeholder={
                  lang === "ar" ? "أدخل اسمك" : "Enter your name"
                }
                className="
            w-full
            rounded-2xl
            border
            border-border/60
            bg-secondary/20
            px-5
            py-4
            outline-none
            transition-all
            duration-300
            focus:border-primary
            focus:ring-4
            focus:ring-primary/10
          "
              />
            </div>

            {/* Feedback */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                {lang === "ar" ? "التقييم" : "Feedback"}
              </label>

              <textarea
                rows={3}
                value={feedbackForm.feedback}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    feedback: e.target.value,
                  })
                }
                placeholder={
                  lang === "ar"
                    ? "اكتب تجربتك مع المستشفى"
                    : "Write your experience with the hospital"
                }
                className="
            w-full
            rounded-2xl
            border
            border-border/60
            bg-secondary/20
            px-5
            py-4
            outline-none
            resize-none
            transition-all
            duration-300
            focus:border-primary
            focus:ring-4
            focus:ring-primary/10
          "
              />
            </div>

            {/* Stars */}
            <div className="mb-8">
              <label className="block mb-3 text-sm font-medium text-center">
                {lang === "ar" ? "التقييم بالنجوم" : "Star Rating"}
              </label>

              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() =>
                      setFeedbackForm({
                        ...feedbackForm,
                        stars: index + 1,
                      })
                    }
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-300 ${index < feedbackForm.stars
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                        : "text-border"
                        }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddFeedback}
              disabled={submittingFeedback}
              className="
          w-full
          bg-primary
          text-primary-foreground
          py-4
          rounded-2xl
          font-semibold
          text-sm
          tracking-wide
          shadow-lg
          hover:shadow-xl
          hover:bg-primary/90
          transition-all
          duration-300
          flex
          items-center
          justify-center
          gap-2
        "
            >
              <Star className="w-4 h-4 fill-current" />

              {submittingFeedback
                ? (lang === "ar"
                  ? "جاري الإرسال..."
                  : "Submitting...")
                : (lang === "ar"
                  ? "إرسال التقييم"
                  : "Submit Feedback")
              }
            </motion.button>
            {showThankYou && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 180,
                }}
                className="
      absolute
      inset-0
      z-50
      flex
      items-center
      justify-center
      rounded-3xl
      bg-background/90
      backdrop-blur-md
      px-6
    "
              >
                <div
                  className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-primary/20
        bg-primary/10
        px-6
        py-5
        shadow-2xl
      "
                >
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.15,
                      type: "spring",
                      stiffness: 260,
                    }}
                    className="
          w-12
          h-12
          rounded-full
          bg-primary/15
          border
          border-primary/20
          flex
          items-center
          justify-center
        "
                  >
                    <MessageCircleHeart className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Text */}
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary font-semibold text-base"
                    >
                      {lang === "ar"
                        ? "شكراً لك على ملاحظاتك"
                        : "Thank you for your feedback"}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground text-sm mt-1"
                    >
                      {lang === "ar"
                        ? "نحن نقدر وقتك ومشاركتك"
                        : "We truly appreciate your response"}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>



        </div>

      )}
    </section>

  );
};

export default TestimonialsSection;