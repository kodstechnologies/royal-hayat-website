import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Crown, Star, Target, Stethoscope, ClipboardList, Briefcase, UserPlus, CheckCircle2, X, ChevronDown, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { createAlSafwaEnrollment } from "../api/alSafwa";
import axios from "axios";
const EnrollmentModal = ({ isOpen, onClose, t, isAr, onSuccess }: { isOpen: boolean; onClose: () => void; t: any; isAr: boolean; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    preferredAppointmentDate: "",
    previousMedicalCheckup: "",
    diabetes: "",
    highCholesterol: "",
    bronchialAsthma: "",
    hypertension: "",
    heartDisease: "",
    overweightObesity: "",
    smoker: "",
    alcohol: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAlSafwaEnrollment({
        ...formData,
        gender: formData.gender as "male" | "female",
        previousMedicalCheckup: formData.previousMedicalCheckup as
          | "less_than_1_year"
          | "more_than_1_year"
          | "never",
        diabetes: formData.diabetes as "yes" | "no" | "dont_know",
        highCholesterol: formData.highCholesterol as "yes" | "no" | "dont_know",
        bronchialAsthma: formData.bronchialAsthma as "yes" | "no" | "dont_know",
        hypertension: formData.hypertension as "yes" | "no" | "dont_know",
        heartDisease: formData.heartDisease as "yes" | "no" | "dont_know",
        overweightObesity: formData.overweightObesity as "yes" | "no" | "dont_know",
        smoker: formData.smoker as "yes" | "no",
        alcohol: formData.alcohol as "yes" | "no",
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      const backendMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : null;
      toast({
        title: isAr ? "خطأ" : "Error",
        description:
          backendMessage ||
          (isAr
            ? "تعذر إرسال نموذج التسجيل. يرجى المحاولة مرة أخرى."
            : "Failed to submit enrollment form. Please try again."),
        variant: "destructive",
      });
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/20 backdrop-blur-md"
          />
          <div className="flex min-h-full items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-background/95 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl shadow-primary/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl md:text-3xl font-serif text-primary">
                  {isAr ? "نموذج التسجيل" : "Enrollment Form"}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors group"
                >
                  <X className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-serif text-foreground mb-2">
                    {isAr ? "تم الإرسال بنجاح!" : "Submitted Successfully!"}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm">
                    {isAr ? "سنتصل بك قريباً." : "We'll contact you shortly."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "الاسم *" : "Name *"}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm placeholder:text-muted-foreground/40"
                        placeholder={isAr ? "الاسم" : "Name"}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "اسم العائلة *" : "Family Name *"}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm placeholder:text-muted-foreground/40"
                        placeholder={isAr ? "اسم العائلة" : "Family name"}
                        value={formData.familyName}
                        onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "الجنس *" : "Gender *"}
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm appearance-none cursor-pointer"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="">{isAr ? "اختر" : "Select"}</option>
                        <option value="male">{isAr ? "ذكر" : "Male"}</option>
                        <option value="female">{isAr ? "أنثى" : "Female"}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-[34px] w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "تاريخ الميلاد *" : "Date of Birth *"}
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "الجوال *" : "Mobile *"}
                      </label>
                      <input
                        required
                        type="tel"
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm placeholder:text-muted-foreground/40"
                        placeholder={isAr ? "الجوال" : "Mobile"}
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                        {isAr ? "البريد الإلكتروني *" : "Email *"}
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm placeholder:text-muted-foreground/40"
                        placeholder={isAr ? "البريد الإلكتروني" : "Email"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-serif text-primary/70 mb-1 ml-1.5 uppercase tracking-wider">
                      {isAr ? "التاريخ المفضل للموعد *" : "Preferred Date of Appointment *"}
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/30 focus:bg-background focus:outline-none transition-all font-body text-sm"
                      value={formData.preferredAppointmentDate}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredAppointmentDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-serif text-primary/70 mb-2 ml-1.5 uppercase tracking-wider">
                      {isAr
                        ? "هل سبق لك إجراء فحص طبي؟"
                        : "Have you previously had a medical checkup done?"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {[
                        { value: "less_than_1_year", label: isAr ? "أقل من سنة" : "Less than 1 yr" },
                        { value: "more_than_1_year", label: isAr ? "أكثر من سنة" : "More than 1 yr" },
                        { value: "never", label: isAr ? "أبداً" : "Never" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-1.5">
                          <input
                            required
                            type="radio"
                            name="previousMedicalCheckup"
                            value={option.value}
                            checked={formData.previousMedicalCheckup === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, previousMedicalCheckup: e.target.value })
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/10 p-3 space-y-2">
                    <p className="text-[11px] font-serif text-primary/70 uppercase tracking-wider">
                      {isAr ? "أي من الحالات التالية تعاني منها؟" : "Which of the following do you suffer from?"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        { key: "diabetes", label: isAr ? "السكري" : "Diabetes" },
                        { key: "hypertension", label: isAr ? "ارتفاع ضغط الدم" : "Hypertension" },
                        { key: "highCholesterol", label: isAr ? "ارتفاع الكوليسترول" : "High Cholesterol" },
                        { key: "heartDisease", label: isAr ? "أمراض القلب" : "Heart Disease" },
                        { key: "bronchialAsthma", label: isAr ? "الربو الشعبي" : "Bronchial Asthma" },
                        { key: "overweightObesity", label: isAr ? "زيادة الوزن / السمنة" : "Overweight / Obesity" },
                      ].map((condition) => (
                        <div key={condition.key} className="rounded-lg border border-primary/10 p-2">
                          <p className="mb-1.5">{condition.label}</p>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { value: "yes", label: isAr ? "نعم" : "Yes" },
                              { value: "no", label: isAr ? "لا" : "No" },
                              { value: "dont_know", label: isAr ? "لا أعرف" : "Don't know" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-1">
                                <input
                                  required
                                  type="radio"
                                  name={condition.key}
                                  value={option.value}
                                  checked={formData[condition.key as keyof typeof formData] === option.value}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [condition.key]: e.target.value,
                                    })
                                  }
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/10 p-3 space-y-2">
                    <p className="text-[11px] font-serif text-primary/70 uppercase tracking-wider">
                      {isAr ? "العادات الخاصة" : "Special Habits"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        { key: "smoker", label: isAr ? "هل تدخن؟" : "Do you smoke?" },
                        { key: "alcohol", label: isAr ? "هل تشرب الكحول؟" : "Do you drink alcohol?" },
                      ].map((habit) => (
                        <div key={habit.key} className="rounded-lg border border-primary/10 p-2">
                          <p className="mb-1.5">{habit.label}</p>
                          <div className="flex gap-3">
                            {[
                              { value: "yes", label: isAr ? "نعم" : "Yes" },
                              { value: "no", label: isAr ? "لا" : "No" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-1">
                                <input
                                  required
                                  type="radio"
                                  name={habit.key}
                                  value={option.value}
                                  checked={formData[habit.key as keyof typeof formData] === option.value}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [habit.key]: e.target.value,
                                    })
                                  }
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-serif text-base tracking-wide hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 mt-2 flex items-center justify-center text-center"
                  >
                    {isSubmitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال التسجيل" : "Submit Enrollment")}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
const AlSafwaProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as {
    fromBookAppointment?: boolean;
    fromDepartments?: boolean;
    fromSpecializedCare?: boolean;
    returnPath?: string;
    restoreDeptOpenIndex?: number;
    restoreSelectedSubByDept?: Record<number, string>;
    restoreScrollY?: number;
    restoreExpandedIndex?: number | null;
    restoreSelectedSubByService?: Record<string, string>;
  } | null) ?? {};
  const fromBookAppointment = Boolean(navState.fromBookAppointment);
  const fromDepartments = Boolean(navState.fromDepartments);
  const fromSpecializedCare = Boolean(navState.fromSpecializedCare);
  const showNavigationBack = fromDepartments || fromSpecializedCare;
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const goBackFromDepartments = () => {
    navigate(navState.returnPath || "/medical-services", {
      state: {
        restoreDeptOpenIndex: navState.restoreDeptOpenIndex,
        restoreSelectedSubByDept: navState.restoreSelectedSubByDept,
        restoreScrollY: navState.restoreScrollY,
      },
    });
  };
  const goBackFromSpecializedCare = () => {
    navigate(navState.returnPath || "/", {
      state: {
        restoreExpandedIndex: navState.restoreExpandedIndex,
        restoreSelectedSubByService: navState.restoreSelectedSubByService,
        restoreScrollY: navState.restoreScrollY,
      },
    });
  };
  const handleNavigationBack = () => {
    if (fromDepartments) {
      goBackFromDepartments();
      return;
    }
    if (fromSpecializedCare) {
      goBackFromSpecializedCare();
    }
  };
  const navigationBackButton = showNavigationBack ? (
    <button
      type="button"
      onClick={handleNavigationBack}
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm mb-8 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {isAr ? "العودة" : "Go Back"}
    </button>
  ) : null;
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const objectives = isAr ? [
    "تقديم رعاية صحية متميزة وشخصية",
    "الكشف المبكر عن المخاطر الصحية والحدّ منها",
    "إدارة فعّالة للأمراض المزمنة والوراثية",
    "تحديث جدول التطعيمات والتحصينات",
    "تعزيز الصحة العامة والعافية الشاملة",
  ] : [
    "Deliver premium, personalized healthcare",
    "Identify and mitigate health risks early",
    "Efficiently manage chronic and hereditary conditions",
    "Provide immunization updates",
    "Enhance overall health and well-being",
  ];
  const features = isAr ? [
    "الوصول إلى نخبة من المتخصصين في أمراض القلب والجهاز الهضمي وغيرها",
    "الاستمتاع بأجنحة تنفيذية خاصة وأنيقة",
    "الاستفادة من منسّق تنفيذي مخصص لضمان سلاسة المواعيد",
    "الاستفادة من خدمات المختبر المعتمد والتشخيص الطبي المتكامل",
    "الحصول على تقرير طبي شامل عقب إتمام الفحص",
  ] : [
    "Access top specialists in Cardiology, Gastroenterology, and more",
    "Enjoy elegant, private executive suites",
    "Benefit from a dedicated Executive Coordinator for seamless scheduling",
    "Utilize our accredited laboratory and diagnostic services",
    "Receive a comprehensive medical report after your assessment",
  ];
  const whatToBring = isAr ? [
    "قائمة الأدوية الحالية أو عيّنات منها",
    "السجلات الطبية السابقة ونتائج التحاليل",
    "بيانات التواصل مع الطبيب المُحيل",
  ] : [
    "Current medication list or samples",
    "Previous medical records and lab results",
    "Contact details of your referring physician",
  ];
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        {fromBookAppointment && (
          <div className="container mx-auto px-6 pt-4">
            <button
              type="button"
              onClick={() => navigate("/book-appointment")}
              className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAr ? "العودة لحجز الموعد" : "Back to book appointment"}
            </button>
          </div>
        )}
        {!fromBookAppointment && showNavigationBack && (
          <div className="container mx-auto px-6 pt-4">{navigationBackButton}</div>
        )}
        <div className="pt-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="bg-primary py-16 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-3">
              {isAr ? "تم إرسال طلب الانضمام!" : "Enrollment Submitted!"}
            </h1>
            <p className="text-primary-foreground/70 font-body text-sm max-w-md mx-auto px-6">
              {isAr ? "شكراً لاهتمامك ببرنامج الصفوة. سنتواصل معك خلال 24 ساعة لتنسيق تقييمك الصحي الشخصي." : "Thank you for your interest in the Al Safwa Program. We will contact you within 24 hours to coordinate your personal health assessment."}
            </p>
          </motion.div>
          <div className="container mx-auto px-6 py-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-popover rounded-2xl border border-border p-8 mb-6 shadow-sm -mt-8">
              <h3 className="font-serif text-lg text-foreground mb-4">{isAr ? "ماذا يحدث بعد ذلك؟" : "What Happens Next?"}</h3>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p>{isAr ? "سيقوم فريق الصفوة بمراجعة ملفك الشخصي الأولي." : "The Al Safwa team will review your initial medical snapshot."}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p>{isAr ? "سيتصل بك المنسق الخاص لتحديد موعد زيارتك الأولى." : "An Executive Coordinator will call you to schedule your first comprehensive visit."}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p>{isAr ? "ستتلقى رسالة تأكيد رسمية عبر البريد الإلكتروني مع تفاصيل الموعد." : "You will receive a formal confirmation email with appointment details and preparations."}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-accent/5 rounded-2xl border border-accent/20 p-8 mb-8 text-center">
              <h3 className="font-serif text-lg text-foreground mb-2">{isAr ? "هل لديك أسئلة فورية؟" : "Have Urgent Questions?"}</h3>
              <p className="text-muted-foreground font-body text-sm mb-4">
                {isAr ? "يمكنك الاتصال بخط الصفوة المخصص للحصول على المساعدة المباشرة." : "You can call our dedicated Al Safwa line for direct assistance."}
              </p>
              <div className="text-primary font-serif text-xl">+965 2536 0123</div>
            </motion.div>
            <div className="text-center">
              <button onClick={() => window.location.href = "/"}
                className="bg-primary text-primary-foreground px-10 py-3.5 rounded-full font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                {t("backToHome")}
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      {}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          {fromBookAppointment && (
            <button
              type="button"
              onClick={() => navigate("/book-appointment")}
              className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAr ? "العودة لحجز الموعد" : "Back to book appointment"}
            </button>
          )}
          {!fromBookAppointment && navigationBackButton}
          <ScrollAnimationWrapper>
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-accent" />
              </div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("eliteHealthcare")}</p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">{t("alSafwaProgram")}</h1>
              <p className="text-muted-foreground font-body text-base leading-relaxed">
                {isAr
                  ? "في عالمنا المتسارع اليوم، كثيراً ما تتراجع الصحة أمام ضغوط الحياة اليومية. يقدم برنامج الصفوة في مستشفى رويال حياة رعاية طبية مميزة، مصممة لتندمج بسلاسة مع نمط حياتك المشغول."
                  : "In today's fast-paced world, health can often take a backseat. The Al Safwa Program at Royale Hayat Hospital offers elite medical care designed to fit seamlessly into your busy lifestyle."}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">{isAr ? "نظرة عامة على البرنامج" : "Program Overview"}</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {isAr
                    ? "تحكّم في صحتك بكل يسر وسهولة من خلال برنامجنا المخصص. سجّل اشتراكك بملء استمارة تسجيل سريعة تتضمن لمحة عن تاريخك الطبي ونمط حياتك، وسيتولى فريقنا المتخصص وضع خطة رعاية صحية مخصصة تلبي احتياجاتك."
                    : "Take control of your health effortlessly with our personalized program. Enrol by completing a quick registration form, providing a snapshot of your medical history and lifestyle. Our team will craft a customized care plan just for you."}
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "أهداف البرنامج" : "Objectives"}</h2>
            </div>
          </ScrollAnimationWrapper>
          <div className="grid gap-4 ml-16">
            {objectives.map((obj, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "مميزات البرنامج" : "Features"}</h2>
            </div>
          </ScrollAnimationWrapper>
          <div className="grid gap-4 ml-16">
            {features.map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">{isAr ? "الاستعداد لزيارتك" : "Preparing for Your Visit"}</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {isAr
                    ? "لضمان دقة النتائج، يُرجى الصيام لمدة اثنتي عشرة ساعة قبل الزيارة، واستشارة طبيبك بشأن الأدوية التي تتناولها. نوصي بالحضور مبكراً لإتمام إجراءات التسجيل والاسترخاء في جناحك."
                    : "To ensure accurate results, please fast for 12 hours before, and consult your doctor about medications. Arrive early to complete registration and relax in your executive suite."}
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimationWrapper>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "ما يجب إحضاره" : "What to Bring"}</h2>
            </div>
          </ScrollAnimationWrapper>
          <div className="grid gap-4 ml-16">
            {whatToBring.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
                <UserPlus className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{isAr ? "سجّل اليوم" : "Register Today"}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
                {isAr
                  ? "انضم إلى برنامج الصفوة اليوم وأعِد الأولوية لصحتك، في أجواء من الرقي والسهولة."
                  : "Enrol today to join the Al Safwa Program and prioritize your health with luxury and ease."}
              </p>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-body text-sm tracking-wide hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                {isAr ? "سجّل الآن" : "Enroll Now"}
              </button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <EnrollmentModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        t={t}
        isAr={isAr}
        onSuccess={() => setIsSubmitted(true)}
      />
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default AlSafwaProgram;
