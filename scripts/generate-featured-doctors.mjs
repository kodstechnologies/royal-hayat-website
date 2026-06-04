import { writeFileSync } from "fs";
import { getFeaturedDoctors } from "../src/data/doctors.ts";
const pick = (d) => ({
  id: d.id,
  name: d.name,
  nameAr: d.nameAr,
  specialty: d.specialty,
  specialtyAr: d.specialtyAr,
  department: d.department,
  departmentAr: d.departmentAr,
  title: d.title,
  titleAr: d.titleAr,
  initials: d.initials,
  color: d.color,
  image: d.image,
  availableOnline: d.availableOnline,
  hideBooking: d.hideBooking,
});
const list = getFeaturedDoctors(12).map(pick);
const body = `import type { Doctor } from "./doctors";
export const featuredDoctors: Doctor[] = ${JSON.stringify(list, null, 2)};
`;
writeFileSync(new URL("../src/data/featuredDoctors.ts", import.meta.url), body);
console.log("featuredDoctors.ts:", list.length, "doctors");
