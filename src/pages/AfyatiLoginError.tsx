import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { parseAfyatiLoginErrorPayload } from "@/utils/afyatiLoginError";

const PHONE_DISPLAY = "+965 2536 0000";
const PHONE_TEXT_CLASS = "inline-block [direction:ltr] [unicode-bidi:isolate]";

const AfyatiLoginError = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [searchParams] = useSearchParams();

  const { reason, message } = useMemo(
    () => parseAfyatiLoginErrorPayload(searchParams),
    [searchParams],
  );

  const hasDetails = Boolean(reason || message);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">{t("login")}</h1>
          <p className="text-muted-foreground font-body text-sm">
            {isAr
              ? "تعذر تسجيل الدخول إلى بوابة التقارير الطبية"
              : "Unable to sign in to the medical reports portal"}
          </p>
        </motion.div>

        <div className="bg-popover rounded-2xl border border-border p-6 md:p-8 max-w-3xl mx-auto shadow-sm">
          <div className="rounded-xl p-5 md:p-6 border border-destructive/30 bg-destructive/10 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="font-body text-sm font-medium text-foreground mb-4">
              {isAr
                ? "لم نتمكن من إكمال تسجيل الدخول. يرجى مراجعة التفاصيل أدناه."
                : "We could not complete your sign-in. Please review the details below."}
            </p>

            {hasDetails ? (
              <div className="text-start space-y-3 rounded-xl border border-border bg-background/80 p-4">
                {reason ? (
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                      {isAr ? "سبب الخطأ" : "Error reason"}
                    </p>
                    <p className="font-body text-sm text-foreground break-words">{reason}</p>
                  </div>
                ) : null}
                {message ? (
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                      {isAr ? "الرسالة" : "Message"}
                    </p>
                    <p className="font-body text-sm text-foreground break-words whitespace-pre-wrap">
                      {message}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="font-body text-sm text-muted-foreground">
                {isAr
                  ? "لم يتم تقديم تفاصيل إضافية عن الخطأ."
                  : "No additional error details were provided."}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-medical-reports"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              {isAr ? "حاول مرة أخرى" : "Try again"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border font-body text-sm tracking-widest uppercase text-foreground hover:bg-muted/40 transition-colors"
            >
              {isAr ? "العودة إلى الرئيسية" : "Back to home"}
            </Link>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-xl">
            <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
              {isAr ? (
                <>
                  إذا استمرت المشكلة، يرجى التواصل مع المستشفى على الرقم:
                  <br />
                  <strong className={`text-foreground ${PHONE_TEXT_CLASS}`}>{PHONE_DISPLAY}</strong>
                </>
              ) : (
                <>
                  If the problem continues, please call the hospital at{" "}
                  <strong className={PHONE_TEXT_CLASS}>{PHONE_DISPLAY}</strong>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AfyatiLoginError;
