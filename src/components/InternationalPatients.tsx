import { Globe, Plane, Phone, Shield, LogIn, UserPlus } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const InternationalPatients = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();
  const features = [
    { icon: Plane, titleKey: "travelCoordination", descKey: "travelCoordinationDesc" },
    { icon: Phone, titleKey: "concierge247", descKey: "concierge247Desc" },
    { icon: Shield, titleKey: "insuranceLiaison", descKey: "insuranceLiaisonDesc" },
  ];
  return (
    <section className="py-16 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-2">{t("welcomeWorldwide")}</p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">{t("internationalPatientsTitle")}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 max-w-lg">{t("internationalPatientsDesc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {features.map((f, i) => (
                  <motion.div key={f.titleKey} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="bg-popover rounded-xl p-4 border border-border/50">
                    <f.icon className="w-5 h-5 text-accent mb-2" />
                    <h4 className="font-serif text-sm text-foreground mb-1">{t(f.titleKey)}</h4>
                    <p className="font-body text-xs text-muted-foreground">{t(f.descKey)}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-body text-xs tracking-wider uppercase hover:bg-primary/90 transition-all duration-300">
                  <LogIn className="w-4 h-4" />
                  {t("patientLoginBtn")}
                </button>
                <button className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-lg font-body text-xs tracking-wider uppercase hover:bg-secondary/30 transition-all duration-300">
                  <UserPlus className="w-4 h-4" />
                  {t("registerBtn")}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default InternationalPatients;
