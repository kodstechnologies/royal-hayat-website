import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChatButton from "@/components/ChatButton";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Crown, Utensils, Sparkles, Flower2, Coffee, Phone, CheckCircle2, Baby, Image, Video, Bed, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
// @ts-ignore
import ReactPannellum from "react-pannellum";
import { useSearchParams, Link } from "react-router-dom";

type HospitalityServicesProps = {
  gardeniaHallImages: string[];
  alJouriHallImages: string[];
  orchidSuiteImages: string[];
  spaImages: string[];
  cafeImages: string[];
  suiteCarouselImagesByIndex: Record<number, string[]>;
};

const HospitalityServices = ({
  gardeniaHallImages,
  alJouriHallImages,
  orchidSuiteImages,
  spaImages,
  cafeImages,
  suiteCarouselImagesByIndex,
}: HospitalityServicesProps) => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const show = (s: string) => showAll || section === s;
  const [activeHall, setActiveHall] = useState("gardenia");
  const [activeSuite, setActiveSuite] = useState(0);
  const [suiteSlide, setSuiteSlide] = useState(0);
  const [orchidSlide, setOrchidSlide] = useState(0);
  const [spaSlide, setSpaSlide] = useState(0);
  const [cafeSlide, setCafeSlide] = useState(0);
  const activeSuiteImages = suiteCarouselImagesByIndex[activeSuite] ?? suiteCarouselImagesByIndex[6];

  useEffect(() => {
    if (activeSuite === 0) return;
    const timer = window.setInterval(() => {
      setSuiteSlide((prev) => (prev + 1) % activeSuiteImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [activeSuite, activeSuiteImages.length]);

  useEffect(() => {
    setSuiteSlide(0);
  }, [activeSuite]);

  useEffect(() => {
    if (activeSuite !== 0) return;
    const timer = window.setInterval(() => {
      setOrchidSlide((prev) => (prev + 1) % orchidSuiteImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [activeSuite, orchidSuiteImages.length]);

  useEffect(() => {
    if (spaImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setSpaSlide((prev) => (prev + 1) % spaImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [spaImages.length]);

  useEffect(() => {
    if (cafeImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setCafeSlide((prev) => (prev + 1) % cafeImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [cafeImages.length]);

  const hallsNav = [
    { id: "gardenia", label: isAr ? "قاعة غاردينيا" : "Gardenia Banquet Hall" },
    { id: "aljouri", label: isAr ? "قاعة الجوري" : "Al Jouri Banquet Hall" },
  ];

  const suitesData = [
    {
      name: isAr ? "جناح رويال أوركيد" : "Royale Orchid Suite",
      area: isAr ? "252 متر مربع (الجناح 130 م² + القاعة 122 م²)" : "252 sqm (Suite 130 sqm + Hall 122 sqm)",
      desc: isAr
        ? "تقدم أجنحة رويال أوركيد تجربة فريدة لمن يتوقعون الأفضل. مصممة للضيوف المعتادين على أرقى الأشياء في الحياة، توفر هذه الأجنحة الحصرية خصوصية وراحة لا مثيل لهما في بيئة مستوحاة من الأناقة الأوروبية الكلاسيكية."
        : "The Royale Orchid Suites offer a truly rarefied experience for those who expect nothing less than the extraordinary. Designed for guests accustomed to the finest things in life, these exclusive suites provide unmatched privacy and comfort within a setting inspired by classic European elegance.",
      highlights: isAr
        ? ["تقدير كامل واهتمام شخصي", "تنسيق سلس للرعاية الصحية وخدمات الضيوف", "لمسات مدروسة تخلق ذكريات دائمة لك ولعائلتك وضيوفك"]
        : ["Complete discretion and personalized attention", "Seamless coordination of healthcare and guest services", "Thoughtful touches that create lasting memories for you, your family, and your guests"],
      extraDesc: isAr
        ? "من المفروشات الفاخرة إلى مناطق الاستقبال الخاصة وتناول الطعام الفاخر في الغرفة، كل عنصر مصمم لراحتك وراحة بالك."
        : "From luxurious furnishings to private hosting areas and fine in-room dining, every element is tailored to your comfort, peace of mind, and sense of occasion.",
      dimensions: isAr
        ? ["مساحة الجناح: 130 متر مربع", "مساحة قاعة الجناح: 122 متر مربع", "المساحة الإجمالية: 252 متر مربع"]
        : ["Suite Room Area: 130 sqm", "Suite Hall Area: 122 sqm", "Total Suite Area: 252 sqm"],
      amenities: isAr
        ? ["سرير طبي ذكي Hill-Rom® لراحة المريض المثلى", "ديكور أوروبي أنيق مع مقاعد فاخرة ومفروشات مخصصة", "منطقة معيشة أوركيد الخاصة للأصدقاء والعائلة الزائرين", "غرفة مرافق مخصصة مع حمام خاص", "مطبخ صغير مجهز بثلاجة وقهوة وشاي مجاني", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية مخصصة للمرضى", "كاميرا حية متصلة بالحضانة لراحة البال", "هاتف IP للتواصل المريح", "إنترنت واي فاي عالي السرعة مجاني"]
        : ["Hill-Rom® intelligent medical bed for optimized patient comfort and care", "Elegant European-inspired décor with luxury seating and bespoke furnishings", "Private Orchid living area designed for visiting friends and family", "Dedicated companion room with private bathroom", "Pantry equipped with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive TV featuring Orbit-Showtime Network channels", "Dedicated patient education channel for informed care", "Live baby camera connection with the nursery for peace of mind", "IP telephone for convenient communication", "Complimentary high-speed Wi-Fi access"],
      hospitality: isAr
        ? ["خدمة تنظيف ورعاية شخصية على مدار الساعة", "تجربة طعام فاخرة مع قائمة طعام خاصة في الغرفة"]
        : ["24-hour housekeeping and personalized butler-style service", "Fine dining experience with an exclusive in-room private dining menu"],
      hall: {
        title: isAr ? "قاعة جناح رويال أوركيد – المواصفات والمرافق" : "Royale Orchid Suite Hall – Specifications & Amenities",
        desc: isAr
          ? "قاعة جناح رويال أوركيد هي مساحة استقبال خاصة أنيقة، مصممة لاستقبال ضيوفك بأناقة مع الحفاظ على خصوصية وراحة إقامتك."
          : "The Royale Orchid Suite Hall is an exquisite private reception space, designed to welcome your guests in style while maintaining the privacy and comfort of your hospital stay.",
        specs: isAr
          ? ["المساحة الإجمالية: 122 متر مربع", "مقاعد أنيقة لما يصل إلى 25 ضيفاً", "تستوعب حتى 50 ضيفاً للحفلات والتجمعات"]
          : ["Total Area: 122 square meters", "Elegant seating for up to 25 guests", "Accommodates up to 50 guests for receptions and gatherings"],
        features: isAr
          ? ["أثاث فاخر مصمم للراحة والأناقة", "نظام صوتي فردي للتحكم بالأجواء", "سقف زجاجي يغمر المكان بالضوء الطبيعي", "مدخل خاص للضيوف"]
          : ["Luxurious designer furniture curated for comfort and sophistication", "Individual sound system for personalized ambiance and audio control", "Stunning skylight, bathing the space in natural light", "Private guest entrance, offering discreet and direct access to the reception area"],
      },
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح أوركيد" : "Orchid Suite",
      area: isAr ? "130 متر مربع" : "130 sqm",
      desc: isAr
        ? "يشتهر بتصميمه الغريب والفريد، يقدم جناح أوركيد تجربة فريدة مصممة للضيوف الذين يقدرون أرقى الأشياء. هذا الملاذ الفاخر المستوحى من الأناقة الأوروبية الكلاسيكية يضع الخصوصية والراحة في المقدمة."
        : "Renowned for its exotic and unique design, the Orchid Suite offers a rarefied experience tailored for guests who appreciate the finest things in life. This lavish sanctuary, inspired by classic European elegance, places privacy and comfort at the forefront, ensuring a serene and exclusive stay.",
      amenities: isAr
        ? ["مساحة الجناح: 130 متر مربع", "سرير طبي ذكي Hill-Rom®", "مقاعد فاخرة ومنطقة استقبال", "صالة أوركيد الخاصة للأقارب والأصدقاء", "غرفة مرافق مع حمام خاص", "مطبخ صغير مع ثلاجة وقهوة وشاي مجاني", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية للمرضى", "نظام أمان الأم والطفل Hugs & Kisses", "كاميرا حية متصلة بالحضانة", "هاتف IP", "إنترنت واي فاي مجاني", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة حصرية"]
        : ["Suite Area: 130 square meters", "Hill-Rom® Intelligent Medical Bed for optimal patient comfort", "Luxury seating and a lavish reception area designed for you and your guests", "Private Orchid Lounge for visiting relatives and friends", "Companion room with private bathroom", "Pantry equipped with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive television featuring your favorite channels on the Orbit-Showtime Network", "Dedicated patient education channel for informative care", "Hugs & Kisses Mother & Baby Security System for peace of mind", "Live baby camera connection with the nursery", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "24-hour housekeeping service ensures a pristine environment", "Exclusive private dining menu tailored to your preferences"],
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح لوتس" : "Lotus Suite",
      area: isAr ? "130 متر مربع" : "130 sqm",
      desc: isAr
        ? "سُمي على اسم زهرة اللوتس الأنيقة، هذه الأجنحة مصممة لإلهام الشفاء الجسدي والروحي. تتميز بغرفة نوم ومنطقة استقبال مصممتين بإتقان ومغمورتين بالضوء الطبيعي."
        : "Aptly named after the graceful lotus, these suites are designed to inspire both physical and spiritual healing. Featuring an exquisitely crafted bedroom and reception area, each suite is flooded with natural light, creating a serene and uplifting atmosphere.",
      amenities: isAr
        ? ["مساحة الجناح: 130 متر مربع", "سرير طبي ذكي Hill-Rom®", "مقاعد فاخرة أنيقة", "غرفة مرافق مع حمام خاص", "مطبخ صغير مجهز بالكامل مع ثلاجة وقهوة وشاي مجاني", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية للمرضى", "نظام أمان الأم والطفل Hugs & Kisses", "كاميرا حية متصلة بالحضانة", "هاتف IP", "إنترنت واي فاي مجاني", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة حصرية"]
        : ["Suite Area: 130 square meters", "Hill-Rom® Intelligent Medical Bed for enhanced patient comfort", "Elegant luxury seating in the reception area", "Companion room with private bathroom", "Fully equipped pantry and mini kitchen with a refrigerator, complimentary coffee, and tea-making facilities", "Interactive television featuring your favorite channels via the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for seamless communication", "Complimentary high-speed Wi-Fi internet access", "24-hour housekeeping service", "Exclusive private dining menu tailored to your preferences"],
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح ياسمين" : "Jasmine Suite",
      area: isAr ? "90 متر مربع" : "90 sqm",
      desc: isAr
        ? "يذكّر بجمال زهرة الياسمين الأنيق، هذه الأجنحة مفروشة بتصاميم كلاسيكية أنيقة مع لمسات من الحرير والخشب. يوفر جناح الياسمين ملاذاً فاخراً مثالياً لتدليل حواسك."
        : "Reminiscent of the graceful beauty of the Jasmine flower, these suites are furnished with elegant classical designs featuring rich silk and wood accents and adorned with locally sourced objet d'art. The Jasmine Suite provides a luxurious sanctuary, perfect for pampering your senses and enjoying a tranquil stay.",
      amenities: isAr
        ? ["مساحة الجناح: 90 متر مربع", "سرير طبي ذكي Hill-Rom®", "مقاعد فاخرة في منطقة الاستقبال", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية للمرضى", "نظام أمان الأم والطفل Hugs & Kisses", "كاميرا حية متصلة بالحضانة", "هاتف IP", "إنترنت واي فاي مجاني", "مطبخ صغير مع ثلاجة وقهوة وشاي مجاني", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة حصرية"]
        : ["Suite Area: 90 square meters", "Hill-Rom® Intelligent Medical Bed for superior patient comfort", "Luxury seating in the reception area", "Interactive television with your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "Mini kitchen with a refrigerator, complimentary coffee, and tea-making facilities", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح كاميليا" : "Camellia Suite",
      area: isAr ? "65 متر مربع" : "65 sqm",
      desc: isAr
        ? "مثل زهرة الكاميليا المثالية، تثير هذه الأجنحة الإعجاب بأجوائها الفاخرة ومفروشاتها المختارة بعناية. تقع في الطابق الثالث، وتتميز كل منها بمنطقة استقبال واسعة بلمسات كلاسيكية."
        : "Like the perfect blossom of the Camellia, these suites evoke admiration with their luxurious ambiance and carefully selected furnishings. Located on the 3rd floor, each suite features a comfortably spacious reception area accented with classical decorative touches, offering a warm and inviting atmosphere that will bring a smile to your face.",
      amenities: isAr
        ? ["مساحة الجناح: 65 متر مربع", "سرير طبي ذكي Hill-Rom®", "مقاعد مريحة ومنطقة استقبال واسعة", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية للمرضى", "نظام أمان الأم والطفل Hugs & Kisses", "كاميرا حية متصلة بالحضانة", "هاتف IP", "إنترنت واي فاي مجاني", "مطبخ صغير مع ثلاجة وقهوة وشاي مجاني", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة حصرية"]
        : ["Suite Area: 65 square meters", "Hill-Rom® Intelligent Medical Bed for optimal patient comfort", "Convenient seating and a large reception area", "Interactive television featuring your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for seamless communication", "Complimentary high-speed Wi-Fi internet access", "Pantry with a refrigerator, complimentary coffee, and tea-making facilities", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح ليلي" : "Lily Suite",
      area: isAr ? "32 متر مربع" : "32 sqm",
      desc: isAr
        ? "رمز لعذوبة زهرة الليلي، أجنحتنا في الطابق الثاني مفروشة بأناقة مع لمسات خشبية دقيقة مصممة لتوفير الراحة المطلقة أثناء إقامتك. توفر غرفة نوم واسعة وحمام فاخر ومنطقة جلوس مريحة."
        : "Symbolic of the sweetness of a Lily, our suites on the 2nd floor are charmingly furnished with subtle wooden accents, designed to provide you with absolute comfort during your stay. This elegant starting category offers a spacious bedroom, a lavish en-suite bathroom, and a cozy seating area.",
      amenities: isAr
        ? ["مساحة الجناح: 32 متر مربع", "سرير طبي ذكي Hill-Rom®", "منطقة جلوس فاخرة", "تلفزيون تفاعلي مع قنوات أوربت شوتايم", "قناة تعليمية للمرضى", "نظام أمان الأم والطفل Hugs & Kisses", "كاميرا حية متصلة بالحضانة", "هاتف IP", "إنترنت واي فاي مجاني", "ثلاجة صغيرة", "قهوة وشاي مجاني", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة حصرية"]
        : ["Suite Area: 32 square meters", "Hill-Rom® Intelligent Medical Bed for enhanced comfort", "Luxury seating area for relaxation", "Interactive television with your favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "Hugs & Kisses Mother & Baby Security System", "Live baby camera connection with the nursery", "IP telephone for convenient communication", "Complimentary high-speed Wi-Fi internet access", "Mini refrigerator", "Coffee and tea-making facilities are provided free of charge", "24-hour housekeeping service", "Exclusive private dining menu"],
      phone: "+96525360581",
    },
    {
      name: isAr ? "جناح ديزي" : "Daisy Suite",
      area: isAr ? "32 متر مربع" : "32 sqm",
      desc: isAr
        ? "مصمم خصيصاً للأطفال من 0 إلى 12 عاماً، أجنحة ديزي مصممة لإسعاد وترفيه صغارك أثناء إقامتهم. من الأسرّة المصممة خصيصاً إلى خيارات الترفيه المتنوعة، هذا الجناح الصديق للأطفال يشعرهم وكأنهم في جنة."
        : "Tailored especially for children aged 0 to 12 years, the Daisy Suites are designed to delight and entertain your little ones during their stay. From specially designed beds to a wide range of engaging entertainment options, this kid-friendly suite truly feels like a paradise for young guests.",
      amenities: isAr
        ? ["مساحة الجناح: 32 متر مربع", "سرير طبي ذكي Hill-Rom®", "منطقة جلوس ملونة", "تلفزيون تفاعلي مع القنوات المفضلة للأطفال", "قناة تعليمية للمرضى", "خدمات ألعاب عند الطلب", "برنامج DVD خاص للأطفال", "هاتف IP", "إنترنت واي فاي مجاني", "ثلاجة صغيرة", "قهوة وشاي للوالدين", "خدمة تنظيف على مدار الساعة", "قائمة طعام خاصة للأطفال"]
        : ["Suite Area: 32 square meters", "Hill-Rom® Intelligent Medical Bed for comfort and safety", "Colorful seating area to brighten the day", "Interactive television with your child's favorite channels from the Orbit-Showtime Network", "Dedicated patient education channel", "On-demand gaming services for fun and relaxation", "Special DVD program menu designed for kids", "IP telephone for easy communication", "Complimentary high-speed Wi-Fi internet access", "Mini refrigerator", "Coffee and tea-making facilities for parents", "24-hour housekeeping service", "Special kids' menu crafted to please young palates"],
      phone: "+96525360581",
    },
  ];

  const currentSuite = suitesData[activeSuite];

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="py-8 md:py-10 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("premiumExperience")}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {section === "halls" ? (isAr ? "القاعات الفاخرة" : " Halls")
                : section === "suites" ? (isAr ? "الأجنحة الفاخرة" : " Suites")
                  : section === "spa" ? (isAr ? "سبا إليمنتس" : "Elements Spa")
                    : section === "cafe" ? (isAr ? "مقهى الليوان" : "Al Liwan Café")
                      : t("luxuryServices")}
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Introduction */}
      {showAll && <section className="py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">{isAr ? "مقدمة" : "Introduction"}</h2>
            <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
              {isAr ? (<>
                <p>يقدم مستشفى رويال حياة خدمات فاخرة لتعزيز تجارب المرضى والضيوف خلال المناسبات الخاصة. نقدم عناصر مخصصة مثل زجاجات المياه وعلب المناديل والهدايا لضمان إقامة لا تُنسى. يلبي طهاتنا التنفيذيون الأنظمة الغذائية الخاصة بطعام طازج ومغذٍ.</p>
                <p>الطابق السادس مخصص للفخامة ويشبه أرقى الفنادق، ويضم طاقم خدمة عملاء مدرب تدريباً عالياً. يتميز بأربعة أنواع من الأجنحة المزينة بأناقة مع وسائل الراحة الحديثة.</p>
                <p>أجنحة رويال أوركيد الأكثر فخامة مصممة لكبار الشخصيات وتوفر خصوصية وأماناً لا مثيل لهما مع مفروشات فاخرة وخيارات طعام خاصة.</p>
                <p>تضمن ضيافة رويال حياة الفاخرة مجموعة من الخدمات بما في ذلك تقديم الطعام وتصاميم الزهور والترفيه المصممة حسب الاحتياجات الفردية.</p>
              </>) : (<>
                <p>RHH offers luxury services to enhance patient and guest experiences during special occasions. They provide personalized items such as water bottles, tissue boxes, and gifts, ensuring a memorable stay. RHH's executive chefs cater to special diets with fresh, nutritious food, allowing guests to enjoy gourmet hors d'oeuvres or desserts.</p>
                <p>The sixth floor of RHH is dedicated to luxury, resembling the finest hotels, and boasts a highly trained customer service staff. It features four types of elegantly decorated inpatient suites with modern amenities like interactive TVs, kitchens, and 24-hour housekeeping.</p>
                <p>The most extravagant Royale Orchid Suites, designed for VIPs, provide unmatched privacy and security, featuring a large suite with an adjoining reception hall. Guests enjoy lavish furnishings, private dining options, and a selection of high-quality personal care products.</p>
                <p>RHH's luxurious hospitality ensures a range of services, including catering, floral designs, and entertainment, tailored to individual needs. Furthermore, a Lactation & Lamaze facility is available on the sixth floor.</p>
              </>)}
            </div>
          </ScrollAnimationWrapper>

          <div className="mt-8 text-center">
            <a href="tel:+96525360573" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" />
              {isAr ? "احجز فعاليتك عبر الإنترنت" : "Book your Event Online"}
            </a>
          </div>

          {/* <div className="mt-10 aspect-video bg-muted/30 rounded-2xl border border-border flex items-center justify-center">
            <div className="text-center">
              <Video className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">{isAr ? "فيديو ترويجي للخدمات الفاخرة قريباً" : "Luxury Services promotional video coming soon"}</p>
            </div>
          </div> */}
        </div>
      </section>}

      {/* ===== OUR LUXURY HALLS ===== */}
      {show("halls") && <section className="py-6 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollAnimationWrapper>
            {showAll && <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">{isAr ? "القاعات الفاخرة" : "Halls"}</h2>}
            <div className={`flex justify-center gap-2 flex-wrap ${showAll ? 'mt-6' : 'mt-2'} mb-10`}>
              {hallsNav.map((h) => (
                <button key={h.id} onClick={() => setActiveHall(h.id)}
                  className={`px-5 py-2.5 rounded-full font-body text-xs tracking-wide transition-all ${activeHall === h.id ? "bg-primary text-primary-foreground" : "bg-popover border border-border/50 text-muted-foreground hover:bg-muted/50"}`}>
                  {h.label}
                </button>
              ))}
            </div>
          </ScrollAnimationWrapper>

          {/* Gardenia */}
          {activeHall === "gardenia" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key="gardenia">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gardeniaHallImages.map((src, index) => (
                    <div key={src} className="aspect-[4/3] rounded-xl border border-border overflow-hidden bg-muted/20">
                      <img
                        src={src}
                        alt={isAr ? `صورة قاعة غاردينيا ${index + 1}` : `Gardenia Banquet Hall image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-serif text-foreground mb-4">{isAr ? "قاعة غاردينيا" : "Gardenia Banquet Hall"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {isAr
                      ? "قاعة غاردينيا هي مكاننا الرئيسي، مصممة بعناية لاستيعاب التجمعات المتوسطة إلى الكبيرة في بيئة أنيقة ومتعددة الاستخدامات. بسعة تصل إلى 150 ضيفاً بتنسيق المسرح، توفر هذه القاعة مساحة استثنائية لمجموعة متنوعة من الفعاليات."
                      : "The Gardenia Banquet Hall is our premier venue, thoughtfully designed to accommodate medium to large gatherings in an elegant and versatile setting. With a generous seating capacity of up to 150 guests in theatre-style configuration, this hall offers an exceptional space for a wide variety of events."}
                  </p>
                  <h4 className="font-serif text-base text-foreground mb-3">{isAr ? "مثالية لـ:" : "Ideal for:"}</h4>
                  <div className="space-y-2 mb-6">
                    {(isAr ? ["احتفالات المواليد", "ندوات العافية", "المؤتمرات الطبية", "المناسبات العائلية والمناسبات الخاصة"] : ["Birth celebrations", "Wellness seminars", "Medical conferences", "Family milestones and special occasions"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <h4 className="font-serif text-base text-foreground mb-3">{isAr ? "أنماط التجهيز المتاحة:" : "Available Setup Styles:"}</h4>
                  <div className="space-y-2 mb-6">
                    {(isAr ? ["ديوانية", "مسرح", "شكل U", "فصل دراسي", "كباريه", "طاولات مستديرة"] : ["Diwaniya", "Theatre", "U-Shape", "Classroom", "Cabaret", "Round Tables"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {isAr
                      ? "بتصميمها المرن وديكورها الداخلي المذهل وخدمتها الشخصية، تضمن قاعة غاردينيا تجربة راقية وسلسة لفعاليتك."
                      : "With its flexible layout, stunning interior, and personalized service, the Gardenia Banquet Hall guarantees a refined and seamless experience for your event."}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Phone className="w-4 h-4 text-accent" />
                    <p className="font-body text-sm text-foreground">{isAr ? "للحجز والمزيد من المعلومات، اتصل:" : "For bookings and more information, please call:"} <a href="tel:+96525360573" className="text-accent hover:underline font-semibold">+96525360573</a></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Al Jouri */}
          {activeHall === "aljouri" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key="aljouri">
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {alJouriHallImages.map((src, index) => (
                    <div key={src} className="aspect-[4/3] rounded-xl border border-border overflow-hidden bg-muted/20">
                      <img
                        src={src}
                        alt={isAr ? `صورة قاعة الجوري ${index + 1}` : `Al Jouri Banquet Hall image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-serif text-foreground mb-4">{isAr ? "قاعة الجوري" : "Al Jouri Banquet Hall"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {isAr
                      ? "للمناسبات الأكثر حميمية، تقدم قاعة الجوري أجواءً دافئة ومرحبة، مما يجعلها الخيار المثالي للفعاليات الأصغر حجماً حيث التواصل الشخصي والراحة هما الأولوية."
                      : "For more intimate occasions, Al Jouri Hall offers a warm and inviting atmosphere, making it the ideal choice for smaller-scale events where personal connection and comfort are paramount."}
                  </p>
                  <h4 className="font-serif text-base text-foreground mb-3">{isAr ? "مثالية لـ:" : "Ideal for:"}</h4>
                  <div className="space-y-2 mb-6">
                    {(isAr ? ["حتى 100 ضيف", "التجمعات غير الرسمية", "النقاشات", "ترتيبات الجلوس التقليدية التي تعزز المحادثة والدفء"] : ["Up to 100 guests", "Casual gatherings", "Discussions", "Traditional seating arrangements that foster conversation and warmth"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Phone className="w-4 h-4 text-accent" />
                    <p className="font-body text-sm text-foreground">{isAr ? "للحجز والمزيد من المعلومات، اتصل:" : "For bookings and more information, please call:"} <a href="tel:+96525360573" className="text-accent hover:underline font-semibold">+96525360573</a></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}



        </div>
      </section>}

      {/* ===== AL LIWAN CAFÉ ===== */}
      {section === "cafe" && <section className="py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative order-2 lg:order-2">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cafe-section-${cafeSlide}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={cafeImages[cafeSlide]}
                      alt={isAr ? `مقهى الليوان ${cafeSlide + 1}` : `Al Liwan Cafe image ${cafeSlide + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <>
                <button
                  onClick={() => setCafeSlide((prev) => (prev - 1 + cafeImages.length) % cafeImages.length)}
                  aria-label={isAr ? "السابق" : "Previous"}
                  disabled={cafeImages.length <= 1}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCafeSlide((prev) => (prev + 1) % cafeImages.length)}
                  aria-label={isAr ? "التالي" : "Next"}
                  disabled={cafeImages.length <= 1}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(cafeSlide + 1).padStart(2, "0")} / {String(cafeImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <ScrollAnimationWrapper className="order-3 lg:order-1">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {isAr
                    ? "مقهى الليوان هو صالة قهوة ومطعم ترحيبي يقع في ردهة مستشفى رويال حياة. يقدم طعاماً محضراً طازجاً وحلويات شهية في بيئة راقية، مع جلسات مريحة وخدمة واي فاي مجانية للضيوف."
                    : "Al Liwan Café is a welcoming coffee lounge and diner located in the lobby of Royale Hayat Hospital. It offers freshly prepared food and delectable desserts in a sophisticated setting, complemented by comfortable seating and complimentary Wi-Fi."}
                </p>
                <div className="space-y-2 mb-5">
                  {(isAr
                    ? ["عصائر طازجة ومجموعة متنوعة من السموذي", "برغر وسلطات وساندويتشات ولفائف", "تشكيلة يومية من الكعك والبسكويت", "قهوة متخصصة ومجموعة متنوعة من الشاي"]
                    : ["Fresh juices and a wide smoothie selection", "Burgers, salads, sandwiches, and wraps", "Daily assortment of cakes and cookies", "Specialty coffee and tea selections"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr ? "مواعيد العمل اليومية: 8:00 صباحاً - 11:00 مساءً." : "Open daily: 8:00 a.m. - 11:00 p.m."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}

      {/* ===== ELEMENTS SPA ===== */}
      {section === "spa" && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`spa-section-${spaSlide}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={spaImages[spaSlide]}
                      alt={isAr ? `سبا إليمنتس ${spaSlide + 1}` : `Elements Spa image ${spaSlide + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <>
                <button
                  onClick={() => setSpaSlide((prev) => (prev - 1 + spaImages.length) % spaImages.length)}
                  aria-label={isAr ? "السابق" : "Previous"}
                  disabled={spaImages.length <= 1}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSpaSlide((prev) => (prev + 1) % spaImages.length)}
                  aria-label={isAr ? "التالي" : "Next"}
                  disabled={spaImages.length <= 1}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(spaSlide + 1).padStart(2, "0")} / {String(spaImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <ScrollAnimationWrapper>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "سبا إليمنتس من بانيان تري" : "Elements Spa by Banyan Tree"}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {isAr
                    ? "سبا إليمنتس، بالتعاون مع فنادق ومنتجعات بانيان تري الحائزة على جوائز، يجلب جوهر العلاجات التقليدية وتقاليد العافية الشاملة إلى مستشفى رويال حياة."
                    : "Elements Spa, in collaboration with the award-winning Banyan Tree Hotels & Resorts, brings the essence of time-honored remedies and holistic wellness traditions to Royale Hayat Hospital."}
                </p>
                <div className="mb-5">
                  <h4 className="font-serif text-base text-foreground mb-3">{isAr ? "خدماتنا تشمل:" : "Our Services Include:"}</h4>
                  <div className="space-y-2">
                    {(isAr
                      ? ["التدليك المميز", "مقشرات ومرطبات الجسم", "العناية بالوجه وتجديد البشرة", "علاجات اليدين والقدمين", "علاجات الشعر"]
                      : ["Signature Massages", "Body Scrubs & Conditioners", "Facials & Skin Rejuvenation", "Hand & Foot Therapies", "Hair Treatments"]).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr ? "لمزيد من التفاصيل، يرجى زيارة: " : "For more details, please visit: "}
                  <a href="https://www.banyantreespa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">www.banyantreespa.com</a>
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}



      {/* ===== OUR LUXURY SUITES ===== */}
      {show("suites") && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollAnimationWrapper>
            {showAll && <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">{isAr ? "الأجنحة الفاخرة" : "Suites"}</h2>}
            <p className="text-muted-foreground font-body text-sm text-center mb-8 max-w-xl mx-auto">
              {isAr ? "اختر من سبع فئات أجنحة مميزة، كل منها مسمى على اسم زهرة ومصمم لتقديم تجربة فريدة." : "Choose from seven distinctive suite categories, each named after a flower and designed to offer a unique experience."}
            </p>
          </ScrollAnimationWrapper>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {suitesData.map((s, i) => (
              <button key={i} onClick={() => setActiveSuite(i)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wide transition-all ${activeSuite === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border/50 text-muted-foreground hover:bg-muted/50"}`}>
                {s.name.replace(isAr ? " جناح" : " Suite", "").replace("جناح ", "")}
              </button>
            ))}
          </div>

          <motion.div key={activeSuite} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            {activeSuite !== 0 ? (
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="relative">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`suite-${activeSuite}-${suiteSlide}`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <img
                          src={activeSuiteImages[suiteSlide]}
                          alt={isAr ? `صورة ${currentSuite.name} ${suiteSlide + 1}` : `${currentSuite.name} image ${suiteSlide + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={() => setSuiteSlide((prev) => (prev - 1 + activeSuiteImages.length) % activeSuiteImages.length)}
                    aria-label={isAr ? "السابق" : "Previous"}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSuiteSlide((prev) => (prev + 1) % activeSuiteImages.length)}
                    aria-label={isAr ? "التالي" : "Next"}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center justify-center gap-3 mt-5">
                    <span className="font-body text-xs text-muted-foreground tracking-widest">
                      {String(suiteSlide + 1).padStart(2, "0")} / {String(activeSuiteImages.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif text-foreground mb-2">{currentSuite.name}</h3>
                  <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{currentSuite.desc}</p>

                  {currentSuite.highlights && (
                    <div className="space-y-2 mb-6 text-left">
                      {currentSuite.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentSuite.dimensions && (
                    <div className="mb-6 text-left">
                      <h4 className="font-serif text-base text-foreground mb-2">{isAr ? "أبعاد الجناح:" : "Suite Dimensions:"}</h4>
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

                  <div className="mb-6 text-left">
                    <h4 className="font-serif text-base text-foreground mb-3">
                      {isAr ? "المرافق والتجهيزات:" : "In-Suite Features & Amenities:"}
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
                    <p className="font-body text-sm text-foreground">{isAr ? "للحجز والمزيد من المعلومات، اتصل:" : "For bookings and more information, please call:"} <a href={`tel:${currentSuite.phone}`} className="text-accent hover:underline font-semibold">{currentSuite.phone}</a></p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Row 1: Text left, Image right (like Al Liwan Café) */}
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[340px] order-2 lg:order-2">
                    {activeSuite === 0 ? (
                      <iframe
                        src="https://tour.panoee.net/iframe/royaleorchid"
                        title="Royale Orchid Suite 360 Tour"
                        width="100%"
                        height="340px"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="font-body text-xs text-muted-foreground">{isAr ? "صور الجناح قريباً" : `${currentSuite.name} images coming soon`}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="order-1 lg:order-1">
                    <h3 className="text-xl font-serif text-foreground mb-2">{currentSuite.name}</h3>
                    <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{currentSuite.desc}</p>

                    {currentSuite.highlights && (
                      <div className="space-y-2 mb-4">
                        {currentSuite.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="font-body text-sm text-foreground">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentSuite.extraDesc && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{currentSuite.extraDesc}</p>
                    )}

                    {currentSuite.dimensions && (
                      <div className="mb-4">
                        <h4 className="font-serif text-base text-foreground mb-2">{isAr ? "أبعاد الجناح:" : "Suite Dimensions:"}</h4>
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

                {/* Additional carousel + details for Royale Orchid */}
                <div className="grid lg:grid-cols-2 gap-10 items-start mt-16">
                  <div className="relative">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`orchid-${orchidSlide}`}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute inset-0"
                        >
                          <img
                            src={orchidSuiteImages[orchidSlide]}
                            alt={isAr ? `صورة ${currentSuite.name} ${orchidSlide + 1}` : `${currentSuite.name} image ${orchidSlide + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={() => setOrchidSlide((prev) => (prev - 1 + orchidSuiteImages.length) % orchidSuiteImages.length)}
                      aria-label={isAr ? "السابق" : "Previous"}
                      className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setOrchidSlide((prev) => (prev + 1) % orchidSuiteImages.length)}
                      aria-label={isAr ? "التالي" : "Next"}
                      className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="flex items-center justify-center gap-3 mt-5">
                      <span className="font-body text-xs text-muted-foreground tracking-widest">
                        {String(orchidSlide + 1).padStart(2, "0")} / {String(orchidSuiteImages.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="font-body text-xs text-accent tracking-wide uppercase mb-4">{currentSuite.area}</p>

                    <div className="mb-6">
                      <h4 className="font-serif text-base text-foreground mb-3">
                        {isAr ? "المرافق والتجهيزات:" : "In-Suite Features & Amenities:"}
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
                          {isAr ? "خدمات الضيافة المتميزة:" : "Premium Hospitality Services:"}
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
                      <p className="font-body text-sm text-foreground">
                        {isAr ? "للحجز والمزيد من المعلومات، اتصل:" : "For bookings and more information, please call:"}{" "}
                        <a href={`tel:${currentSuite.phone}`} className="text-accent hover:underline font-semibold">
                          {currentSuite.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentSuite.hall && (
              <div className="bg-popover border border-border/50 rounded-2xl p-6 mt-16">
                <h4 className="font-serif text-base text-foreground mb-2">{currentSuite.hall.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{currentSuite.hall.desc}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-serif text-sm text-foreground mb-2">{isAr ? "مواصفات القاعة:" : "Hall Specifications:"}</h5>
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
                    <h5 className="font-serif text-sm text-foreground mb-2">{isAr ? "ميزات متميزة:" : "Premium Features:"}</h5>
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

      {/* In-Room Event Services Preview */}
      {showAll && <section className="py-6 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollAnimationWrapper>
            <div className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">
                  {isAr ? "خدمات الفعاليات في الغرف" : "In-Room Event Services"}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "اجعل لحظاتك الخاصة لا تُنسى مع خدمات الفعاليات المخصصة في غرفتك — من احتفالات المواليد إلى باقات الزهور والترتيبات الشخصية."
                    : "Make your special moments unforgettable with personalized in-room event services — from newborn celebrations to floral arrangements and custom setups."}
                </p>
              </div>
              <Link to="/in-room-events" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors flex-shrink-0">
                {isAr ? "استكشف المزيد" : "Explore More"}
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>}

      {/* ===== ELEMENTS SPA (Show All Order) ===== */}
      {showAll && <section className="py-6 bg-primary/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative order-2 lg:order-2">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`spa-showall-${spaSlide}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={spaImages[spaSlide]}
                      alt={isAr ? `سبا إليمنتس ${spaSlide + 1}` : `Elements Spa image ${spaSlide + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <>
                <button
                  onClick={() => setSpaSlide((prev) => (prev - 1 + spaImages.length) % spaImages.length)}
                  aria-label={isAr ? "السابق" : "Previous"}
                  disabled={spaImages.length <= 1}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSpaSlide((prev) => (prev + 1) % spaImages.length)}
                  aria-label={isAr ? "التالي" : "Next"}
                  disabled={spaImages.length <= 1}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(spaSlide + 1).padStart(2, "0")} / {String(spaImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <ScrollAnimationWrapper className="order-1 lg:order-1">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "سبا إليمنتس من بانيان تري" : "Elements Spa by Banyan Tree"}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {isAr
                    ? "سبا إليمنتس، بالتعاون مع فنادق ومنتجعات بانيان تري الحائزة على جوائز، يجلب جوهر العلاجات التقليدية وتقاليد العافية الشاملة إلى مستشفى رويال حياة."
                    : "Elements Spa, in collaboration with the award-winning Banyan Tree Hotels & Resorts, brings the essence of time-honored remedies and holistic wellness traditions to Royale Hayat Hospital."}
                </p>
                <div className="mb-5">
                  <h4 className="font-serif text-base text-foreground mb-3">{isAr ? "خدماتنا تشمل:" : "Our Services Include:"}</h4>
                  <div className="space-y-2">
                    {(isAr
                      ? ["التدليك المميز", "مقشرات ومرطبات الجسم", "العناية بالوجه وتجديد البشرة", "علاجات اليدين والقدمين", "علاجات الشعر"]
                      : ["Signature Massages", "Body Scrubs & Conditioners", "Facials & Skin Rejuvenation", "Hand & Foot Therapies", "Hair Treatments"]).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr ? "لمزيد من التفاصيل، يرجى زيارة: " : "For more details, please visit: "}
                  <a href="https://www.banyantreespa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">www.banyantreespa.com</a>
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>} 

      {/* ===== AL LIWAN CAFÉ (Show All Order) ===== */}
      {showAll && <section className="py-6 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cafe-showall-${cafeSlide}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={cafeImages[cafeSlide]}
                      alt={isAr ? `مقهى الليوان ${cafeSlide + 1}` : `Al Liwan Cafe image ${cafeSlide + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <>
                <button
                  onClick={() => setCafeSlide((prev) => (prev - 1 + cafeImages.length) % cafeImages.length)}
                  aria-label={isAr ? "السابق" : "Previous"}
                  disabled={cafeImages.length <= 1}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCafeSlide((prev) => (prev + 1) % cafeImages.length)}
                  aria-label={isAr ? "التالي" : "Next"}
                  disabled={cafeImages.length <= 1}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-foreground disabled:hover:border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(cafeSlide + 1).padStart(2, "0")} / {String(cafeImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <ScrollAnimationWrapper className="order-3 lg:order-2">
              <div>
                <div className="hidden lg:flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t("alLiwanCafe")}</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {isAr
                    ? "مقهى الليوان هو صالة قهوة ومطعم ترحيبي يقع في ردهة مستشفى رويال حياة. يقدم طعاماً محضراً طازجاً وحلويات شهية في بيئة راقية، مع جلسات مريحة وخدمة واي فاي مجانية للضيوف."
                    : "Al Liwan Café is a welcoming coffee lounge and diner located in the lobby of Royale Hayat Hospital. It offers freshly prepared food and delectable desserts in a sophisticated setting, complemented by comfortable seating and complimentary Wi-Fi."}
                </p>
                <div className="space-y-2 mb-5">
                  {(isAr
                    ? ["عصائر طازجة ومجموعة متنوعة من السموذي", "برغر وسلطات وساندويتشات ولفائف", "تشكيلة يومية من الكعك والبسكويت", "قهوة متخصصة ومجموعة متنوعة من الشاي"]
                    : ["Fresh juices and a wide smoothie selection", "Burgers, salads, sandwiches, and wraps", "Daily assortment of cakes and cookies", "Specialty coffee and tea selections"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr ? "مواعيد العمل اليومية: 8:00 صباحاً - 11:00 مساءً." : "Open daily: 8:00 a.m. - 11:00 p.m."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      {/* ===== NEWBORN PHOTOGRAPHY ===== */}
      {showAll && <section className="py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div className="aspect-video bg-muted/30 rounded-2xl border border-border flex items-center justify-center order-2 lg:order-2">
              <div className="text-center">
                <Image className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="font-body text-xs text-muted-foreground">{isAr ? "معرض الصور قريباً" : "Photography portfolio coming soon"}</p>
              </div>
            </div>
            <ScrollAnimationWrapper className="order-1 lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">{isAr ? "خدمات تصوير المواليد" : "Newborn Photography Services"}</h2>
              </div>
              <h3 className="font-serif text-lg text-foreground mb-4">{isAr ? "التقط أثمن لحظات الحياة" : "Capture Life's Most Precious Moments"}</h3>
              <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
                <p>{isAr
                  ? "استقبال مولودك الجديد هو من أغلى لحظات الحياة. في مستشفى رويال حياة، نقدم خدمات تصوير احترافية لتوثيق هذه اللحظات الخاصة خلال إقامتك."
                  : "Welcoming your newborn is one of life's most cherished milestones. At Royale Hayat Hospital, we offer professional photography services to beautifully capture these special moments during your stay."}</p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Phone className="w-4 h-4 text-accent" />
                <p className="font-body text-sm text-foreground">{isAr ? "للاستفسارات والمواعيد، اتصل:" : "For inquiries and appointments, please contact:"} <a href="tel:25360960" className="text-accent hover:underline font-semibold">2536 0960</a></p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>}
      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default HospitalityServices;
