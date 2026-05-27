import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ChatButton from "@/components/ChatButton";
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
import VerifyNationalId from "./pages/VerifyNationalId.tsx";
import FAQ from "./pages/FAQ.tsx";
import MedicalRepVisitBooking from "./pages/MedicalRepVisitBooking.tsx";
import MedicalRecordsRequest from "./pages/MedicalRecordsRequest.tsx";
import TrackerWaveInfantSecurity from "./pages/TrackerWaveInfantSecurity.tsx";
import InRoomEvents from "./pages/InRoomEvents.tsx";
import JobApplication from "./pages/JobApplication.tsx";
import CSR from "./pages/CSR.tsx";
import FifthFloorCafe from "./pages/FifthFloorCafe.tsx";
import NewbornPhotography from "./pages/NewbornPhotography.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTopOnNav from "./components/ScrollToTopOnNav.tsx";

const queryClient = new QueryClient();
const inRoomEventsTopCarouselImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC02570.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC02560+copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC00364+copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC01274+copy.jpgg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC02516+copy.jpgg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC02068_1+copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC00382+copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC00345+copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-romm-experiences/DSC00381+copy.jpg"
];
const inRoomEventGalleryImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06020.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06022.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06024.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06036.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06045.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06052.JPG",
];
const gardeniaHallImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/halls-gardenia/DSC08789_jchzn4.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/halls-gardenia/DSC08760_co7jbw.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/halls-gardenia/DSC08758_rtqu6e.jpg.jpeg",
];
const alJouriHallImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-jouri-halls/DSC00056_hjzwvy.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-jouri-halls/DSC00058_d8vsgp.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-jouri-halls/DSC08997_okdxrp.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-jouri-halls/DSC08998_tgjegx.jpg.jpeg",
];
const orchidSuiteImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08664.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08673.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08672.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08687.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08688.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08691.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08695.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08698.jpg.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/suites-orchid/DSC08710.jpg.jpeg",
];
const spaImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09782.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09747.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09509.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09785.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09603.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09813.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09646.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spa/DSC09828.JPG",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007140/DSC09859_zrzp1q.jpg"
];
const cafeImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09215.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09120.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09115.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09126.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09207.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC05535.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC05536.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/DSC09202.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/_DSC4893.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/_DSC4906.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/al-liwan-cafe/cafe.JPG",
];
const suiteCarouselImagesByIndex: Record<number, string[]> = {
  1: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08493.jpg+(1).jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08502.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08561.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08506.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08588.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08570.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08554.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08513.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08517.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08534.jpg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal+-orchid+suites/DSC08608.jpg.jpeg"
  ],
  2: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08721.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08726.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08734.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08754.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08771.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08767.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08793.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08737.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08747.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lotus-updated/DSC08750.jpg",
  ],
  3: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08328.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08298.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08277.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08332.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08335.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08316.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08294.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/jasmine/DSC08302.jpg",
  ],
  4: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08353.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08360.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08375.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08382.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08388.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08396.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/camelia/DSC08413.jpg"
  ],
  5: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08428.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08431.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08437.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08433.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08443.jpg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/lilly/DSC08466.jpg",

  ],
  6: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Daisy-suite/1.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Daisy-suite/2.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Daisy-suite/3.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Daisy-suite/4.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Daisy-suite/5.JPG",
  ],
};
// Paste your final gallery links here
const workWithUsStaffActivitiesImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/1.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/2.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/3.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/4.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/5.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/6.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/7.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/8.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/9.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/10.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/11.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/12.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/13.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/14.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/15.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/16.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/17.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities-compressed/newly-compressed/18.jpeg"

];
const workWithUsGalaDinnerImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08126_wppstv.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08140_jci4mk.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08615_rybxhl.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08168_tiadwl.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08257_yn0rmm.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC07723_epsgdt.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08448_wlkj6f.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC08474_tacof7.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/gaala-dinner/DSC07991_x9cjhq.jpg",
];
const workWithUsHospitalityWeekImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09149_qfnzht.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935736/DSC09306_fihok4.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09247_khdp4n.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09612_hhn0fv.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935748/DSC09610_srzdoh.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935753/DSC09634_eknzqv.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935760/DSC09636_ichbwp.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09646_ndyvdd.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935765/DSC09140_lflsb8.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09129_tzqxkp.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09681_g98lhh.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09657_ps1xib.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09552_fbx1yb.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935775/DSC09414_s9sbgq.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935777/DSC09290_g0ripb.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/DSC09692_quejxz.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/2_cfzzrm.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/1_fczt7v.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/8_pmkhzw.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/9_utv6oa.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/10_emmrib.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/11_k8uouo.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/3_h5btrw.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/4_ivnfjs.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/5_kap6ph.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/6_tbyu3i.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/hospitality/7_cgiufp.jpg"
];
const workWithUsRhhQuizImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07156.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07159.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07164.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07198.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07223.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07237.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07245.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07253.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07310.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07357.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07379.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/rhh-quiz/DSC07389.JPG"
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTopOnNav />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatButton />
          </BrowserRouter>
        </ChatProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
