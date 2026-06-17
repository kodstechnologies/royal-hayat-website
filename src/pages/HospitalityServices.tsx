import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import ImageCarousel from "@/components/ImageCarousel";
import { orchidSuiteCarouselImageClass } from "@/data/routeGalleryImages";
import EventBookingModal from "@/components/EventBookingModal";
import { Crown, Utensils, Sparkles, Flower2, Coffee, Phone, CheckCircle2, Baby, Image, Video, Bed, Star, X, Gift, UtensilsCrossed, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
const PANOEE_IFRAME_ALLOW = "fullscreen; xr-spatial-tracking; xr; accelerometer; gyroscope; autoplay;";
const PHONE_LINK_CLASS =
  "text-accent hover:underline font-semibold inline-block [direction:ltr] [unicode-bidi:isolate]";
const LTR_ISOLATE_CLASS = "inline-block [direction:ltr] [unicode-bidi:isolate]";

const renderSetupStyleLabel = (item: string, isAr: boolean) => {
  if (isAr && item === "- حرف U") {
    return (
      <span dir="rtl">
        {"- حرف "}
        <span dir="ltr" className={LTR_ISOLATE_CLASS}>
          U
        </span>
      </span>
    );
  }
  return item;
};

const getColonIndex = (text: string) => {
  const candidates = [text.indexOf(":"), text.indexOf("؛")].filter((index) => index !== -1);
  return candidates.length ? Math.min(...candidates) : -1;
};

const renderColonHeading = (text: string) => {
  const colonIndex = getColonIndex(text);
  if (colonIndex === -1) {
    return <span className="font-bold">{text}</span>;
  }
  const label = text.slice(0, colonIndex + 1);
  const rest = text.slice(colonIndex + 1);
  return (
    <>
      <span className="font-bold">{label}</span>
      {rest}
    </>
  );
};

const SPA_AR_DESC =
  "إليمنتس سبا بالتعاون مع مجموعة بانيان تري، الحائزة على جوائز عالمية، يقدم تجربة استثنائية تجمع بين فلسفات العناية الشاملة وطقوس الاسترخاء المستوحاة من أعرق التقاليد العلاجية حول العالم، وذلك ضمن أجواء هادئة وفاخرة داخل مستشفى رويال حياة. صُممت تجارب السبا بعناية لتعزيز التوازن الجسدي والذهني واستعادة الحيوية والراحة من خلال مجموعة مختارة من العلاجات الفاخرة وتقنيات العناية المتقدمة.";
const SPA_AR_SERVICES = [
  "جلسات المساج العلاجية المميزة",
  "مقشرات وعلاجات ترطيب الجسم",
  "علاجات العناية بالبشرة وتجديد الحيوية",
  "علاجات اليدين والقدمين",
  "علاجات العناية بالشعر",
];
const SPA_EN_SERVICES = [
  "Signature Massages",
  "Body Scrubs & Conditioners",
  "Facials & Skin Rejuvenation",
  "Hand & Foot Therapies",
  "Hair Treatments",
];
const CAFE_AR_INTRO =
  "في قلب الردهة الرئيسية، يقدم الليوان بيسترو (المطعم واللاونج) تجربة ضيافة راقية ضمن أجواء دافئة وأنيقة، حيث تعبق الأجواء بروائح الأطباق الطازجة والحلويات المحضّرة بعناية، مع أنغام موسيقية هادئة تضفي إحساسًا بالراحة والاسترخاء.";
const CAFE_AR_MENU =
  "استمتعوا بتجربة طعام مميزة تجمع بين النكهات العربية الأصيلة وتشكيلة مختارة من الأطباق العالمية، ضمن قائمة متنوعة تلبي مختلف الأذواق. وتشمل القائمة العصائر الطازجة، والسموثي، والبرغر الفاخر، والسلطات، والسندويشات، واللفائف الطازجة.";
const CAFE_AR_DESSERT =
  "واختتموا تجربتكم بقطعة من الكيك أو المخبوزات الطازجة، إلى جانب تشكيلة من القهوة المختصة وأنواع الشاي الفاخرة.";
const CAFE_AR_HOURS =
  "يفتتح الليوان بيسترو أبوابه يوميًا من الساعة 8 صباحًا وحتى 11 مساءً، ليكون وجهتكم المثالية للإفطار، والغداء، والعشاء، أو للاستمتاع بوجبة خفيفة في أي وقت من اليوم.";
const FIFTH_FLOOR_AR_TITLE = "مقهى الدور الخامس";
const FIFTH_FLOOR_AR_SUBTITLE = "مساحة دافئة للوجبات الخفيفة والمشروبات المنعشة";
const FIFTH_FLOOR_AR_INTRO =
  "يوفر مقهى الدور الخامس أجواءً مريحة وهادئة تتيح للضيوف الاسترخاء أثناء انتظار المواعيد الطبية أو زيارة أحبائهم. وقد صُمم المقهى بعناية ليكون مساحة ترحيبية مناسبة للعائلات المنتظرة لاستقبال مولود جديد أو انتهاء أحد الإجراءات الطبية، ضمن بيئة تبعث على الطمأنينة والراحة.";
const FIFTH_FLOOR_AR_MENU =
  "استمتعوا بتشكيلة مختارة من القهوة الطازجة، والسندويشات المتنوعة، والسلطات الطازجة، والحلويات الفاخرة، جميعها مقدمة ضمن أجواء تجمع بين الراحة والرُقي.";
const FIFTH_FLOOR_AR_OFFERINGS = [
  "قهوة مختصة طازجة التحضير",
  "تشكيلة متنوعة من السندويشات",
  "سلطات طازجة",
  "حلويات فاخرة",
];
const FIFTH_FLOOR_AR_LOCATION = "الدور الخامس - مستشفى رويال حياة";
const NEWBORN_AR_INTRO =
  "استقبال مولودكم الجديد هو من أجمل اللحظات وأكثرها قيمة في الحياة، ولهذا يقدم مستشفى رويال حياة خدمات تصوير احترافية لتوثيق هذه الذكريات الثمينة خلال فترة إقامتكم.";
const NEWBORN_AR_DETAILS =
  "يقوم فريق من المصورين المحترفين، بالتعاون مع إحدى أبرز الاستوديوهات الرقمية في الكويت، بالتقاط أجمل اللحظات بكل احترافية ودفء، ليتم حفظ كل ابتسامة ونظرة ولحظة فرح في صور تبقى ذكرى خالدة لكم ولعائلتكم لسنوات طويلة.";
type HospitalityServicesProps = {
  gardeniaHallImages: string[];
  alJouriHallImages: string[];
  orchidSuiteImages: string[];
  spaImages: string[];
  cafeImages: string[];
  suiteCarouselImagesByIndex: Record<number, string[]>;
  inRoomEventGalleryImages: string[];
};
const HospitalityServices = ({
  gardeniaHallImages,
  alJouriHallImages,
  orchidSuiteImages,
  spaImages,
  cafeImages,
  suiteCarouselImagesByIndex,
  inRoomEventGalleryImages,
}: HospitalityServicesProps) => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const show = (s: string) => showAll || section === s;
  const [activeHall, setActiveHall] = useState("gardenia");
  const [gardeniaSlide, setGardeniaSlide] = useState(0);
  const [alJouriSlide, setAlJouriSlide] = useState(0);
  const [activeSuite, setActiveSuite] = useState(0);
  const [suiteSlide, setSuiteSlide] = useState(0);
  const [orchidSlide, setOrchidSlide] = useState(0);
  const [spaSlide, setSpaSlide] = useState(0);
  const [cafeSlide, setCafeSlide] = useState(0);
  const [fifthCafeSlide, setFifthCafeSlide] = useState(0);
  const [inRoomSlide, setInRoomSlide] = useState(0);
  const [babySlide, setBabySlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [eventBookingOpen, setEventBookingOpen] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [section]);
  const babyImages = [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/baby-images/WhatsApp+Image+2026-05-12+at+2.39.52+PM+(1).jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/baby-images/WhatsApp+Image+2026-05-12+at+2.39.52+PM.jpeg",
  ];
  const fifthFloorCafeImages = [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/fifth-floor/WhatsApp+Image+2026-06-02+at+2.17.44+PM+(1).jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/fifth-floor/WhatsApp+Image+2026-06-02+at+2.17.44+PM.jpeg",
  ];
  const activeSuiteImages = suiteCarouselImagesByIndex[activeSuite] ?? suiteCarouselImagesByIndex[6];
  useEffect(() => {
    setSuiteSlide(0);
    setOrchidSlide(0);
  }, [activeSuite]);
  const ORCHID_SUITE_INDEX = 1;
  const LOTUS_SUITE_INDEX = 2;
  const JASMINE_SUITE_INDEX = 3;
  const CAMELLIA_SUITE_INDEX = 4;
  const LILY_SUITE_INDEX = 5;
  const DAISY_SUITE_INDEX = 6;
  const SUITE_360_TOURS: Record<number, { iframeName: string; src: string; titleEn: string; titleAr: string }> = {
    [ORCHID_SUITE_INDEX]: {
      iframeName: "ORCHID SUITE",
      src: "https://tour.panoee.net/iframe/6a218338c64044b87c0df614",
      titleEn: "Orchid Suite 360 Tour",
      titleAr: "جولة 360 لجناح أوركيد",
    },
    [LOTUS_SUITE_INDEX]: {
      iframeName: "LOTUS SUITE",
      src: "https://tour.panoee.net/iframe/6a218241c64044a5c40df5da",
      titleEn: "Lotus Suite 360 Tour",
      titleAr: "جولة 360 لجناح لوتس",
    },
    [JASMINE_SUITE_INDEX]: {
      iframeName: "JASMIN SUITE",
      src: "https://tour.panoee.net/iframe/6a2181b6cb8011619dbd8b53",
      titleEn: "Jasmine Suite 360 Tour",
      titleAr: "جولة 360 لجناح الياسمين",
    },
    [CAMELLIA_SUITE_INDEX]: {
      iframeName: "CAMELIA SUITE",
      src: "https://tour.panoee.net/iframe/6a216556cb8011ee21bd8532",
      titleEn: "Camellia Suite 360 Tour",
      titleAr: "جولة 360 لجناح كاميليا",
    },
    [LILY_SUITE_INDEX]: {
      iframeName: "LILY SUITE",
      src: "https://tour.panoee.net/iframe/6a216838c64044858c0defbd",
      titleEn: "Lily Suite 360 Tour",
      titleAr: "جولة 360 لجناح ليلي",
    },
    [DAISY_SUITE_INDEX]: {
      iframeName: "DAISY SUITE",
      src: "https://tour.panoee.net/iframe/6a252fd8c640443c090e5390",
      titleEn: "Daisy Suite 360 Tour",
      titleAr: "جولة 360 لجناح ديزي",
    },
  };
  const activeSuite360Tour = SUITE_360_TOURS[activeSuite];
  useEffect(() => {
    if (activeHall !== "gardenia" && activeHall !== "aljouri" && !activeSuite360Tour) return;
    const panoIframeName = "tour-embeded";
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const iframe = document.getElementById(panoIframeName) as HTMLIFrameElement | null;
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage({
        type: "devicemotion",
        deviceMotionEvent: {
          acceleration: { x: e.acceleration?.x, y: e.acceleration?.y, z: e.acceleration?.z },
          accelerationIncludingGravity: {
            x: e.accelerationIncludingGravity?.x,
            y: e.accelerationIncludingGravity?.y,
            z: e.accelerationIncludingGravity?.z,
          },
          rotationRate: { alpha: e.rotationRate?.alpha, beta: e.rotationRate?.beta, gamma: e.rotationRate?.gamma },
          interval: e.interval,
          timeStamp: e.timeStamp,
        },
      }, "*");
    };
    window.addEventListener("devicemotion", handleDeviceMotion);
    return () => window.removeEventListener("devicemotion", handleDeviceMotion);
  }, [activeHall, activeSuite]);
  const hallsNav = [
    { id: "gardenia", label: isAr ? "قاعة جاردينيا للاحتفالات" : "Gardenia Banquet Hall" },
    { id: "aljouri", label: isAr ? "قاعة الجوري للاحتفالات" : "Al Jouri Banquet Hall" },
  ];
  const suitesData = [
    {
      name: isAr ? "جناح رويال أوركيد" : "Royale Orchid Suite",
      tabLabel: isAr ? "رويال اوركيد" : "Royale Orchid",
      area: isAr
        ? "متر مربع (130 متر مربع للجناح + 122 متر مربع للقاعة) 252"
        : "252 sqm (Suite 130 sqm + Hall 122 sqm)",
      desc: isAr
        ? "يوفر جناح رويال أوركيد تجربة استثنائية فاخرة صُممت خصيصًا للضيوف الذين يبحثون عن أعلى مستويات الخصوصية والراحة والرقي. ويتميز الجناح بتصميم مستوحى من الأناقة الأوروبية الكلاسيكية، مع خدمات ضيافة متكاملة وعناية شخصية فائقة."
        : "The Royale Orchid Suites offer a truly rarefied experience for those who expect nothing less than the extraordinary. Designed for guests accustomed to the finest things in life, these exclusive suites provide unmatched privacy and comfort within a setting inspired by classic European elegance.",
      highlights: isAr
        ? ["خصوصية تامة واهتمام شخصي راقٍ", "تنسيق متكامل بين الخدمات الطبية وخدمات الضيافة", "تفاصيل فاخرة تمنحكم تجربة لا تُنسى لكم ولعائلتكم وضيوفكم", "أثاث فاخر، ومساحات استقبال خاصة، وخدمة طعام راقية داخل الجناح"]
        : ["Complete discretion and personalized attention", "Seamless coordination of healthcare and guest services", "Thoughtful touches that create lasting memories for you, your family, and your guests"],
      extraDesc: isAr
        ? ""
        : "From luxurious furnishings to private hosting areas and fine in-room dining, every element is tailored to your comfort, peace of mind, and sense of occasion.",
      dimensions: isAr
        ? ["مساحة غرفة الجناح: 130 متر مربع", "مساحة القاعة الخاصة: 122 متر مربع", "إجمالي مساحة الجناح: 252 متر مربع"]
        : ["Suite Room Area: 130 sqm", "Suite Hall Area: 122 sqm", "Total Suite Area: 252 sqm"],
      amenities: isAr
        ? ["سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية", "ديكور فاخر مستوحى من الطراز الأوروبي مع أثاث راقٍ", "منطقة معيشة خاصة لاستقبال العائلة والأصدقاء", "غرفة مخصصة للمرافق مع حمام خاص", "مطبخ تحضيري مجهز بثلاجة ومرافق إعداد القهوة والشاي مجانًا", "تلفزيون تفاعلي مع قنوات", "قناة تثقيفية خاصة بالمرضى", "خدمة مشاهدة المولود مباشرة عبر كاميرا الحضانة", "هاتف للاتصالات السهلة", "خدمة واي فاي مجانية عالية السرعة"]
        : ["Hill-Rom® intelligent medical bed for optimized patient comfort and care", "Elegant European-inspired décor with luxury seating and bespoke furnishings", "Private Orchid living area designed for visiting friends and family", "Dedicated companion room with private bathroom", "Pantry equipped with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive TV featuring Orbit-Showtime Network channels", "Dedicated patient education channel for informed care", "Live baby camera connection with the nursery for peace of mind", "IP telephone for convenient communication", "Complimentary high-speed Wi-Fi access"],
      hospitality: isAr
        ? ["خدمة تنظيف الغرف وخدمة ضيافة على مدار الساعة", "قائمة طعام فاخرة وتجربة تناول خاصة داخل الجناح"]
        : ["24-hour housekeeping and personalized butler-style service", "Fine dining experience with an exclusive in-room private dining menu"],
      hall: {
        title: isAr ? "قاعة جناح رويال أوركيد – المواصفات والمرافق" : "Royale Orchid Suite Hall – Specifications & Amenities",
        desc: isAr
          ? "تم تصميم قاعة جناح رويال أوركيد كمساحة استقبال خاصة وفاخرة لاستضافة ضيوفكم بأناقة مع الحفاظ على الخصوصية والراحة."
          : "The Royale Orchid Suite Hall is an exquisite private reception space, designed to welcome your guests in style while maintaining the privacy and comfort of your hospital stay.",
        specs: isAr
          ? ["المساحة الإجمالية: 122 متر مربع", "جلسات أنيقة تتسع حتى 25 ضيفًا", "إمكانية استقبال حتى 50 ضيفًا للمناسبات والتجمعات"]
          : ["Total Area: 122 square meters", "Elegant seating for up to 25 guests", "Accommodates up to 50 guests for receptions and gatherings"],
        features: isAr
          ? ["أثاث فاخر بتصاميم راقية تجمع بين الراحة والأناقة", "نظام صوتي خاص للتحكم بالأجواء والموسيقى", "سقف زجاجي مميز يمنح القاعة إضاءة طبيعية رائعة", "مدخل خاص للضيوف يوفر الخصوصية وسهولة الوصول المباشر للقاعة"]
          : ["Luxurious designer furniture curated for comfort and sophistication", "Individual sound system for personalized ambiance and audio control", "Stunning skylight, bathing the space in natural light", "Private guest entrance, offering discreet and direct access to the reception area"],
      },
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 25360581" : "+96525360581",
    },
    {
      name: isAr ? "جناح أوركيد" : "Orchid Suite",
      tabLabel: isAr ? "اوركيد" : "Orchid",
      area: isAr ? "130 مترًا مربعًا" : "130 sqm",
      desc: isAr
        ? "يتميّز جناح أوركيد بتصميمه الفريد والمستوحى من الأناقة الأوروبية الكلاسيكية، ليقدّم تجربة إقامة استثنائية للضيوف الباحثين عن أعلى مستويات الفخامة، والخصوصية، والراحة."
        : "Renowned for its exotic and unique design, the Orchid Suite offers a rarefied experience tailored for guests who appreciate the finest things in life. This lavish sanctuary, inspired by classic European elegance, places privacy and comfort at the forefront, ensuring a serene and exclusive stay.",
      desc2: isAr
        ? "وقد صُمم هذا الجناح الراقي بعناية ليكون ملاذًا هادئًا يجمع بين الرقي والدفء، مع الاهتمام بأدق التفاصيل التي تضمن إقامة مريحة ومميزة لكم ولعائلاتكم."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 130 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية",
            "منطقة استقبال فاخرة مع جلسات راقية لكم ولضيوفكم",
            "صالة أوركيد خاصة لاستقبال الأقارب والأصدقاء",
            "غرفة مرافِق مستقلة مع حمام خاص",
            "ركن ضيافة مجهز بثلاجة ومرافق إعداد القهوة والشاي مجانًا",
            "تلفزيون تفاعلي مع قنوات",
            "قناة تعليمية خاصة بالمرضى لتعزيز التوعية والرعاية",
            "نظام القبلة والعناق للأمان والحماية للأم والطفل",
            "بث مباشر من حضانة الأطفال عبر كاميرا خاصة لراحة وطمأنينة العائلة",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة لضمان أعلى مستويات الراحة والنظافة",
            "قائمة طعام خاصة وتجربة ضيافة راقية داخل الجناح وفق تفضيلاتكم",
          ]
        : ["Suite Area: 130 square meters", "Hill-Rom® Intelligent Medical Bed for optimal patient comfort", "Luxury seating and a lavish reception area designed for you and your guests", "Private Orchid Lounge for visiting relatives and friends", "Companion room with private bathroom", "Pantry equipped with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive television featuring your favorite channels on the Orbit-Showtime Network", "Dedicated patient education channel for informative care", "Hugs & Kisses Mother & Baby Security System for peace of mind", "Live baby camera connection with the nursery", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "24-hour housekeeping service ensures a pristine environment", "Exclusive private dining menu tailored to your preferences"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
    {
      name: isAr ? "جناح لوتس" : "Lotus Suite",
      tabLabel: isAr ? "لوتس" : "Lotus",
      area: isAr ? "130 مترًا مربعًا" : "130 sqm",
      desc: isAr
        ? "استُلهم تصميم جناح لوتس من زهرة اللوتس الهادئة والراقية، ليمنح تجربة إقامة تجمع بين الراحة الجسدية والسكينة النفسية ضمن أجواء مفعمة بالهدوء والضوء الطبيعي."
        : "Aptly named after the graceful lotus, these suites are designed to inspire both physical and spiritual healing. Featuring an exquisitely crafted bedroom and reception area, each suite is flooded with natural light, creating a serene and uplifting atmosphere.",
      desc2: isAr
        ? "ويتميز الجناح بغرفة نوم أنيقة ومنطقة استقبال فاخرة صُممت بعناية لتوفير تجربة إقامة راقية ومريحة، حيث تتناغم التفاصيل الفاخرة مع الأجواء الهادئة لتمنحكم إحساسًا بالاسترخاء والخصوصية."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 130 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية",
            "منطقة استقبال أنيقة مع جلسات فاخرة",
            "غرفة مرافِق مستقلة مع حمام خاص",
            "ركن ضيافة ومطبخ صغير مجهز بالكامل مع ثلاجة ومرافق إعداد القهوة والشاي مجانًا",
            "تلفزيون تفاعلي مع قنوات",
            "قناة تعليمية خاصة بالمرضى لتعزيز التوعية والرعاية",
            "نظام القبلة والعناق للأمان والحماية للأم والطفل",
            "بث مباشر من حضانة الأطفال عبر كاميرا خاصة لراحة وطمأنينة العائلة",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة",
            "قائمة طعام خاصة وتجربة ضيافة راقية داخل الجناح وفق تفضيلاتكم",
          ]
        : ["Suite Area: 130 square meters", "Hill-Rom® Intelligent Medical Bed for enhanced patient comfort", "Elegant luxury seating in the reception area", "Companion room with private bathroom", "Fully equipped pantry and mini kitchen with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive television featuring your favorite channels via the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for seamless communication", "Complimentary high-speed Wi-Fi internet access", "24-hour housekeeping service", "Exclusive private dining menu tailored to your preferences"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
    {
      name: isAr ? "جناح الياسمين" : "Jasmine Suite",
      tabLabel: isAr ? "ياسمين" : "Jasmine",
      area: isAr ? "90 مترًا مربعًا" : "90 sqm",
      desc: isAr
        ? "استُلهم تصميم جناح الياسمين من جمال زهرة الياسمين الهادئة والرقيقة، ليمنحكم تجربة إقامة فاخرة تنبض بالأناقة والسكينة. ويتميز الجناح بتفاصيل كلاسيكية راقية تجمع بين الأقمشة الحريرية الفاخرة ولمسات الخشب الدافئة، إلى جانب قطع فنية مختارة بعناية تعكس الذوق الرفيع والأصالة المحلية."
        : "Reminiscent of the graceful beauty of the Jasmine flower, these suites are furnished with elegant classical designs featuring rich silk and wood accents and adorned with locally sourced objet d'art. The Jasmine Suite provides a luxurious sanctuary, perfect for pampering your senses and enjoying a tranquil stay.",
      desc2: isAr
        ? "يوفر جناح الياسمين أجواءً هادئة ومريحة صُممت بعناية لتدلل الحواس وتمنح المرضى وعائلاتهم تجربة إقامة استثنائية تجمع بين الخصوصية، الراحة، والضيافة الراقية."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 90 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية",
            "منطقة استقبال أنيقة مع جلسات فاخرة",
            "تلفزيون تفاعلي مع قنوات",
            "قناة تعليمية خاصة بالمرضى لتعزيز التوعية والرعاية",
            "نظام القبلة والعناق للأمان والحماية للأم والطفل",
            "بث مباشر من حضانة الأطفال عبر كاميرا خاصة لراحة وطمأنينة العائلة",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "مطبخ صغير مجهز بثلاجة ومرافق إعداد القهوة والشاي مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة",
            "قائمة طعام خاصة وتجربة ضيافة راقية داخل الجناح",
          ]
        : ["Suite Area: 90 square meters", "Hill-Rom® Intelligent Medical Bed for superior patient comfort", "Luxury seating in the reception area", "Interactive television with your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "Mini kitchen with a refrigerator, complimentary coffee, and tea-making facilities", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
    {
      name: isAr ? "جناح كاميلـيا" : "Camellia Suite",
      tabLabel: isAr ? "كاميليا" : "Camellia",
      area: isAr ? "65 مترًا مربعًا" : "65 sqm",
      desc: isAr
        ? "استُلهم تصميم جناح كاميلـيا من جمال زهرة الكاميليا المتألقة، ليعكس أجواءً من الفخامة والدفء والرقي. تقع الأجنحة في الدور الثالث، وتتميز بتفاصيل كلاسيكية أنيقة وأثاث مختار بعناية ليمنح المرضى وعائلاتهم تجربة إقامة مريحة وراقية."
        : "Like the perfect blossom of the Camellia, these suites evoke admiration with their luxurious ambiance and carefully selected furnishings. Located on the 3rd floor, each suite features a comfortably spacious reception area accented with classical decorative touches, offering a warm and inviting atmosphere that will bring a smile to your face.",
      desc2: isAr
        ? "ويضم الجناح منطقة استقبال واسعة ومريحة تضفي أجواءً ترحيبية هادئة، صُممت لتمنحكم إحساسًا بالراحة والطمأنينة طوال فترة الإقامة."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 65 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية",
            "منطقة استقبال أنيقة مع جلسات فاخرة",
            "تلفزيون تفاعلي مع قنوات",
            "قناة تعليمية خاصة بالمرضى لتعزيز التوعية والرعاية",
            "نظام القبلة والعناق للأمان والحماية للأم والطفل",
            "بث مباشر من حضانة الأطفال عبر كاميرا خاصة لراحة وطمأنينة العائلة",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "ركن ضيافة مجهز بثلاجة ومرافق إعداد القهوة والشاي مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة",
            "قائمة طعام خاصة وتجربة ضيافة راقية داخل الجناح",
          ]
        : ["Suite Area: 65 square meters", "Hill-Rom® Intelligent Medical Bed for optimal patient comfort", "Convenient seating and a large reception area", "Interactive television featuring your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for seamless communication", "Complimentary high-speed Wi-Fi internet access", "Pantry with a refrigerator, complimentary coffee, and tea-making facilities", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
    {
      name: isAr ? "جناح ليلي" : "Lily Suite",
      tabLabel: isAr ? "ليلي" : "Lily",
      area: isAr ? "32 مترًا مربعًا" : "32 sqm",
      desc: isAr
        ? "استُلهم تصميم جناح ليلي من رقة وعذوبة زهرة الزنبق، ليمنحكم أجواءً هادئة تجمع بين الراحة والأناقة. تقع هذه الأجنحة في الدور الثاني، وتتميز بلمسات خشبية ناعمة وتصميم دافئ يوفّر تجربة إقامة مريحة ومليئة بالسكينة."
        : "Symbolic of the sweetness of a Lily, our suites on the 2nd floor are charmingly furnished with subtle wooden accents, designed to provide you with absolute comfort during your stay. This elegant starting category offers a spacious bedroom, a lavish en-suite bathroom, and a cozy seating area.",
      desc2: isAr
        ? "ويُعد جناح ليلي الخيار المثالي لبداية إقامة فاخرة، حيث يضم غرفة نوم واسعة، وحمامًا داخليًا أنيقًا، بالإضافة إلى منطقة جلوس مريحة صُممت بعناية لتلبية احتياجات المرضى وعائلاتهم بكل راحة وخصوصية."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 32 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الراحة والرعاية",
            "منطقة جلوس أنيقة ومريحة للاسترخاء",
            "تلفزيون تفاعلي مع قنوات",
            "قناة تعليمية خاصة بالمرضى لتعزيز التوعية والرعاية",
            "نظام القبلة والعناق للأمان والحماية للأم والطفل",
            "بث مباشر من حضانة الأطفال عبر كاميرا خاصة لراحة وطمأنينة العائلة",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "ثلاجة صغيرة داخل الجناح",
            "مرافق إعداد القهوة والشاي مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة",
            "قائمة طعام خاصة وتجربة ضيافة راقية داخل الجناح",
          ]
        : ["Suite Area: 32 square meters", "Hill-Rom® Intelligent Medical Bed for enhanced comfort", "Luxury seating area for relaxation", "Interactive television with your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for convenient communication", "Complimentary high-speed Wi-Fi internet access", "Mini refrigerator", "Coffee and tea-making facilities are provided free of charge", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
    {
      name: isAr ? "جناح ديزي" : "Daisy Suite",
      tabLabel: isAr ? "ديزي" : "Daisy",
      area: isAr ? "32 مترًا مربعًا" : "32 sqm",
      desc: isAr
        ? "صُمم جناح ديزي خصيصًا للأطفال من عمر الولادة وحتى 12 عامًا، ليمنحهم تجربة إقامة مليئة بالمرح والراحة والطمأنينة. يتميز الجناح بأجواء مبهجة وتفاصيل صديقة للأطفال، بدءًا من الأسرة المصممة بعناية وصولًا إلى خيارات الترفيه المتنوعة التي تجعل من الإقامة تجربة ممتعة لا تُنسى للصغار وعائلاتهم."
        : "Tailored especially for children aged 0 to 12 years, the Daisy Suites are designed to delight and entertain your little ones during their stay. From specially designed beds to a wide range of engaging entertainment options, this kid-friendly suite truly feels like a paradise for young guests.",
      desc2: isAr
        ? "ويُعد جناح ديزي مساحة مثالية تجمع بين الرعاية الطبية المتقدمة والبيئة الدافئة التي تمنح الأطفال الشعور بالسعادة والأمان طوال فترة إقامتهم."
        : undefined,
      amenitiesTitle: isAr ? "المزايا والتجهيزات داخل الجناح" : undefined,
      amenities: isAr
        ? [
            "مساحة الجناح: 32 مترًا مربعًا",
            "سرير طبي ذكي لتوفير أعلى مستويات الأمان والراحة",
            "منطقة جلوس ملوّنة ومريحة تضفي أجواءً مرحة للأطفال",
            "تلفزيون تفاعلي مع قنوات الأطفال المفضلة عبر Orbit Showtime Network",
            "قناة تعليمية خاصة بالمرضى",
            "خدمات ألعاب ترفيهية حسب الطلب",
            "مكتبة أفلام وبرامج DVD مخصصة للأطفال",
            "هاتف لسهولة التواصل",
            "خدمة إنترنت عالية السرعة مجانًا",
            "ثلاجة صغيرة داخل الجناح",
            "مرافق إعداد القهوة والشاي للوالدين مجانًا",
            "خدمة تنظيف متوفرة على مدار الساعة",
            "قائمة طعام خاصة بالأطفال تناسب أذواقهم واحتياجاتهم",
          ]
        : ["Suite Area: 32 square meters", "Hill-Rom® Intelligent Medical Bed for comfort and safety", "Colorful seating area to brighten the day", "Interactive television with your child's favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "On-demand gaming services for fun and relaxation", "Special DVD program menu designed for kids", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "Mini refrigerator", "Coffee and tea-making facilities for parents", "24-hour housekeeping service", "Special kids' menu crafted to please young palates"],
      phone: "+96525360581",
      phoneDisplay: isAr ? "+965 2536 0581" : "+96525360581",
    },
  ];
  const currentSuite = suitesData[activeSuite];
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />
      <section className="py-8 md:py-10 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("premiumExperience")}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {section === "halls" ? (isAr ? "قاعات احتفالات الولادة" : "Birth Celebration Halls")
                : section === "suites" ? (isAr ? "الأجنحة الفاخرة" : "Exclusive Suites")
                  : section === "spa" ? "Elements Spa"
                    : section === "cafe" ? (isAr ? "الليوان بيسترو" : "Al Liwan Bistro")
                      : (isAr ? "خدمات الضيافة" : "Hospitality Services")}
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {showAll && <section className="py-4">
        <div className="container mx-auto px-6 max-w-7xl">
          <ScrollAnimationWrapper>
            {!isAr && <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">Introduction</h2>}
            <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed text-justify">
              {isAr ? (<>
                <p>يقدم مستشفى رويال حياة خدمات فاخرة مصممة للارتقاء بتجربة المرضى والضيوف خلال المناسبات الخاصة، حيث نحرص على توفير تفاصيل شخصية مميزة تشمل عبوات المياه، وصناديق المناديل، والهدايا الراقية، لضمان إقامة لا تُنسى.</p>
                <p>كما يقدّم الطهاة لدينا قوائم طعام مخصصة تلبي مختلف الاحتياجات الغذائية، مع أطباق طازجة وصحية تتيح للضيوف الاستمتاع بتجربة ضيافة استثنائية تشمل المقبلات الفاخرة والحلويات الراقية.</p>
                <p>ويُخصص الدور السادس بالكامل لتجربة ضيافة فاخرة تحاكي أرقى الفنادق العالمية، بإشراف فريق خدمة عملاء عالي التدريب والكفاءة. ويضم الدور أربعة أنواع من الأجنحة الداخلية الأنيقة، المجهزة بأحدث وسائل الراحة العصرية مثل أجهزة التلفاز التفاعلية، والمطابخ الخاصة، وخدمة التدبير المنزلي على مدار الساعة.</p>
                <p>أما أجنحة «رويال أوركيد» الفاخرة، والمصممة خصيصًا لكبار الشخصيات، فتوفّر أعلى مستويات الخصوصية والأمان، حيث تضم جناحًا واسعًا مع قاعة استقبال خاصة، إضافة إلى أثاث فاخر، وخيارات طعام خاصة، ومجموعة مختارة من منتجات العناية الشخصية عالية الجودة.</p>
                <p>وتضمن خدمات الضيافة الراقية في رويال حياة توفير مجموعة متكاملة من الخدمات، تشمل الضيافة والتموين، تنسيقات الزهور، وخيارات الترفيه، بما يتناسب مع احتياجات كل ضيف. كما يتوفر أيضًا مركز الرضاعة الطبيعية وتهيئة الولادة (Lamaze) في الدور السادس.</p>
              </>) : (<>
                <p>Royale Hayat Hospital offers exclusive services to enhance patient and guest experiences during special occasions. They provide personalized items such as water bottles, tissue boxes, and gifts, ensuring a memorable stay. Royale Hayat Hospital's executive chefs cater to special diets with fresh, nutritious food, allowing guests to enjoy gourmet hors d'oeuvres or desserts.</p>
                <p>The sixth floor of Royale Hayat Hospital is dedicated to exclusivity, resembling the finest hotels, and boasts a highly trained customer service staff. It features four types of elegantly decorated inpatient suites with modern amenities like interactive TVs, kitchens, and 24-hour housekeeping.</p>
                <p>The most extravagant Royale Orchid Suites, designed for VIPs, provide unmatched privacy and security, featuring a large suite with an adjoining reception hall. Guests enjoy lavish furnishings, private dining options, and a selection of high-quality personal care products.</p>
                <p>Royale Hayat Hospital's exclusive hospitality ensures a range of services, including catering, floral designs, and entertainment, tailored to individual needs. Furthermore, a Lactation & Lamaze facility is available on the sixth floor.</p>
              </>)}
            </div>
          </ScrollAnimationWrapper>
          <div className="mt-8 text-center space-y-4">
            <a
              href="tel:+96525360573"
              dir="ltr"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors [direction:ltr] [unicode-bidi:isolate]"
            >
              <Phone className="w-4 h-4" />
              +965 2536 0573
            </a>
            <div>
              <button
                type="button"
                onClick={() => setEventBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
              >
                {isAr ? "اضغط لحجز مناسبتك" : "Book your Event Online"}
              </button>
            </div>
          </div>
          {
}
        </div>
      </section>}
      {show("halls") && <section className="py-6 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <ScrollAnimationWrapper>
            {showAll && <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">{isAr ? "قاعات احتفالات الولادة" : "Birth Celebration Halls"}</h2>}
            <div className={`flex justify-center gap-2 flex-wrap ${showAll ? 'mt-6' : 'mt-2'} mb-10`}>
              {hallsNav.map((h) => (
                <button key={h.id} onClick={() => setActiveHall(h.id)}
                  className={`px-5 py-2.5 rounded-full font-body text-xs tracking-wide transition-all ${activeHall === h.id ? "bg-primary text-primary-foreground" : "bg-popover border border-border/50 text-muted-foreground hover:bg-muted/50"}`}>
                  {h.label}
                </button>
              ))}
            </div>
          </ScrollAnimationWrapper>
          {activeHall === "gardenia" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key="gardenia">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[400px]">
                  <iframe
                    id="tour-embeded"
                    name="GARDENIA HALL"
                    src="https://tour.panoee.net/iframe/6a1ff18fc6404495aa0daee6"
                    title={isAr ? "جولة 360 لقاعة جاردينيا" : "Gardenia Banquet Hall 360 Tour"}
                    width="100%"
                    height="400px"
                    frameBorder="0"
                    scrolling="no"
                    allow={PANOEE_IFRAME_ALLOW}
                    allowFullScreen
                    className="w-full h-full"
                    loading="eager"
                  />
                </div>
                <ScrollAnimationWrapper>
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-4">{isAr ? "قاعة جاردينيا للاحتفالات" : "Gardenia Banquet Hall"}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                      {isAr
                        ? "تُعد قاعة جاردينيا الوجهة المثالية لاستضافة الفعاليات المتوسطة والكبيرة، حيث صُممت بعناية لتجمع بين الأناقة، المرونة، والراحة ضمن أجواء راقية ومميزة. حيث تتميز القاعة بسعة تصل إلى 150 ضيفًا بتنسيق المسرح، مما يجعلها خيارًا مثاليًا لمجموعة متنوعة من المناسبات والفعاليات."
                        : "The Gardenia Banquet Hall is our premier venue, thoughtfully designed to accommodate medium to large gatherings in an elegant and versatile setting. With a generous seating capacity of up to 150 guests in a theatre-style configuration, this hall offers an exceptional space for a wide variety of events."}
                    </p>
                    <h4 className="font-serif text-base text-foreground mb-3">{renderColonHeading(isAr ? "مثالية لكل من:" : "Ideal for:")}</h4>
                    <div className="space-y-2 mb-5">
                      {(isAr
                        ? ["احتفالات استقبال المواليد", "الندوات الصحية والتوعوية", "المؤتمرات الطبية", "المناسبات العائلية والاحتفالات الخاصة"]
                        : ["Birth celebrations", "Wellness seminars", "Medical conferences", "Family milestones and special occasions"]
                      ).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <h4 className="font-serif text-base text-foreground mb-3">{renderColonHeading(isAr ? "أنماط الترتيب المتوفرة:" : "Available Setup Styles:")}</h4>
                    <div className="space-y-2 mb-5">
                      {(isAr
                        ? ["الديوانية", "المسرح", " - U حرف", "الصفوف الدراسية", "تنسيق الكاباريه", "الطاولات المستديرة"]
                        : ["Diwaniya", "Theatre", "U-Shape", "Classroom", "Cabaret", "Round Tables"]
                      ).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{renderSetupStyleLabel(item, isAr)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                      {isAr
                        ? "بفضل تصميمها المرن، وديكورها الأنيق، وخدماتها المخصصة، تضمن قاعة جاردينيا تجربة استثنائية راقية ومتكاملة لجميع مناسباتكم"
                        : "With its flexible layout, stunning interior, and personalized service, the Gardenia Banquet Hall guarantees a refined and seamless experience for your event."}
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <p className="font-body text-sm text-foreground text-justify">
                        {isAr ? "للحجز والاستفسار:" : "For bookings and more information, please call:"}{" "}
                        <a href="tel:+96525360573" dir="ltr" className={PHONE_LINK_CLASS}>{isAr ? "+965 2536 0573" : "+96525360573"}</a>
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              </div>
              <div className="mt-16 max-w-5xl mx-auto px-4 md:px-12">
                <ImageCarousel
                  images={gardeniaHallImages}
                  slide={gardeniaSlide}
                  setSlide={setGardeniaSlide}
                  altForIndex={(i) => (isAr ? `قاعة جاردينيا للاحتفالات ${i + 1}` : `Gardenia Banquet Hall image ${i + 1}`)}
                  autoPlay={activeHall === "gardenia"}
                  aspectClass="aspect-video"
                  onImageClick={setLightboxImage}
                  isAr={isAr}
                />
              </div>
            </motion.div>
          )}
          {activeHall === "aljouri" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key="aljouri">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[400px]">
                  <iframe
                    id="tour-embeded"
                    name="AL JOURI HALL"
                    src="https://tour.panoee.net/iframe/6a1fce16c64044079d0da91a"
                    title={isAr ? "جولة 360 لقاعة الجوري" : "Al Jouri Banquet Hall 360 Tour"}
                    width="100%"
                    height="400px"
                    frameBorder="0"
                    scrolling="no"
                    allow={PANOEE_IFRAME_ALLOW}
                    allowFullScreen
                    className="w-full h-full"
                    loading="eager"
                  />
                </div>
                <ScrollAnimationWrapper>
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-4">{isAr ? "قاعة الجوري للاحتفالات" : "Al Jouri Banquet Hall"}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                      {isAr
                        ? "للمناسبات الأكثر خصوصية ودفئًا، توفر قاعة الجوري أجواءً مريحة وراقية، مما يجعلها الخيار الأمثل للتجمعات الصغيرة التي تركز على التواصل والضيافة الراقية."
                        : "For more intimate occasions, Al Jouri Hall offers a warm and inviting atmosphere, making it the ideal choice for smaller-scale events where personal connection and comfort are paramount."}
                    </p>
                    <h4 className="font-serif text-base text-foreground mb-3">{renderColonHeading(isAr ? "مثالية لـ:" : "Ideal for:")}</h4>
                    <div className="space-y-2 mb-5">
                      {(isAr
                        ? ["الفعاليات حتى 100 ضيف", "التجمعات العائلية والاجتماعات الودية", "جلسات النقاش واللقاءات الخاصة", "مساحات جلوس تقليدية مصممة لتعزيز التواصل والراحة"]
                        : ["Up to 100 guests", "Casual gatherings", "Discussions", "Traditional seating arrangements that foster conversation and warmth"]
                      ).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <p className="font-body text-sm text-foreground text-justify">
                        {isAr ? "للحجز والاستفسار:" : "For bookings and more information, please call:"}{" "}
                        <a href="tel:+96525360573" dir="ltr" className={PHONE_LINK_CLASS}>{isAr ? "+965 2536 0573" : "+96525360573"}</a>
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              </div>
              <div className="mt-16 max-w-5xl mx-auto px-4 md:px-12">
                <ImageCarousel
                  images={alJouriHallImages}
                  slide={alJouriSlide}
                  setSlide={setAlJouriSlide}
                  altForIndex={(i) => (isAr ? `قاعة الجوري للاحتفالات ${i + 1}` : `Al Jouri Banquet Hall image ${i + 1}`)}
                  autoPlay={activeHall === "aljouri"}
                  aspectClass="aspect-video"
                  onImageClick={setLightboxImage}
                  isAr={isAr}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>}
      {section === "cafe" && <section className="py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-1 lg:order-2">
              <ImageCarousel
                images={cafeImages}
                slide={cafeSlide}
                setSlide={setCafeSlide}
                altForIndex={(i) => (isAr ? `الليوان بيسترو ${i + 1}` : `Al Liwan Bistro image ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="order-2 lg:order-1 min-w-0">
              <div className="min-w-0">
                <div className="hidden lg:flex items-center gap-3 mb-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground min-w-0">{t("alLiwanCafe")}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr
                    ? CAFE_AR_INTRO
                    : "At the heart of the lobby, Al Liwan Bistro (Restaurant & Lounge) offers an inviting setting where the aromas of freshly prepared dishes and handcrafted desserts gently fill the air. Relax in a sophisticated space, surrounded by elegant interiors and the soft sounds of live music, creating a calm and welcoming atmosphere."}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr
                    ? CAFE_AR_MENU
                    : "Enjoy a refined dining experience featuring Arabian specialties alongside a curated selection of international cuisine. The menu includes freshly squeezed juices, smoothies, gourmet burgers, salads, sandwiches, and wraps. Complete your experience with a slice of cake or a freshly baked pastry, paired with specialty coffees and teas."}
                </p>
                {isAr && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                    {CAFE_AR_DESSERT}
                  </p>
                )}
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
                  {isAr
                    ? CAFE_AR_HOURS
                    : "Open daily from 8 a.m. to 11 p.m., Al Liwan Bistro is an ideal destination for breakfast, lunch, dinner, or a light bite at any time of day."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {section === "spa" && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{isAr ? "Elements Spa" : "Elements Spa by Banyan Tree"}</h2>
          </div>
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
            <div className="lg:col-start-1 lg:row-start-1">
              <ImageCarousel
                images={spaImages}
                slide={spaSlide}
                setSlide={setSpaSlide}
                altForIndex={(i) => (isAr ? `إليمنتس سبا ${i + 1}` : `Elements Spa image ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="lg:col-start-2 lg:row-start-1">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "Elements Spa" : "Elements Spa by Banyan Tree"}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                  {isAr
                    ? SPA_AR_DESC
                    : "Elements Spa, in collaboration with the award-winning Banyan Tree Hotels & Resorts, brings the essence of time-honored remedies and holistic wellness traditions to Royale Hayat Hospital."}
                </p>
                <div className="mb-5">
                  <h4 className="font-serif text-base text-foreground mb-3">{renderColonHeading(isAr ? "خدماتنا تشمل" : "Our Services Include:")}</h4>
                  <div className="space-y-2">
                    {(isAr ? SPA_AR_SERVICES : SPA_EN_SERVICES).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <p className="font-body tracking-normal [word-spacing:normal] text-sm text-muted-foreground leading-relaxed text-start md:text-justify">
                  {isAr ? "لمزيد من التفاصيل، يرجى زيارة: " : "For more details, please visit: "}
                  <a href="https://www.banyantreespa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">www.banyantreespa.com</a>
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {show("suites") && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <ScrollAnimationWrapper>
            {showAll && (
              <>
                {isAr && <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-2 text-center">تجربة استثنائية</p>}
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">{isAr ? "الأجنحة الفاخرة" : "Exclusive Suites"}</h2>
              </>
            )}
            <p className="text-muted-foreground font-body text-sm text-justify mb-8 max-w-2xl mx-auto text-center">
              {isAr
                ? "اختياركم يمتد عبر سبع فئات مميزة من الأجنحة، يحمل كل منها اسم زهرة ويقدم تجربة إقامة فريدة تجمع بين الفخامة، الخصوصية، والراحة الراقية."
                : "Choose from seven distinctive suite categories, each named after a flower and designed to offer a unique experience."}
            </p>
          </ScrollAnimationWrapper>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {suitesData.map((s, i) => (
              <button key={i} onClick={() => setActiveSuite(i)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wide transition-all ${activeSuite === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border/50 text-muted-foreground hover:bg-muted/50"}`}>
                {s.tabLabel}
              </button>
            ))}
          </div>
          <motion.div key={activeSuite} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            {activeSuite !== 0 && !activeSuite360Tour ? (
              
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <ImageCarousel
                  images={activeSuiteImages}
                  slide={suiteSlide}
                  setSlide={setSuiteSlide}
                  altForIndex={(i) => (isAr ? `صورة ${currentSuite.name} ${i + 1}` : `${currentSuite.name} image ${i + 1}`)}
                  autoPlay
                  imageClass={activeSuite === ORCHID_SUITE_INDEX ? orchidSuiteCarouselImageClass : undefined}
                  onImageClick={setLightboxImage}
                  isAr={isAr}
                />
                <div>
                  <h3 className="text-xl font-serif text-foreground mb-2">{currentSuite.name}</h3>
                  <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                  <p className={`font-body text-sm text-muted-foreground leading-relaxed text-justify ${"desc2" in currentSuite && currentSuite.desc2 ? "mb-4" : "mb-6"}`}>{currentSuite.desc}</p>
                  {"desc2" in currentSuite && currentSuite.desc2 && (
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-6">{currentSuite.desc2}</p>
                  )}
                  {currentSuite.highlights && (
                    <div className="space-y-2 mb-6 text-justify">
                      {isAr && <h4 className="font-serif text-base text-foreground mb-2">{renderColonHeading("مميزات الجناح")}</h4>}
                      {currentSuite.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentSuite.dimensions && (
                    <div className="mb-6 text-justify">
                      <h4 className="font-serif text-base text-foreground mb-2">{renderColonHeading(isAr ? "مساحات الجناح" : "Suite Dimensions:")}</h4>
                      <div className="space-y-1">
                        {currentSuite.dimensions.map((d, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-body text-sm text-foreground">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mb-6 text-justify">
                    <h4 className="font-serif text-base text-foreground mb-3">
                      {renderColonHeading(
                        "amenitiesTitle" in currentSuite && currentSuite.amenitiesTitle
                          ? currentSuite.amenitiesTitle
                          : isAr
                            ? "مرافق وخدمات الجناح"
                            : "In-Suite Features & Amenities:",
                      )}
                    </h4>
                    <div className="space-y-2 mb-4">
                      {currentSuite.amenities.map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="font-body text-sm text-foreground">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Phone className="w-4 h-4 text-accent" />
                    <p className="font-body text-sm text-foreground text-justify">
                      {isAr ? "للحجز والاستفسار:" : "For bookings and more information, please call:"}{" "}
                      <a href={`tel:${currentSuite.phone}`} dir="ltr" className={PHONE_LINK_CLASS}>
                        {"phoneDisplay" in currentSuite && currentSuite.phoneDisplay ? currentSuite.phoneDisplay : currentSuite.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ) : activeSuite360Tour ? (
              <>
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[400px]">
                    <iframe
                      id="tour-embeded"
                      name={activeSuite360Tour.iframeName}
                      src={activeSuite360Tour.src}
                      title={isAr ? activeSuite360Tour.titleAr : activeSuite360Tour.titleEn}
                      width="100%"
                      height="400px"
                      frameBorder="0"
                      scrolling="no"
                      allow={PANOEE_IFRAME_ALLOW}
                      allowFullScreen
                      className="w-full h-full"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-2">{currentSuite.name}</h3>
                    <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                    <p className={`font-body text-sm text-muted-foreground leading-relaxed text-justify ${"desc2" in currentSuite && currentSuite.desc2 ? "mb-4" : "mb-6"}`}>{currentSuite.desc}</p>
                    {"desc2" in currentSuite && currentSuite.desc2 && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-6">{currentSuite.desc2}</p>
                    )}
                    <div className="mb-6 text-justify">
                      <h4 className="font-serif text-base text-foreground mb-3">
                        {renderColonHeading(
                          "amenitiesTitle" in currentSuite && currentSuite.amenitiesTitle
                            ? currentSuite.amenitiesTitle
                            : isAr
                              ? "مرافق وخدمات الجناح"
                              : "In-Suite Features & Amenities:",
                        )}
                      </h4>
                      <div className="space-y-2 mb-4">
                        {currentSuite.amenities.map((a, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="font-body text-sm text-foreground">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <Phone className="w-4 h-4 text-accent" />
                      <p className="font-body text-sm text-foreground text-justify">
                        {isAr ? "للحجز والاستفسار:" : "For bookings and more information, please call:"}{" "}
                        <a href={`tel:${currentSuite.phone}`} dir="ltr" className={PHONE_LINK_CLASS}>
                          {"phoneDisplay" in currentSuite && currentSuite.phoneDisplay ? currentSuite.phoneDisplay : currentSuite.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-16 max-w-5xl mx-auto px-4 md:px-12">
                  <ImageCarousel
                    images={activeSuiteImages}
                    slide={suiteSlide}
                    setSlide={setSuiteSlide}
                    altForIndex={(i) => (isAr ? `صورة ${currentSuite.name} ${i + 1}` : `${currentSuite.name} image ${i + 1}`)}
                    autoPlay
                    aspectClass="aspect-video"
                    imageClass={activeSuite === ORCHID_SUITE_INDEX ? orchidSuiteCarouselImageClass : undefined}
                    onImageClick={setLightboxImage}
                    isAr={isAr}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[340px] order-2 lg:order-2">
                    {activeSuite === 0 ? (
                      <iframe
                        src="https://tour.panoee.net/iframe/royaleorchid"
                        title="Royale Orchid Suite 360 Tour"
                        width="100%"
                        height="340px"
                        frameBorder="0"
                        allow={PANOEE_IFRAME_ALLOW}
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="font-body text-xs text-muted-foreground text-justify">{isAr ? "صور الجناح قريباً" : `${currentSuite.name} images coming soon`}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="order-1 lg:order-1">
                    <h3 className="text-xl font-serif text-foreground mb-2">{currentSuite.name}</h3>
                    <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">{currentSuite.desc}</p>
                    {currentSuite.highlights && (
                      <div className="space-y-2 mb-4">
                        {isAr && <h4 className="font-serif text-base text-foreground mb-2">{renderColonHeading("مميزات الجناح")}</h4>}
                        {currentSuite.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="font-body text-sm text-foreground">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentSuite.extraDesc && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">{currentSuite.extraDesc}</p>
                    )}
                    {currentSuite.dimensions && (
                      <div className="mb-4">
                        <h4 className="font-serif text-base text-foreground mb-2">{renderColonHeading(isAr ? "مساحات الجناح" : "Suite Dimensions:")}</h4>
                        <div className="space-y-1">
                          {currentSuite.dimensions.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="font-body text-sm text-foreground">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-10 items-start mt-16">
                  <ImageCarousel
                    images={orchidSuiteImages}
                    slide={orchidSlide}
                    setSlide={setOrchidSlide}
                    altForIndex={(i) => (isAr ? `صورة ${currentSuite.name} ${i + 1}` : `${currentSuite.name} image ${i + 1}`)}
                    autoPlay={activeSuite === 0}
                    imageClass={orchidSuiteCarouselImageClass}
                    onImageClick={setLightboxImage}
                    isAr={isAr}
                  />
                  <div>
                    <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                    <div className="mb-6">
                      <h4 className="font-serif text-base text-foreground mb-3">
                        {renderColonHeading(isAr ? "مرافق وخدمات الجناح" : "In-Suite Features & Amenities:")}
                      </h4>
                      <div className="space-y-2 mb-4">
                        {currentSuite.amenities.map((a, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="font-body text-sm text-foreground">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {currentSuite.hospitality && (
                      <div className="mb-6">
                        <h4 className="font-serif text-base text-foreground mb-2">
                          {renderColonHeading(isAr ? "خدمات الضيافة الفاخرة" : "Premium Hospitality Services:")}
                        </h4>
                        <div className="space-y-2">
                          {currentSuite.hospitality.map((h, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Star className="w-4 h-4 text-accent flex-shrink-0" />
                              <span className="font-body text-sm text-foreground">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-6">
                      <Phone className="w-4 h-4 text-accent" />
                      <p className="font-body text-sm text-foreground text-justify">
                        {isAr ? "للحجز ولمزيد من المعلومات، يرجى الاتصال على:" : "For bookings and more information, please call:"}{" "}
                        <a href={`tel:${currentSuite.phone}`} dir="ltr" className={PHONE_LINK_CLASS}>
                          {"phoneDisplay" in currentSuite && currentSuite.phoneDisplay ? currentSuite.phoneDisplay : currentSuite.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {currentSuite.hall && (
              <div className="bg-popover border border-border/50 rounded-2xl p-6 mt-16">
                <h4 className="font-serif text-base text-foreground mb-2">{renderColonHeading(currentSuite.hall.title)}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-3">{currentSuite.hall.desc}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-serif text-sm text-foreground mb-2">{renderColonHeading(isAr ? "مواصفات القاعة" : "Hall Specifications:")}</h5>
                    <div className="space-y-1">
                      {currentSuite.hall.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-serif text-sm text-foreground mb-2">{renderColonHeading(isAr ? "المميزات الفاخرة" : "Premium Features:")}</h5>
                    <div className="space-y-1">
                      {currentSuite.hall.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Star className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>}
      {showAll && <section className="py-6 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">
              {isAr ? "تجارب الاحتفال داخل الأجنحة" : "In-Suite Celebration Experiences"}
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-2 lg:order-2">
              {inRoomEventGalleryImages.length > 0 ? (
                <ImageCarousel
                  images={inRoomEventGalleryImages}
                  slide={inRoomSlide}
                  setSlide={setInRoomSlide}
                  altForIndex={(i) => (isAr ? `فعالية في الغرفة ${i + 1}` : `In-room event ${i + 1}`)}
                  autoPlay
                  onImageClick={setLightboxImage}
                  isAr={isAr}
                />
              ) : (
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-border/50 bg-popover shadow-lg">
                  <div className="flex h-full w-full items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <Image className="mx-auto mb-2 h-10 w-10 text-muted-foreground/50" />
                      <p className="font-body text-xs text-muted-foreground text-justify">{isAr ? "صور قريباً" : "Photos coming soon"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ScrollAnimationWrapper className="order-1 lg:order-1">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                    {isAr ? "تجارب الاحتفال داخل الأجنحة" : "In-Suite Celebration Experiences"}
                  </h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                  {isAr
                    ? "اصنعوا لحظات لا تُنسى واحتفلوا بمناسباتكم الخاصة بكل خصوصية وراحة داخل أجنحتكم الفاخرة، حيث تلتقي الأجواء الدافئة بالضيافة الراقية لتمنحكم تجربة استثنائية مليئة بالذكريات الجميلة."
                    : "Prefer a more private and intimate celebration? We offer the perfect opportunity to host unforgettable moments right within the comfort and elegance of your suite."}
                </p>
                {isAr ? (
                  <>
                    <h3 className="font-serif text-base text-foreground mb-2">خدماتنا</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                      نقدم مجموعة متكاملة من الخدمات المصممة بعناية لتحويل مناسبتكم إلى تجربة استثنائية لا تُنسى.
                    </p>
                    <div className="space-y-4 mb-6">
                      {[
                        {
                          icon: Gift,
                          title: "تصميم وديكور مخصص",
                          desc: "نقوم بتنسيق وتجهيز الجناح بما يتناسب مع طابع مناسبتكم الخاصة وأسلوبكم الفريد. من تنسيقات الورود والبالونات إلى الإضاءة والأقمشة الفاخرة، حيث يتم تصميم كل تفصيل بعناية ليعكس رؤيتكم ويمنحكم أجواءً مميزة.",
                        },
                        {
                          icon: UtensilsCrossed,
                          title: "ضيافة ومأكولات فاخرة",
                          desc: "استمتعوا بتجربة طعام راقية تضم تشكيلة مختارة من الأطباق المُعدة بعناية من مطابخنا المتخصصة.\n\nمن المقبلات الفاخرة إلى الحلويات الراقية، نحرص على تقديم تجربة ضيافة استثنائية ترضي جميع الأذواق.",
                        },
                        {
                          icon: UserCheck,
                          title: "خدمة كبير الخدم",
                          desc: "يتواجد فريقنا المتخصص لخدمتكم والاهتمام بجميع التفاصيل طوال المناسبة، من استقبال الضيوف وحتى ترتيب وتنظيم الأجواء، لنضمن لكم تجربة سلسة ومريحة بكل احترافية وخصوصية.",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-body text-sm font-semibold text-foreground mb-1">{item.title}</p>
                            <p className="font-body text-xs text-muted-foreground leading-relaxed text-justify whitespace-pre-line">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <h3 className="font-serif text-base text-foreground mb-3">المناسبات التي نقوم بتنسيقها</h3>
                    <div className="space-y-2 mb-6">
                      {[
                        "احتفالات استقبال المواليد",
                        "أعياد الميلاد والذكرى السنوية",
                        "حفلات الاستقبال والتجمعات العائلية",
                        "المفاجآت الخاصة للمرضى والضيوف",
                        "جميع المناسبات المميزة التي تستحق الاحتفال",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <h3 className="font-serif text-base text-foreground mb-2">احجز مناسبتك اليوم</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                      فريقنا المتخصص على أتم الاستعداد لمساعدتكم في تنظيم مناسبة استثنائية تبقى في الذاكرة
                    </p>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 mb-5">
                      {[
                        { icon: Gift, title: "Custom Design & Décor", desc: "Balloons, flowers, lighting and fabrics tailored to your occasion." },
                        { icon: UtensilsCrossed, title: "Gourmet Catering", desc: "Curated dishes from our kitchen, from appetizers to desserts." },
                        { icon: UserCheck, title: "Butler Service", desc: "Professional service from reception to cleanup." },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-body text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="font-body text-xs text-muted-foreground leading-relaxed text-justify">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-5">
                      {[
                        "Newborn celebrations",
                        "Birthdays and anniversaries",
                        "Reception parties and family gatherings",
                        "Personalized surprises for patients and guests",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex flex-col items-start gap-4">
                  <a href="tel:+96525360573" dir="ltr" className={`inline-flex items-center gap-2 font-body text-sm ${PHONE_LINK_CLASS}`}>
                    <Phone className="w-4 h-4" />
                    +965 2536 0573
                  </a>
                  <button
                    type="button"
                    onClick={() => setEventBookingOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    {isAr ? "احجز مناسبتك اليوم" : "Book your Event Online"}
                  </button>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {showAll && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{isAr ? "Elements Spa" : "Elements Spa by Banyan Tree"}</h2>
          </div>
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
            <div className="lg:col-start-1 lg:row-start-1">
              <ImageCarousel
                images={spaImages}
                slide={spaSlide}
                setSlide={setSpaSlide}
                altForIndex={(i) => (isAr ? `إليمنتس سبا ${i + 1}` : `Elements Spa image ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="lg:col-start-2 lg:row-start-1">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "Elements Spa" : "Elements Spa by Banyan Tree"}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-5">
                  {isAr
                    ? SPA_AR_DESC
                    : "Elements Spa, in collaboration with the award-winning Banyan Tree Hotels & Resorts, brings the essence of time-honored remedies and holistic wellness traditions to Royale Hayat Hospital."}
                </p>
                <div className="mb-5">
                  <h4 className="font-serif text-base text-foreground mb-3">{renderColonHeading(isAr ? "خدماتنا تشمل" : "Our Services Include:")}</h4>
                  <div className="space-y-2">
                    {(isAr ? SPA_AR_SERVICES : SPA_EN_SERVICES).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
                  {isAr ? "لمزيد من التفاصيل، يرجى زيارة: " : "For more details, please visit: "}
                  <a href="https://www.banyantreespa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">www.banyantreespa.com</a>
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {showAll && <section className="py-6 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-1 lg:order-2">
              <ImageCarousel
                images={cafeImages}
                slide={cafeSlide}
                setSlide={setCafeSlide}
                altForIndex={(i) => (isAr ? `الليوان بيسترو ${i + 1}` : `Al Liwan Bistro image ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="order-2 lg:order-1 min-w-0">
              <div className="min-w-0">
                <div className="hidden lg:flex items-center gap-3 mb-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground min-w-0">{t("alLiwanCafe")}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr
                    ? CAFE_AR_INTRO
                    : "At the heart of the lobby, Al Liwan Bistro (Restaurant & Lounge) offers an inviting setting where the aromas of freshly prepared dishes and handcrafted desserts gently fill the air. Relax in a sophisticated space, surrounded by elegant interiors and the soft sounds of live music, creating a calm and welcoming atmosphere."}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr
                    ? CAFE_AR_MENU
                    : "Enjoy a refined dining experience featuring Arabian specialties alongside a curated selection of international cuisine. The menu includes freshly squeezed juices, smoothies, gourmet burgers, salads, sandwiches, and wraps. Complete your experience with a slice of cake or a freshly baked pastry, paired with specialty coffees and teas."}
                </p>
                {isAr && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                    {CAFE_AR_DESSERT}
                  </p>
                )}
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
                  {isAr
                    ? CAFE_AR_HOURS
                    : "Open daily from 8 a.m. to 11 p.m., Al Liwan Bistro is an ideal destination for breakfast, lunch, dinner, or a light bite at any time of day."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {showAll && <section className="py-6 bg-muted/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden text-center mb-4">
            <h2 className="text-2xl font-serif text-foreground mb-2">
              {isAr ? FIFTH_FLOOR_AR_TITLE : "The 5th Floor Café"}
            </h2>
            {isAr && (
              <p className="font-body text-sm text-accent tracking-wide">
                {FIFTH_FLOOR_AR_SUBTITLE}
              </p>
            )}
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-2 lg:order-1">
              <ImageCarousel
                images={fifthFloorCafeImages}
                slide={fifthCafeSlide}
                setSlide={setFifthCafeSlide}
                altForIndex={(i) => (isAr ? `${FIFTH_FLOOR_AR_TITLE} ${i + 1}` : `The 5th Floor Cafe image ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="order-3 lg:order-2 min-w-0">
              <div className="text-justify min-w-0">
                <div className="hidden lg:block text-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                    {isAr ? FIFTH_FLOOR_AR_TITLE : "The 5th Floor Café"}
                  </h2>
                  {isAr && (
                    <p className="font-body text-sm text-accent tracking-wide">
                      {FIFTH_FLOOR_AR_SUBTITLE}
                    </p>
                  )}
                </div>
                <p className="w-full font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr ? (
                    <>
                      {"يوفر "}
                      <span className="font-semibold text-foreground">{FIFTH_FLOOR_AR_TITLE}</span>
                      {FIFTH_FLOOR_AR_INTRO.replace(`يوفر ${FIFTH_FLOOR_AR_TITLE}`, "")}
                    </>
                  ) : "The Fifth Café, located on the 5th floor, offers a welcoming and comfortable space for guests to relax while waiting for appointments or visiting loved ones. Thoughtfully designed for families awaiting the arrival of a newborn or the completion of a procedure, it provides a calm and reassuring environment. Guests can enjoy freshly brewed coffee, a selection of sandwiches, fresh salads, and indulgent desserts — all served in a cozy setting that blends comfort with convenience."}
                </p>
                {isAr && (
                  <p className="w-full font-body text-sm text-muted-foreground leading-relaxed text-justify mb-6">
                    {FIFTH_FLOOR_AR_MENU}
                  </p>
                )}
                <h3 className="font-serif text-base text-foreground mb-3 text-left">
                  {renderColonHeading(isAr ? "ما نقدمه" : "What We Offer:")}
                </h3>
                <div className="space-y-2 mb-6 w-full text-justify">
                  {(isAr
                    ? FIFTH_FLOOR_AR_OFFERINGS
                    : ["Freshly brewed specialty coffee", "A selection of sandwiches", "Fresh salads", "Indulgent desserts"]
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="font-body text-sm text-muted-foreground text-justify">
                  {isAr ? FIFTH_FLOOR_AR_LOCATION : "5th Floor — Royale Hayat Hospital"}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {showAll && <section className="py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Baby className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{isAr ? "خدمات تصوير حديثي الولادة" : "Newborn Photography Services"}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-1 lg:order-2">
              <ImageCarousel
                images={babyImages}
                slide={babySlide}
                setSlide={setBabySlide}
                altForIndex={(i) => (isAr ? `تصوير المواليد ${i + 1}` : `Newborn photography ${i + 1}`)}
                autoPlay
                onImageClick={setLightboxImage}
                isAr={isAr}
              />
            </div>
            <ScrollAnimationWrapper className="order-2 lg:order-1">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "خدمات تصوير حديثي الولادة" : "Newborn Photography Services"}</h2>
                </div>
                <h3 className="font-serif text-lg text-foreground mb-4">{isAr ? "وثّقوا أجمل لحظات الحياة" : "Capture Life's Most Precious Moments"}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                  {isAr
                    ? NEWBORN_AR_INTRO
                    : "Welcoming your newborn is one of life's most cherished milestones. At Royale Hayat Hospital, we offer professional photography services to beautifully capture these special moments during your stay."}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify mb-6">
                  {isAr
                    ? NEWBORN_AR_DETAILS
                    : "Our skilled photographers, from one of Kuwait's leading digital studios, ensure every smile, glance, and joyful memory is preserved for you and your family to treasure for years to come."}
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <p className="font-body text-sm text-foreground text-justify">
                    {isAr ? "للاستفسار وحجز المواعيد:" : "For inquiries and appointments, please contact:"}{" "}
                    <a href="tel:+96525360960" dir="ltr" className={PHONE_LINK_CLASS}>{isAr ? "25360960" : "2536 0960"}</a>
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      <EventBookingModal isOpen={eventBookingOpen} isAr={isAr} onClose={() => setEventBookingOpen(false)} />
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-background/20 text-white hover:bg-background/35 transition-colors flex items-center justify-center"
              aria-label={isAr ? "إغلاق الصورة" : "Close image"}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt={isAr ? "صورة مكبرة" : "Enlarged image"}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default HospitalityServices;
