import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import ChairmanMessage from "@/components/ChairmanMessage";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Star, Sparkles, Shield, Target, BookOpen, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
const leaders = [
  {
    initials: "SA",
    nameEn: "Dr. Sulaiman Al Mazeedi",
    nameAr: "د. سليمان المزيدي",
    roleEn: "Medical Advisor",
    roleAr: "المستشار الطبي",
    credentialsEn: "M.B.B.Ch., MRCS (England), KBS, MCSO (Harvard)",
    credentialsAr: "بكالوريوس الطب والجراحة، عضو الكلية الملكية للجراحين (إنجلترا)، البورد الكويتي، هارفارد",
    bioEn: [
      "Dr. Sulaiman Al Mazeedi is a highly accomplished and influential figure in the field of healthcare. His unwavering passion for medicine and tireless dedication to improving healthcare outcomes have earned him widespread recognition and respect both nationally and internationally.",
      "He began his educational journey at the Faculty of Medicine at Kuwait University. Dr. Al Mazeedi is a member of the Kuwaiti Board of General Surgery and the Royal College of Surgeons (England), where he trained in Bariatric and Colorectal Surgery in London, UK. During this period, he honed his clinical skills and developed a profound understanding of complex medical conditions.",
      "Dr. Al Mazeedi is committed to transforming the healthcare landscape in Kuwait. He has spearheaded numerous initiatives aimed at integrating cutting-edge technology into healthcare delivery systems, improving patient outcomes, and enhancing overall efficiency.",
    ],
    bioAr: [
      "الدكتور سليمان المزيدي شخصية بارزة ومؤثرة في مجال الرعاية الصحية. شغفه الراسخ بالطب وتفانيه الدؤوب في تحسين نتائج الرعاية الصحية أكسباه تقديراً واحتراماً واسعين على المستويين الوطني والدولي.",
      "بدأ رحلته التعليمية في كلية الطب بجامعة الكويت. الدكتور المزيدي عضو في البورد الكويتي للجراحة العامة والكلية الملكية للجراحين (إنجلترا)، حيث تدرب على جراحة السمنة والقولون والمستقيم في لندن، المملكة المتحدة.",
      "الدكتور المزيدي ملتزم بتحويل المشهد الصحي في الكويت. قاد العديد من المبادرات الهادفة إلى دمج التقنيات المتطورة في أنظمة تقديم الرعاية الصحية وتحسين نتائج المرضى وتعزيز الكفاءة العامة.",
    ],
    image: "/images/doctors/Dr. Sulaiman.jpg",
  },
  {
    initials: "AE",
    nameEn: "Dr. Abubakr Elmardi",
    nameAr: "د. أبوبكر المرضي",
    roleEn: "Chief Strategic Officer (CSO)\nHead of Obstetrics & Gynecology Department\nConsultant Obstetrician & Gynecologist\nHead of Urogynecology Unit & Pelvic Floor Reconstructive Surgery\nHead of Cosmetic Gynecology Unit",
    roleAr: "الرئيس الاستراتيجي\nرئيس قسم التوليد وأمراض النساء\nاستشاري التوليد وأمراض النساء\nرئيس وحدة أمراض المسالك البولية النسائية وجراحة ترميم الحوض\nرئيس وحدة التجميل النسائي",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Dr. Abubakr Elmardi is a highly accomplished consultant obstetrician and gynaecologist, currently serving as the Chief Strategic Officer and the Head of the Obstetrics & Gynaecology Department. With 24 years of experience as the former Head of Department at North Midland University Hospital in the UK, he brings a wealth of knowledge and expertise to his role.",
      "He is a Fellow of several esteemed organizations, including the Royal College of Obstetricians & Gynaecologists (UK), the American College of Obstetricians & Gynaecologists, and the Faculty of Sexual & Reproductive Health (FFSRH) of the RCOG. Additionally, he is a Fellow of the International College of Surgeons (FICS) in the USA and an active member of both the International Urogynecological Association and the International Continence Society.",
      "Dr. Elmardi specializes in the management of normal and high-risk pregnancies, as well as normal, assisted, and complex deliveries, including caesarean sections and major obstetric surgeries. He is also experienced in cosmetic vaginal surgery, utilizing techniques such as Monalisa and laser treatments.",
      "In the area of menstrual disorders, he offers innovative treatments like Novasure endometrial ablation for women who have completed their families. His surgical expertise includes hysteroscopic procedures for the removal of polyps, fibroids, and septa via Myosure (TCER), as well as laparoscopic surgeries addressing conditions such as adhesions and ectopic pregnancies.",
      "Additionally, Dr. Elmardi is dedicated to managing female urinary and pelvic floor disorders, performing urodynamic studies, and conducting bladder and pelvic floor scanning to ensure comprehensive care for his patients.",
    ],
    bioAr: [
      "الدكتور أبوبكر المرضي استشاري متميز في التوليد وأمراض النساء، يشغل حالياً منصب الرئيس الاستراتيجي ورئيس قسم التوليد وأمراض النساء. يتمتع بخبرة 24 عاماً كرئيس سابق للقسم في مستشفى نورث ميدلاند الجامعي في المملكة المتحدة.",
      "زميل في عدة منظمات مرموقة، بما في ذلك الكلية الملكية لأطباء التوليد وأمراض النساء (المملكة المتحدة)، والكلية الأمريكية لأطباء التوليد وأمراض النساء، وكلية الصحة الجنسية والإنجابية. كما أنه زميل في الكلية الدولية للجراحين في الولايات المتحدة.",
      "يتخصص الدكتور المرضي في إدارة حالات الحمل الطبيعية وعالية الخطورة، والولادات الطبيعية والمساعدة والمعقدة بما في ذلك العمليات القيصرية والعمليات الجراحية الكبرى. لديه خبرة في الجراحة التجميلية المهبلية.",
      "في مجال اضطرابات الدورة الشهرية، يقدم علاجات مبتكرة مثل الاستئصال البطاني بتقنية نوفاشور. تشمل خبرته الجراحية إجراءات المنظار الرحمي وجراحات المنظار البطني.",
      "بالإضافة إلى ذلك، يكرس الدكتور المرضي جهوده لإدارة اضطرابات المسالك البولية الأنثوية وقاع الحوض، وإجراء دراسات ديناميكية البول ومسح المثانة وقاع الحوض.",
    ],
    image: "/images/doctors/abubakr-elmardi.png",
  },
  {
    initials: "OE",
    nameEn: "Prof. Dr. Omar El Khateeb",
    nameAr: "أ.د. عمر الخطيب",
    roleEn: "Medical Director\nConsultant of Anesthesia & Intensive Care Unit",
    roleAr: "المدير الطبي\nاستشاري التخدير والعناية المركزة",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Prof. Dr. Omar El Khateeb brings over 40 years of extensive experience in the field of Anesthesia and Painless Labor. He is a distinguished graduate of the Faculty of Medicine at Alexandria University, Egypt, where he laid the foundation for his impressive medical career.",
      "He holds a Master's Degree in Anesthesia and Surgical Intensive Care from the Alexandria School of Medicine, followed by a Doctorate Degree in Anesthesia, Intensive Care, and Pain Management from the University of Alexandria, awarded in 1982. His academic credentials are complemented by his membership in the International Association for the Study of Pain (IASP).",
      "Dr. El Khateeb is highly experienced in various specialized areas, including obstetric anesthesia and analgesia, as well as performing epidural blocks for childbirth. He has a profound understanding of anesthesia management for high-risk and elderly patients, ensuring safety and comfort. Additionally, he is skilled in surgical intensive care medicine for both adults and pediatric patients, and he has expertise in providing anesthesia for bariatric surgeries.",
    ],
    bioAr: [
      "يتمتع الأستاذ الدكتور عمر الخطيب بأكثر من 40 عاماً من الخبرة الواسعة في مجال التخدير والولادة بدون ألم. خريج متميز من كلية الطب بجامعة الإسكندرية، مصر.",
      "حاصل على درجة الماجستير في التخدير والعناية المركزة الجراحية من كلية الطب بالإسكندرية، تليها درجة الدكتوراه في التخدير والعناية المركزة وإدارة الألم من جامعة الإسكندرية عام 1982. عضو في الجمعية الدولية لدراسة الألم.",
      "الدكتور الخطيب ذو خبرة عالية في مجالات متخصصة متعددة، بما في ذلك تخدير التوليد والتسكين، وإجراء التخدير فوق الجافية للولادة. لديه فهم عميق لإدارة التخدير للمرضى عاليي الخطورة وكبار السن، وخبرة في طب العناية المركزة الجراحية للبالغين والأطفال.",
    ],
    image: "/images/doctors/Dr. Omar.jpg",
  },
  {
    initials: "SM",
    nameEn: "Shibu Thomas Mathew",
    nameAr: "شيبو توماس ماثيو",
    roleEn: "Chief Financial Officer & Director – Human Resources Capital",
    roleAr: "المدير المالي الرئيسي ومدير رأس المال البشري",
    credentialsEn: "CMA (USA), ACMA India, IFRS",
    credentialsAr: "",
    bioEn: [
      "Shibu Thomas Mathew has been part of Royale Hayat Hospital’s leadership journey since its inception, joining the pre-opening team in 2006 and contributing to the establishment of a trusted, world-class healthcare institution. He was appointed Financial Controller in 2007 and promoted to Chief Financial Officer in 2010.",
      "In his role as Chief Financial Officer and Director – Human Resources Capital, Mr. Mathew provides strategic leadership that integrates financial stewardship with people-centric governance. He oversees long-term investment planning, financial performance management, budget governance, and human capital strategy across all Group companies. He also serves as a Board Member for several subsidiaries, supporting strong governance, ethical decision-making, and sustainable growth.",
      "With prior senior leadership experience in finance, accounting, and treasury roles across multinational organizations, Mr. Shibu brings a balanced approach combining operational discipline, strategic foresight, and a deep commitment to people and purpose.",
      "He is a CMA (USA), ACMA India with IFRS credentials and executive education in healthcare strategy from Harvard T.H. Chan School of Public Health.",
    ],
    bioAr: [
      "شيبو توماس ماثيو كان جزءاً من رحلة قيادة مستشفى رويال حياة منذ بدايتها، حيث انضم إلى فريق ما قبل الافتتاح في عام 2006 وساهم في تأسيس مؤسسة رعاية صحية عالمية المستوى وموثوقة. تم تعيينه كمراقب مالي في عام 2007 وتمت ترقيته إلى منصب المدير المالي في عام 2010.",
      "في دوره المزدوج كمدير مالي ومدير للموارد البشرية، يقدم السيد ماثيو قيادة استراتيجية تدمج الإشراف المالي مع الحوكمة التي تركز على الأشخاص. يشرف على تخطيط الاستثمار طويل الأجل، وإدارة الأداء المالي، وحوكمة الميزانية، واستراتيجية رأس المال البشري عبر جميع شركات المجموعة. كما يشغل منصب عضو مجلس إدارة لعدة شركات تابعة، ويدعم الحوكمة القوية واتخاذ القرارات الأخلاقية والنمو المستدام.",
      "مع خبرة قيادية سابقة في أدوار التمويل والمحاسبة والخزينة عبر المنظمات متعددة الجنسيات، يقدم السيد شيبو نهجاً متوازناً يجمع بين الانضباط العملياتي والرؤية الاستراتيجية والالتزام العميق تجاه الناس والهدف.",
      "وهو حاصل على شهادات CMA (الولايات المتحدة الأمريكية) وACMA الهند مع مؤهلات IFRS وتعليم تنفيذي في استراتيجية الرعاية الصحية من كلية هارفارد تي إتش تشان للصحة العامة.",
    ],
    image: "/images/doctors/Mr. Shibu.jpg",
  },
  {
    initials: "HG",
    nameEn: "Dr. Hamid Ghaderi",
    nameAr: "د. حامد غديري",
    roleEn: "Head of Anesthesia, ICU & Pain Management\nDeputy Medical Director\nConsultant Anesthesia, ICU & Pain Management",
    roleAr: "رئيس قسم التخدير والعناية المركزة وإدارة الألم\nنائب المدير الطبي\nاستشاري التخدير والعناية المركزة وإدارة الألم",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Graduating from the prestigious Medical School at the Elite University of Heidelberg in Germany, Dr. Hamid has built an impressive career in the field of anesthesia, intensive care, and pain management. At the University of Heidelberg, Dr. Hamid served as a Consultant and Lecturer, specializing in anesthesia, intensive care, and pain management. This expertise is further validated by a German Board certification in Anesthesia, Surgical Intensive Care, and Clinical Pain Management from the same university.",
      "Dr. Hamid has completed fellowships in both Intensive and Neonatal Care at the Children's Hospital, University of Heidelberg, and in Cardiac Anesthesia in Germany. As a recognized professional, Dr. Hamid is a member of both the German and European Society for Anesthesia, ICU, and Pain Management, as well as the European Society for Cardiac Anesthesia.",
      "With extensive experience in general and regional anesthesia for all specialties and high-risk patients, Dr. Hamid is adept at handling anesthesia for bariatric surgeries and providing epidural injections for normal delivery and cesarean sections. Dr. Hamid has a subspecialty in pediatrics, neonatal anesthesia, and anesthesia for special needs, alongside surgical intensive care medicine for both adults and pediatrics.",
      "In chronic pain management, Dr. Hamid focuses on spine pain with therapeutic injections and has pioneered CT-guided spine therapeutic injection, establishing the first qualified center in Kuwait and the Middle East. The expertise extends to managing chronic pain for conditions such as headaches, shingles, fibromyalgia, cancer pain, and other pain-related conditions.",
    ],
    bioAr: [
      "تخرج الدكتور حامد من كلية الطب المرموقة في جامعة هايدلبرغ في ألمانيا، وبنى مسيرة مهنية مميزة في مجال التخدير والعناية المركزة وإدارة الألم. عمل كاستشاري ومحاضر في جامعة هايدلبرغ. حاصل على شهادة البورد الألمانية في التخدير والعناية المركزة الجراحية وإدارة الألم السريري.",
      "أكمل الدكتور حامد زمالات في العناية المركزة ورعاية حديثي الولادة في مستشفى الأطفال بجامعة هايدلبرغ، وفي تخدير القلب في ألمانيا. عضو في الجمعية الألمانية والأوروبية للتخدير والعناية المركزة وإدارة الألم، والجمعية الأوروبية لتخدير القلب.",
      "يتمتع بخبرة واسعة في التخدير العام والموضعي لجميع التخصصات والمرضى عاليي الخطورة، بما في ذلك تخدير جراحات السمنة والتخدير فوق الجافية للولادة الطبيعية والقيصرية. لديه تخصص فرعي في تخدير الأطفال وحديثي الولادة وذوي الاحتياجات الخاصة.",
      "في إدارة الألم المزمن، يركز على آلام العمود الفقري بالحقن العلاجية وقد كان رائداً في الحقن العلاجية الموجهة بالأشعة المقطعية للعمود الفقري، مؤسساً أول مركز مؤهل في الكويت والشرق الأوسط. تشمل خبرته إدارة الألم المزمن لحالات مثل الصداع والهربس النطاقي والألم العضلي الليفي وألم السرطان.",
    ],
    image: "/images/doctors/Dr. Hamid.jpg",
  },
];

const LeaderCard = ({ leader, lang }: { leader: typeof leaders[0] & { image?: string }; lang: string }) => {
  const [expanded, setExpanded] = useState(false);
  const name = lang === "ar" ? leader.nameAr : leader.nameEn;
  const role = lang === "ar" ? leader.roleAr : leader.roleEn;
  const credentials = lang === "ar" ? leader.credentialsAr : leader.credentialsEn;
  const bio = lang === "ar" ? leader.bioAr : leader.bioEn;
  const roles = role.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-popover border border-border/50 rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Photo / Avatar side */}
        <div className="md:w-64 flex-shrink-0 bg-primary/5 flex items-center justify-center p-8 md:p-10">
          <div className={`w-44 h-44 md:w-60 md:h-60 rounded-2xl flex items-center justify-center border-4 border-primary/20 overflow-hidden ${leader.nameEn === "Shibu Thomas Mathew" ? "bg-white" : "bg-primary/10"}`}>
            {leader.image ? (
              <img
                src={leader.image}
                alt={name}
                className="w-full h-full object-contain md:object-cover md:object-top bg-white"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-serif text-primary">{leader.initials}</span>
            )}
          </div>
        </div>
        {/* Info side */}
        <div className="flex-1 p-6 md:p-8">
          <h3 className="font-serif text-xl text-foreground mb-1">{name}</h3>
          {credentials && (
            <p className="font-body text-xs text-accent mb-2">{credentials}</p>
          )}
          <div className="space-y-0.5 mb-4">
            {roles.map((r, i) => (
              <p key={i} className="font-body text-sm text-accent">{r}</p>
            ))}
          </div>
          <div className={`space-y-3 overflow-hidden transition-all duration-500 ${expanded ? "max-h-[2000px]" : "max-h-[100px]"}`}>
            {bio.map((p, i) => (
              <p key={i} className="font-body text-sm text-muted-foreground leading-relaxed text-justify">{p}</p>
            ))}
          </div>
          {bio.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-primary font-body text-xs tracking-wide mt-3 hover:underline"
            >
              {expanded
                ? (lang === "ar" ? "عرض أقل" : "Show Less")
                : (lang === "ar" ? "اقرأ المزيد" : "Read More")}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AboutUs = () => {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const show = (s: string) => showAll || section === s; 

  const values = [
    { icon: Heart, titleKey: "patientCenteredCare", descKey: "patientCenteredCareDesc" },
    { icon: Heart, titleKey: "compassion", descKey: "compassionDesc" },
    { icon: Star, titleKey: "passionForExcellence", descKey: "passionForExcellenceDesc" },
    { icon: Sparkles, titleKey: "innovation", descKey: "innovationDesc" },
    { icon: Shield, titleKey: "integrityProfessionalism", descKey: "integrityProfessionalismDesc" },
  ];

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />

      {/* Hero */}
      {section !== "chairman" && (
        <section className="pt-12 pb-6 md:pt-16 md:pb-8 bg-primary/5">
          <div className="container mx-auto px-6 text-center">
            <ScrollAnimationWrapper>
              {section !== "chairman" && (
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{lang === "ar" ? "تعرف علينا" : "Get To Know Us"}</p>
              )}
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                {section === "history" ? (lang === "ar" ? "قصتنا" : "Our Story")
                  : section === "mission" ? (lang === "ar" ? "الرسالة والقيم" : "Mission & Values")
                    : section === "csr" ? "Celebrating Life"
                      : section === "chairman" ? (lang === "ar" ? "رسالة رئيس مجلس الإدارة" : "Chairman's Message")
                        : section === "leadership" ? (lang === "ar" ? "فريق القيادة" : "Leadership Team")
                          : t("aboutUs")}
              </h1>
              {showAll && <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">{t("storyP1")}</p>}
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Our History - FULL content from doc */}
      {show("history") && <section className="pb-16 pt-2 bg-background" id="history">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-10">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {/* <BookOpen className="w-4 h-4 inline mr-1" /> */}
                {/* {lang === "ar" ? "تاريخنا" : "Our History"} */}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t("historyTitle")}</h2>
            </div>
          </ScrollAnimationWrapper>
          <div className="max-w-4xl mx-auto space-y-5">
            {[
              t("historyP1"),
              t("historyP2"),
              t("historyP3"),
              t("historyP4"),
              t("historyP5"),
              t("historyP6"),
              t("historyP7"),
              t("historyP8"),
            ].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="font-body text-sm text-muted-foreground leading-relaxed text-justify"
                {...(p.includes("<") && p.includes(">")
                  ? { dangerouslySetInnerHTML: { __html: p } }
                  : {})}
              >
                {!p.includes("<") || !p.includes(">") ? p : null}
              </motion.p>
            ))}
          </div>
        </div>
      </section>}

      {/* Chairman's Message */}
      {show("chairman") && (
        <>
          <section className="pt-12 pb-0 bg-background">
            <div className="container mx-auto px-6 text-center">
              <ScrollAnimationWrapper>
                <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                  {lang === "ar" ? "رسالة رئيس مجلس الإدارة" : "Chairman's Message"}
                </h1>
              </ScrollAnimationWrapper>
            </div>
          </section>
          <ChairmanMessage />
        </>
      )}

      {/* Leadership Team */}
      {show("leadership") && <section className="pb-16 pt-16 bg-background" id="leadership">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-10">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                {t("leadership")}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{t("leadershipSubtitle")}</h2>
              <p className="text-muted-foreground font-body text-sm max-w-3xl mx-auto">{t("leadershipDesc")}</p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-5xl mx-auto space-y-6">
            {leaders.map((leader) => (
              <LeaderCard key={leader.nameEn} leader={leader} lang={lang} />
            ))}
          </div>
        </div>
      </section>}

      {/* Mission & Values */}
      {show("mission") && <section className="pb-16 pt-2 bg-secondary/10" id="mission">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-10">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                <Target className="w-4 h-4 inline mr-1" />
                {lang === "ar" ? "رسالتنا" : "Our Mission"}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{t("missionStatement")}</h2>
              <p className="text-muted-foreground font-body text-sm max-w-3xl mx-auto italic">"{t("missionText")}"</p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <div className="text-center mb-8 mt-12">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {lang === "ar" ? "قيمنا" : "Our Values"}
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.titleKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-popover border border-border/50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-base text-foreground mb-2">{t(v.titleKey)}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>}

      {/* CSR */}
      {show("csr") && (
        <Link to="/csr" className="block">
          <section className="pb-16 pt-2 bg-background cursor-pointer hover:bg-primary/5 transition">
            <div className="container mx-auto px-6">
              <ScrollAnimationWrapper>
                <div className="text-center mb-10">
                  <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    CSR
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                    Celebrating Life
                  </h2>
                  <p className="text-muted-foreground font-body text-sm max-w-3xl mx-auto leading-relaxed text-justify">
                    A signature landmark by Royale Hayat Hospital, created to symbolize renewal, unity, and the beauty of life.
                    <br /><br />
                    Inspired by a vision of healing that extends beyond hospital walls, the monument blends art, nature, and contemporary design into a meaningful urban statement.
                    <br /><br />
                    With its circular form representing continuity and its blooming flower reflecting growth and vitality, the landmark stands as a tribute to hope, wellness, and community connection. More than a structure, it is a gift to Kuwait - beautifying the cityscape while embodying a lasting commitment to compassion, care, and optimism for generations to come.
                  </p>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
        </Link>
      )}

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default AboutUs;
