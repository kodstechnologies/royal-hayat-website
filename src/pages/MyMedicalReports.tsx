import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  startIdentityVerification,
  type IdentityStatusResponse,
  type StartIdentityPayload,
} from "@/api/identity";
import { subscribeToIdentityVerification } from "@/api/identitySocket";
import { buildMedicalReportsRedirectUrl } from "@/utils/medicalReportsRedirect";

const PHONE_DISPLAY = "+965 2536 0000";
const PHONE_TEXT_CLASS = "inline-block [direction:ltr] [unicode-bidi:isolate]";

type Phase = "idle" | "starting" | "waiting" | "redirecting" | "failed" | "not_verified";

const MyMedicalReports = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [operationId, setOperationId] = useState("");
  const socketUnsubscribeRef = useRef<(() => void) | null>(null);
  const verificationDoneRef = useRef(false);

  const validate = () => {
    const value = nationalId.trim();
    if (!value) {
      return isAr ? "الرقم المدني مطلوب" : "National ID is required";
    }
    if (!/^\d{12}$/.test(value)) {
      return isAr ? "أدخل رقمًا مدنيًا صحيحًا (12 رقم)" : "Enter a valid National ID (12 digits)";
    }
    return "";
  };

  const resolveCivilId = (statusData: { civilId?: string | null }) =>
    (statusData?.civilId || nationalId.trim()).trim();

  const redirectToMedicalReports = (civilId: string) => {
    if (!civilId) {
      setError(isAr ? "لم يتم استلام الرقم المدني." : "Civil ID was not received from verification.");
      setPhase("failed");
      return;
    }

    try {
      const redirectUrl = buildMedicalReportsRedirectUrl(civilId);
      setPhase("redirecting");
      window.location.assign(redirectUrl);
    } catch {
      setError(
        isAr
          ? "تعذر فتح بوابة التقارير الطبية. يرجى المحاولة مرة أخرى."
          : "Failed to open the medical reports portal. Please try again.",
      );
      setPhase("failed");
    }
  };

  const handleVerificationResult = (statusData: IdentityStatusResponse) => {
    if (statusData?.status === "pending") {
      setPhase("waiting");
      return;
    }
    if (statusData?.verified !== true) {
      setPhase("not_verified");
      return;
    }
    redirectToMedicalReports(resolveCivilId(statusData));
  };

  useEffect(() => {
    if (!operationId || phase !== "waiting") {
      verificationDoneRef.current = false;
      return;
    }
    verificationDoneRef.current = false;
    socketUnsubscribeRef.current?.();
    const finishIfReady = (statusData: IdentityStatusResponse) => {
      if (verificationDoneRef.current || statusData?.status === "pending") return;
      verificationDoneRef.current = true;
      setError("");
      handleVerificationResult(statusData);
      socketUnsubscribeRef.current?.();
      socketUnsubscribeRef.current = null;
    };
    const { unsubscribe } = subscribeToIdentityVerification(operationId, finishIfReady);
    socketUnsubscribeRef.current = unsubscribe;
    return () => {
      unsubscribe();
      socketUnsubscribeRef.current = null;
    };
  }, [operationId, phase, isAr, nationalId]);

  const resetVerification = () => {
    socketUnsubscribeRef.current?.();
    socketUnsubscribeRef.current = null;
    setOperationId("");
    setPhase("idle");
    setError("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    void (async () => {
      const civilId = nationalId.trim();
      try {
        setPhase("starting");
        setError("");
        setOperationId("");
        socketUnsubscribeRef.current?.();
        socketUnsubscribeRef.current = null;

        const payload: StartIdentityPayload = {
          civilId,
          serviceName: { ar: "طلب السجل الطبي", en: "Medical Record Request" },
          reason: { ar: "الوصول إلى التقارير الطبية", en: "Access medical reports" },
        };
        const startData = await startIdentityVerification(payload);

        if (startData?.success === false) {
          const metaType = startData?.meta?.type ?? "";
          if (metaType.includes("too-many-requests")) {
            setError(
              isAr
                ? "طلبات مصادقة كثيرة جداً لهذا الرقم المدني، يرجى المحاولة لاحقاً."
                : "Too many concurrent authentication requests for this Civil ID. Please try again later.",
            );
          } else {
            setError(
              isAr
                ? "بيانات غير صحيحة، يرجى المحاولة مرة أخرى."
                : "Incorrect information, please try again.",
            );
          }
          setPhase("failed");
          return;
        }

        if (startData?.skippedStart === true && startData?.verified === true) {
          redirectToMedicalReports(resolveCivilId(startData));
          return;
        }

        if (startData?.verified === true) {
          redirectToMedicalReports(civilId);
          return;
        }

        const opId = startData?.operationId;
        if (!opId) {
          throw new Error(isAr ? "لم يتم استلام operationId" : "Missing operationId");
        }

        setOperationId(opId);
        setPhase("waiting");
      } catch (err: unknown) {
        const statusCode = (err as { response?: { status?: number; data?: { meta?: { type?: string } } } })
          ?.response?.status;
        const apiType =
          (err as { response?: { data?: { meta?: { type?: string } } } })?.response?.data?.meta?.type ?? "";
        const isTooMany = statusCode === 400 && apiType.includes("too-many-requests");
        const isNoMobileId = statusCode === 400 && apiType.includes("no-mobile-id");
        if (isTooMany) {
          setError(
            isAr
              ? "طلبات مصادقة كثيرة جداً لهذا الرقم المدني، يرجى المحاولة لاحقاً."
              : "Too many concurrent authentication requests for this Civil ID. Please try again later.",
          );
        } else if (isNoMobileId) {
          setError(
            isAr
              ? "لم يتم العثور على جهاز نشط مسجل بهذا الرقم"
              : "No active device found registered with this ID",
          );
        } else if (statusCode === 400) {
          setError(
            isAr
              ? "بيانات غير صحيحة، يرجى المحاولة مرة أخرى."
              : "Incorrect information, please try again.",
          );
        } else {
          const message = err instanceof Error ? err.message : "";
          setError(
            message ||
              (isAr
                ? "تعذر بدء التحقق. يرجى المحاولة مرة أخرى."
                : "Failed to start verification. Please try again."),
          );
        }
        setPhase("failed");
      }
    })();
  };

  const isBusy = phase === "starting" || phase === "waiting" || phase === "redirecting";
  const showWaiting = Boolean(operationId) && phase === "waiting";

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
          <p className="text-muted-foreground font-body text-sm mb-2">
            {isAr ? "التحقق من الهوية للوصول إلى تقاريرك الطبية" : "Verify your identity to access your medical reports"}
          </p>
          <p className="text-muted-foreground/80 font-body text-xs max-w-lg mx-auto">
            {isAr
              ? "أدخل رقم البطاقة المدنية الكويتية ووافق على طلب المصادقة في تطبيق هويتي للمتابعة."
              : "Enter your Kuwait Civil ID and approve the authentication request in Kuwait Mobile ID (Hawyti) to continue."}
          </p>
        </motion.div>

        <div className="bg-popover rounded-2xl border border-border p-6 md:p-8 max-w-3xl mx-auto shadow-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {isAr ? "الرقم المدني" : "National ID"} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={isAr ? "ادخل 12 رقم" : "Enter 12 digits"}
                value={nationalId}
                onChange={(event) => {
                  const next = event.target.value.replace(/\D/g, "").slice(0, 12);
                  setNationalId(next);
                  if (phase !== "redirecting") {
                    resetVerification();
                  }
                }}
                disabled={isBusy}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                  error ? "border-destructive" : "border-border"
                }`}
              />
              {error && <p className="font-body text-xs text-destructive mt-1">{error}</p>}
            </div>

            {!operationId && phase !== "redirecting" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isBusy}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {phase === "starting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isAr ? "جارِ الفحص..." : "Checking..."}
                  </>
                ) : (
                  <>
                    {isAr ? "تحقق من الرقم المدني" : "Verify National ID"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}

            {phase === "starting" && (
              <div className="bg-muted/30 rounded-xl p-4 text-center border border-border">
                <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
                <p className="font-body text-sm text-foreground">{t("identitySendingRequest")}</p>
              </div>
            )}

            {showWaiting && (
              <div className="rounded-xl p-4 text-center border border-accent/20 bg-accent/5">
                <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
                <p className="font-body text-sm font-medium text-foreground">{t("identityWaitingTitle")}</p>
                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{t("identityWaitingBody")}</p>
              </div>
            )}

            {phase === "redirecting" && (
              <div className="rounded-xl p-4 text-center border border-accent/20 bg-accent/5">
                <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
                <p className="font-body text-sm font-medium text-foreground">
                  {isAr ? "تم التحقق بنجاح. جارٍ فتح بوابة التقارير الطبية..." : "Verified successfully. Opening your medical reports portal..."}
                </p>
              </div>
            )}

            {(phase === "failed" || phase === "not_verified") && (
              <div className="bg-destructive/10 rounded-xl p-4 text-center border border-destructive/30">
                <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="font-body text-sm text-foreground">
                  {phase === "not_verified"
                    ? isAr
                      ? "لم يتم التحقق. يرجى المحاولة مرة أخرى."
                      : "Verification was not completed. Please try again."
                    : isAr
                      ? "حدث خطأ أثناء التحقق"
                      : "Something went wrong during verification"}
                </p>
                <button
                  type="button"
                  onClick={resetVerification}
                  className="mt-4 text-xs font-body uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                >
                  {isAr ? "حاول مرة أخرى" : "Try again"}
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-muted/30 rounded-xl">
            <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
              {isAr ? (
                <>
                  في حال لم يتم تسجيلكم مسبقًا، يرجى التواصل مع المستشفى على الرقم:
                  <br />
                  <strong className={`text-foreground ${PHONE_TEXT_CLASS}`}>{PHONE_DISPLAY}</strong>
                  <br />
                  لاستكمال إجراءات التسجيل.
                </>
              ) : (
                <>
                  If you are not yet registered, please call the hospital at{" "}
                  <strong className={PHONE_TEXT_CLASS}>{PHONE_DISPLAY}</strong> to complete your registration.
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

export default MyMedicalReports;
