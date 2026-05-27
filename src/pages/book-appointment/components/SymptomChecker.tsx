import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, Brain, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

type SymptomCheckerProps = {
  lang: string;
  isAr: boolean;
  t: (key: string) => string;
  chipOptions: string[];
  symptomChips: string[];
  setSymptomChips: React.Dispatch<React.SetStateAction<string[]>>;
  symptomText: string;
  setSymptomText: React.Dispatch<React.SetStateAction<string>>;
  symptomAnalyzing: boolean;
  onAnalyze: () => void;
  onBack: () => void;
};

const SymptomChecker = ({
  lang,
  isAr,
  t,
  chipOptions,
  symptomChips,
  setSymptomChips,
  symptomText,
  setSymptomText,
  symptomAnalyzing,
  onAnalyze,
  onBack,
}: SymptomCheckerProps) => (
  <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
    <Header />
    <div className="container mx-auto px-6 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 mb-4">
          <Brain className="w-4 h-4 text-accent" />
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">
            {lang === "ar" ? "فحص الأعراض" : "Symptom Checker"}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">{t("tellUsSymptoms")}</h1>
      </motion.div>

      <div className="bg-popover rounded-2xl p-8 border border-border shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          {chipOptions.map((chip) => (
            <motion.button
              key={chip}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                setSymptomChips((prev) => {
                  const isSelected = prev.includes(chip);
                  const next = isSelected ? prev.filter((c) => c !== chip) : [...prev, chip];

                  setSymptomText((prevText) => {
                    const parts = prevText
                      .split(/[,;\n]+/)
                      .map((s) => s.trim())
                      .filter(Boolean);

                    if (isSelected) {
                      return parts.filter((p) => p.toLowerCase() !== chip.toLowerCase()).join(", ");
                    }

                    if (parts.some((p) => p.toLowerCase() === chip.toLowerCase())) return parts.join(", ");
                    return [...parts, chip].join(", ");
                  });

                  return next;
                })
              }
              className={`px-4 py-2 rounded-full text-xs font-body tracking-wide transition-all duration-200 border ${
                symptomChips.includes(chip)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {chip}
            </motion.button>
          ))}
        </div>
        <textarea
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          placeholder={t("describeInDetail")}
          className="w-full h-24 bg-muted/20 border border-border rounded-xl p-4 font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 mb-4"
        />

        <div className="bg-destructive/10 rounded-xl p-4 border-2 border-destructive/30 mb-4">
          <p className="font-body text-sm text-foreground leading-relaxed font-medium">
            <AlertCircle className="w-4 h-4 inline mr-2 text-destructive" />
            {lang === "ar"
              ? "⚠️ تنويه مهم: هذه الأداة تقدم اقتراحات عامة فقط ولا تُعد بديلاً عن الاستشارة الطبية المتخصصة. يرجى مراجعة الطبيب للتشخيص الدقيق والعلاج المناسب."
              : "⚠️ Important Disclaimer: This tool provides general suggestions only and is NOT a substitute for professional medical advice. Please consult a doctor for accurate diagnosis and appropriate treatment."}
          </p>
        </div>

        <AnimatePresence>
          {symptomAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 py-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-6 h-6 rounded-full border-2 border-accent/20 border-t-accent"
              />
              <span className="font-body text-sm text-accent">{t("analyzing")}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-nowrap items-center justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 items-center gap-1.5 text-muted-foreground font-body text-xs sm:text-sm hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{t("previous")}</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAnalyze}
            disabled={(symptomChips.length === 0 && !symptomText.trim()) || symptomAnalyzing}
            className={`flex shrink-0 items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg font-body text-[10px] sm:text-xs tracking-wide sm:tracking-widest uppercase whitespace-nowrap transition-all ${
              (symptomChips.length > 0 || symptomText.trim()) && !symptomAnalyzing
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            {t("analyzeSymptoms")}
          </motion.button>
        </div>
      </div>
    </div>
    <Footer />
    <ScrollToTop />
  </div>
);

export default SymptomChecker;
