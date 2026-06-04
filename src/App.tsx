import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ChatButton from "@/components/ChatButton";
import ScrollToTopOnNav from "@/components/ScrollToTopOnNav";
import Index from "./pages/Index.tsx";
import {
  inRoomEventsTopCarouselImages,
  inRoomEventGalleryImages,
  gardeniaHallImages,
  alJouriHallImages,
  orchidSuiteImages,
  spaImages,
  cafeImages,
  suiteCarouselImagesByIndex,
  workWithUsStaffActivitiesImages,
  workWithUsGalaDinnerImages,
  workWithUsHospitalityWeekImages,
  workWithUsRhhQuizImages,
} from "@/data/routeGalleryImages";
const BookAppointment = lazy(() => import("./pages/BookAppointment.tsx"));
const HospitalityServices = lazy(() => import("./pages/HospitalityServices.tsx"));
const PatientsVisitors = lazy(() => import("./pages/PatientsVisitors.tsx"));
const AlSafwaProgram = lazy(() => import("./pages/AlSafwaProgram.tsx"));
const HomeHealth = lazy(() => import("./pages/HomeHealth.tsx"));
const Doctors = lazy(() => import("./pages/Doctors.tsx"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile.tsx"));
const DepartmentDetail = lazy(() => import("./pages/DepartmentDetail.tsx"));
const Downloads = lazy(() => import("./pages/Downloads.tsx"));
const Departments = lazy(() => import("./pages/Departments.tsx"));
const MedicalServices = lazy(() => import("./pages/MedicalServices.tsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const WorkWithUs = lazy(() => import("./pages/WorkWithUs.tsx"));
const InternationalPatient = lazy(() => import("./pages/InternationalPatient.tsx"));
const AppointmentRequest = lazy(() => import("./pages/AppointmentRequest.tsx"));
const AppointmentBookingFallback = lazy(() => import("./pages/AppointmentBookingFallback.tsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.tsx"));
const VerifyNationalId = lazy(() => import("./pages/VerifyNationalId.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const MedicalRepVisitBooking = lazy(() => import("./pages/MedicalRepVisitBooking.tsx"));
const MedicalRecordsRequest = lazy(() => import("./pages/MedicalRecordsRequest.tsx"));
const TrackerWaveInfantSecurity = lazy(() => import("./pages/TrackerWaveInfantSecurity.tsx"));
const InRoomEvents = lazy(() => import("./pages/InRoomEvents.tsx"));
const JobApplication = lazy(() => import("./pages/JobApplication.tsx"));
const CSR = lazy(() => import("./pages/CSR.tsx"));
const FifthFloorCafe = lazy(() => import("./pages/FifthFloorCafe.tsx"));
const NewbornPhotography = lazy(() => import("./pages/NewbornPhotography.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
    <span className="sr-only">Loading page...</span>
  </div>
);
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTopOnNav />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route
                  path="/hospitality"
                  element={
                    <HospitalityServices
                      gardeniaHallImages={gardeniaHallImages}
                      alJouriHallImages={alJouriHallImages}
                      orchidSuiteImages={orchidSuiteImages}
                      spaImages={spaImages}
                      cafeImages={cafeImages}
                      suiteCarouselImagesByIndex={suiteCarouselImagesByIndex}
                      inRoomEventGalleryImages={inRoomEventGalleryImages}
                    />
                  }
                />
                <Route path="/patients-visitors" element={<PatientsVisitors />} />
                <Route path="/al-safwa" element={<AlSafwaProgram />} />
                <Route path="/home-health" element={<HomeHealth />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctors/:id" element={<DoctorProfile />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/medical-services" element={<MedicalServices />} />
                <Route path="/medical-services/:slug" element={<DepartmentDetail />} />
                <Route path="/medical-services/:slug/:subSlug" element={<DepartmentDetail />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route
                  path="/work-with-us"
                  element={
                    <WorkWithUs
                      staffActivitiesImages={workWithUsStaffActivitiesImages}
                      galaDinnerImages={workWithUsGalaDinnerImages}
                      hospitalityWeekImages={workWithUsHospitalityWeekImages}
                      rhhQuizImages={workWithUsRhhQuizImages}
                    />
                  }
                />
                <Route path="/international-patient" element={<InternationalPatient />} />
                <Route path="/appointment-request" element={<AppointmentRequest />} />
                <Route path="/appointment-request/fallback" element={<AppointmentBookingFallback />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/medical-rep-visit-booking" element={<MedicalRepVisitBooking />} />
                <Route path="/medical-records-request" element={<MedicalRecordsRequest />} />
                <Route path="/infant-security" element={<TrackerWaveInfantSecurity />} />
                <Route
                  path="/in-room-events"
                  element={
                    <InRoomEvents
                      topCarouselImages={inRoomEventsTopCarouselImages}
                      galleryImages={inRoomEventGalleryImages}
                    />
                  }
                />
                <Route path="/job-application" element={<JobApplication />} />
                <Route path="/csr" element={<CSR />} />
                <Route path="/fifth-floor-cafe" element={<FifthFloorCafe />} />
                <Route path="/newborn-photography" element={<NewbornPhotography />} />
                <Route path="/verify-national-id" element={<VerifyNationalId />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ChatButton />
          </BrowserRouter>
        </ChatProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
