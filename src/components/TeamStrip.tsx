import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
const teamMembers = [
  { initials: "MA", name: "Mohammed Al-Khaled" },
  { initials: "HA", name: "Dr. Hanan Al-Shammari" },
  { initials: "FR", name: "Fatima Al-Rashidi" },
  { initials: "KM", name: "Khalid Al-Mutairi" },
  { initials: "NA", name: "Noor Al-Ahmad" },
  { initials: "SA", name: "Dr. Salem Al-Dosari" },
];
const TeamStrip = () => {
  return (
    <section className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4">
          {teamMembers.map((m, i) => (
            <ScrollAnimationWrapper key={m.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3, scale: 1.03 }}
                className="flex items-center gap-3 bg-popover rounded-full px-5 py-3 border border-border/50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-body text-xs font-semibold">{m.initials}</span>
                </div>
                <span className="font-body text-sm text-foreground">{m.name}</span>
              </motion.div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TeamStrip;
