import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Globe, Phone, Calendar, Languages, Car, Hotel, UtensilsCrossed, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";

const InternationalPatient = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const services = [
    { icon: Calendar, label: isAr ? "جدولة المواعيد مع الأطباء" : "Appointment scheduling with physicians" },
    { icon: Globe, label: isAr ? "تنسيق عملية القبول" : "Coordination of the admissions process" },
    { icon: Languages, label: isAr ? "خدمات الترجمة بعدة لغات" : "Interpretation services in several languages" },
    { icon: Car, label: isAr ? "ترتيبات النقل بما في ذلك الاستقبال من المطار" : "Transportation arrangements including airport pickup" },
    { icon: Hotel, label: isAr ? "ترتيبات الإقامة طويلة وقصيرة المدى للمرضى وعائلاتهم" : "Long and short-term lodging arrangements for patients and their families" },
    { icon: Hotel, label: isAr ? "إقامة فاخرة متوفرة في المستشفى" : "Deluxe accommodations available at the hospital" },
    { icon: UtensilsCrossed, label: isAr ? "وجبات معدة خصيصاً عند الطلب" : "Specially prepared meals upon request" },
    { icon: Globe, label: isAr ? "خدمات الكونسيرج عند الطلب" : "Concierge services upon request" },
  ];

  const [form, setForm] = useState({
    firstName: "", lastName: "", mobile: "", email: "", address: "", country: "", comments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.mobile) {
      toast.error(isAr ? "يرجى ملء الحقول المطلوبة." : "Please fill in required fields.");
      return;
    }
    toast.success(isAr ? "تم إرسال الطلب وسنتواصل معك." : "Request sent and we will get back to you.");
    setForm({ firstName: "", lastName: "", mobile: "", email: "", address: "", country: "", comments: "" });
  };

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{isAr ? "مرحباً بالجميع" : "Welcome Worldwide"}</p>
            <h1 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-4">{isAr ? "مركز المرضى الدوليين" : "International Patient Center"}</h1>
            <p className="text-primary-foreground/80 font-body text-sm max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? "إن تفانينا في الرعاية الصحية الدولية ورعاية المرضى الدوليين يساعد في ترسيخ مكانتنا كأحد أفضل المستشفيات في الكويت."
                : "Our dedication to international health care and international patient care helps solidify us as one of the best hospitals in Kuwait."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-body text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "سيساعد مركز المرضى الدوليين المرضى في التفاصيل الإدارية مثل تحديد المواعيد والنقل والترتيبات المالية. يشمل مركزنا أيضاً مترجمين لتقديم خدمات الترجمة اللغوية."
                : "International Patient Center will assist patients with administrative details such as appointment setting, transportation, and financial arrangements. Our International Patient Center also includes interpreters to provide language interpretation services."}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-body text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "تبدأ رعاية المرضى الدوليين قبل وصولك إلى المستشفى وتستمر طوال فترة إقامتك. إن تفانينا في الرعاية الصحية الدولية يساعد في ترسيخ مكانتنا كأحد أفضل المستشفيات في الكويت."
                : "International patient care begins before you arrive at the hospital and lasts throughout your stay. Our dedication to international health care and international patient care helps solidify us as one of the best hospitals in Kuwait."}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-body text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "مركز المرضى الدوليين هو مكتب خدمات متكامل يساعد المرضى الدوليين والأطباء المحيلين الذين يبحثون عن استشارة أو رأي ثانٍ أو علاج لمرض معقد."
                : "International Patient Center is a full-service office that assists international patients and referring physicians looking for a consultation, a second opinion, or treatment for a complex illness."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-foreground mb-3 text-center">
              {isAr ? "كيف نساعدك" : "How We Help"}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-body text-sm text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              {isAr
                ? "يسهّل فريق مركز المرضى الدوليين تلقي الرعاية من خلال تنسيق الاحتياجات الطبية والشخصية التالية قبل وصولك وأثناء إقامتك:"
                : "The International Patient Center staff makes it easy to receive care by coordinating the following medical and personal needs for you before your arrival and during your stay:"}
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 bg-popover border border-border/50 rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-body text-sm text-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-xl mx-auto">
            <Phone className="w-6 h-6 text-accent mx-auto mb-3" />
            <p className="font-body text-sm text-foreground mb-1">{isAr ? "للحجز من خارج الكويت، يرجى الاتصال بـ:" : "For appointment from outside Kuwait, please call:"}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
              <a href="tel:+96525360555" className="font-serif text-lg text-accent hover:underline">+965 2536 0555</a>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <a href="tel:+96567668208" className="font-serif text-lg text-accent hover:underline">+965 6766 8208</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">{isAr ? "استفسار إلكتروني" : "Online Enquiry"}</h2>
              <p className="font-body text-sm text-muted-foreground text-center mb-8">{isAr ? "للاستفسارات عبر الإنترنت، يرجى ملء النموذج أدناه." : "For online enquiries, please fill in the form below."}</p>
            </motion.div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "الاسم الأول" : "First Name"} *</label>
                  <input type="text" value={form.firstName} onChange={e => handleChange("firstName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "اسم العائلة" : "Last Name"}</label>
                  <input type="text" value={form.lastName} onChange={e => handleChange("lastName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "الهاتف المحمول" : "Mobile"} *</label>
                <input type="tel" value={form.mobile} onChange={e => handleChange("mobile", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "البريد الإلكتروني" : "Email"} *</label>
                <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "العنوان" : "Address"}</label>
                <input type="text" value={form.address} onChange={e => handleChange("address", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "الدولة" : "Country"}</label>
                <input type="text" value={form.country} onChange={e => handleChange("country", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "التعليقات" : "Comments"}</label>
                <textarea rows={4} value={form.comments} onChange={e => handleChange("comments", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>

              <button type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300">
                <Send className="w-4 h-4" />
                {isAr ? "إرسال" : "Send"}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default InternationalPatient;
