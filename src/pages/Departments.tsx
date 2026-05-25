import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import DepartmentsSection from "@/components/DepartmentsSection";

const Departments = () => {
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <DepartmentsSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Departments;
