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
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778038620/DSC02570_udxrpg.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039575/DSC02560_copy_oj1xqd.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039577/DSC00364_copy_g2hgt2.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039578/DSC01274_copy_el7r0l.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039579/DSC02516_copy_ydrkma.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039581/DSC02068_1_copy_fbu2ap.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039581/DSC00382_copy_sbialz.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039582/DSC00345_copy_y3w4lm.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1778039609/DSC00381_copy_lnaijo.jpg"
];
const inRoomEventGalleryImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925513/DSC06020_ehruim.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925529/DSC06022_xybmbl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925539/DSC06024_l5xmxc.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925551/DSC06036_p19nrt.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925567/DSC06045_jvt2rh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776925643/DSC06052_ibvveb.jpg",
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
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942128/DSC08664_nlaap5.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942138/DSC08673_vojwry.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942143/DSC08672_ubs2ca.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942182/DSC08687_z3gvtd.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942278/DSC08688_upvgue.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942280/DSC08691_z9yijg.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942287/DSC08695_s9cbl3.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942313/DSC08698_raphu7.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942314/DSC08710_yomu0q.jpg",
];
const spaImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007124/DSC09782_l7ovv0.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007126/DSC09747_zoavmx.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007129/DSC09509_cazmhp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777545090/DSC09785_q78zcb.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007132/DSC09603_zcdl5j.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007134/DSC09813_okeyuc.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007139/DSC09646_ri5pbt.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007139/DSC09828_ir8xj1.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007140/DSC09859_zrzp1q.jpg"
];
const cafeImages = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777006536/DSC09215_xfkowp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777006536/DSC09120_ejvx9m.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777006539/DSC09115_nn6lzj.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777006540/DSC09126_titzqv.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777006541/DSC09207_w92s3o.jpg",
  "/images/cafe/DSC05535.jpg",
  "/images/cafe/DSC05536.jpg",
  "/images/cafe/DSC09202.jpg",
  "/images/cafe/_DSC4893.jpg",
  "/images/cafe/_DSC4906.jpg",
  "/images/cafe/cafe.JPG",
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
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948216/DSC08721_bdez9o.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948217/DSC08726_l9maev.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948218/DSC08734_neveao.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948222/DSC08754_rpfxtg.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948223/DSC08771_ykq1x7.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948224/DSC08767_yg4smn.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948227/DSC08793_rzkoyu.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948227/DSC08737_mj7z85.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948228/DSC08747_btjh9v.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948228/DSC08750_kjgyeg.jpg",
  ],
  3: [
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947830/DSC08328_qbensg.jpg  ",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947830/DSC08298_xbmqxm.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947832/DSC08277_drjwfi.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947838/DSC08332_moneaf.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947839/DSC08335_dnaqrp.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947841/DSC08316_a92ung.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947845/DSC08294_j5ggsf.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776947846/DSC08302_dxchtu.jpg",
  ],
  4: [
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946405/DSC08353_xiv5vw.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946413/DSC08360_okofcu.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946419/DSC08375_smjff2.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946498/DSC08382_jtv4sq.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776946507/DSC08388_je9e59.jpg",
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
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776941478/1_aza1am.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776941481/2_qnolrs.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776941489/3_guz4n4.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776941495/4_o8t25v.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776941496/5_p5i047.jpg",
  ],
};
// Paste your final gallery links here
const workWithUsStaffActivitiesImages: string[] = [
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/1.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/2.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/3.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/4.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/5.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/6.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/7.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/8.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/9.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/10.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/11.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/12.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/13.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/14.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/15.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/16.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/17.jpg",
"https://royal-hayat.s3.eu-central-1.amazonaws.com/staff-activities/18.jpg.jpeg"

];
const workWithUsGalaDinnerImages: string[] = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285681/DSC08126_wppstv.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930182/DSC08140_jci4mk.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776930183/DSC08615_rybxhl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285877/DSC08168_tiadwl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285903/DSC08257_yn0rmm.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285938/DSC07723_epsgdt.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285955/DSC08448_wlkj6f.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285963/DSC08474_tacof7.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777285680/DSC07991_x9cjhq.jpg",
];
const workWithUsHospitalityWeekImages: string[] = [
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935727/DSC09149_qfnzht.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935736/DSC09306_fihok4.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935737/DSC09247_khdp4n.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935746/DSC09612_hhn0fv.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935748/DSC09610_srzdoh.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935753/DSC09634_eknzqv.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935760/DSC09636_ichbwp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935762/DSC09646_ndyvdd.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935765/DSC09140_lflsb8.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935768/DSC09129_tzqxkp.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935772/DSC09681_g98lhh.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935774/DSC09657_ps1xib.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935922/DSC09552_fbx1yb.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935775/DSC09414_s9sbgq.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935777/DSC09290_g0ripb.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776935779/DSC09692_quejxz.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287099/2_cfzzrm.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287104/1_fczt7v.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287107/8_pmkhzw.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287111/9_utv6oa.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287111/10_emmrib.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287117/11_k8uouo.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287621/3_h5btrw.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287621/4_ivnfjs.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287623/5_kap6ph.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287624/6_tbyu3i.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777287624/7_cgiufp.jpg"
];
const workWithUsRhhQuizImages: string[] = [
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
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
