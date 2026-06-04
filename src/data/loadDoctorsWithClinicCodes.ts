import type { DoctorWithClinicCode } from "./doctorsWithClinicCodes";

let cache: DoctorWithClinicCode[] | null = null;
let loadPromise: Promise<DoctorWithClinicCode[]> | null = null;

export async function loadDoctorsWithClinicCodes(): Promise<DoctorWithClinicCode[]> {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = import("./doctorsWithClinicCodes").then((mod) => {
      cache = mod.doctorsWithClinicCodes;
      return cache;
    });
  }
  return loadPromise;
}

export type { DoctorWithClinicCode } from "./doctorsWithClinicCodes";
