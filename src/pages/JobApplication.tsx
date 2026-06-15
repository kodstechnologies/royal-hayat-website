import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Share2, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getAllJobs, getJobById, applyForJob, type JobPosting } from "@/api/job";
import { localizeJobPosting } from "@/lib/jobLocale";

// ── Static fallback positions (same as WorkWithUs) ────────────────────────────
const staticPositions: JobPosting[] = [
  { title: "Floor Coordinator only Female, Bilingual (Arabic & English)", category: "Hospitality / Guest Services", location: "Royale Hayat Hospital", type: "Full-time", date: "March 19, 2026", desc: "Royale Hayat Hospital have devoted considerable effort to applying established strategies for quality improvement thus they created a position of Floor coordinator that make patient experience more valuable and focusing on patient satisfaction in the inpatient setting and how to improve it.", responsibilities: ["To ensure a differences and service recovery every day with every patient throughout his or her hospitalization.", "Positive outcomes of stay.", "Improved quality outcomes, and patient satisfaction which may help transform the acute care delivery model toward a more rational and safe approach.", "Coordinate floor operations and ensure smooth patient flow", "Liaise between departments to resolve patient concerns"], requirements: ["Bilingual proficiency in Arabic and English (mandatory)", "Female candidates only", "Minimum 2 years of experience in hospitality or healthcare coordination", "Excellent communication and organizational skills"] },
  { title: "Guest Relations Officer", category: "Hospitality / Guest Services", location: "Royale Hayat Hospital", type: "Full-time", date: "March 15, 2026", desc: "Provide outstanding hospitality and patient experience throughout the hospital premises.", responsibilities: ["Welcome and assist patients and visitors", "Handle complaints and feedback professionally", "Coordinate with departments for patient needs", "Maintain guest satisfaction records"], requirements: ["Experience in hospitality or guest relations", "Excellent interpersonal skills", "Bilingual preferred", "Professional appearance and demeanor"] },
  { title: "Marketing Specialist – Digital & Social Media", category: "Marketing & Communications", location: "Royale Hayat Hospital", type: "Full-time", date: "March 10, 2026", desc: "Drive digital marketing campaigns, manage social media channels, and enhance brand visibility for the hospital.", responsibilities: ["Plan and execute digital marketing campaigns", "Manage hospital social media accounts", "Analyze campaign performance metrics", "Create engaging content for various platforms"], requirements: ["Bachelor's degree in Marketing or related field", "3+ years of digital marketing experience", "Proficiency in social media management tools", "Strong analytical and creative skills"] },
  { title: "Registered Nurse – ICU", category: "Nursing Support", location: "Royale Hayat Hospital", type: "Full-time", date: "March 5, 2026", desc: "Provide critical care nursing in the Intensive Care Unit with advanced monitoring and patient assessment skills.", responsibilities: ["Monitor critically ill patients continuously", "Administer medications and treatments as prescribed", "Collaborate with medical team on patient care plans", "Maintain accurate patient documentation"], requirements: ["Valid nursing license", "ICU experience minimum 3 years", "BLS and ACLS certification", "Strong clinical assessment skills"] },
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
  const jobParam = searchParams.get("jobId") ?? searchParams.get("job") ?? "0";
  const isAr = lang === "ar";

  const [jobRecord, setJobRecord] = useState<JobPosting | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState(false);

  const displayJob = useMemo(
    () => (jobRecord ? localizeJobPosting(jobRecord, isAr) : null),
    [jobRecord, isAr],
  );

  const [showForm, setShowForm] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const load = async () => {
      setJobLoading(true);
      setJobError(false);

      // jobParam is either a MongoDB _id (24-char hex) or a numeric index
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(jobParam);

      if (isMongoId) {
        try {
          const data = (await getJobById(jobParam)) as JobPosting | null;
          if (data) {
            setJobRecord(data);
            setJobLoading(false);
            return;
          }
        } catch {
          setJobError(true);
          setJobRecord(null);
          setJobLoading(false);
          return;
        }
      }

      // Numeric index — try fetching all jobs and picking by index
      const numericIndex = parseInt(jobParam, 10);
      try {
        const apiJobs = await getAllJobs({ isActive: true, limit: 100 });
        if (apiJobs.length > 0 && !isNaN(numericIndex) && apiJobs[numericIndex]) {
          setJobRecord(apiJobs[numericIndex]);
          setJobLoading(false);
          return;
        }
      } catch {
        // fall through
      }

      // Final fallback: static list by numeric index
      const idx = isNaN(numericIndex) ? 0 : Math.min(numericIndex, staticPositions.length - 1);
      setJobRecord(staticPositions[idx] ?? staticPositions[0]);
      setJobLoading(false);
    };

    void load();
  }, [jobParam]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRecord) return;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields",
      });
      return;
    }

    if (!resumeFile) {
      toast({ title: isAr ? "يرجى رفع السيرة الذاتية" : "Please upload your resume" });
      return;
    }

    const jobMongoId = jobRecord._id;
    const isMongoId = jobMongoId && /^[0-9a-fA-F]{24}$/.test(String(jobMongoId));

    if (!isMongoId) {
      toast({
        title: isAr ? "خطأ" : "Error",
        description: isAr
          ? "تعذر ربط هذا الإعلان بالنظام. يرجى المحاولة من صفحة الوظائف."
          : "This posting could not be linked to an active job. Please apply from the careers page.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await applyForJob({
        jobId: String(jobMongoId),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        coverLetter: coverLetter.trim(),
        resume: resumeFile,
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
      setResumeFile(null);
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
    if (!displayJob) return;
    if (navigator.share) {
      navigator.share({ title: displayJob.title, url: window.location.href });
    } else {
      void navigator.clipboard.writeText(window.location.href);
      toast({ title: isAr ? "تم نسخ الرابط" : "Link Copied" });
    }
  };
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-2 text-sm font-body mb-8">
            <Link to="/" className="text-primary hover:text-accent transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              to="/work-with-us?section=positions"
              className="text-primary hover:text-accent transition-colors"
            >
              {isAr ? "الوظائف" : "Careers"}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{isAr ? "تقديم" : "Apply"}</span>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {jobLoading ? (
              <div className="lg:col-span-3 flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : jobError || !displayJob ? (
              <div className="lg:col-span-3 text-center py-16">
                <p className="font-body text-muted-foreground">
                  {isAr ? "تعذر تحميل الوظيفة." : "Could not load this job posting."}
                </p>
                <Link
                  to="/work-with-us?section=positions"
                  className="text-primary hover:text-accent font-body text-sm underline underline-offset-4 inline-block mt-4"
                >
                  {isAr ? "العودة إلى الوظائف" : "Back to Careers"}
                </Link>
              </div>
            ) : (
              <>
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-6 uppercase leading-tight">{displayJob.title}</h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-8 text-justify">{displayJob.desc}</p>
              <Link to="/work-with-us?section=positions" className="text-primary hover:text-accent font-body text-sm underline underline-offset-4 inline-block mb-10">
                {isAr ? "عرض جميع الوظائف المتاحة" : "View All open positions"}
              </Link>
              <div className="mb-8">
                <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-4">{isAr ? "المهام والمسؤوليات" : "Duties and Responsibilities"}</h2>
                <ul className="space-y-3">
                  {displayJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                      <span className="text-foreground mt-0.5">•</span>
                      <span className="text-justify">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-8">
                <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-4">{isAr ? "المتطلبات" : "Requirements"}</h2>
                <ul className="space-y-3">
                  {displayJob.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                      <span className="text-foreground mt-0.5">•</span>
                      <span className="text-justify">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
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
              <div className="bg-popover border border-border/50 rounded-2xl p-6 space-y-5">
                <p className="font-serif text-lg text-foreground">{displayJob.postedDate ?? ""}</p>
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "الموقع" : "Location"}</p>
                  <p className="font-body text-sm text-muted-foreground">{displayJob.location}</p>
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "نوع العمل" : "Work Type"}</p>
                  <p className="font-body text-sm text-muted-foreground">{displayJob.type}</p>
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-foreground font-semibold mb-1">{isAr ? "التصنيف" : "Classification"}</p>
                  <p className="font-body text-sm text-muted-foreground">{displayJob.category}</p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
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
                  <Input id="cv" type="file" required accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">{isAr ? "PDF, DOC, DOCX" : "Accepted: PDF, DOC, DOCX"}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">{isAr ? "خطاب التقديم (اختياري)" : "Cover Letter (Optional)"}</Label>
                  <Textarea id="coverLetter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder={isAr ? "اكتب خطاب التقديم هنا..." : "Write your cover letter here..."} rows={5} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !jobRecord}>
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
