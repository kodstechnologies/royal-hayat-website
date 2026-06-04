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
import AppointmentBookingFallback from "./pages/AppointmentBookingFallback.tsx";
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
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC00345copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC00364copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC00381copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC00382copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC01274copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC02068_1copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC02516copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC02560copy.jpg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room-exp/DSC02570.jpg"
];
const inRoomEventGalleryImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/In-Room-Event/DSC06020.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/In-Room-Event/DSC06022.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/In-Room-Event/DSC06024.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/In-Room-Event/DSC06036.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06045.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/in-room/DSC06052.JPG",
];
const gardeniaHallImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gardeneria/h7l3psmyyagfq3zbxpfc.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gardeneria/to9pjrjetqhep0hjjuan.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gardeneria/xwtidtktsnjpk3iahoap.jpeg",
];
const alJouriHallImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/AL-jouri/DSC00056.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/AL-jouri/DSC00058.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/AL-jouri/DSC08997.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/AL-jouri/DSC08998.JPG",
];
const orchidSuiteImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/bopzkiyw2loxlj5feqrq.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/d4qb0yqskjhqchdkl7am.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/frsyhf8nbgjkgcg434jr.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/ifxwoic4djdk7cy9fxgj.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/im5vl7sowqrq9gde5mdd.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/uefabpbuxb4bg54jgxcf.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/uylb3kpbuglecsvdqgdf.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/x4w2fqifwses0tjowg9f.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-orchid/zp7qxsiyn7fdhme2vgdq.jpeg",
];
const spaImages = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09509.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09603.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09646.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09747.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09782.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09785.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09813.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09828.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09859.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09904.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09919.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09988.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/royal-spaa/DSC09998.JPG"
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
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/d81veuqgifhks7mpprut.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/emlkwpnph4axlabp5smi.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/euwmc9rg206ozte8p8ix.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/ifuagqjxpbkcv8huvujd.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/io2safarcnecwqofjxm1.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/l6lb42ccxrzu9o8qnbxk.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/p3pxcglwjk8mqbidne0f.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/pxce6mp6rit36gkfywyu.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/w9xjg4kdl3eilnnghpkk.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lotus/wglzftvg549dujlb3fjx.jpeg",
  ],
  3: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/bx7ymuhxwixfhdhxbyku.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/fxqarwihyftpzeutdywz.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/k8joiud1ewxluwzt2tpi.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/tja2z3jqm4q1t6i7xqwg.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/u8e75li5wnhrpqitla9p.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/uwqw5j8vt2wa7tc1zoyi.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/xe5vnrgoorqzxvpyje8v.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Jasmine/z4xihlkdwjgsxjjgub3r.jpeg",
  ],
  4: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/dfrnc17tjfiwg63yepus.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/e2m1pewo9k1rtquc7ouy.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/gppueg2ql96cktn96rrw.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/hzyn1ygqydhdsaiugr15.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/j2wxqczm7enuqdezidhm.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/qcv8nsui4xqqbuakcbfp.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/CAMELIA/vek4mpusktaqueewcuzu.jpeg"
  ],
  5: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/chpusk9tadupiu2h8hy2.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/fvrac4c1bv39jsshltet.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/gkn6xei3syyn7vhxv6j7.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/iutpipwwggghend6stbw.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/khr9yeymetkhvqaanojt.jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/Lily/myvuptdn5rvcaexz0s6u.jpeg",

  ],
  6: [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/daisysuit/1.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/daisysuit/2.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/daisysuit/3.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/daisysuit/4.JPG",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/daisysuit/5.JPG",
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
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/blcpmdecxupelqvkijou.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/eopob7rj5scvqpdxsekb.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/ktwduzlweq3cztxdez7g.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/mysutejao4nmqxf3snpw.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/ncrb47w5qlys9xvoyiji.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/qbised4ujkhqc2sffv2t.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/qbomku0lyzaaseslxvoa.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/tvv1owx2wu7nxqexztee.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Gala-Dinner/zk2blxgnnnwyba6nud45.jpeg",
];
const workWithUsHospitalityWeekImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/0.jpeg",
 
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/1.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/2.jpeg",

  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/3.jpeg",

  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/4.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/7.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/8.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/9.jpeg",

  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/10.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/11.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/12.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/13.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/14.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/17.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/19.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/20.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/f2puzid2k2knsjky1cin.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/hxxxtukrqjmuglvizvqy.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/qfxefcsafmvobw936o59.jpeg",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Hospitalitiy/tf7uuik4lr5m1grkj3db.jpeg"
];
const workWithUsRhhQuizImages: string[] = [
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07156.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07159.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07164.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07198.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07223.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07237.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07237.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07253.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07310.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07357.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07379.JPG",
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/RHH-quiz/DSC07389.JPG"
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
