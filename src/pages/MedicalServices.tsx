import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import DepartmentsSection from "@/components/DepartmentsSection";
import DoctorsSection from "@/components/DoctorsSection";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { featuredDoctors } from "@/data/featuredDoctors";
const HomeHealthPreview = () => {
  const { lang, t } = useLanguage();
  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-popover border border-border/50 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 md:text-left">
            <h3 className="font-serif text-xl text-foreground mb-2">
              {lang === "ar" ? "رويال هوم هيلث للرعاية المنزلية" : "Royale Home Health"}
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
              {lang === "ar"
                ? "نقدم رعاية طبية متميزة في راحة منزلك، تشمل التمريض المنزلي والعلاج الطبيعي والرعاية بعد العمليات الجراحية."
                : "We deliver premium medical care in the comfort of your home, including home nursing, physiotherapy, and post-surgical recovery care."}
            </p>
            <Link to="/home-health" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
              {t("learnMore")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
const MedicalServices = () => {
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />
      <DepartmentsSection />
      <DoctorsSection featuredDoctors={featuredDoctors} />
      <HomeHealthPreview />
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default MedicalServices;
