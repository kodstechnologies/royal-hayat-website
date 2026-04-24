import galaPhoto from "@/assets/gaala/DSC08131.jpg";
import galaPhoto2 from "@/assets/gaala/DSC08140.jpg";  // https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927275/DSC08789_jchzn4.jpg
import galaPhoto3 from "@/assets/gaala/DSC08608.jpg";  // https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927267/DSC08760_co7jbw.jpg
import galaPhoto4 from "@/assets/gaala/DSC08615.jpg";  // https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927266/DSC08758_rtqu6e.jpg
import type { LifePhoto } from "@/components/LifePhotoCarousel";

/**
 * Photo galleries for "Life at Royale Hayat Hospital".
 *
 * NOTE for content team:
 * Only one source photo (gala-1.jpg) was provided so far. It is used as the first
 * card in every gallery as a visible sample. The remaining slots are placeholders
 * showing the alt label and slot number — drop the new images into
 * `src/assets/life/<event>-<n>.jpg` and replace the ma tching `src` below.
 */

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
