import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsRow = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "19+", labelKey: "yearsOfExcellence" },
    { value: "86%", labelKey: "patientSatisfaction" },
    { value: "600+", labelKey: "specialistDoctors" },
    { value: "25+", labelKey: "departmentsLabel" },
  ];

  return (
    <section id="stats-row" className="py-16 bg-popover border-b border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollAnimationWrapper key={stat.labelKey} delay={i * 0.15}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-serif text-[#816107] mb-2">{stat.value}</p>
                <p className="text-xs tracking-[0.2em] uppercase font-body text-muted-foreground">{t(stat.labelKey)}</p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsRow;
