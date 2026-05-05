import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsRow from "@/components/StatsRow";
import StoryBlock from "@/components/StoryBlock";
import HomeBookingBlock from "@/components/HomeBookingBlock";
import SpecializedCare from "@/components/SpecializedCare";

import DoctorsSection from "@/components/DoctorsSection";
import WhyRoyaleHayat from "@/components/WhyRoyaleHayat";
import ChairmanMessage from "@/components/ChairmanMessage";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

import AwardsSection from "@/components/AwardsSection";
import InsurancePartners from "@/components/InsurancePartners";
import TestimonialsSection from "@/components/TestimonialsSection";
import HospitalityBanner from "@/components/HospitalityBanner";
import AlSafwaSpotlight from "@/components/AlSafwaSpotlight";
import PatientsQuickLinks from "@/components/PatientsQuickLinks";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />
      <HeroSection />
      <StatsRow />
      <StoryBlock />
      <HomeBookingBlock />
      <SpecializedCare />
      <InsurancePartners />
      <DoctorsSection />
      <WhyRoyaleHayat />
      
      {/* Chairman's Message Section with Heading */}
      <section className="pt-12 pb-0 bg-background">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {lang === "ar" ? "رسالة رئيس مجلس الإدارة" : "Chairman's Message"}
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <ChairmanMessage />
      
      <HospitalityBanner />
      <AlSafwaSpotlight />
      <AwardsSection />
      <PatientsQuickLinks />
      <TestimonialsSection />
      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default Index;
