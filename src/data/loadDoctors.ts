import type { Doctor } from "./doctors";
let cache: Doctor[] | null = null;
let loadPromise: Promise<Doctor[]> | null = null;
export async function loadDoctors(): Promise<Doctor[]> {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = import("./doctors").then((mod) => {
      cache = mod.doctors;
      return cache;
    });
  }
  return loadPromise;
}
export async function loadDoctorById(id: string): Promise<Doctor | undefined> {
  const list = await loadDoctors();
  return list.find((d) => d.id === id);
}
export type { Doctor } from "./doctors";
