import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RUNTIME_PDF_GROUPS } from "@/data/runtimePdfUrls";
import RuntimePdfLink from "@/components/RuntimePdfLink";
import { buildRuntimePdfUrl } from "@/utils/buildRuntimePdfUrl";

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

          <div className="max-w-4xl mx-auto space-y-12">
            {RUNTIME_PDF_GROUPS.map((group, groupIndex) => (
              <ScrollAnimationWrapper key={group.id}>
                <div>
                  <h2 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border/50">
                    {group.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((pdf, i) => (
                      <motion.div
                        key={pdf.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (groupIndex * 0.05) + (i * 0.03) }}
                      >
                      <RuntimePdfLink
                        path={pdf.path}
                        className="bg-popover border border-border/50 rounded-2xl p-5 flex items-start gap-3 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm text-foreground mb-0.5 leading-snug">{pdf.label}</h3>
                          <p className="font-body text-xs text-muted-foreground truncate">{buildRuntimePdfUrl(pdf.path)}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                      </RuntimePdfLink>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollAnimationWrapper>
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
