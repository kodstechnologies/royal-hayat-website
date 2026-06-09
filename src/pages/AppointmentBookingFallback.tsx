import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  User,
  Clock,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Phone,
  Calendar,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { createAppointmentRequest } from "@/api/appointmentRequest";
import { toast } from "@/hooks/use-toast";
import type { AppointmentBookingFallbackState } from "@/types/appointmentBookingFallback";

const AppointmentBookingFallback = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackState = location.state as AppointmentBookingFallbackState | null;

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+965");
  const [dateOfBirth, setDateOfBirth] = useState(fallbackState?.suggestedDob ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const t1 = window.setTimeout(scrollToTop, 0);
    const t2 = window.setTimeout(scrollToTop, 100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [submitted]);

  const genderLabel = useMemo(() => {
    if (!fallbackState?.gender) return fallbackState?.genderDisplay || "—";
    return fallbackState.gender === "male" ? t("male") : t("female");
  }, [fallbackState, t]);

  if (!fallbackState?.fullname || !fallbackState.selectedDate) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-20 max-w-lg text-center">
          <p className="font-body text-sm text-muted-foreground mb-6">
            {isAr
              ? "لا تتوفر بيانات الحجز. يرجى البدء من جديد."
              : "Booking details are missing. Please start again."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/book-appointment")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!phone.trim()) e.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\d{8}$/.test(phone.trim())) {
      e.phone = isAr ? "أدخل رقم هاتف مكون من 8 أرقام" : "Enter an 8-digit phone number";
    }
    if (!dateOfBirth) e.dateOfBirth = isAr ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
    else if (new Date(dateOfBirth) > new Date()) {
      e.dateOfBirth = isAr ? "أدخل تاريخ ميلاد صحيحاً" : "Enter a valid date of birth";
    }
    if (!fallbackState.gender) {
      e.gender = isAr ? "تعذر تحديد الجنس من بيانات الهوية" : "Gender could not be determined from identity data";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildAdditionalNotes = () => {
    const parts: string[] = [];
    if (fallbackState.bookingError) {
      parts.push(`Online booking failed: ${fallbackState.bookingError}`);
    }
    if (fallbackState.patientId) parts.push(`HIS patient ID: ${fallbackState.patientId}`);
    if (fallbackState.civilId) parts.push(`Civil ID: ${fallbackState.civilId}`);
    return parts.length > 0 ? parts.join(". ") : undefined;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createAppointmentRequest({
        fullname: fallbackState.fullname.trim(),
        phone: `${countryCode}${phone.trim()}`,
        dob: dateOfBirth,
        gender: fallbackState.gender,
        doctor: isAr ? fallbackState.doctorNameAr || fallbackState.doctorName : fallbackState.doctorName,
        department: isAr
          ? fallbackState.departmentNameAr || fallbackState.departmentName
          : fallbackState.departmentName,
        date: fallbackState.formattedDate || fallbackState.selectedDate,
        timeSlot: {
          period: fallbackState.slotPeriod,
          time: fallbackState.formattedTime || fallbackState.selectedSlot,
        },
        symptoms: fallbackState.symptoms?.length ? fallbackState.symptoms : undefined,
        additionalNotes: buildAdditionalNotes(),
        requestType: "registered patient booking fallback",
      });
      setSubmitted(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : null;
      toast({
        title: isAr ? "خطأ" : "Error",
        description:
          message ||
          (isAr
            ? "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى."
            : "Could not submit your request. Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDobDisplay = dateOfBirth
    ? dateOfBirth.split("-").reverse().join("/")
    : "";

  const summaryRows = [
    { label: t("department"), value: isAr ? fallbackState.departmentNameAr || fallbackState.departmentName : fallbackState.departmentName, icon: Building2 },
    { label: t("doctor"), value: isAr ? fallbackState.doctorNameAr || fallbackState.doctorName : fallbackState.doctorName, icon: User },
    ...(fallbackState.symptoms?.length
      ? [{ label: t("symptoms"), value: fallbackState.symptoms.join(", "), icon: Activity }]
      : []),
    {
      label: isAr ? "التاريخ والوقت" : "Date & Time",
      value: `${fallbackState.formattedDate}  •  ${fallbackState.formattedTime}`,
      icon: Clock,
    },
    { label: t("patient"), value: fallbackState.fullname, icon: ClipboardList },
    { label: t("gender"), value: genderLabel, icon: User },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-20 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-serif text-foreground mb-3">{t("appointmentRequested")}</h1>
          <p className="text-muted-foreground font-body text-sm mb-6">{t("appointmentRequestedMsg")}</p>
          <div className="bg-popover rounded-2xl border border-border p-6 text-start mb-6">
            <h3 className="font-serif text-lg text-foreground mb-4">{t("appointmentDetails")}</h3>
            <div className="space-y-4 font-body text-sm">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <row.icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div className="min-w-0 text-start">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{row.label}</p>
                    <p className="text-foreground font-medium break-words">{row.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 py-2">
                <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("phone")}</p>
                  <p className="text-foreground font-medium">
                    {countryCode} {phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <Calendar className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {isAr ? "تاريخ الميلاد" : "Date of Birth"}
                  </p>
                  <p className="text-foreground font-medium">{formattedDobDisplay}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <div className="bg-primary py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-primary-foreground mb-2">
          {t("bookingFallbackTitle")}
        </h1>
        <p className="text-primary-foreground/70 font-body text-sm max-w-xl mx-auto px-4">
          {t("bookingFallbackSubtitle")}
        </p>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/book-appointment", { replace: true })}
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-body text-sm mb-6"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          {t("previous")}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-popover rounded-2xl p-8 md:p-10 border border-border shadow-sm"
        >
          <h2 className="font-serif text-xl text-foreground mb-2">{t("reviewSubmit")}</h2>

          {fallbackState.bookingError && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="font-body text-sm text-destructive">{fallbackState.bookingError}</p>
            </div>
          )}

          <div className="space-y-5 mb-8">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-4 py-3 border-b border-border last:border-0"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <row.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    {row.label}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
            <h3 className="font-serif text-base text-foreground mb-1">
              {t("bookingFallbackContactFields")}
            </h3>
            <p className="font-body text-xs text-muted-foreground mb-5">{t("provideInfo")}</p>

            <div className="space-y-5">
              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {t("phoneNumber")} <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="+965">+965</option>
                    <option value="+966">+966</option>
                    <option value="+971">+971</option>
                    <option value="+973">+973</option>
                    <option value="+968">+968</option>
                    <option value="+974">+974</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 8));
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    inputMode="numeric"
                    maxLength={8}
                    placeholder={t("phonePlaceholder")}
                    className={`flex-1 px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.phone ? "border-destructive" : "border-border"}`}
                  />
                </div>
                {errors.phone && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span>
                </label>
                <div className="date-input-wrap">
                  <input
                    type="date"
                    value={dateOfBirth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                    }}
                    className={`form-date-input w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.dateOfBirth ? "border-destructive" : "border-border"}`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              {errors.gender && (
                <p className="font-body text-xs text-destructive">{errors.gender}</p>
              )}
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-8 bg-primary text-primary-foreground py-4 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isAr ? "جارِ الإرسال..." : "Submitting..."}
              </>
            ) : (
              <>
                {t("confirmRequest")}
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AppointmentBookingFallback;
