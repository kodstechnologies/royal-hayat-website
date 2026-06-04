import type { DepartmentDetail } from "./departmentDetails";

let cache: DepartmentDetail[] | null = null;
let loadPromise: Promise<DepartmentDetail[]> | null = null;

export async function loadDepartmentDetails(): Promise<DepartmentDetail[]> {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = import("./departmentDetails").then((mod) => {
      cache = mod.departmentDetails;
      return cache;
    });
  }
  return loadPromise;
}

export type { DepartmentDetail, DepartmentDetailSection } from "./departmentDetails";
