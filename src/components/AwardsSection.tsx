import { useState, useEffect } from "react";
import { Award, Shield, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

import diamondAward from "@/assets/awards/diamond-award.png";
import capAccredited from "@/assets/awards/cap-accredited.png";
import pccAward from "@/assets/awards/pcc-award.png";
import serviceHero from "@/assets/awards/service-hero-16th.png";

const awards = [
  { image: serviceHero, name: "16th Service Hero Award", nameAr: "جائزة بطل الخدمة السادسة عشرة", year: "2010–2025", source: "Best Hospital in Kuwait", sourceAr: "مؤشر بطل الخدمة", desc: "Best Hospital in Kuwait for 16 consecutive years.", descAr: "أفضل مستشفى في الكويت لمدة 16 عامًا متتاليًا.", stat: "16", statLabel: "Consecutive Years", statLabelAr: "سنة متتالية" },
  { image: diamondAward, name: "Diamond Canadian Accreditation", nameAr: "اعتماد الماس الكندي", year: "2023", source: "Accreditation Canada", sourceAr: "اعتماد كندا", desc: "Highest level of excellence in patient safety and quality.", descAr: "أعلى مستوى من التميز في سلامة المرضى والجودة.", stat: "Diamond", statLabel: "Tier Level", statLabelAr: "مستوى التميز" },
  { image: capAccredited, name: "Lab CAP Accreditation", nameAr: "اعتماد CAP للمختبر", year: "2024", source: "College of American Pathologists", sourceAr: "كلية علماء الأمراض الأمريكية", desc: "Accredited 8 times in a row — gold standard in laboratory quality.", descAr: "معتمد 8 مرات متتالية — المعيار الذهبي في جودة المختبرات.", stat: "8×", statLabel: "Consecutive Accreditations", statLabelAr: "اعتمادات متتالية" },
  { image: pccAward, name: "People-Centered Care Commitment Award", nameAr: "جائزة الالتزام بالرعاية المتمحورة حول الإنسان", year: "2025", source: "Accreditation Canada", sourceAr: "اعتماد كندا", desc: "Commitment to patient-centred care excellence.", descAr: "الالتزام بالتميز في الرعاية المتمحورة حول المريض.", stat: "2025", statLabel: "Latest Recognition", statLabelAr: "أحدث تقدير" },
];

const AwardsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((p) => (p + 1) % awards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setActiveIndex((p) => (p + 1) % awards.length);
  const prev = () => setActiveIndex((p) => (p - 1 + awards.length) % awards.length);

  const featured = awards[activeIndex];
  const otherAwards = awards.filter((_, i) => i !== activeIndex);

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <div className="w-10 h-0.5 bg-[#D8B656] mx-auto mb-3" />
            <p className="text-[#D8B656] text-xs tracking-[0.3em] uppercase font-body mb-2">{t("recognition")}</p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary-foreground">
              {t("certificatesAwards")} <span className="text-[#D8B656] italic">{t("awards")}</span>
            </h2>
          </div>
        </ScrollAnimationWrapper>

        <div className="relative flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-stretch">
          {/* Featured award — larger with bigger image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35 }}
              className="lg:w-[420px] min-h-[450px] md:min-h-[520px] bg-white/10 backdrop-blur-sm border border-secondary/15 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center flex-shrink-0"
            >
              <div className="w-40 h-40 md:w-64 md:h-64 rounded-xl bg-white flex items-center justify-center mb-5 p-4 md:p-5">
                <img src={featured.image} alt={featured.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#D8B656]/20 text-[#D8B656] text-xs font-body tracking-wider mb-3">
                {featured.year}
              </span>
              <h3 className="text-lg md:text-xl font-serif text-white mb-2">
                {lang === "ar" ? featured.nameAr : featured.name}
              </h3>
              {featured.source && (
                <p className="text-[#D8B656] font-body text-sm mb-2">
                  {lang === "ar" ? featured.sourceAr : featured.source}
                </p>
              )}
              <p className="text-white/70 font-body text-sm leading-relaxed">
                {lang === "ar" ? featured.descAr : featured.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Right side: awards grid + stats row filling space */}
          <div className="flex-1 flex flex-col gap-4 md:gap-5">
            {/* Awards grid — responsive: 1 col on mobile, 3 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 flex-1">
              {otherAwards.map((a, i) => (
                <ScrollAnimationWrapper key={a.name + i} delay={i * 0.05} className="h-full">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => setActiveIndex(awards.indexOf(a))}
                    className="bg-white/8 backdrop-blur-sm border border-secondary/10 rounded-xl p-4 md:p-5 hover:border-[#D8B656]/30 transition-all cursor-pointer h-full flex flex-row sm:flex-col items-center sm:justify-center text-center gap-4 sm:gap-0"
                  >
                    <div className="w-20 h-20 sm:w-44 sm:h-44 rounded-lg bg-white flex items-center justify-center sm:mb-4 p-3 sm:p-4 flex-shrink-0">
                      <img src={a.image} alt={a.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif text-white mb-1 leading-snug text-left sm:text-center">
                        {lang === "ar" ? a.nameAr : a.name}
                      </h4>
                      <p className="text-white/50 font-body text-xs text-left sm:text-center">{a.year}</p>
                    </div>
                  </motion.div>
                </ScrollAnimationWrapper>
              ))}
            </div>

            {/* Stats strip filling the bottom space */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {otherAwards.map((a, i) => {
                const icons = [Shield, Award, Star];
                const Icon = icons[i % icons.length];
                return (
                  <motion.div
                    key={`stat-${a.name}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-[#D8B656]/10 border border-[#D8B656]/20 rounded-xl px-4 py-3 md:py-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#D8B656]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#D8B656]" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-serif text-lg leading-tight">{a.stat}</p>
                      <p className="text-white/50 font-body text-[10px] leading-tight">
                        {lang === "ar" ? a.statLabelAr : a.statLabel}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="flex gap-1.5">
            {awards.map((_, i) => (
              <button key={i} onClick={() => setActiveIndex(i)} className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#D8B656] w-7" : "bg-white/20 w-2 hover:bg-white/40"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
