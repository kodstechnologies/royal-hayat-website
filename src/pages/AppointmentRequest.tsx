import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, ArrowRight, ArrowLeft, User, Phone, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { doctors as allDoctors } from "@/data/doctors";

const AppointmentRequest = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const returnState = (location.state as any) ?? {};

  // Pre-fill doctor info from query param
  const doctorId = searchParams.get("doctor");
  const prefilledDoctor = doctorId ? allDoctors.find(d => d.id === doctorId) : null;

  const [form, setForm] = useState({
    fullName: "", phone: "", countryCode: "+965", dateOfBirth: "", gender: "",
    department: "", preferredDate: "", message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = lang === "ar" ? "الاسم مطلوب" : "Full name is required";
    if (!form.phone.trim()) e.phone = lang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\d{8}$/.test(form.phone.trim())) e.phone = lang === "ar" ? "أدخل رقم هاتف مكون من 8 أرقام" : "Enter an 8-digit phone number";
    if (!form.dateOfBirth) e.dateOfBirth = lang === "ar" ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
    if (!form.gender) e.gender = lang === "ar" ? "الجنس مطلوب" : "Gender is required";
    // department validation removed
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const formattedDob = form.dateOfBirth ? form.dateOfBirth.split("-").reverse().join("/") : "";
  const genderLabel =
    form.gender === "male"
      ? t("male")
      : form.gender === "female"
        ? t("female")
        : (lang === "ar" ? "غير محدد" : "Not specified");

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-20 max-w-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-serif text-foreground mb-3">
            {lang === "ar" ? "تم إرسال الطلب بنجاح!" : "Request Submitted Successfully!"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-6">
            {lang === "ar" ? "سنتواصل معك خلال 6-12 ساعة لتأكيد موعدك." : "We will contact you within 6-12 hours to confirm your appointment."}
          </p>
          <div className="bg-popover rounded-2xl border border-border p-6 text-start mb-6">
            <h3 className="font-serif text-lg text-foreground mb-4">{t("appointmentDetails")}</h3>
            <div className="space-y-5">
                {[
                  { label: t("patient"), value: form.fullName, icon: User },
                  { label: t("phone number"), value: `${form.countryCode} ${form.phone}`, icon: Phone },
                  { label: lang === "ar" ? "تاريخ الميلاد" : "Date of Birth", value: formattedDob || (lang === "ar" ? "غير متوفر" : "Not provided"), icon: Calendar },
                  { label: t("gender"), value: genderLabel, icon: User },
                  {
                    label: lang === "ar" ? "ملاحظات إضافية" : "Additional Notes",
                    value: form.message.trim() || (lang === "ar" ? "لا توجد ملاحظات" : "No additional notes"),
                    icon: ClipboardList
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5 py-3 border-b border-border last:border-0">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <row.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{row.label}</p>
                      <p className="font-body text-sm text-foreground font-medium whitespace-pre-line break-words">{row.value}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
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
          {lang === "ar" ? "نموذج طلب موعد" : "Appointment Request Form"}
        </h1>
        <p className="text-primary-foreground/70 font-body text-sm">
          {lang === "ar" ? "املأ التفاصيل أدناه وسنتواصل معك قريباً" : "Fill in the details below and we'll get back to you shortly"}
        </p>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <button 
          onClick={() => navigate("/book-appointment", { state: returnState })}
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-body text-sm mb-6 px-0"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {lang === "ar" ? "العودة" : "Back"}
        </button>
        {/* Pre-filled Doctor Info */}
        {prefilledDoctor && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-popover rounded-2xl p-5 border border-border shadow-sm mb-6 flex items-center gap-4">
            <div className={`${prefilledDoctor.color} w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}>
              {prefilledDoctor.image ? (
                <img
                  src={prefilledDoctor.image}
                  alt={lang === "ar" ? prefilledDoctor.nameAr : prefilledDoctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-serif text-primary-foreground">{prefilledDoctor.initials}</span>
              )}
            </div>
            <div>
              <p className="font-serif text-foreground text-base">{lang === "ar" ? prefilledDoctor.nameAr : prefilledDoctor.name}</p>
              <p className="text-muted-foreground font-body text-xs">{lang === "ar" ? prefilledDoctor.specialtyAr : prefilledDoctor.specialty}</p>
              <p className="text-accent font-body text-[10px] tracking-wider uppercase mt-0.5">{lang === "ar" ? prefilledDoctor.departmentAr : prefilledDoctor.department}</p>
            </div>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-foreground">{t("patientDetails")}</h2>
              <p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("fullName")} <span className="text-destructive">*</span>
              </label>
              <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)}
                placeholder={t("enterFullName")}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.fullName ? "border-destructive" : "border-border"}`} />
              {errors.fullName && <p className="font-body text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("phoneNumber")} <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <select value={form.countryCode} onChange={(e) => updateField("countryCode", e.target.value)}
                  className="w-24 px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="+965">+965</option><option value="+966">+966</option><option value="+971">+971</option>
                  <option value="+973">+973</option><option value="+968">+968</option><option value="+974">+974</option>
                  <option value="+20">+20</option><option value="+91">+91</option><option value="+44">+44</option><option value="+1">+1</option>
                </select>
                <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 8))}
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  placeholder={t("phonePlaceholder")}
                  className={`flex-1 px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.phone ? "border-destructive" : "border-border"}`} />
              </div>
              {errors.phone && <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {lang === "ar" ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.dateOfBirth ? "border-destructive" : "border-border"}`}
                />
                {errors.dateOfBirth && <p className="font-body text-xs text-destructive mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {t("gender")} <span className="text-destructive">*</span>
                </label>
                <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.gender ? "border-destructive" : "border-border"}`}>
                  <option value="">{t("selectGender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
                {errors.gender && <p className="font-body text-xs text-destructive mt-1">{errors.gender}</p>}
              </div>
            </div>


            {/* Message */}
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {lang === "ar" ? "ملاحظات إضافية" : "Additional Notes"} ({lang === "ar" ? "اختياري" : "Optional"})
              </label>
              <textarea value={form.message} onChange={(e) => updateField("message", e.target.value)}
                placeholder={lang === "ar" ? "أي معلومات إضافية تود مشاركتها..." : "Any additional information you'd like to share..."}
                className="w-full h-24 px-4 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
            className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            {lang === "ar" ? "إرسال الطلب" : "Submit Request"} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default AppointmentRequest;
