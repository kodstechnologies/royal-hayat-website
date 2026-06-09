import { writeFileSync } from "fs";
import { doctors } from "../src/data/doctors.ts";

const index = doctors.map((d) => ({
  id: d.id,
  name: d.name,
  nameAr: d.nameAr,
  specialty: d.specialty,
  specialtyAr: d.specialtyAr,
}));

const contents = `export type DoctorSearchIndexEntry = {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
};

export const doctorSearchIndex: DoctorSearchIndexEntry[] = ${JSON.stringify(index, null, 2)};
`;

writeFileSync(new URL("../src/data/doctorsSearchIndex.ts", import.meta.url), contents);
console.log(`Generated ${index.length} doctor search index entries`);
