import { Star, X, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  createHospitalFeedback,
  extractHospitalFeedbackRecord,
  getAllHospitalFeedbacks,
  type HospitalFeedbackRecord,
} from "@/api/feedback";
import { toast } from "@/hooks/use-toast";

type DisplayTestimonial = {
  id: string;
  stars: number;
  text: string;
  textAr: string;
  name: string;
  nameAr: string;
};

const hasText = (value?: string) => Boolean(value?.trim());

const isShownOnWebsite = (item: HospitalFeedbackRecord) => {
  const value = item.shownOnWebsite as unknown;
  return value === true || value === 1 || value === "true";
};

const feedbackHasContent = (
  item: HospitalFeedbackRecord,
  language: "en" | "ar",
) => {
  if (language === "ar") {
    return hasText(item.arabicFeedback) || hasText(item.feedback);
  }
  return hasText(item.feedback) || hasText(item.arabicFeedback);
};

const dedupeFeedbacks = (items: HospitalFeedbackRecord[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = String(item._id ?? (item as { id?: string }).id ?? "").trim();
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const mapHospitalFeedbackToDisplay = (
  item: HospitalFeedbackRecord,
  language: "en" | "ar",
): DisplayTestimonial | null => {
  const text = item.feedback ?? "";
  const textAr = item.arabicFeedback ?? "";
  const name = item.userName ?? "";
  const nameAr = item.arabicUserName ?? "";

  if (!feedbackHasContent(item, language)) return null;

  const id =
    String(item._id ?? (item as { id?: string }).id ?? "").trim() ||
    `fb-${name || nameAr}-${text.slice(0, 12) || textAr.slice(0, 12)}`;

  if (language === "ar") {
    return {
      id,
      stars: item.stars ?? 5,
      text: hasText(text) ? text : textAr,
      textAr: hasText(textAr) ? textAr : text,
      name: hasText(nameAr) ? nameAr : name,
      nameAr: hasText(nameAr) ? nameAr : name,
    };
  }

  return {
    id,
    stars: item.stars ?? 5,
    text: hasText(text) ? text : textAr,
    textAr: hasText(textAr) ? textAr : text,
    name: hasText(name) ? name : nameAr,
    nameAr: hasText(nameAr) ? nameAr : name,
  };
};

const toDisplayFromApi = (
  list: HospitalFeedbackRecord[],
  language: "en" | "ar",
): DisplayTestimonial[] =>
  dedupeFeedbacks(list)
    .filter(isShownOnWebsite)
    .filter((item) => feedbackHasContent(item, language))
    .map((item) => mapHospitalFeedbackToDisplay(item, language))
    .filter((item): item is DisplayTestimonial => item !== null);

const buildDisplayFromForm = (
  form: { name: string; feedback: string; stars: number },
  language: "en" | "ar",
  id: string,
): DisplayTestimonial => {
  const name = form.name.trim();
  const text = form.feedback.trim();
  const stars = form.stars >= 1 ? form.stars : 5;

  if (language === "ar") {
    return {
      id,
      stars,
      text,
      textAr: text,
      name,
      nameAr: name,
    };
  }

  return {
    id,
    stars,
    text,
    textAr: text,
    name,
    nameAr: name,
  };
};

const mergeDisplayFeedbacks = (
  ...groups: DisplayTestimonial[][]
): DisplayTestimonial[] => {
  const seen = new Set<string>();
  const merged: DisplayTestimonial[] = [];

  for (const group of groups) {
    for (const item of group) {
      const key = item.id || `${item.name}-${item.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    feedback: "",
    stars: 0,
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoadingFeedbacks(true);

        const list = await getAllHospitalFeedbacks();
        setHospitalFeedbacks(toDisplayFromApi(list, lang));
      } catch (error) {
        console.error(error);
        setHospitalFeedbacks([]);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedbacks();
  }, [lang]);

  const shouldAnimateMarquee = hospitalFeedbacks.length > 1;
  const marqueeItems = shouldAnimateMarquee
    ? [...hospitalFeedbacks, ...hospitalFeedbacks]
    : hospitalFeedbacks;

  const handleAddFeedback = async () => {
    const name = feedbackForm.name.trim();
    const feedback = feedbackForm.feedback.trim();

    if (!name || !feedback) {
      setSubmitError(
        lang === "ar"
          ? "يرجى إدخال الاسم والتقييم"
          : "Please enter your name and feedback",
      );
      return;
    }

    if (!feedbackForm.stars) {
      setSubmitError(
        lang === "ar"
          ? "يرجى اختيار التقييم بالنجوم"
          : "Please select a star rating",
      );
      return;
    }

    setSubmittingFeedback(true);
    setSubmitError(null);

    try {
      const stars = feedbackForm.stars;
      const payload =
        lang === "ar"
          ? {
              arabicUserName: name,
              arabicFeedback: feedback,
              stars,
              shownOnWebsite: true,
            }
          : {
              userName: name,
              feedback,
              stars,
              shownOnWebsite: true,
            };

      const createResponse = await createHospitalFeedback(payload, {
        addedBy: "patient",
      });

      const createdRecord = extractHospitalFeedbackRecord(createResponse);
      const submittedDisplay =
        (createdRecord &&
          mapHospitalFeedbackToDisplay(createdRecord, lang)) ||
        buildDisplayFromForm(
          { name, feedback, stars },
          lang,
          createdRecord?._id ?? `submitted-${Date.now()}`,
        );

      let published: DisplayTestimonial[] = [];
      try {
        const refreshList = await getAllHospitalFeedbacks();
        published = toDisplayFromApi(refreshList, lang);
      } catch {
        // Keep showing the submission even if refresh fails
      }

      setHospitalFeedbacks((prev) =>
        mergeDisplayFeedbacks([submittedDisplay], published, prev),
      );

      setFeedbackForm({
        name: "",
        feedback: "",
        stars: 0,
      });

      setShowThankYou(true);
      toast({
        title: lang === "ar" ? "تم إرسال التقييم" : "Feedback submitted",
        description:
          lang === "ar"
            ? "شكراً لمشاركتك. يظهر تقييمك أدناه."
            : "Thank you. Your feedback is shown below.",
      });

      setTimeout(() => {
        setShowThankYou(false);
        setIsFeedbackOpen(false);
      }, 2000);
    } catch (error: unknown) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        (lang === "ar"
          ? "تعذر إرسال التقييم. حاول مرة أخرى."
          : "Could not submit feedback. Please try again.");
      setSubmitError(message);
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };
  return (
    <section id="testimonials" className="py-24 bg-popover overflow-hidden">
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
      {loadingFeedbacks && (
        <div className="flex justify-center py-12 px-6">
          <p className="text-sm text-muted-foreground font-body">
            {lang === "ar" ? "جاري تحميل آراء المرضى..." : "Loading patient feedback..."}
          </p>
        </div>
      )}
      {!loadingFeedbacks && hospitalFeedbacks.length > 0 && (
        <div
          ref={containerRef}
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className={`flex gap-3 sm:gap-6 w-max px-4 sm:px-6 ${shouldAnimateMarquee ? "" : "mx-auto"}`}
            animate={
              shouldAnimateMarquee
                ? { x: lang === "ar" ? ["0%", "50%"] : ["0%", "-50%"] }
                : { x: 0 }
            }
            transition={
              shouldAnimateMarquee
                ? { x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }
                : {}
            }
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {marqueeItems.map((item, i) => (
              <motion.div
                key={`${item.id || item.name}-${i}`}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(74,20,35,0.1)" }}
                className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 w-[220px] sm:w-[300px] md:w-[360px] flex-shrink-0"
              >
                <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-4">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground font-body leading-relaxed mb-3 sm:mb-6 text-xs sm:text-sm line-clamp-5 sm:line-clamp-none">
                  "{lang === "ar" ? item.textAr : item.text}"
                </p>
                <p className="font-serif text-foreground text-xs sm:text-sm">
                  {lang === "ar" ? item.nameAr : item.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
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
                onChange={(e) => {
                  setSubmitError(null);
                  setFeedbackForm({
                    ...feedbackForm,
                    name: e.target.value,
                  });
                }}
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
                onChange={(e) => {
                  setSubmitError(null);
                  setFeedbackForm({
                    ...feedbackForm,
                    feedback: e.target.value,
                  });
                }}
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
                    onClick={() => {
                      setSubmitError(null);
                      setFeedbackForm({
                        ...feedbackForm,
                        stars: index + 1,
                      });
                    }}
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

            {submitError && (
              <p className="mb-4 text-center text-sm text-destructive font-body">
                {submitError}
              </p>
            )}

            {/* Submit */}
            <motion.button
              type="button"
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