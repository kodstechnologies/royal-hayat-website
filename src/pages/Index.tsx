import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsRow from "@/components/StatsRow";
import StoryBlock from "@/components/StoryBlock";
import HomeBookingBlock from "@/components/HomeBookingBlock";
import SpecializedCare from "@/components/SpecializedCare";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LazyWhenInView, { sectionPlaceholder } from "@/components/LazyWhenInView";
const InsurancePartners = lazy(() => import("@/components/InsurancePartners"));
const DoctorsSection = lazy(() => import("@/components/DoctorsSection"));
const WhyRoyaleHayat = lazy(() => import("@/components/WhyRoyaleHayat"));
const HospitalityBanner = lazy(() => import("@/components/HospitalityBanner"));
const AlSafwaSpotlight = lazy(() => import("@/components/AlSafwaSpotlight"));
const AwardsSection = lazy(() => import("@/components/AwardsSection"));
const PatientsQuickLinks = lazy(() => import("@/components/PatientsQuickLinks"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] max-lg:pt-[var(--header-height,7.5rem)] [&_.text-accent]:text-[#816107]">
      <Header />
      <HeroSection />
      <StatsRow />
      <StoryBlock />
      <HomeBookingBlock />
      <SpecializedCare />
      <LazyWhenInView placeholder={sectionPlaceholder("min-h-[320px]")}>
        <Suspense fallback={sectionPlaceholder("min-h-[320px]")}>
          <InsurancePartners />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder("min-h-[480px]")}>
        <Suspense fallback={sectionPlaceholder("min-h-[480px]")}>
          <DoctorsSection />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder()}>
        <Suspense fallback={sectionPlaceholder()}>
          <WhyRoyaleHayat />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder()}>
        <Suspense fallback={sectionPlaceholder()}>
          <HospitalityBanner />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder()}>
        <Suspense fallback={sectionPlaceholder()}>
          <AlSafwaSpotlight />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder("min-h-[360px]")}>
        <Suspense fallback={sectionPlaceholder("min-h-[360px]")}>
          <AwardsSection />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder()}>
        <Suspense fallback={sectionPlaceholder()}>
          <PatientsQuickLinks />
        </Suspense>
      </LazyWhenInView>
      <LazyWhenInView placeholder={sectionPlaceholder("min-h-[400px]")}>
        <Suspense fallback={sectionPlaceholder("min-h-[400px]")}>
          <TestimonialsSection />
        </Suspense>
      </LazyWhenInView>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default Index;
