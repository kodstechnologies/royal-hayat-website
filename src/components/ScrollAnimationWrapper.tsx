import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}
const directionMap = (dist: number) => ({
  up: { y: dist, x: 0 },
  down: { y: -dist, x: 0 },
  left: { x: dist, y: 0 },
  right: { x: -dist, y: 0 },
  none: { x: 0, y: 0 },
});
const ScrollAnimationWrapper = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 50,
}: ScrollAnimationWrapperProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const d = directionMap(distance)[direction];
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: d.x, y: d.y, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};
export default ScrollAnimationWrapper;
