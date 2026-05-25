import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const files = [
  {
    titleKey: "birthing_packages",
    file: "/downloads/Birthing-Packages-for-Royale-Orchid-and-Orchid-Patients.pdf",
    type: "PDF",
  },
  {
    titleKey: "insurance_lightbox",
    file: "/downloads/RHH_Insurance_Lightbox_poster_Report.txt",
    type: "TXT",
  },
];

const Downloads = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-14">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("forOurPatients")}</p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t("downloadsTitle")}</h1>
              <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">{t("downloadsDesc")}</p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {files.map((f, i) => (
              <motion.a
                key={f.titleKey}
                href={f.file}
                download
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-popover border border-border/50 rounded-2xl p-6 flex items-start gap-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base text-foreground mb-1">{t(f.titleKey)}</h3>
                  <p className="font-body text-xs text-muted-foreground">{f.type}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                  <Download className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Downloads;
