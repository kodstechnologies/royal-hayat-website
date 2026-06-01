import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Share2, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { applyForJob, getJobById, type JobPosting } from "@/api/job";
const openPositions = [
  { title: "Floor Coordinator only Female, Bilingual (Arabic & English)", category: "Hospitality / Guest Services", location: "Royale Hayat Hospital", type: "Full-time", date: "March 19, 2026", desc: "Royale Hayat Hospital have devoted considerable effort to applying established strategies for quality improvement thus they created a position of Floor coordinator that make patient experience more valuable and focusing on patient satisfaction in the inpatient setting and how to improve it.", responsibilities: ["To ensure a differences and service recovery every day with every patient throughout his or her hospitalization.", "Positive outcomes of stay.", "Improved quality outcomes, and patient satisfaction which may help transform the acute care delivery model toward a more rational and safe approach.", "Coordinate floor operations and ensure smooth patient flow", "Liaise between departments to resolve patient concerns"], requirements: ["Bilingual proficiency in Arabic and English (mandatory)", "Female candidates only", "Minimum 2 years of experience in hospitality or healthcare coordination", "Excellent communication and organizational skills"] },
  { title: "Guest Relations Officer", category: "Hospitality / Guest Services", location: "Royale Hayat Hospital", type: "Full-time", date: "March 15, 2026", desc: "Provide outstanding hospitality and patient experience throughout the hospital premises.", responsibilities: ["Welcome and assist patients and visitors", "Handle complaints and feedback professionally", "Coordinate with departments for patient needs", "Maintain guest satisfaction records"], requirements: ["Experience in hospitality or guest relations", "Excellent interpersonal skills", "Bilingual preferred", "Professional appearance and demeanor"] },
  { title: "Marketing Specialist – Digital & Social Media", category: "Marketing & Communications", location: "Royale Hayat Hospital", type: "Full-time", date: "March 10, 2026", desc: "Drive digital marketing campaigns, manage social media channels, and enhance brand visibility for the hospital.", responsibilities: ["Plan and execute digital marketing campaigns", "Manage hospital social media accounts", "Analyze campaign performance metrics", "Create engaging content for various platforms"], requirements: ["Bachelor's degree in Marketing or related field", "3+ years of digital marketing experience", "Proficiency in social media management tools", "Strong analytical and creative skills"] },
  { title: "Content Writer – Arabic & English", category: "Marketing & Communications", location: "Royale Hayat Hospital", type: "Full-time", date: "March 8, 2026", desc: "Create compelling bilingual content for website, social media, press releases, and patient education materials.", responsibilities: ["Write bilingual content for multiple channels", "Edit and proofread marketing materials", "Research healthcare topics for accuracy", "Collaborate with design team on content projects"], requirements: ["Fluent in Arabic and English (written)", "Portfolio of published writing", "Healthcare content experience preferred", "Strong research and editing skills"] },
  { title: "Registered Nurse – ICU", category: "Nursing Support", location: "Royale Hayat Hospital", type: "Full-time", date: "March 5, 2026", desc: "Provide critical care nursing in the Intensive Care Unit with advanced monitoring and patient assessment skills.", responsibilities: ["Monitor critically ill patients continuously", "Administer medications and treatments as prescribed", "Collaborate with medical team on patient care plans", "Maintain accurate patient documentation"], requirements: ["Valid nursing license", "ICU experience minimum 3 years", "BLS and ACLS certification", "Strong clinical assessment skills"] },
  { title: "Registered Nurse – Labor & Delivery", category: "Nursing Support", location: "Royale Hayat Hospital", type: "Full-time", date: "March 3, 2026", desc: "Deliver compassionate care to mothers during labor, delivery, and postpartum recovery.", responsibilities: ["Monitor maternal and fetal well-being during labor", "Assist with deliveries and cesarean sections", "Provide postpartum care and education", "Support breastfeeding initiation"], requirements: ["Valid nursing license", "Labor and delivery experience", "Neonatal resuscitation certification", "Excellent patient communication skills"] },
  { title: "Nurse Manager – Surgical Ward", category: "Nursing Support", location: "Royale Hayat Hospital", type: "Full-time", date: "February 28, 2026", desc: "Lead and manage the surgical ward nursing team, ensuring high standards of patient care and safety.", responsibilities: ["Oversee daily nursing operations on the surgical ward", "Manage staffing schedules and assignments", "Ensure compliance with safety protocols", "Mentor and develop nursing staff"], requirements: ["BSN with valid nursing license", "5+ years surgical nursing experience", "Leadership or management experience", "Strong organizational skills"] },
  { title: "Quality Improvement Coordinator", category: "Quality & Patient Safety", location: "Royale Hayat Hospital", type: "Full-time", date: "February 25, 2026", desc: "Implement quality improvement initiatives and monitor patient safety indicators across departments.", responsibilities: ["Develop and implement quality improvement projects", "Collect and analyze patient safety data", "Conduct audits and compliance reviews", "Train staff on quality standards"], requirements: ["Healthcare quality certification preferred", "Experience in quality management", "Strong data analysis skills", "Knowledge of JCI/CBAHI standards"] },
  { title: "Patient Safety Officer", category: "Quality & Patient Safety", location: "Royale Hayat Hospital", type: "Full-time", date: "February 22, 2026", desc: "Oversee incident reporting, risk assessments, and safety protocols to ensure the highest standards of patient care.", responsibilities: ["Manage incident reporting system", "Conduct root cause analyses", "Develop safety improvement plans", "Coordinate safety training programs"], requirements: ["Clinical background preferred", "Patient safety certification", "Experience in risk management", "Strong analytical and reporting skills"] },
  { title: "Home Health Nurse", category: "Royale Home Health", location: "Field", type: "Full-time", date: "February 20, 2026", desc: "Provide professional nursing care to patients in their homes, including wound care, medication management, and health education.", responsibilities: ["Deliver nursing care in patient homes", "Assess patient health status regularly", "Educate patients and families on health management", "Coordinate with physicians on care plans"], requirements: ["Valid nursing license", "Home health experience preferred", "Valid driver's license", "Independent decision-making ability"] },
  { title: "Consultant Cardiologist", category: "Medical", location: "Royale Hayat Hospital", type: "Full-time", date: "February 18, 2026", desc: "Provide expert cardiac consultations, diagnostics, and treatment plans in a state-of-the-art cardiology department.", responsibilities: ["Conduct cardiac consultations and assessments", "Interpret diagnostic tests and imaging", "Develop comprehensive treatment plans", "Participate in multidisciplinary team meetings"], requirements: ["Board certification in Cardiology", "Fellowship training completed", "10+ years of clinical experience", "Research publications preferred"] },
  { title: "Specialist – Obstetrics & Gynecology", category: "Medical", location: "Royale Hayat Hospital", type: "Full-time", date: "February 15, 2026", desc: "Deliver comprehensive women's health services including prenatal care, high-risk pregnancies, and gynecological procedures.", responsibilities: ["Manage prenatal and postnatal care", "Perform gynecological procedures", "Handle high-risk pregnancy cases", "Provide women's health consultations"], requirements: ["Board certification in OB/GYN", "Minimum 5 years of specialist experience", "Surgical skills required", "Bilingual preferred"] },
  { title: "Pediatrician", category: "Medical", location: "Royale Hayat Hospital", type: "Full-time", date: "February 12, 2026", desc: "Provide expert medical care for infants, children, and adolescents in outpatient and inpatient settings.", responsibilities: ["Conduct pediatric examinations and assessments", "Diagnose and treat childhood illnesses", "Administer vaccinations and preventive care", "Guide parents on child health and development"], requirements: ["Board certification in Pediatrics", "Minimum 3 years of experience", "PALS certification", "Excellent communication with children and parents"] },
  { title: "Human Resources Coordinator", category: "Administrative", location: "Royale Hayat Hospital", type: "Full-time", date: "February 10, 2026", desc: "Support HR operations including recruitment, onboarding, employee relations, and benefits administration.", responsibilities: ["Coordinate recruitment and onboarding processes", "Manage employee records and documentation", "Assist with benefits administration", "Support employee relations activities"], requirements: ["Bachelor's degree in HR or related field", "2+ years HR experience", "Knowledge of labor laws", "Proficiency in HR information systems"] },
  { title: "Medical Records Specialist", category: "Administrative", location: "Royale Hayat Hospital", type: "Full-time", date: "February 8, 2026", desc: "Manage and maintain accurate medical records, ensuring compliance with healthcare regulations and standards.", responsibilities: ["Maintain and organize medical records", "Ensure compliance with privacy regulations", "Process record requests accurately", "Support audits and quality reviews"], requirements: ["Experience in medical records management", "Knowledge of healthcare regulations", "Attention to detail", "Proficiency in electronic health records"] },
];

const mapApiJobToDisplay = (apiJob: JobPosting) => ({
  title: apiJob.title,
  category: String(apiJob.classification ?? apiJob.category ?? apiJob.department ?? ""),
  location: apiJob.location ?? "",
  type: apiJob.type ?? "",
  date: apiJob.postedDate ?? apiJob.date ?? "",
  desc: apiJob.description ?? apiJob.desc ?? "",
  responsibilities: apiJob.responsibilities ?? [],
  requirements: apiJob.requirements ?? [],
});

const JobApplication = () => {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") ?? "";
  const jobIndex = parseInt(searchParams.get("job") || "0", 10);
  const fallbackJob = openPositions[jobIndex] || openPositions[0];
  const [job, setJob] = useState(fallbackJob);
  const isAr = lang === "ar";
  const [showForm, setShowForm] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    getJobById(jobId)
      .then((data) => {
        if (!cancelled && data) setJob(mapApiJobToDisplay(data as JobPosting));
      })
      .catch(() => {
        if (!cancelled) {
          toast({
            title: isAr ? "خطأ" : "Error",
            description: isAr ? "تعذر تحميل تفاصيل الوظيفة." : "Could not load job details.",
            variant: "destructive",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [jobId, isAr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) {
      toast({
        title: isAr ? "غير متاح" : "Unavailable",
        description: isAr
          ? "يرجى التقديم من صفحة الوظائف المتاحة."
          : "Please apply from the open positions page.",
        variant: "destructive",
      });
      return;
    }
    if (!cvFile) {
      toast({
        title: isAr ? "مطلوب" : "Required",
        description: isAr ? "يرجى رفع السيرة الذاتية." : "Please upload your CV.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await applyForJob({
        jobId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        coverLetter: coverLetter.trim() || undefined,
        cv: cvFile,
      });
      toast({
        title: isAr ? "تم إرسال الطلب" : "Application Submitted",
        description: isAr
          ? "شكراً لتقديم طلبك. سنتواصل معك قريباً."
          : "Thank you for your application. We will get back to you shortly.",
      });
      setShowForm(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setCvFile(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (isAr ? "تعذر إرسال الطلب. حاول مرة أخرى." : "Could not submit your application. Please try again.");
      toast({
        title: isAr ? "خطأ" : "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: isAr ? "تم نسخ الرابط" : "Link Copied" });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-body mb-8">
            <Link to="/" className="text-primary hover:text-accent transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/work-with-us?section=positions" className="text-primary hover:text-accent transition-colors">{isAr ? "الوظائف" : "Careers"}</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{isAr ? "تقديم" : "Apply"}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Job Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 uppercase leading-tight">{job.title}</h1>

              <p className="font-body text-base text-muted-foreground leading-relaxed mb-8 text-justify">{job.desc}</p>

              <Link to="/work-with-us?section=positions" className="text-primary hover:text-accent font-body text-sm underline underline-offset-4 inline-block mb-10">
                {isAr ? "عرض جميع الوظائف المتاحة" : "View All open positions"}
              </Link>

              {/* Duties */}
              <div className="mb-8">
                <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-4">{isAr ? "المهام والمسؤوليات" : "Duties and Responsibilities"}</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                      <span className="text-foreground mt-0.5">•</span>
                      <span className="text-justify">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-4">{isAr ? "المتطلبات" : "Requirements"}</h2>
                <ul className="space-y-3">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                      <span className="text-foreground mt-0.5">•</span>
                      <span className="text-justify">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={() => {
                  setShowForm(true);
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }} className="w-full gap-2 rounded-full py-6 text-sm tracking-wider uppercase">
                  <Mail className="w-4 h-4" />
                  {isAr ? "قدّم الآن" : "Apply Now"}
                </Button>
                <Button variant="outline" onClick={handleShare} className="w-full gap-2 rounded-full py-6 text-sm tracking-wider uppercase">
                  <Share2 className="w-4 h-4" />
                  {isAr ? "شارك الآن" : "Share Now"}
                </Button>
              </div>

              {/* Job Meta */}
              <div className="bg-popover border border-border/50 rounded-2xl p-6 space-y-5">
                <p className="font-serif text-lg text-foreground">{job.date}</p>

                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "الموقع" : "Location"}</p>
                  <p className="font-body text-sm text-muted-foreground">{job.location}</p>
                </div>

                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "نوع العمل" : "Work Type"}</p>
                  <p className="font-body text-sm text-muted-foreground">{job.type}</p>
                </div>

                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "التصنيف" : "Classification"}</p>
                  <p className="font-body text-sm text-muted-foreground">{job.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form (centered) */}
          {showForm && (
            <div
              ref={formRef}
              className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 mt-10 max-w-2xl mx-auto"
            >
              <h2 className="font-serif text-lg text-foreground mb-6 text-center">{isAr ? "نموذج التقديم" : "Application Form"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{isAr ? "الاسم الكامل" : "Full Name"} <span className="text-destructive">*</span></Label>
                  <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email"} <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email address"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-destructive">*</span></Label>
                  <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={isAr ? "أدخل رقم هاتفك" : "Enter your phone number"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cv">{isAr ? "السيرة الذاتية" : "Upload CV"} <span className="text-destructive">*</span></Label>
                  <Input id="cv" type="file" required accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">{isAr ? "PDF, DOC, DOCX" : "Accepted: PDF, DOC, DOCX"}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">{isAr ? "خطاب التقديم (اختياري)" : "Cover Letter (Optional)"}</Label>
                  <Textarea id="coverLetter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder={isAr ? "اكتب خطاب التقديم هنا..." : "Write your cover letter here..."} rows={5} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !jobId}>
                  {submitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : isAr ? "إرسال الطلب" : "Submit Application"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default JobApplication;
