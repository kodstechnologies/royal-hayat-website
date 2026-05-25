import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  startIdentityVerification,
  type IdentityRawPayload,
  type IdentityStatusResponse,
  type StartIdentityPayload,
  type StartIdentityResponse
} from "@/api/identity";
import { subscribeToIdentityVerification } from "@/api/identitySocket";

const VerifyNationalId = () => {
  const { lang, t } = useLanguage();

  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState<string>("");
  const [phase, setPhase] = useState<"idle" | "starting" | "waiting" | "done" | "failed">("idle");
  const [operationId, setOperationId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [personName, setPersonName] = useState<string>("");
  const [identityPayload, setIdentityPayload] = useState<Record<string, unknown> | null>(null);

  const socketUnsubscribeRef = useRef<(() => void) | null>(null);
  const verificationDoneRef = useRef(false);

  const applyStatusResult = (statusData: IdentityStatusResponse) => {
    if (statusData?.status === "pending") {
      setIsVerified(null);
      setPersonName("");
      setIdentityPayload(null);
      setPhase("waiting");
      return;
    }

    setIsVerified(statusData?.verified === true);

    const nameFromStatus = (() => {
      const nameEn = statusData?.personName?.english || "";
      const nameAr = statusData?.personName?.arabic || "";
      return (lang === "ar" ? nameAr : nameEn) || "";
    })();
    setPersonName(nameFromStatus || extractDisplayName(statusData));
    setIdentityPayload(extractIdentityPayload(statusData));
    setPhase("done");
  };

  const extractDisplayName = (payload: StartIdentityResponse | IdentityStatusResponse) => {
    const source =
      ("raw" in payload ? payload.raw?.payload || payload.raw : undefined) ||
      ("identityData" in payload ? payload.identityData?.payload || payload.identityData : undefined);
    const typedSource = source as IdentityRawPayload | undefined;
    const nameEn = typedSource?.name?.english || typedSource?.name?.en || "";
    const nameAr = typedSource?.name?.arabic || typedSource?.name?.ar || "";
    return (lang === "ar" ? nameAr : nameEn) || "";
  };

  const extractIdentityPayload = (payload: StartIdentityResponse | IdentityStatusResponse) => {
    const source =
      ("raw" in payload ? payload.raw?.payload || payload.raw : undefined) ||
      ("identityData" in payload ? payload.identityData?.payload || payload.identityData : undefined);
    return source && typeof source === "object" ? (source as Record<string, unknown>) : null;
  };

  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value;
    return "";
  };

  const renderPayloadRows = (value: unknown, path = "", depth = 0): JSX.Element[] => {
    if (Array.isArray(value)) {
      if (!value.length) {
        return [
          <div key={`${path}-empty`} className="text-[11px] text-muted-foreground" style={{ paddingInlineStart: depth * 14 }}>
            {path || "value"}: null
          </div>
        ];
      }
      return value.flatMap((item, index) => renderPayloadRows(item, `${path}[${index}]`, depth + 1));
    }

    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (!entries.length) {
        return [
          <div key={`${path}-empty-obj`} className="text-[11px] text-muted-foreground" style={{ paddingInlineStart: depth * 14 }}>
            {path || "value"}: null
          </div>
        ];
      }
      return entries.flatMap(([key, nested]) => {
        const nestedPath = path ? `${path}.${key}` : key;
        return renderPayloadRows(nested, nestedPath, depth + 1);
      });
    }

    return [
      <div key={`${path}-leaf`} className="text-[11px] text-muted-foreground break-all" style={{ paddingInlineStart: depth * 14 }}>
        {path || "value"}: {renderValue(value)}
      </div>
    ];
  };

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
      applyStatusResult(statusData);
      socketUnsubscribeRef.current?.();
      socketUnsubscribeRef.current = null;
    };

    const { unsubscribe } = subscribeToIdentityVerification(operationId, finishIfReady);
    socketUnsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      socketUnsubscribeRef.current = null;
    };
  }, [operationId, phase, lang]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;

    void (async () => {
      try {
        setPhase("starting");
        setError("");
        setIsVerified(null);
        setPersonName("");
        setIdentityPayload(null);
        setOperationId("");
        socketUnsubscribeRef.current?.();
        socketUnsubscribeRef.current = null;

        const payload: StartIdentityPayload = {
          civilId: nationalId.trim(),
          serviceName: { ar: "تجربة", en: "Service Test" },
          reason: { ar: "تجربة", en: "test" }
        };
        const startData = await startIdentityVerification(payload);
        if (startData?.skippedStart === true && startData?.verified === true) {
          setOperationId("");
          setIsVerified(true);
          setPersonName(extractDisplayName(startData));
          setIdentityPayload(extractIdentityPayload(startData));
          setPhase("done");
          return;
        }

        const opId: string | undefined = startData?.operationId;
        if (!opId) throw new Error(lang === "ar" ? "لم يتم استلام operationId" : "Missing operationId");

        setOperationId(opId);
        setPhase("waiting");
      } catch (err: unknown) {
        setPhase("failed");
        const message = err instanceof Error ? err.message : "";
        setError(
          message
            ? message
            : lang === "ar"
              ? "تعذر بدء التحقق. يرجى المحاولة مرة أخرى."
              : "Failed to start verification. Please try again."
        );
      }
    })();
  };

  const showWaiting = operationId && phase === "waiting";

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
                  socketUnsubscribeRef.current?.();
                  socketUnsubscribeRef.current = null;
                }}
                disabled={phase === "waiting" || phase === "starting"}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                  error ? "border-destructive" : "border-border"
                }`}
              />
              {error && <p className="font-body text-xs text-destructive mt-1">{error}</p>}
            </div>

            {!operationId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={phase === "starting" || phase === "waiting"}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {phase === "starting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {lang === "ar" ? "جارِ الفحص..." : "Checking..."}
                  </>
                ) : (
                  <>
                    {lang === "ar" ? "تحقق من الرقم المدني" : "Check National ID"}
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
                <p className="font-body text-[11px] text-muted-foreground mt-3 break-all">
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
                {identityPayload && (
                  <div className="mt-3 text-left rounded-lg border border-border bg-background/50 p-3 max-h-64 overflow-auto">
                    <p className="font-body text-xs text-foreground mb-2">
                      {lang === "ar" ? "بيانات الهوية" : "Identity Data"}
                    </p>
                    {renderPayloadRows(identityPayload)}
                  </div>
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
