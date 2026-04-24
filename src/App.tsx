import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import BookAppointment from "./pages/BookAppointment.tsx";
import HospitalityServices from "./pages/HospitalityServices.tsx";
import PatientsVisitors from "./pages/PatientsVisitors.tsx";
import AlSafwaProgram from "./pages/AlSafwaProgram.tsx";
import HomeHealth from "./pages/HomeHealth.tsx";
import Doctors from "./pages/Doctors.tsx";
import DoctorProfile from "./pages/DoctorProfile.tsx";
import DepartmentDetail from "./pages/DepartmentDetail.tsx";
import Downloads from "./pages/Downloads.tsx";
import Departments from "./pages/Departments.tsx";
import MedicalServices from "./pages/MedicalServices.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import WorkWithUs from "./pages/WorkWithUs.tsx";
import InternationalPatient from "./pages/InternationalPatient.tsx";
import AppointmentRequest from "./pages/AppointmentRequest.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import FAQ from "./pages/FAQ.tsx";
import MedicalRepVisitBooking from "./pages/MedicalRepVisitBooking.tsx";
import MedicalRecordsRequest from "./pages/MedicalRecordsRequest.tsx";
import TrackerWaveInfantSecurity from "./pages/TrackerWaveInfantSecurity.tsx";
import InRoomEvents from "./pages/InRoomEvents.tsx";
import JobApplication from "./pages/JobApplication.tsx";
import CSR from "./pages/CSR.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTopOnNav from "./components/ScrollToTopOnNav.tsx";

const queryClient = new QueryClient();
const inRoomEventGalleryImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925513/DSC06020_ehruim.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925529/DSC06022_xybmbl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925539/DSC06024_l5xmxc.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925551/DSC06036_p19nrt.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925567/DSC06045_jvt2rh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925643/DSC06052_ibvveb.jpg",
];
const gardeniaHallImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927275/DSC08789_jchzn4.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927267/DSC08760_co7jbw.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776927266/DSC08758_rtqu6e.jpg",
];
const alJouriHallImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776926516/DSC00056_hjzwvy.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776926527/DSC00058_d8vsgp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776926678/DSC08997_okdxrp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776926911/DSC08998_tgjegx.jpg",
];
// Paste your final gallery links here
const workWithUsStaffActivitiesImages: string[] = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937358/DSC01416_tbc1rp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937364/DSC01442_ragu4u.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937365/DSC01438_ntgkrf.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937369/DSC01580_n9qcvf.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937392/DSC01593_rtvjvq.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937412/DSC01607_ztnxgl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937432/DSC01658_cysuzu.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937441/DSC01686_qcxrzj.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946800/DSC00788_szhxre.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946803/DSC00798_ul6fqp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946810/DSC00814_btimbf.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946819/DSC00820_mn9o0l.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946844/DSC00827_ha5hjd.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946857/DSC00850_toqbup.jpg",

  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947464/DSC00967_1_avtbcf.jpg"
];
const workWithUsGalaDinnerImages: string[] = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930176/DSC08131_coqkmh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930182/DSC08140_jci4mk.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930183/DSC08615_rybxhl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930186/DSC08608_wazupo.jpg",
];
const workWithUsHospitalityWeekImages: string[] = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935727/DSC09149_qfnzht.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935736/DSC09306_fihok4.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935737/DSC09247_khdp4n.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935746/DSC09612_hhn0fv.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935748/DSC09610_srzdoh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935753/DSC09634_eknzqv.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935760/DSC09636_ichbwp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935762/DSC09646_ndyvdd.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935765/DSC09140_lflsb8.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935768/DSC09129_tzqxkp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935772/DSC09681_g98lhh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935774/DSC09657_ps1xib.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935922/DSC09552_fbx1yb.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935775/DSC09414_s9sbgq.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935777/DSC09290_g0ripb.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935779/DSC09692_quejxz.jpg"
];
const workWithUsRhhQuizImages: string[] =  [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936376/DSC07156_qsfg84.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936381/DSC07159_d7zezu.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936399/DSC07164_zzzwsl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936401/DSC07198_o4iaj1.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936465/DSC07223_my0qra.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776936488/DSC07237_qepj8e.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937025/DSC07245_lekpdn.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937031/DSC07253_l8amlp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937033/DSC07310_jl3tfo.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937037/DSC07357_wdp2ax.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937047/DSC07379_tqgj4d.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937052/DSC07389_bt9tzt.jpg"
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route
              path="/hospitality"
              element={<HospitalityServices gardeniaHallImages={gardeniaHallImages} alJouriHallImages={alJouriHallImages} />}
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
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/medical-rep-visit-booking" element={<MedicalRepVisitBooking />} />
            <Route path="/medical-records-request" element={<MedicalRecordsRequest />} />
            <Route path="/infant-security" element={<TrackerWaveInfantSecurity />} />
            <Route path="/in-room-events" element={<InRoomEvents galleryImages={inRoomEventGalleryImages} />} />
            <Route path="/job-application" element={<JobApplication />} />
            <Route path="/csr" element={<CSR />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
