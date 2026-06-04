import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, Stethoscope, Building2, Shield, ClipboardList, User, CheckCircle2, Star, UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { createAppointmentRequest } from "@/api/appointmentRequest";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
const chipSuggestions = ["Headache", "Chest Pain", "Fever", "Dizziness", "Back Pain", "Fatigue", "Nausea", "Cough", "Joint Pain", "Shortness of Breath"];
const departmentMap: Record<string, { name: string; category: string }[]> = {
  headache: [{ name: "Neurology", category: "Nervous System" }, { name: "ENT", category: "Head & Neck" }],
  "chest pain": [{ name: "Cardiology", category: "Heart & Vascular" }, { name: "Emergency Medicine", category: "Emergency" }],
  fever: [{ name: "Internal Medicine", category: "General" }, { name: "Pediatrics", category: "Children" }],
  dizziness: [{ name: "Neurology", category: "Nervous System" }, { name: "ENT", category: "Head & Neck" }],
  "back pain": [{ name: "Orthopedics", category: "Bones & Joints" }, { name: "Physiotherapy", category: "Rehabilitation" }],
  fatigue: [{ name: "Internal Medicine", category: "General" }, { name: "Endocrinology", category: "Hormones" }],
  nausea: [{ name: "Gastroenterology", category: "Digestive" }, { name: "Obstetrics & Gynecology", category: "Women's Health" }],
  cough: [{ name: "Pulmonology", category: "Lungs" }, { name: "ENT", category: "Head & Neck" }],
  "joint pain": [{ name: "Orthopedics", category: "Bones & Joints" }, { name: "Rheumatology", category: "Bones & Joints" }],
  "shortness of breath": [{ name: "Pulmonology", category: "Lungs" }, { name: "Cardiology", category: "Heart & Vascular" }],
};
const conditionHints: Record<string, string> = {
  headache: "Possible tension headache or migraine",
  "chest pain": "Could indicate cardiac or musculoskeletal issue",
  fever: "Possible viral or bacterial infection",
  dizziness: "May relate to vertigo or blood pressure",
  "back pain": "Possible muscular strain or disc issue",
  fatigue: "Could indicate anemia or thyroid conditions",
  nausea: "May relate to gastrointestinal or inner ear condition",
  cough: "Possible upper respiratory infection",
  "joint pain": "May indicate arthritis or strain",
  "shortness of breath": "Could relate to respiratory or cardiac conditions",
};
const deptDoctors: Record<string, Array<{ name: string; specialty: string; available: boolean; experience: string; rating: number }>> = {
  Neurology: [
    { name: "Dr. Ahmed Al-Khaled", specialty: "Neurology", available: true, experience: "15+ Years", rating: 4.8 },
    { name: "Dr. Fatima Al-Rashidi", specialty: "Neurology", available: true, experience: "12+ Years", rating: 4.7 },
  ],
  ENT: [
    { name: "Dr. Khalid Al-Dosari", specialty: "ENT", available: true, experience: "10+ Years", rating: 4.6 },
  ],
  Cardiology: [
    { name: "Dr. Omar Al-Sabah", specialty: "Cardiology", available: true, experience: "18+ Years", rating: 4.9 },
    { name: "Dr. Sara Al-Fahad", specialty: "Cardiology", available: false, experience: "14+ Years", rating: 4.7 },
  ],
  "Emergency Medicine": [
    { name: "Dr. Mohammed Al-Mutairi", specialty: "Emergency Medicine", available: true, experience: "11+ Years", rating: 4.5 },
  ],
  "Internal Medicine": [
    { name: "Dr. Hanan Al-Shammari", specialty: "Internal Medicine", available: true, experience: "16+ Years", rating: 4.8 },
    { name: "Dr. Ahmed Al-Rashidi", specialty: "Internal Medicine", available: true, experience: "13+ Years", rating: 4.6 },
  ],
  Pediatrics: [
    { name: "Dr. Fatima Hassan", specialty: "Pediatrics", available: true, experience: "12+ Years", rating: 4.7 },
  ],
  Orthopedics: [
    { name: "Dr. Khalid Al-Mutairi", specialty: "Orthopedics", available: true, experience: "14+ Years", rating: 4.8 },
  ],
  Physiotherapy: [
    { name: "Dr. Sara Al-Dosari", specialty: "Physiotherapy", available: true, experience: "9+ Years", rating: 4.5 },
  ],
  Endocrinology: [
    { name: "Dr. Omar Al-Khaled", specialty: "Endocrinology", available: true, experience: "11+ Years", rating: 4.6 },
  ],
  Gastroenterology: [
    { name: "Dr. Mohammed Al-Sabah", specialty: "Gastroenterology", available: true, experience: "15+ Years", rating: 4.7 },
  ],
  "Obstetrics & Gynecology": [
    { name: "Dr. Hanan Al-Fahad", specialty: "Obstetrics & Gynecology", available: true, experience: "17+ Years", rating: 4.9 },
  ],
  Pulmonology: [
    { name: "Dr. Ahmed Al-Dosari", specialty: "Pulmonology", available: true, experience: "12+ Years", rating: 4.6 },
  ],
  Rheumatology: [
    { name: "Dr. Fatima Al-Sabah", specialty: "Rheumatology", available: true, experience: "10+ Years", rating: 4.5 },
  ],
};
type BookingStep = "symptoms" | "results" | "registered" | "doctor" | "patient" | "confirm" | "success";
const IntelligentBooking = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [focused, setFocused] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [symptomText, setSymptomText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ departments: { name: string; category: string }[]; conditions: string[] } | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>("symptoms");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<{ name: string; specialty: string; available: boolean; experience: string; rating: number } | null>(null);
  const [isRequestMode, setIsRequestMode] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCountryCode, setPatientCountryCode] = useState("+965");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientErrors, setPatientErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
    setResults(null);
    setBookingStep("symptoms");
  };
  const handleAnalyze = () => {
    const allSymptoms = [...selectedChips, ...(symptomText.trim() ? [symptomText.trim()] : [])];
    if (allSymptoms.length === 0) return;
    setAnalyzing(true);
    setTimeout(() => {
      const depts = new Map<string, { name: string; category: string }>();
      const conditions: string[] = [];
      allSymptoms.forEach((s) => {
        const key = s.toLowerCase();
        const matches = departmentMap[key] || [];
        matches.forEach((m) => depts.set(m.name, m));
        if (conditionHints[key]) conditions.push(conditionHints[key]);
      });
      if (depts.size === 0) {
        depts.set("Internal Medicine", { name: "Internal Medicine", category: "General" });
      }
      if (conditions.length === 0) conditions.push("General checkup recommended");
      setResults({
        departments: Array.from(depts.values()).slice(0, 4),
        conditions: conditions.slice(0, 3),
      });
      setAnalyzing(false);
      setBookingStep("results");
    }, 1500);
  };
  const handleSelectDept = (deptName: string) => {
    setSelectedDept(deptName);
    setBookingStep("registered");
  };
  const handleSelectDoctor = (doc: typeof selectedDoctor) => {
    setSelectedDoctor(doc);
    setIsRequestMode(!doc?.available);
    setBookingStep("patient");
  };
  const validatePatientDetails = () => {
    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.name = lang === "ar" ? "الاسم مطلوب" : "Full name is required";
    if (!patientPhone.trim()) errors.phone = lang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\d{7,15}$/.test(patientPhone.trim())) errors.phone = lang === "ar" ? "أدخل رقم هاتف صحيح" : "Enter a valid phone number";
    if (!patientAge.trim()) errors.age = lang === "ar" ? "العمر مطلوب" : "Age is required";
    else if (isNaN(Number(patientAge)) || Number(patientAge) < 0 || Number(patientAge) > 150) errors.age = lang === "ar" ? "أدخل عمراً صحيحاً" : "Enter a valid age";
    if (!patientGender) errors.gender = lang === "ar" ? "الجنس مطلوب" : "Gender is required";
    setPatientErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handlePatientSubmit = () => {
    if (!validatePatientDetails()) return;
    setBookingStep("confirm");
  };
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      await createAppointmentRequest({
        fullname: patientName.trim(),
        phone: `${patientCountryCode}${patientPhone.trim()}`,
        age: Number(patientAge),
        gender: patientGender,
        doctor: selectedDoctor?.name,
        department: selectedDept ?? undefined,
        symptoms: allSymptoms.length ? allSymptoms : undefined,
        requestType: isRequestMode
          ? "doctor unavailability request"
          : "first time visitor request",
      });
      setBookingStep("success");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : null;
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description:
          message ||
          (lang === "ar"
            ? "تعذر إرسال طلب الموعد. يرجى المحاولة مرة أخرى."
            : "Could not submit your appointment request. Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleReset = () => {
    setSelectedChips([]);
    setSymptomText("");
    setResults(null);
    setBookingStep("symptoms");
    setSelectedDept(null);
    setSelectedDoctor(null);
    setPatientName("");
    setPatientPhone("");
    setPatientAge("");
    setPatientGender("");
    setPatientErrors({});
    setIsRequestMode(false);
  };
  const allSymptoms = [...selectedChips, ...(symptomText.trim() ? [symptomText.trim()] : [])];
  const availableDoctors = selectedDept ? (deptDoctors[selectedDept] || [{ name: "Dr. General Specialist", specialty: selectedDept, available: true, experience: "10+ Years", rating: 4.5 }]) : [];
  return (
    <section className="py-14 bg-primary" id="book">
      <div className="container mx-auto px-6 text-center">
        <ScrollAnimationWrapper>
          <div className="inline-flex items-center gap-2 bg-popover/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body">{t("aiPowered")}</p>
          </div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-serif text-primary-foreground mb-3">{t("tellUsSymptoms")}</h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={0.15}>
          <p className="text-secondary/70 font-body max-w-xl mx-auto mb-6 text-sm">{t("symptomDesc")}</p>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={0.2}>
          <div className="max-w-2xl mx-auto bg-background rounded-2xl p-6 md:p-8 text-left shadow-2xl border border-border">
            <AnimatePresence mode="wait">
              {}
              {bookingStep === "symptoms" && (
                <motion.div key="symptoms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-serif text-foreground">{t("howFeeling")}</h3>
                  </div>
                  <p className="text-muted-foreground font-body text-xs mb-4 ms-12">{t("describeSymptoms")}</p>
                  <div className="flex flex-wrap gap-2 mb-4 ms-12">
                    {chipSuggestions.map((chip, i) => (
                      <motion.button
                        key={chip}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleChip(chip)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body cursor-pointer transition-all duration-200 border ${selectedChips.includes(chip)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/30 text-foreground border-transparent hover:bg-accent/20 hover:text-accent"
                          }`}
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                  <textarea
                    value={symptomText}
                    onChange={(e) => { setSymptomText(e.target.value); setResults(null); }}
                    placeholder={t("describeInDetail")}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full h-28 bg-muted/30 border rounded-xl p-4 font-body text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none transition-all duration-500 ${focused
                        ? "border-accent/50 ring-2 ring-accent/20 shadow-[0_0_20px_-5px_hsl(var(--accent)/0.3)]"
                        : "border-border"
                      }`}
                  />
                  <AnimatePresence>
                    {analyzing && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                        <div className="bg-accent/5 rounded-xl p-6 border border-accent/10 flex items-center justify-center gap-3">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-6 h-6 rounded-full border-2 border-accent/20 border-t-accent" />
                          <span className="font-body text-sm text-accent">{t("analyzing")}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-4 bg-muted/20 rounded-lg p-3 border border-border">
                    <p className="font-body text-[10px] text-muted-foreground leading-relaxed">
                      <Shield className="w-3 h-3 inline me-1 text-accent" />
                      {lang === "ar"
                        ? "تنويه: هذه مجرد توصية من الذكاء الاصطناعي. للحصول على معلومات كاملة، يرجى التحدث إلى موظفينا."
                        : "Disclaimer: This is just an AI recommendation. For complete information, please talk to our staff."}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span className="font-body text-[10px]">{t("encrypted")}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAnalyze}
                      disabled={allSymptoms.length === 0 || analyzing}
                      className={`px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${allSymptoms.length > 0 && !analyzing
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {t("analyzeSymptoms")}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {}
              {bookingStep === "results" && results && (
                <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-accent/5 rounded-xl p-5 border border-accent/10 mb-4">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-accent" />
                        <span className="font-body text-sm font-medium text-accent">{t("possibleConditions")}</span>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        {results.conditions.map((c, i) => (
                          <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="font-body text-xs text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 flex-shrink-0" />
                            {c}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/20 rounded-lg p-3 border border-border mb-4">
                      <p className="font-body text-[10px] text-muted-foreground leading-relaxed">
                        <Shield className="w-3 h-3 inline me-1 text-accent" />
                        {lang === "ar"
                          ? "تنويه: هذه الأداة تقدم اقتراحات عامة فقط ولا تُعد بديلاً عن الاستشارة الطبية. يرجى مراجعة الطبيب للتشخيص الدقيق."
                          : "Disclaimer: This tool provides general suggestions only and is not a substitute for professional medical advice. Please consult a doctor for accurate diagnosis."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span className="font-body text-sm font-medium text-accent">{t("recommendedDepts")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {results.departments.map((dept, i) => (
                      <motion.button key={dept.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        onClick={() => handleSelectDept(dept.name)}
                        className="flex items-center gap-2 bg-popover rounded-lg p-3 border border-border hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer text-start">
                        <div>
                          <p className="font-body text-xs font-medium text-foreground">{dept.name}</p>
                          <p className="font-body text-[10px] text-muted-foreground">{dept.category}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-accent ms-auto" />
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={() => setBookingStep("symptoms")} className="flex items-center gap-2 text-muted-foreground font-body text-xs hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3 h-3" /> {t("previous")}
                  </button>
                </motion.div>
              )}
              {}
              {bookingStep === "registered" && (
                <motion.div key="registered" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-foreground">
                        {lang === "ar" ? "هل أنت مريض مسجل؟" : "Are you a registered patient?"}
                      </h3>
                      <p className="text-muted-foreground font-body text-xs">
                        {lang === "ar"
                          ? "هل أنت مريض مسجل في مستشفى رويال حياة؟"
                          : "Are you a registered patient at Royale Hayat Hospital?"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        window.open("https://afyati.royalehayat.com", "_blank");
                      }}
                      className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-popover hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-all text-center"
                    >
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                      <p className="font-body text-sm font-medium text-foreground">
                        {lang === "ar" ? "نعم، أنا مسجل" : "Yes, I am registered"}
                      </p>
                      <p className="font-body text-[10px] text-muted-foreground">
                        {lang === "ar" ? "سيتم توجيهك إلى بوابة عافيتي" : "You will be redirected to Afiyati Portal"}
                      </p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        navigate("/appointment-request");
                      }}
                      className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-popover hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-all text-center"
                    >
                      <User className="w-8 h-8 text-accent" />
                      <p className="font-body text-sm font-medium text-foreground">
                        {lang === "ar" ? "لا، أنا زائر لأول مرة" : "No, I am a first-time visitor"}
                      </p>
                      <p className="font-body text-[10px] text-muted-foreground">
                        {lang === "ar" ? "سيتم توجيهك إلى نموذج طلب الموعد" : "You will be taken to the Appointment Request Form"}
                      </p>
                    </motion.button>
                  </div>
                  <button onClick={() => setBookingStep("results")} className="flex items-center gap-2 text-muted-foreground font-body text-xs hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3 h-3" /> {t("previous")}
                  </button>
                </motion.div>
              )}
              {}
              {bookingStep === "doctor" && (
                <motion.div key="doctor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-foreground">{lang === "ar" ? "اختر طبيبك" : "Select Your Doctor"}</h3>
                      <p className="text-muted-foreground font-body text-xs">{selectedDept}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    {availableDoctors.map((doc, i) => (
                      <motion.div key={doc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        onClick={() => handleSelectDoctor(doc)}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-popover hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-all">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-sm flex-shrink-0">
                          {doc.name.split(" ").slice(1).map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-foreground">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-body text-[10px] text-muted-foreground">{doc.experience}</span>
                            <span className="font-body text-[10px] text-accent flex items-center gap-0.5"><Star className="w-3 h-3" /> {Number(doc.rating).toFixed(1)}</span>
                          </div>
                          {doc.available ? (
                            <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="font-body text-[10px] text-green-600">{t("available")}</span></div>
                          ) : (
                            <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-destructive" /><span className="font-body text-[10px] text-destructive">{t("currentlyUnavailable")}</span></div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </motion.div>
                    ))}
                  </div>
                  <button onClick={() => setBookingStep("results")} className="flex items-center gap-2 text-muted-foreground font-body text-xs hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3 h-3" /> {t("previous")}
                  </button>
                </motion.div>
              )}
              {}
              {bookingStep === "patient" && (
                <motion.div key="patient" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-foreground">{t("patientDetails")}</h3>
                      <p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {t("fullName")} <span className="text-destructive">*</span>
                      </label>
                      <input type="text" value={patientName}
                        onChange={(e) => { setPatientName(e.target.value); setPatientErrors(prev => ({ ...prev, name: "" })); }}
                        placeholder={t("enterFullName")}
                        className={`w-full px-4 py-3 rounded-xl border bg-muted/20 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.name ? "border-destructive" : "border-border"}`} />
                      {patientErrors.name && <p className="font-body text-xs text-destructive mt-1">{patientErrors.name}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {t("phoneNumber")} <span className="text-destructive">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select value={patientCountryCode} onChange={(e) => setPatientCountryCode(e.target.value)}
                          className="w-24 px-3 py-3 rounded-xl border border-border bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30">
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
                        <input type="tel" value={patientPhone}
                          onChange={(e) => { setPatientPhone(e.target.value.replace(/\D/g, "")); setPatientErrors(prev => ({ ...prev, phone: "" })); }}
                          placeholder={t("phonePlaceholder")}
                          className={`flex-1 px-4 py-3 rounded-xl border bg-muted/20 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.phone ? "border-destructive" : "border-border"}`} />
                      </div>
                      {patientErrors.phone && <p className="font-body text-xs text-destructive mt-1">{patientErrors.phone}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                          {t("age")} <span className="text-destructive">*</span>
                        </label>
                        <input type="number" min="0" max="150" value={patientAge}
                          onChange={(e) => { setPatientAge(e.target.value); setPatientErrors(prev => ({ ...prev, age: "" })); }}
                          placeholder={t("enterAge")}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/20 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.age ? "border-destructive" : "border-border"}`} />
                        {patientErrors.age && <p className="font-body text-xs text-destructive mt-1">{patientErrors.age}</p>}
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                          {t("gender")} <span className="text-destructive">*</span>
                        </label>
                        <select value={patientGender}
                          onChange={(e) => { setPatientGender(e.target.value); setPatientErrors(prev => ({ ...prev, gender: "" })); }}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.gender ? "border-destructive" : "border-border"}`}>
                          <option value="">{t("selectGender")}</option>
                          <option value="male">{t("male")}</option>
                          <option value="female">{t("female")}</option>
                        </select>
                        {patientErrors.gender && <p className="font-body text-xs text-destructive mt-1">{patientErrors.gender}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <button onClick={() => setBookingStep("doctor")} className="flex items-center gap-2 text-muted-foreground font-body text-xs hover:text-foreground transition-colors">
                      <ArrowLeft className="w-3 h-3" /> {t("previous")}
                    </button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handlePatientSubmit}
                      className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2">
                      {t("continue")} <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {bookingStep === "confirm" && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-serif text-foreground">{lang === "ar" ? "مراجعة وتأكيد" : "Review & Confirm"}</h3>
                  </div>
                  {isRequestMode && (
                    <div className="bg-accent/5 border border-accent/10 rounded-xl p-3 mb-4">
                      <p className="font-body text-xs text-accent font-medium">{t("appointmentRequest")}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{t("requestNote")}</p>
                    </div>
                  )}
                  <div className="space-y-3 mb-5">
                    {[
                      { label: t("department"), value: selectedDept || "" },
                      { label: t("doctor"), value: selectedDoctor?.name || "" },
                      { label: t("patient"), value: patientName },
                      { label: t("phone"), value: `${patientCountryCode} ${patientPhone}` },
                      { label: t("age"), value: patientAge },
                      { label: t("gender"), value: patientGender === "male" ? t("male") : t("female") },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider w-24 flex-shrink-0">{row.label}</p>
                        <p className="font-body text-sm text-foreground font-medium">{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setBookingStep("patient")} className="flex items-center gap-2 text-muted-foreground font-body text-xs hover:text-foreground transition-colors">
                      <ArrowLeft className="w-3 h-3" /> {t("previous")}
                    </button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleConfirmBooking}
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {submitting
                        ? lang === "ar"
                          ? "جاري الإرسال..."
                          : "Submitting..."
                        : isRequestMode
                          ? t("submitRequest")
                          : t("confirmBooking")}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {}
              {bookingStep === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-serif text-foreground mb-2">
                    {isRequestMode ? t("requestSubmitted") : t("appointmentConfirmed")}
                  </h3>
                  <p className="text-muted-foreground font-body text-xs mb-4 max-w-sm mx-auto">
                    {isRequestMode ? t("requestConfirmMsg") : t("bookingConfirmMsg")}
                  </p>
                  <div className="bg-muted/20 rounded-xl p-4 border border-border text-start mb-4">
                    <p className="font-body text-xs text-muted-foreground mb-1">{t("doctor")}: <span className="text-foreground font-medium">{selectedDoctor?.name}</span></p>
                    <p className="font-body text-xs text-muted-foreground mb-1">{t("department")}: <span className="text-foreground font-medium">{selectedDept}</span></p>
                    <p className="font-body text-xs text-muted-foreground">{t("patient")}: <span className="text-foreground font-medium">{patientName}</span></p>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleReset}
                    className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    {lang === "ar" ? "حجز موعد جديد" : "Book Another Appointment"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};
export default IntelligentBooking;
