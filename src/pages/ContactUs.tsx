import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import axios from "axios";
import { postEnquiry } from "@/api/enquiry";

const ContactUs = () => {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", department: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    "Obstetrics & Gynecology", "Pediatrics", "Internal Medicine", "Cardiology",
    "Orthopedics", "Dermatology", "Ophthalmology", "ENT", "Neurology",
    "General Surgery", "Pulmonology", "Gastroenterology", "General Inquiry"
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = lang === "ar" ? "الاسم مطلوب" : "Full name is required";
    if (!form.email.trim()) e.email = lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lang === "ar" ? "بريد إلكتروني غير صحيح" : "Enter a valid email";
    if (!form.phone.trim()) e.phone = lang === "ar" ? "رقم الهاتف مطلوب" : "Phone is required";
    if (!form.message.trim()) e.message = lang === "ar" ? "الرسالة مطلوبة" : "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await postEnquiry(form);
      setSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", department: "", message: "" });
      toast.success(lang === "ar" ? "تم إرسال رسالتك بنجاح." : "Your message has been sent successfully.");
    } catch (error) {
      const backendMessage =
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.response?.data?.error || error.message
          : null;

      toast.error(
        backendMessage ||
        (lang === "ar" ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Failed to send message. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <div className="bg-primary py-14 text-center">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-serif text-primary-foreground mb-3">
          {lang === "ar" ? "تواصل معنا" : "Contact Us"}
        </motion.h1>
        <p className="text-primary-foreground/70 font-body text-sm max-w-lg mx-auto">
          {lang === "ar" ? "أي أسئلة؟ يسعدنا مساعدتك!" : "Any questions? We would be happy to help you!"}
        </p>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-serif text-foreground mb-6">
              {lang === "ar" ? "تواصل معنا" : "Get In Touch"}
            </motion.h2>

            {/* Hotline */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-popover rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <p className="font-body text-xs text-accent uppercase tracking-wider">
                      {lang === "ar" ? "خط المستشفى الساخن على مدار الساعة" : "24/7 Hospital Hotline"}
                    </p>
                  </div>
                  <a href="tel:+96525360000" className="text-xl font-serif text-foreground hover:text-primary transition-colors" dir="ltr">
                    +965 25360000
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-popover rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === "ar" ? "البريد الإلكتروني" : "Mail"}
                  </p>
                  <a href="mailto:info@royalehayat.com" className="text-lg font-serif text-foreground hover:text-primary transition-colors">
                    info@royalehayat.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-popover rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === "ar" ? "عنواننا" : "Our Address"}
                  </p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {lang === "ar"
                      ? "مستشفى رويال حياة، ص.ب. 179، حولي 32002، حولي، الكويت."
                      : "Royale Hayat Hospital P.O. Box 179, Hawalli 32002, Hawalli, Kuwait."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl overflow-hidden border border-border h-[250px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.159!2d48.0469!3d29.3375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c7600000001%3A0x1234567890abcdef!2sRoyale%20Hayat%20Hospital!5e0!3m2!1sen!2skw!4v1700000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Royale Hayat Hospital Location"
              />
            </motion.div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm sticky top-24">
              {submitted ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-serif text-foreground mb-2">
                    {lang === "ar" ? "تم إرسال رسالتك!" : "Message Sent!"}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mb-4">
                    {lang === "ar" ? "سنتواصل معك في أقرب وقت ممكن." : "We'll get back to you as soon as possible."}
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", department: "", message: "" }); }}
                    className="font-body text-sm text-primary hover:text-primary/80 transition-colors underline">
                    {lang === "ar" ? "إرسال رسالة أخرى" : "Send another message"}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-serif text-foreground mb-1">
                    {lang === "ar" ? "أرسل لنا رسالة" : "Write Us A Message"}
                  </h2>
                  <p className="text-muted-foreground font-body text-xs mb-6">
                    {lang === "ar" ? "املأ النموذج أدناه وسنرد عليك قريباً" : "Fill the form below and we'll respond shortly"}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-destructive">*</span>
                      </label>
                      <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder={lang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                        className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.fullName ? "border-destructive" : "border-border"}`} />
                      {errors.fullName && <p className="font-body text-xs text-destructive mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {lang === "ar" ? "البريد الإلكتروني" : "Email"} <span className="text-destructive">*</span>
                      </label>
                      <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)}
                        placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                        className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.email ? "border-destructive" : "border-border"}`} />
                      {errors.email && <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {lang === "ar" ? "الهاتف" : "Phone"}
                      </label>
                      <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder={lang === "ar" ? "رقم الهاتف" : "Phone number"}
                        className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.phone ? "border-destructive" : "border-border"}`} />
                      {errors.phone && <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {lang === "ar" ? "القسم" : "Department"}
                      </label>
                      <select value={form.department} onChange={(e) => updateField("department", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30">
                        <option value="">{lang === "ar" ? "اختر القسم" : "Select Department"}</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {lang === "ar" ? "الرسالة" : "Message"} <span className="text-destructive">*</span>
                      </label>
                      <textarea value={form.message} onChange={(e) => updateField("message", e.target.value)}
                        placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Type your message here..."}
                        className={`w-full h-28 px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 ${errors.message ? "border-destructive" : "border-border"}`} />
                      {errors.message && <p className="font-body text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={isSubmitting}
                    className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {isSubmitting ? (lang === "ar" ? "جارٍ الإرسال..." : "Sending...") : (lang === "ar" ? "إرسال" : "Send")}
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default ContactUs;
