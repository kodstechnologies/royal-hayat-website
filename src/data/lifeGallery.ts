import galaPhoto from "@/assets/gaala/DSC08131.jpg";
import galaPhoto2 from "@/assets/gaala/DSC08140.jpg";
import galaPhoto3 from "@/assets/gaala/DSC08608.jpg";
import galaPhoto4 from "@/assets/gaala/DSC08615.jpg";
import type { LifePhoto } from "@/components/LifePhotoCarousel";
const slot = (label: string, count: number, firstSrc?: string): LifePhoto[] =>
  Array.from({ length: count }).map((_, i) => ({
    src: i === 0 ? firstSrc : undefined,
    alt: `${label} — ${i + 1}`,
  }));
export const galleries = {
  galaDinner: [
    { src: galaPhoto, alt: "Gala Dinner — 1" },
    { src: galaPhoto2, alt: "Gala Dinner — 2" },
    { src: galaPhoto3, alt: "Gala Dinner — 3" },
    { src: galaPhoto4, alt: "Gala Dinner — 4" },
  ],
  hospitalityWeek: slot("Hospitality Week", 16, galaPhoto),
  rhhQuiz: slot("RHH Quiz", 12, galaPhoto),
  recognition: slot("Employee of the Month", 1, galaPhoto),
  staffActivities: slot("Volley Ball Tournament", 18, galaPhoto),
};
