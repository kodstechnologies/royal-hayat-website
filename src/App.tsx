import { Suspense } from "react";
import { lazyWithRetry } from "@/utils/lazyWithRetry";
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
import RuntimePdfViewer from "./pages/RuntimePdfViewer.tsx";
import PublicDocumentRoute from "./pages/PublicDocumentRoute.tsx";
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
const BookAppointment = lazyWithRetry(() => import("./pages/BookAppointment.tsx"));
const HospitalityServices = lazyWithRetry(() => import("./pages/HospitalityServices.tsx"));
const PatientsVisitors = lazyWithRetry(() => import("./pages/PatientsVisitors.tsx"));
const AlSafwaProgram = lazyWithRetry(() => import("./pages/AlSafwaProgram.tsx"));
const HomeHealth = lazyWithRetry(() => import("./pages/HomeHealth.tsx"));
const Doctors = lazyWithRetry(() => import("./pages/Doctors.tsx"));
const DoctorProfile = lazyWithRetry(() => import("./pages/DoctorProfile.tsx"));
const DepartmentDetail = lazyWithRetry(() => import("./pages/DepartmentDetail.tsx"));
const Downloads = lazyWithRetry(() => import("./pages/Downloads.tsx"));
const Departments = lazyWithRetry(() => import("./pages/Departments.tsx"));
const MedicalServices = lazyWithRetry(() => import("./pages/MedicalServices.tsx"));
const AboutUs = lazyWithRetry(() => import("./pages/AboutUs.tsx"));
const WorkWithUs = lazyWithRetry(() => import("./pages/WorkWithUs.tsx"));
const InternationalPatient = lazyWithRetry(() => import("./pages/InternationalPatient.tsx"));
const AppointmentRequest = lazyWithRetry(() => import("./pages/AppointmentRequest.tsx"));
const AppointmentBookingFallback = lazyWithRetry(() => import("./pages/AppointmentBookingFallback.tsx"));
const ContactUs = lazyWithRetry(() => import("./pages/ContactUs.tsx"));
const VerifyNationalId = lazyWithRetry(() => import("./pages/VerifyNationalId.tsx"));
const MyMedicalReports = lazyWithRetry(() => import("./pages/MyMedicalReports.tsx"));
const AfyatiLoginError = lazyWithRetry(() => import("./pages/AfyatiLoginError.tsx"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ.tsx"));
const MedicalRepVisitBooking = lazyWithRetry(() => import("./pages/MedicalRepVisitBooking.tsx"));
const MedicalRecordsRequest = lazyWithRetry(() => import("./pages/MedicalRecordsRequest.tsx"));
const TrackerWaveInfantSecurity = lazyWithRetry(() => import("./pages/TrackerWaveInfantSecurity.tsx"));
const InRoomEvents = lazyWithRetry(() => import("./pages/InRoomEvents.tsx"));
const JobApplication = lazyWithRetry(() => import("./pages/JobApplication.tsx"));
const CSR = lazyWithRetry(() => import("./pages/CSR.tsx"));
const FifthFloorCafe = lazyWithRetry(() => import("./pages/FifthFloorCafe.tsx"));
const NewbornPhotography = lazyWithRetry(() => import("./pages/NewbornPhotography.tsx"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
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
            <Route path="/my-medical-reports" element={<MyMedicalReports />} />
            <Route path="/my-medical-reports/login-error" element={<AfyatiLoginError />} />
            <Route path="/Runtime/uploads/*" element={<RuntimePdfViewer />} />
            <Route path="/wp-content/uploads/*" element={<RuntimePdfViewer />} />
            <Route path="*" element={<PublicDocumentRoute />} />
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
