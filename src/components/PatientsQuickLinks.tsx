import { Heart, ClipboardList, ShieldCheck, Bed, ScrollText, MapPin, Baby } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const PatientsQuickLinks = () => {
  const { t, lang } = useLanguage();

  const links = [
    { icon: Heart, label: t("nursing"), href: "/patients-visitors" },
    { icon: ClipboardList, label: t("admissionInfo"), href: "/patients-visitors" },
    { icon: ShieldCheck, label: t("healthInsurance"), href: "/patients-visitors" },
    { icon: Bed, label: t("duringYourStay"), href: "/patients-visitors" },
    { icon: Bed, label: lang === "ar" ? "باقات غرف الولادة" : "Birthing Room Packages", href: "/patients-visitors?tab=rooms-package" },
    { icon: ScrollText, label: t("patientBillOfRights"), href: "/patients-visitors" },
    { icon: MapPin, label: t("internationalPatient"), href: "/international-patient" },
    { icon: Baby, label: lang === "ar" ? "نظام أمان الرضّع" : "Infant Security", href: "/infant-security" },
  ];

  return (
    <section className="py-12 bg-secondary/10">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-8">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("forOurPatients")}</p>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t("patientsVisitors")}</h2>
          </div>
        </ScrollAnimationWrapper>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {links.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={l.href}
                className="flex flex-col items-center gap-3 bg-popover border border-border/50 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center h-full"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <l.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-body text-xs font-medium text-foreground">{l.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientsQuickLinks;
