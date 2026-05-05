import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import DepartmentsSection from "@/components/DepartmentsSection";
import { getCatagoriesWithDepartmentsAndDoctors } from "@/api/catagory";
import { getDoctorsBySubspeciality } from "@/api/doctors";
import {
  type MedicalCategoryGroup,
  mapCategoriesToGroupedMedicalDepartments,
} from "@/utils/mapMedicalCatalogFromApi";

type CatalogState =
  | { status: "loading" }
  | { status: "ok"; grouped: MedicalCategoryGroup[] }
  | { status: "error" };

const Departments = () => {
  const [catalogState, setCatalogState] = useState<CatalogState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const categories = await getCatagoriesWithDepartmentsAndDoctors();
        if (cancelled) return;
        const grouped = mapCategoriesToGroupedMedicalDepartments(categories);
        setCatalogState({ status: "ok", grouped });
      } catch {
        if (!cancelled) setCatalogState({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />
      <DepartmentsSection
        apiGroupedCatalog={
          catalogState.status === "ok"
            ? catalogState.grouped
            : catalogState.status === "error"
              ? []
              : undefined
        }
        apiCatalogLoading={catalogState.status === "loading"}
        disableStaticFallback
        catalogFetchFailed={catalogState.status === "error"}
        fetchDoctorsBySubspeciality={getDoctorsBySubspeciality}
      />
      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default Departments;
