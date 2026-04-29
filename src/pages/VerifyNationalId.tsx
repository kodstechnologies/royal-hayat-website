import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Loader2, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIdentityStatus, startIdentityVerification } from "../../api/identity";

const VerifyNationalId = () => {
  const { lang, t } = useLanguage();

  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState<string>("");
  const [phase, setPhase] = useState<"idle" | "starting" | "checking" | "done" | "failed">("idle");
  const [operationId, setOperationId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [personName, setPersonName] = useState<string>("");

  const validate = () => {
    const v = nationalId.trim();
    if (!v) {
      return lang === "ar" ? "الرقم المدني مطلوب" : "National ID is required";
    }
    if (!/^\d{12}$/.test(v)) {
      return lang === "ar" ? "أدخل رقمًا مدنيًا صحيحًا (12 رقم)" : "Enter a valid National ID (12 digits)";
    }
    return "";
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;

    // Frontend -> backend -> SharperIntegration
    void (async () => {
      try {
        setPhase("starting");
        setError("");
        setIsVerified(null);
        setPersonName("");
        setOperationId("");

        const payload: {
          civilId: string;
          callbackUrl?: string;
          serviceName: { ar: string; en: string };
          reason: { ar: string; en: string };
        } = {
          civilId: nationalId.trim(),
          serviceName: { ar: "تجربة", en: "Service Test" },
          reason: { ar: "تجربة", en: "test" }
        };
        const startData = await startIdentityVerification(payload);
        const opId: string | undefined = startData?.operationId;
        if (!opId) throw new Error(lang === "ar" ? "لم يتم استلام operationId" : "Missing operationId");

        setOperationId(opId);
        // Callback-first flow: after starting, user can click "Check Status".
        setPhase("idle");
      } catch (err: any) {
        setPhase("failed");
        setError(
          typeof err?.message === "string"
            ? err.message
            : lang === "ar"
              ? "تعذر بدء التحقق. يرجى المحاولة مرة أخرى."
              : "Failed to start verification. Please try again."
        );
      }
    })();
  };

  const onCheckStatus = () => {
    if (!operationId) return;

    void (async () => {
      try {
        setPhase("checking");
        setError("");

        const statusData = await getIdentityStatus(operationId);
        if (statusData?.status === "pending") {
          setIsVerified(null);
          setPersonName("");
          setPhase("idle");
          setError(lang === "ar" ? "الحالة ما زالت قيد الانتظار" : "Status is still pending");
          return;
        }

        setIsVerified(statusData?.verified === true);

        const nameEn = statusData?.personName?.english || "";
        const nameAr = statusData?.personName?.arabic || "";
        setPersonName((lang === "ar" ? nameAr : nameEn) || "");

        setPhase("done");
      } catch (err: any) {
        setPhase("failed");
        setError(
          typeof err?.message === "string"
            ? err.message
            : lang === "ar"
              ? "تعذر جلب الحالة. يرجى المحاولة مرة أخرى."
              : "Failed to fetch status. Please try again."
        );
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
      <Header />

      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            {t("bookYourAppointment")}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-2">
            {lang === "ar" ? "اختر طريقة الحجز المناسبة لك" : "Choose how you'd like to book"}
          </p>
          <p className="text-muted-foreground/80 font-body text-xs max-w-lg mx-auto">
            {lang === "ar"
              ? "حدد الطريقة التي تناسبك لحجز موعدك — حسب القسم، الطبيب، أو وصف الأعراض."
              : "Select the method that works best for you to schedule your appointment — by department, doctor, or symptom description."}
          </p>
        </motion.div>

        <div className="bg-popover rounded-2xl border border-border p-6 md:p-8 max-w-3xl mx-auto shadow-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {lang === "ar" ? "الرقم المدني" : "National ID"} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={lang === "ar" ? "ادخل 12 رقم" : "Enter 12 digits"}
                value={nationalId}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, "").slice(0, 12);
                  setNationalId(next);
                  setPhase("idle");
                  setError("");
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                  error ? "border-destructive" : "border-border"
                }`}
              />
              {error && <p className="font-body text-xs text-destructive mt-1">{error}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={phase === "starting" || phase === "checking"}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {phase === "starting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "ar" ? "جارِ البدء..." : "Starting..."}
                </>
              ) : (
                <>
                  {lang === "ar" ? "تحقق" : "Verify"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {operationId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onCheckStatus}
                disabled={phase === "checking" || phase === "starting"}
                className="w-full bg-secondary/40 text-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-secondary/60 transition-all flex items-center justify-center gap-2"
              >
                {phase === "checking" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {lang === "ar" ? "جارِ التحقق من الحالة..." : "Checking status..."}
                  </>
                ) : (
                  <>
                    {lang === "ar" ? "تحقق من الموافقة" : "Check Approval"}
                    <RefreshCcw className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}

            {operationId && phase !== "done" && (
              <div className="bg-muted/30 rounded-xl p-4 text-center border border-border">
                <p className="font-body text-sm text-foreground">
                  {lang === "ar"
                    ? "تمت معالجة التحقق، يرجى انتظار الموافقة."
                    : "Authentication processed, please wait for approval."}
                </p>
                <p className="font-body text-[11px] text-muted-foreground mt-2 break-all">
                  operationId: {operationId}
                </p>
              </div>
            )}

            {phase === "done" && isVerified !== null && (
              <div
                className={`rounded-xl p-4 text-center border ${
                  isVerified ? "bg-accent/5 border-accent/20" : "bg-destructive/10 border-destructive/30"
                }`}
              >
                {isVerified ? (
                  <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                )}
                <p className="font-body text-sm text-foreground">
                  {isVerified
                    ? lang === "ar"
                      ? "تم التحقق بنجاح"
                      : "Verified"
                    : lang === "ar"
                      ? "لم يتم التحقق"
                      : "Not verified"}
                </p>
                {personName && (
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {lang === "ar" ? "الاسم:" : "Name:"} {personName}
                  </p>
                )}
                {operationId && (
                  <p className="font-body text-[11px] text-muted-foreground mt-2 break-all">
                    {lang === "ar" ? "operationId:" : "operationId:"} {operationId}
                  </p>
                )}
              </div>
            )}

            {phase === "failed" && (
              <div className="bg-destructive/10 rounded-xl p-4 text-center border border-destructive/30">
                <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="font-body text-sm text-foreground">
                  {lang === "ar" ? "حدث خطأ أثناء التحقق" : "Something went wrong during verification"}
                </p>
                {operationId && (
                  <p className="font-body text-[11px] text-muted-foreground mt-2 break-all">
                    {lang === "ar" ? "operationId:" : "operationId:"} {operationId}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
      <ChatButton />
    </div>
  );
};

export default VerifyNationalId;

