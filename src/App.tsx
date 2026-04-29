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
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777007129/DSC09785_z64plx.jpg",
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
];
const suiteCarouselImagesByIndex: Record<number, string[]> = {
  1: [
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948608/DSC08493_jlrmzf.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948610/DSC08502_dcahkd.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948614/DSC08561_d3kuke.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948615/DSC08506_hmumk0.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948619/DSC08588_zgvst4.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948620/DSC08570_jc4ply.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948616/DSC08554_pxevou.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948622/DSC08513_qk9cwx.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948623/DSC08517_kz7wnv.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948623/DSC08534_qelfjq.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776948631/DSC08608_yt9anl.jpg",
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
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945676/DSC08428_zep0ci.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945693/DSC08431_svpbrm.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945715/DSC08437_ggyhog.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945724/DSC08443_ap2dhb.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945732/DSC08466_k3hcu9.jpg",
    "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776945732/DSC08466_k3hcu9.jpg",
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
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937358/DSC01416_tbc1rp.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937364/DSC01442_ragu4u.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777284775/IMG_0125_e5ktgb.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777284733/IMG_0014_vc6ocl.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777284656/DSC01653_copy_z3d0nj.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937365/DSC01438_ntgkrf.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937369/DSC01580_n9qcvf.jpg",
  "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937392/DSC01593_rtvjvq.jpg",
  // "https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776937412/DSC01607_ztnxgl.jpg",
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
              element={
                <HospitalityServices
                  gardeniaHallImages={gardeniaHallImages}
                  alJouriHallImages={alJouriHallImages}
                  orchidSuiteImages={orchidSuiteImages}
                  spaImages={spaImages}
                  cafeImages={cafeImages}
                  suiteCarouselImagesByIndex={suiteCarouselImagesByIndex}
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
            <Route path="/in-room-events" element={<InRoomEvents galleryImages={inRoomEventGalleryImages} />} />
            <Route path="/job-application" element={<JobApplication />} />
            <Route path="/csr" element={<CSR />} />
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
