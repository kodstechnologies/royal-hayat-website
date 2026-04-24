import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import LifePhotoCarousel from "@/components/LifePhotoCarousel.tsx";
import type { LifePhoto } from "@/components/LifePhotoCarousel.tsx";
import VoicesFromOurPeople from "@/components/VoicesFromOurPeople.tsx";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Heart, Sparkles, HandHeart, GraduationCap, Globe2, Award,
  MapPin, Clock, ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* OPEN POSITIONS — sourced 1:1 from https://royalehayat.com/careers/ */
/* ------------------------------------------------------------------ */
const categories = [
  "View All",
  "Hospitality / Guest Services",
  "La Cosmetique Royale",
  "Marketing & Communications",
  "Nursing Support",
  "Quality & Patient Safety",
  "Royale Home Health",
  "Specialist Doctors",
  "Surgical Services",
];

const openPositions = [
  {
    title: "Registrar – Plastic Surgeon",
    category: "La Cosmetique Royale",
    location: "On-Site",
    type: "Full-Time",
    desc: "Candidates applying should have minimum Two years of experience as Plastic Surgery Registrar.",
  },
  {
    title: "Floor Coordinator only Female, Bilingual (Arabic & English)",
    category: "Hospitality / Guest Services",
    location: "On-Site",
    type: "Full-Time",
    desc: "Royale Hayat Hospital have devoted considerable effort to applying established strategies for quality improvement thus they created a position of Floor coordinator.",
  },
  {
    title: "Birth Registration Assistant (Bilingual – Arabic & English, only local candidate)",
    category: "Quality & Patient Safety",
    location: "On-Site",
    type: "Full-Time",
    desc: "Birth Registration Clerk shall ensure complete documentation of Birth, Death, Sick Leave, Maternity Leave and other patient related records as per MOH guidelines and protocols.",
  },
  {
    title: "Registered Nurse for Home Care Dept",
    category: "Royale Home Health",
    location: "On-Site",
    type: "Full-Time",
    desc: "To ensure the safe provision of nursing services in collaboration with the patient/family and the multidisciplinary health care team.",
  },
  {
    title: "Registered Nurse for Labor and Delivery Department – Local (Female with MOH Licence)",
    category: "Nursing Support",
    location: "On-Site",
    type: "Full-Time",
    desc: "Registered Nurse for Labor and Delivery Department - Local (Female with MOH Licence).",
  },
  {
    title: "Anesthesia – Specialist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Assesses and prepare patients for Anesthesia.",
  },
  {
    title: "Registrar – Internal Medicine",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Active Listening, Critical Thinking, Active Learning, Monitoring, and Quality control Analysis.",
  },
  {
    title: "Registrar – Obstetrician and Gynecologist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "To attend casualty cases and give emergency treatment, do the necessary admission procedures.",
  },
  {
    title: "Consultant Pediatrician",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Contribution to the daytime weekly attending rota and covering clinic. Clinic will be both by appointment and emergency walk-ins.",
  },
  {
    title: "Registered Nurse for Cosmetic Center – Local (Female with MOH License & Laser Exp)",
    category: "Nursing Support",
    location: "On-Site",
    type: "Full-Time",
    desc: "Responsible for the nursing care of patients according to their scope of practice in liaison with Medical Staff and Allied Health Professionals.",
  },
  {
    title: "Consultant Neonatologist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Candidates applying should have minimum Five years of experience in SCBU/NICU.",
  },
  {
    title: "Brand Manager",
    category: "Marketing & Communications",
    location: "On-Site",
    type: "Full-Time",
    desc: "The Brand Manager develops and executes strategies to enhance RHH's brand image. Responsibilities include managing social media campaigns, supervising team members, coordinating publicity for doctors.",
  },
  {
    title: "Anesthesia Technician – Local (Female with MOH)",
    category: "Surgical Services",
    location: "On-Site",
    type: "Full-Time",
    desc: "Responsible for providing care to patients undergoing anesthesia in liaison with Medical Staff and Allied Health Professionals.",
  },
];

type WorkWithUsProps = {
  staffActivitiesImages: string[];
  galaDinnerImages: string[];
  hospitalityWeekImages: string[];
  rhhQuizImages: string[];
};

const toCarouselPhotos = (label: string, images: string[]): LifePhoto[] => {
  if (images.length === 0) {
    return [{ alt: `${label} — 1` }];
  }
  return images.map((src, index) => ({
    src,
    alt: `${label} — ${index + 1}`,
  }));
};

const WorkWithUs = ({
  staffActivitiesImages,
  galaDinnerImages,
  hospitalityWeekImages,
  rhhQuizImages,
}: WorkWithUsProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState("View All");
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const showSection = (s: string) => showAll || section === s;

  const filtered = activeCategory === "View All"
    ? openPositions
    : openPositions.filter(p => p.category === activeCategory);

  /* --- Work Culture / People Promise from the uploaded document --- */
  const beliefPillars = [
    {
      icon: Heart,
      title: isAr ? "الرحمة قبل الإجراء" : "Compassion Before Procedure",
      desc: isAr
        ? "قد ينسى الناس ما قلناه، لكنهم لن ينسوا أبداً كيف جعلناهم يشعرون. يوجّه هذا الإيمان كيف نرعى ونعمل ونعامل بعضنا البعض."
        : "People may forget what we said, but they will never forget how we made them feel. That belief guides how we care, how we work, and how we treat one another.",
    },
    {
      icon: Sparkles,
      title: isAr ? "الاحترافية تلتقي باللطف" : "Professionalism Meets Kindness",
      desc: isAr
        ? "تلتقي المعايير بالتعاطف، ويحمل العمل هدفاً. الشفاء ليس فقط بالطب، بل بالتجربة."
        : "Standards meet empathy, and work carries purpose. Healing is not only about medicine, but about experience.",
    },
    // {
    //   icon: HandHeart,
    //   title: isAr ? "وعدنا للناس" : "Our People Promise",
    //   desc: isAr
    //     ? "يبدأ وعدنا للمرضى بوعدنا لفريقنا. مكان عمل يُحترم فيه الموظفون ويُوثَق بهم ويُدعمون."
    //     : "Our promise to patients begins with our promise to our people — a workplace where employees are respected, trusted, and supported.",
    // },
    {
      icon: GraduationCap,
      title: isAr ? "التعلّم والنمو" : "Learning & Growth",
      desc: isAr
        ? "نستثمر بشكل متعمد في التدريب المستمر، والاطلاع على المعايير الدولية، والتعاون بين التخصصات وفرص النمو بثقة."
        : "We invest deliberately in continuous training, exposure to international standards, cross-disciplinary collaboration, and opportunities to grow with confidence.",
    },
    {
      icon: Globe2,
      title: isAr ? "ننتمي معاً" : "Where We Belong Together",
      desc: isAr
        ? "فريق متنوع متعدد الثقافات تجمعه الكرامة والاحترام والانتماء. ندعم الرفاهية والمرونة والتوازن."
        : "A diverse, multicultural team united by dignity, respect, and belonging. We support wellbeing, resilience, and balance.",
    },
    {
      icon: Award,
      title: isAr ? "التقدير والامتنان" : "Recognition & Appreciation",
      desc: isAr
        ? "لا يمر الجهد والتميّز والسلوك الأخلاقي دون أن يُلاحظ — لأن التقدير مهم، والرعاية تستحق أن تُكرَّم."
        : "Effort, excellence, and ethical conduct never go unnoticed — because appreciation matters, and care deserves to be recognized.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {isAr ? "الحياة في رويال حياة" : "Life at Royale Hayat Hospital"}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
                {section === "positions" ? (isAr ? "الوظائف المتاحة" : "Open Positions")
                  : section === "culture" ? (isAr ? "ثقافة العمل" : "Work Culture")
                  : (isAr ? "اعمل معنا" : "Work With Us")}
              </h1>
            </div>

            <div className="max-w-3xl mx-auto space-y-5 text-foreground font-body text-base leading-relaxed">
              <p>
                {isAr
                  ? "في مستشفى رويال حياة، نؤمن بفكرة بسيطة: قد ينسى الناس ما قلناه، لكنهم لن ينسوا أبداً كيف جعلناهم يشعرون كمرضى، أو أفراد عائلة، أو زملاء."
                  : "At Royale Hayat Hospital, we hold a simple belief: people may forget what we said, but they will never forget how we made them feel as patients, family members, or colleagues."}
              </p>
              <p>
                {isAr
                  ? "يوجّه هذا الإيمان كيف نرعى، وكيف نعمل، وكيف نعامل بعضنا البعض. كل يوم، تقدّم فرقنا رعاية آمنة وحديثة وعالية الجودة بتعاطف وراحة — لأن الشفاء ليس فقط بالطب، بل بالتجربة."
                  : "That belief guides how we care, how we work, and how we treat one another. Every day, our teams deliver safe, modern, quality care with compassion and comfort—because healing is not only about medicine, but about experience."}
              </p>
              <p>
                {isAr
                  ? "هنا، تلتقي الاحترافية باللطف. تلتقي المعايير بالتعاطف. ويحمل العمل هدفاً. إذا كان هذا الإيمان يلامسك، فأنت تنتمي إلى هنا بالفعل."
                  : "Here, professionalism meets kindness. Standards meet empathy. And work carries purpose. If this belief resonates with you, you already belong here."}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Our People Promise — narrative from document */}
      {showSection("culture") && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-3">
                {isAr ? "«وعدنا للناس»" : "‘Our People Promise’"}
              </h2>
              <p className="text-center text-accent font-body text-sm mb-8 italic">
                {isAr
                  ? "يبدأ وعدنا للمرضى بوعدنا لفريقنا"
                  : "Our promise to patients begins with our promise to our people"}
              </p>
              <div className="space-y-5 font-body text-base text-foreground leading-relaxed">
                <p>
                  {isAr
                    ? "نَعِد بمكان عمل يُحترم فيه الموظفون ويُوثَق بهم ويُدعَمون — لا تُحدّدهم الألقاب، بل تُقدَّر احترافيتهم ونزاهتهم وإسهامهم."
                    : "We promise a workplace where employees are respected, trusted, and supported not defined by titles, but valued for their professionalism, integrity, and contribution."}
                </p>
                <p>
                  {isAr
                    ? "نستثمر بشكل متعمد في التعلّم والتطوير، عبر التدريب المستمر، والاطلاع على المعايير الدولية، والتعاون بين التخصصات، وفرص النمو بثقة."
                    : "We invest deliberately in learning and development, through continuous training, exposure to international standards, collaboration across disciplines, and opportunities to grow with confidence."}
                </p>
                <p>
                  {isAr
                    ? "نؤمن أن التميّز يُبنى من خلال التعلّم — ويُصان من خلال الثقة. وعدنا بسيط: سنساعدك على النمو، وسنُقدّر جهدك، وسنسير معك وأنت تبني مسيرة مهنية تفخر بها."
                    : "We believe excellence is built through learning—and sustained through trust. Our promise is simple: we will help you grow, we will recognize your effort, and we will walk with you as you build a career you can be proud of."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Where We Belong Together */}
      {showSection("culture") && (
        <section className="py-14 bg-secondary/10">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-8">
                {isAr ? "«ننتمي معاً.»" : "‘Where We Belong Together.’"}
              </h2>
              <div className="space-y-5 font-body text-base text-foreground leading-relaxed">
                <p>
                  {isAr
                    ? "العمل في رويال حياة يعني أن تكون جزءاً من فريق متنوّع متعدد الثقافات، تجمعه الغاية والرعاية."
                    : "Working at Royale Hayat means being part of a diverse, multicultural team united by purpose and care."}
                </p>
                <p>
                  {isAr
                    ? "نُدرك المتطلبات العاطفية للرعاية الصحية وندعم الرفاهية والمرونة والتوازن. يأتي فريقنا من ثقافات وخلفيات متعددة، ومع ذلك يجمعهم الاحترام والكرامة والانتماء."
                    : "We recognize the emotional demands of healthcare and support wellbeing, resilience, and balance. Our people come from many cultures and backgrounds, yet are connected by respect, dignity, and belonging."}
                </p>
                <p>
                  {isAr
                    ? "لا يمر الجهد والتميّز هنا دون أن يُلاحظ — لأن التقدير مهم، والرعاية تستحق أن تُكرَّم. في رويال حياة، الأمر أكثر من مجرد عمل. إنه مكان للانتماء وللشعور بالقيمة."
                    : "Effort and excellence never go unnoticed here—because appreciation matters, and care deserves to be recognized. At Royale Hayat, it’s more than work. It’s a place to belong and be valued."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

   

      {/* Recognition & Appreciation gallery */}
      {showSection("culture") && (
        <LifePhotoCarousel
          variant="muted"
          title={isAr ? "التقدير والامتنان" : "Recognition & Appreciation"}
          subtitle={isAr
            ? "موظف الشهر، تكريمات الإنجاز، وامتنان يومي — لأن الجهد يستحق أن يُرى."
            : "Employee of the Month, achievement honors, and everyday gratitude — because effort deserves to be seen."}
          photos={toCarouselPhotos("Recognition & Appreciation", [])}
        />
      )}

      {/* Staff Activities (includes Volley Ball Tournament photos) */}
      {showSection("culture") && (
        <LifePhotoCarousel
          title={isAr ? "أنشطة الموظفين — بطولة الكرة الطائرة" : "Staff Activities — Volley Ball Tournament"}
          subtitle={isAr
            ? "يُعترف بالإنجازات — لأن الجهد والتميّز والسلوك الأخلاقي أمور تهم."
            : "Achievements are acknowledged—because effort, excellence, and ethical conduct matter."}
          photos={toCarouselPhotos("Staff Activities — Volley Ball Tournament", staffActivitiesImages)}
        />
      )}

      {/* Event Galleries */}
      {showSection("culture") && (
        <>
          <LifePhotoCarousel
            variant="muted"
            title={isAr ? "حفل العشاء السنوي" : "Gala Dinner"}
            subtitle={isAr ? "ليلة من الأناقة، الامتنان والاحتفال." : "A night of elegance, gratitude and celebration."}
            photos={toCarouselPhotos("Gala Dinner", galaDinnerImages)}
          />
          <LifePhotoCarousel
            title={isAr ? "أسبوع الضيافة" : "Hospitality Week"}
            subtitle={isAr ? "أسبوع مكرّس لروح الضيافة التي تميّز رويال حياة." : "A week devoted to the hospitality spirit that defines Royale Hayat."}
            photos={toCarouselPhotos("Hospitality Week", hospitalityWeekImages)}
          />
          <LifePhotoCarousel
            variant="muted"
            title={isAr ? "مسابقة RHH" : "RHH Quiz"}
            subtitle={isAr ? "مرح ومنافسة ودي بين الفرق." : "Fun, friendly competition across teams."}
            photos={toCarouselPhotos("RHH Quiz", rhhQuizImages)}
          />
        </>
      )}

      {/* Voices from Our People (Testimonials) */}
      {showSection("culture") && <VoicesFromOurPeople />}

      {/* Explore Careers heading */}
      {showSection("culture") && (
        <section className="py-12 bg-background text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {isAr ? "اكتشف الوظائف في مستشفى رويال حياة" : "Explore Careers at Royale Hayat Hospital"}
            </h2>
          </div>
        </section>
      )}

      {/* Open Positions */}
      {showSection("positions") && (
        <section className="py-16 bg-secondary/10" id="open-positions">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-8">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  {isAr ? "انضم إلى شبكتنا" : "Join Our Network!"}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                  {isAr ? "الوظائف المتاحة" : "Open Positions"}
                </h2>
                <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto mt-3">
                  {isAr
                    ? "اكتشف الفرص الحالية وابدأ مسيرتك المهنية معنا اليوم."
                    : "Explore current opportunities and launch your career with us today."}
                </p>
              </div>
            </ScrollAnimationWrapper>

            {/* Category filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-body tracking-wide border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-popover text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Job cards */}
            <div className="max-w-5xl mx-auto space-y-5">
              {filtered.map((pos) => {
                const originalIndex = openPositions.findIndex(p => p.title === pos.title);
                return (
                  <motion.div
                    key={pos.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg md:text-xl text-foreground mb-2">{pos.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block px-3 py-1 bg-secondary/30 text-foreground text-[11px] font-body rounded tracking-wide">
                            {pos.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">{pos.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <Link
                          to={`/job-application?job=${originalIndex}`}
                          className="inline-flex items-center gap-1 text-accent font-body text-sm font-semibold hover:underline"
                        >
                          {isAr ? "تقدم الآن" : "Apply Now"} <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {pos.location.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {pos.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <p className="font-body text-sm text-muted-foreground">
                {isAr ? "لا ترى الوظيفة المناسبة؟ أرسل سيرتك الذاتية إلى" : "Don't see the right fit? Send your CV to"}{" "}
                <a href="mailto:hr@royalehayat.com" className="text-primary hover:text-accent transition-colors font-semibold">hr@royalehayat.com</a>
              </p>
            </div>
          </div>
        </section>
      )}


      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default WorkWithUs;
