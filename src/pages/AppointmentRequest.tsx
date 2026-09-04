import { useState, useEffect } from "react";
import { createAppointmentRequest } from "@/api/appointmentRequest";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackArrow } from "@/components/BackArrow";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { loadDoctorById, type Doctor } from "@/data/loadDoctors";
import { fetchDoctorProfileById, isMongoDoctorId } from "@/api/doctors";
import type { AppointmentRequestPrefillState } from "@/types/appointmentRequestPrefill";
import type { AppointmentRequestType } from "@/api/appointmentRequest";
import {
  resolveAppointmentDepartmentName,
  resolveAppointmentDoctorName,
  resolvePrefilledAppointmentDepartmentName,
  resolvePrefilledAppointmentDoctorName,
} from "@/utils/appointmentRequestFields";
import {
  buildPreferredSlotFromPicker,
  formatAppointmentDateDisplay,
  formatAppointmentTimeDisplay,
  getAppointmentSlotPeriod,
} from "@/utils/appointmentRequestFormTime";
import FirstTimeVisitorTimePicker from "@/pages/book-appointment/components/FirstTimeVisitorTimePicker";
import { getFirstTimeVisitorHours, type AmPm } from "@/pages/book-appointment/firstTimeVisitorTimeSlots";

const isDoctorRequestOnly = (doc: Pick<Doctor, "hideBooking" | "availableOnline">) =>
  doc.hideBooking === true || doc.availableOnline === false;

const resolveAppointmentSymptoms = (
  prefill: AppointmentRequestPrefillState,
  locationState: Record<string, unknown>,
): string[] | undefined => {
  if (Array.isArray(prefill.symptoms) && prefill.symptoms.length > 0) {
    return prefill.symptoms.map((item) => String(item).trim()).filter(Boolean);
  }
  const saved = locationState.savedSymptoms;
  if (!Array.isArray(saved) || saved.length === 0) return undefined;
  const normalized = saved.map((item) => String(item).trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
};

const resolveAppointmentRequestType = (
  prefill: AppointmentRequestPrefillState,
  doctorId: string | null,
  prefilledDoctor: Doctor | null,
  fromBookAppointment: boolean,
): AppointmentRequestType => {
  if (prefill.requestType) return prefill.requestType;
  if (fromBookAppointment) return "appointment request";
  if (prefilledDoctor && isDoctorRequestOnly(prefilledDoctor)) {
    return "appointment request";
  }
  if (doctorId) return "appointment request";
  return "appointment request";
};

type AppointmentRequestLocationState = {
  appointmentRequestPrefill?: AppointmentRequestPrefillState;
  fromBookAppointment?: boolean;
};

const AppointmentRequest = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preferredSlotFrom, setPreferredSlotFrom] = useState<string | null>(null);
  const [preferredSlotTo, setPreferredSlotTo] = useState<string | null>(null);
  const [manualSlotHour, setManualSlotHour] = useState("");
  const [manualSlotMinute, setManualSlotMinute] = useState("");
  const [manualSlotAmPm, setManualSlotAmPm] = useState("");

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

  const locState = (location.state as AppointmentRequestLocationState | null) ?? {};
  const prefill = locState.appointmentRequestPrefill ?? {};
  const identityReadOnly = Boolean(prefill.readOnlyIdentity);
  const returnState = (location.state as Record<string, unknown>) ?? {};
  const doctorId = searchParams.get("doctor");
  const [prefilledDoctor, setPrefilledDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!doctorId) {
      setPrefilledDoctor(null);
      return;
    }
    let cancelled = false;
    const loadDoctor = async () => {
      const doc = isMongoDoctorId(doctorId)
        ? await fetchDoctorProfileById(doctorId)
        : await loadDoctorById(doctorId);
      if (!cancelled) setPrefilledDoctor(doc ?? null);
    };
    void loadDoctor();
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const [form, setForm] = useState({
    fullName: prefill.fullName?.trim() || "",
    phone: "",
    email: "",
    countryCode: "+965",
    dateOfBirth: prefill.dateOfBirth || "",
    gender: prefill.gender || "",
    preferredDate: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const times = buildPreferredSlotFromPicker(manualSlotHour, manualSlotMinute, manualSlotAmPm);
    if (times) {
      setPreferredSlotFrom(times.from);
      setPreferredSlotTo(times.to);
    } else {
      setPreferredSlotFrom(null);
      setPreferredSlotTo(null);
    }
  }, [manualSlotHour, manualSlotMinute, manualSlotAmPm]);

  const handlePreferredDateChange = (value: string) => {
    setForm((prev) => ({ ...prev, preferredDate: value }));
    setManualSlotHour("");
    setManualSlotMinute("");
    setManualSlotAmPm("");
    setPreferredSlotFrom(null);
    setPreferredSlotTo(null);
    setErrors((prev) => ({ ...prev, preferredDate: "", preferredTime: "" }));
  };

  const handleManualAmPmChange = (value: string) => {
    setManualSlotAmPm(value);
    if (value === "AM" || value === "PM") {
      const hourNum = parseInt(manualSlotHour, 10);
      if (manualSlotHour && !getFirstTimeVisitorHours(value as AmPm).includes(hourNum)) {
        setManualSlotHour("");
      }
    } else {
      setManualSlotHour("");
    }
    setErrors((prev) => ({ ...prev, preferredTime: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = isAr ? "الاسم مطلوب" : "Full name is required";
    if (!form.phone.trim()) e.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\d{8}$/.test(form.phone.trim())) {
      e.phone = isAr ? "أدخل رقم هاتف مكون من 8 أرقام" : "Enter an 8-digit phone number";
    }
    if (!form.email.trim()) e.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = isAr ? "أدخل بريداً إلكترونياً صحيحاً" : "Enter a valid email address";
    }
    if (!form.dateOfBirth) e.dateOfBirth = isAr ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
    else if (new Date(form.dateOfBirth) > new Date()) {
      e.dateOfBirth = isAr ? "أدخل تاريخ ميلاد صحيحاً" : "Enter a valid date of birth";
    }
    if (!form.gender) e.gender = isAr ? "الجنس مطلوب" : "Gender is required";
    if (!form.preferredDate) {
      e.preferredDate = isAr ? "التاريخ المفضل مطلوب" : "Preferred date is required";
    } else if (form.preferredDate < new Date().toISOString().split("T")[0]) {
      e.preferredDate = isAr ? "اختر تاريخاً من اليوم فصاعداً" : "Select a date from today onwards";
    }
    if (!manualSlotHour || !manualSlotMinute || !manualSlotAmPm || !preferredSlotFrom) {
      e.preferredTime = isAr ? "الوقت المفضل مطلوب" : "Preferred time is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const requestType = resolveAppointmentRequestType(
      prefill,
      doctorId,
      prefilledDoctor,
      Boolean(locState.fromBookAppointment),
    );
    const symptoms = resolveAppointmentSymptoms(prefill, returnState);
    const requestLang = isAr ? "ar" : "en";
    const doctorName =
      resolveAppointmentDoctorName(prefilledDoctor, requestLang) ??
      resolvePrefilledAppointmentDoctorName(prefill, requestLang);
    const departmentName =
      resolveAppointmentDepartmentName(null, prefilledDoctor, requestLang) ??
      resolvePrefilledAppointmentDepartmentName(prefill, requestLang);
    const formattedPreferredDate = formatAppointmentDateDisplay(form.preferredDate);

    try {
      await createAppointmentRequest({
        fullname: form.fullName.trim(),
        phone: `${form.countryCode}${form.phone.trim()}`,
        email: form.email.trim(),
        requestType,
        dob: form.dateOfBirth,
        gender: form.gender,
        doctor: doctorName,
        department: departmentName,
        date: formattedPreferredDate || form.preferredDate,
        preferredDate: form.preferredDate,
        slot_from_time: preferredSlotFrom || undefined,
        slot_to_time: preferredSlotTo || undefined,
        timeSlot: preferredSlotFrom
          ? {
              period: getAppointmentSlotPeriod(preferredSlotFrom),
              slot_from_time: preferredSlotFrom,
              slot_to_time: preferredSlotTo || "",
            }
          : undefined,
        additionalNotes: [
          prefill.civilId ? `Civil ID: ${prefill.civilId}` : "",
          form.message.trim(),
        ]
          .filter(Boolean)
          .join(". ") || undefined,
        symptoms,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGoBack = () => {
    if (doctorId) {
      navigate(`/doctors/${doctorId}`, { state: returnState });
      return;
    }
    if (locState.appointmentRequestPrefill || locState.fromBookAppointment) {
      navigate("/book-appointment", { state: returnState });
      return;
    }
    navigate(-1);
  };

  const formattedDob = formatAppointmentDateDisplay(form.dateOfBirth);
  const formattedPreferredDate = formatAppointmentDateDisplay(form.preferredDate);
  const formattedPreferredTime = formatAppointmentTimeDisplay(preferredSlotFrom);
  const genderLabel =
    form.gender === "male"
      ? t("male")
      : form.gender === "female"
        ? t("female")
        : isAr
          ? "غير محدد"
          : "Not specified";

  const resolvedDoctorLabel = prefilledDoctor
    ? isAr
      ? prefilledDoctor.nameAr
      : prefilledDoctor.name
    : resolvePrefilledAppointmentDoctorName(prefill, isAr ? "ar" : "en");

  const resolvedDepartmentLabel = prefilledDoctor
    ? isAr
      ? prefilledDoctor.departmentAr || prefilledDoctor.department
      : prefilledDoctor.department
    : resolvePrefilledAppointmentDepartmentName(prefill, isAr ? "ar" : "en");

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
          <h1 className="text-3xl font-serif text-foreground mb-3">
            {isAr ? "تم إرسال الطلب بنجاح!" : "Request Submitted Successfully!"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-6">
            {isAr
              ? "سنتواصل معك خلال 6-12 ساعة لتأكيد موعدك."
              : "We will contact you within 6-12 hours to confirm your appointment."}
          </p>
          <div className="bg-popover rounded-2xl border border-border p-6 text-start mb-6">
            <h3 className="font-serif text-lg text-foreground mb-4">{t("appointmentDetails")}</h3>
            <div className="space-y-5">
              {[
                { label: t("patient"), value: form.fullName, icon: User },
                { label: t("phone number"), value: `${form.countryCode} ${form.phone}`, icon: Phone },
                {
                  label: isAr ? "البريد الإلكتروني" : "Email",
                  value: form.email.trim(),
                  icon: Mail,
                },
                {
                  label: isAr ? "تاريخ الميلاد" : "Date of Birth",
                  value: formattedDob || (isAr ? "غير متوفر" : "Not provided"),
                  icon: Calendar,
                },
                { label: t("gender"), value: genderLabel, icon: User },
                {
                  label: isAr ? "التاريخ والوقت" : "Date & Time",
                  value:
                    formattedPreferredDate && formattedPreferredTime
                      ? `${formattedPreferredDate} • ${formattedPreferredTime}`
                      : isAr
                        ? "غير متوفر"
                        : "Not provided",
                  icon: Clock,
                },
                {
                  label: isAr ? "ملاحظات إضافية" : "Additional Notes",
                  value:
                    form.message.trim() || (isAr ? "لا توجد ملاحظات" : "No additional notes"),
                  icon: ClipboardList,
                },
                ...(resolvedDoctorLabel
                  ? [{ label: t("doctor"), value: resolvedDoctorLabel, icon: User }]
                  : []),
                ...(resolvedDepartmentLabel
                  ? [{ label: t("department"), value: resolvedDepartmentLabel, icon: ClipboardList }]
                  : []),
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[36px_1fr] items-start gap-x-2.5 py-3 border-b border-border last:border-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <row.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex flex-col items-start">
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider leading-4">
                      {row.label}
                    </p>
                    <p className="font-body text-sm text-foreground font-medium whitespace-pre-line break-words leading-5 mt-0.5">
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              {t("backToHome")}
            </button>
          </div>
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
          {isAr ? "نموذج طلب موعد" : "Appointment Request Form"}
        </h1>
        <p className="text-primary-foreground/70 font-body text-sm">
          {isAr
            ? "أدخل بياناتك واختر الموعد المفضل وسنتواصل معك قريباً"
            : "Enter your details and preferred appointment time — we'll get back to you shortly"}
        </p>
      </div>
      <div className="container mx-auto px-6 py-8 max-w-2xl min-w-0 overflow-x-hidden">
        <button
          type="button"
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-body text-sm mb-6 px-0"
        >
          <BackArrow className="w-4 h-4" />
          {isAr ? "العودة" : "Back"}
        </button>
        {(resolvedDoctorLabel || resolvedDepartmentLabel) && !prefilledDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-popover rounded-2xl p-5 border border-border shadow-sm mb-6"
          >
            {resolvedDoctorLabel && (
              <p className="font-serif text-foreground text-base">{resolvedDoctorLabel}</p>
            )}
            {resolvedDepartmentLabel && (
              <p className="text-accent font-body text-[10px] tracking-wider uppercase mt-1">
                {resolvedDepartmentLabel}
              </p>
            )}
          </motion.div>
        )}
        {prefilledDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-popover rounded-2xl p-5 border border-border shadow-sm mb-6 flex items-center gap-4"
          >
            <div
              className={`${prefilledDoctor.color} w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}
            >
              {prefilledDoctor.image ? (
                <img
                  src={prefilledDoctor.image}
                  alt={isAr ? prefilledDoctor.nameAr : prefilledDoctor.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-lg font-serif text-primary-foreground">
                  {prefilledDoctor.initials}
                </span>
              )}
            </div>
            <div>
              <p className="font-serif text-foreground text-base">
                {isAr ? prefilledDoctor.nameAr : prefilledDoctor.name}
              </p>
              <p className="text-muted-foreground font-body text-xs">
                {isAr ? prefilledDoctor.specialtyAr : prefilledDoctor.specialty}
              </p>
              <p className="text-accent font-body text-[10px] tracking-wider uppercase mt-0.5">
                {isAr ? prefilledDoctor.departmentAr : prefilledDoctor.department}
              </p>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm min-w-0 overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-foreground">{t("patientDetails")}</h2>
              <p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p>
            </div>
          </div>
          {prefill.identityDetails && (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 sm:p-5">
              <h4 className="font-body text-[11px] tracking-[0.18em] uppercase text-accent mb-3">
                {isAr ? "تفاصيل الهوية" : "Identity Details"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: isAr ? "الاسم" : "Name", value: prefill.identityDetails.name },
                  {
                    label: isAr ? "تاريخ الميلاد" : "Date of Birth",
                    value: prefill.identityDetails.dateOfBirth,
                  },
                  {
                    label: isAr ? "الرقم المدني" : "Civil ID Number",
                    value: prefill.identityDetails.civilIdNumber,
                  },
                  {
                    label: isAr ? "الجنسية" : "Nationality",
                    value: prefill.identityDetails.nationality,
                  },
                  { label: isAr ? "الجنس" : "Gender", value: prefill.identityDetails.gender },
                  {
                    label: isAr ? "رقم جواز السفر" : "Passport Number",
                    value: prefill.identityDetails.passportNumber,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5"
                  >
                    <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                      {row.label}
                    </p>
                    <p className="font-body text-sm text-foreground font-medium mt-0.5">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-5 min-w-0">
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("fullName")} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                readOnly={identityReadOnly}
                placeholder={t("enterFullName")}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.fullName ? "border-destructive" : "border-border"} ${identityReadOnly ? "opacity-80 cursor-default" : ""}`}
              />
              {errors.fullName && (
                <p className="font-body text-xs text-destructive mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("phoneNumber")} <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={(e) => updateField("countryCode", e.target.value)}
                  className="w-24 px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="+965">+965</option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                  <option value="+973">+973</option>
                  <option value="+968">+968</option>
                  <option value="+974">+974</option>
                  <option value="+20">+20</option>
                  <option value="+91">+91</option>
                  <option value="+44">+44</option>
                  <option value="+1">+1</option>
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  placeholder={t("phonePlaceholder")}
                  className={`flex-1 px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.phone ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.phone && (
                <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {isAr ? "البريد الإلكتروني" : "Email"} <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                autoComplete="email"
                required
                placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.email ? "border-destructive" : "border-border"}`}
              />
              {errors.email && (
                <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span>
                </label>
                <div className="date-input-wrap">
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    readOnly={identityReadOnly}
                    max={new Date().toISOString().split("T")[0]}
                    className={`form-date-input w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.dateOfBirth ? "border-destructive" : "border-border"} ${identityReadOnly ? "opacity-80 cursor-default" : ""}`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
              <div className="min-w-0">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {t("gender")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  disabled={identityReadOnly}
                  className={`w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.gender ? "border-destructive" : "border-border"} ${identityReadOnly ? "opacity-80 cursor-default" : ""}`}
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
                {errors.gender && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {isAr ? "التاريخ المفضل" : "Preferred Date"} <span className="text-destructive">*</span>
              </label>
              <div className="date-input-wrap">
                <input
                  type="date"
                  value={form.preferredDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handlePreferredDateChange(e.target.value)}
                  className={`form-date-input w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${errors.preferredDate ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.preferredDate && (
                <p className="font-body text-xs text-destructive mt-1">{errors.preferredDate}</p>
              )}
            </div>
            <div>
              <FirstTimeVisitorTimePicker
                isAr={isAr}
                hour={manualSlotHour}
                minute={manualSlotMinute}
                ampm={manualSlotAmPm}
                onHourChange={(value) => {
                  setManualSlotHour(value);
                  setErrors((prev) => ({ ...prev, preferredTime: "" }));
                }}
                onMinuteChange={(value) => {
                  setManualSlotMinute(value);
                  setErrors((prev) => ({ ...prev, preferredTime: "" }));
                }}
                onAmPmChange={handleManualAmPmChange}
                showContinueButton={false}
                label={isAr ? "الوقت المفضل" : "Preferred Time"}
              />
              {errors.preferredTime && (
                <p className="font-body text-xs text-destructive mt-1">{errors.preferredTime}</p>
              )}
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {isAr ? "ملاحظات إضافية" : "Additional Notes"} ({isAr ? "اختياري" : "Optional"})
              </label>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder={
                  isAr
                    ? "أي معلومات إضافية تود مشاركتها..."
                    : "Any additional information you'd like to share..."
                }
                className="w-full h-24 px-4 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              isAr ? (
                "جاري الإرسال..."
              ) : (
                "Submitting..."
              )
            ) : (
              <>
                {isAr ? "إرسال الطلب" : "Submit Request"} <ArrowRight className="w-4 h-4" />
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

export default AppointmentRequest;
