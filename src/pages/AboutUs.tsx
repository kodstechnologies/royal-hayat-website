import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import ChairmanMessage from "@/components/ChairmanMessage";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Star, Sparkles, Shield, Target, BookOpen, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getAllLeadership,
  mapLeadershipToDisplay,
  type LeaderDisplay,
  type LeadershipItem,
} from "@/api/leadership";

const staticLeaders = [
  {
    initials: "SA",
    nameEn: "Dr. Sulaiman Al Mazeedi",
    nameAr: "د. سليمان المزيدي",
    roleEn: "Medical Advisor\nConsultant General Surgery, Obesity Surgery, Colon & Gastrointestinal Endoscopy",
    roleAr: "مستشار طبي\nاستشاري جراحة عامة وجراحة السمنة ومناظير الجهاز الهضمي وجراحة القولون",
    credentialsEn: "M.B.B.Ch., MRCS (England), KBS, MCSO (Harvard)",
    credentialsAr: "M.B.B.Ch., MRCS (England), KBS, MCSO (Harvard)",
    credentialsAfterRole: true,
    bioEn: [
      "Dr. Sulaiman Al Mazeedi is a highly accomplished and influential figure in the field of healthcare. His unwavering passion for medicine and tireless dedication to improving healthcare outcomes have earned him widespread recognition and respect both nationally and internationally.",
      "He began his educational journey at the Faculty of Medicine at Kuwait University. Dr. Al Mazeedi is a member of the Kuwaiti Board of General Surgery and the Royal College of Surgeons (England), where he trained in Bariatric and Colorectal Surgery in London, UK. During this period, he honed his clinical skills and developed a profound understanding of complex medical conditions.",
      "Dr. Al Mazeedi is committed to transforming the healthcare landscape in Kuwait. He has spearheaded numerous initiatives aimed at integrating cutting-edge technology into healthcare delivery systems, improving patient outcomes, and enhancing overall efficiency.",
    ],
    bioAr: [
      "يُعد د. سليمان المزيدي من الشخصيات البارزة والمؤثرة في قطاع الرعاية الصحية، حيث عُرف بشغفه الكبير بالطب والتزامه المستمر بتطوير جودة الرعاية الصحية وتحسين نتائج المرضى، ما أكسبه احترامًا وتقديرًا واسعًا على المستويين المحلي والدولي.",
      "بدأ رحلته الأكاديمية في كلية الطب بجامعة الكويت، وهو عضو في البورد الكويتي للجراحة العامة والكلية الملكية للجراحين في إنجلترا، حيث تلقى تدريبه في جراحات السمنة والقولون في لندن، المملكة المتحدة. وخلال هذه المرحلة، طوّر خبراته السريرية واكتسب فهمًا عميقًا للحالات الطبية المعقدة.",
      "ويؤمن د. المزيدي بأهمية تطوير القطاع الصحي في الكويت، حيث قاد العديد من المبادرات التي تهدف إلى دمج أحدث التقنيات في أنظمة الرعاية الصحية، بما يسهم في تحسين نتائج المرضى ورفع كفاءة الخدمات الطبية.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678706759-dr-sulaiman-al-mazeedi.png",
  },
  {
    initials: "AE",
    nameEn: "Dr. Abubakr Elmardi",
    nameAr: "د. أبو بكر المرضي",
    roleEn:
      "Chief Strategic Officer (CSO)\nHead of Obstetrics & Gynecology Department\nConsultant Obstetrician & Gynecologist\nHead of Urogynecology Unit & Pelvic Floor Reconstructive Surgery\nHead of Cosmetic Gynecology Unit",
    roleAr:
      "الرئيس الإستراتيجي التنفيذي \nرئيس قسم أمراض النساء والولادة\nاستشاري أمراض النساء والولادة\nرئيس وحدة المسالك البولية النسائية وجراحات الحوض الترميمية\nرئيس وحدة التجميل النسائي",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Dr. Abubakr Elmardi is a distinguished consultant obstetrician and gynaecologist, currently serving as the Chief Strategic Officer and the Head of the Obstetrics & Gynaecology Department. With 24 years of experience as the former Head of Department at North Midland University Hospital in the UK, he brings exceptional depth of knowledge and clinical expertise to his role.",
      "He is a Fellow of several esteemed organizations, including the Royal College of Obstetricians & Gynaecologists (UK), the American College of Obstetricians & Gynaecologists, and the Faculty of Sexual & Reproductive Health (FFSRH) of the RCOG. Additionally, he is a Fellow of the International College of Surgeons (FICS) in the USA and an active member of both the International Urogynecological Association and the International Continence Society.",
      "Dr. Elmardi specializes in the management of normal and high-risk pregnancies, as well as normal, assisted, and complex deliveries, including caesarean sections and major obstetric surgeries. He is also experienced in cosmetic vaginal surgery, utilizing techniques such as Monalisa Touch and laser treatments.",
      "In the area of menstrual disorders, he offers innovative treatments like Novasure endometrial ablation for women who have completed their families. His surgical expertise includes hysteroscopic procedures for the removal of polyps, fibroids, and septa via Myosure (TCER), as well as laparoscopic surgeries addressing conditions such as adhesions and ectopic pregnancies.",
      "Dr. Elmardi is also dedicated to managing female urinary and pelvic floor disorders, performing urodynamic studies, and conducting bladder and pelvic floor scanning to ensure comprehensive care for his patients.",
    ],
    bioAr: [
      "يُعد د. أبو بكر المرضي من أبرز الاستشاريين في مجال النساء والولادة، ويشغل حاليًا منصب الرئيس التنفيذي للاستراتيجية ورئيس قسم النساء والولادة. إذ يمتلك خبرة تمتد لأكثر من أربعة وعشرين عامًا كرئيس سابق للقسم في مستشفى نورث ميدلاند الجامعي بالمملكة المتحدة، مما يمنحه خبرة واسعة ومعرفة متقدمة في تخصصه.",
      "يحمل زمالات من عدة مؤسسات مرموقة، من بينها الكلية الملكية لأطباء النساء والولادة في المملكة المتحدة، والكلية الأمريكية لأطباء النساء والولادة، بالإضافة إلى كلية الصحة الجنسية والإنجابية التابعة للكلية الملكية البريطانية. كما أنه زميل الكلية الدولية للجراحين في الولايات المتحدة وعضو فعّال في الجمعية الدولية لأمراض المسالك البولية النسائية والجمعية الدولية للتحكم البولي.",
      "يتخصص د. المرضي في متابعة حالات الحمل الطبيعية وعالية الخطورة، وإجراء الولادات الطبيعية والمعقدة والقيصرية والعمليات النسائية الكبرى. كما يمتلك خبرة في جراحات التجميل النسائي باستخدام أحدث تقنيات الليزر وعلاج موناليزا.",
      "يقدم علاجات متطورة لاضطرابات الدورة الشهرية، مثل تقنية نوفاشور لعلاج بطانة الرحم، إضافة إلى إجراء المناظير النسائية والعمليات الجراحية لعلاج الأورام الليفية، والالتصاقات، والحمل خارج الرحم، واضطرابات قاع الحوض والمسالك البولية النسائية.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678708901-dr-abubakr-elmardi.png",
  },
  {
    initials: "OE",
    nameEn: "Prof. Dr. Omar El Khateeb",
    nameAr: "البروفيسور د. عمر الخطيب",
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
      "يمتلك البروفيسور الدكتور عمر الخطيب أكثر من 40 عامًا من الخبرة في مجال التخدير والولادة بدون ألم. تخرّج من كلية الطب بجامعة الإسكندرية في مصر، حيث أسس لمسيرة طبية متميزة.",
      "حصل على درجة الماجستير في التخدير والعناية المركزة الجراحية من كلية الطب بجامعة الإسكندرية، ثم نال درجة الدكتوراه في التخدير والعناية المركزة وعلاج الألم عام 1982. كما أنه عضو في الجمعية الدولية لدراسة (IASP).",
      "ويتمتع الدكتور الخطيب بخبرة واسعة في تخدير النساء والولادة، وتطبيق تقنيات التخدير فوق الجافية للولادة، إلى جانب خبرته في تخدير الحالات عالية الخطورة وكبار السن، والعناية المركزة الجراحية للكبار والأطفال، فضلًا عن التخدير لجراحات السمنة.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678709624-dr-omar-el-khateeb.png",
  },
  {
    initials: "SM",
    nameEn: "Shibu Thomas Mathew",
    nameAr: "شيبو توماس ماثيو",
    roleEn: "Chief Financial Officer & Director – Human Resources Capital",
    roleAr: "المدير المالي التنفيذي ومدير الموارد البشرية",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Shibu Thomas Mathew has been part of Royale Hayat Hospital’s leadership journey since its inception, joining the pre-opening team in 2006 and contributing to the establishment of a trusted, world-class healthcare institution. He was appointed Financial Controller in 2007 and promoted to Chief Financial Officer in 2010.",
      "In his role as Chief Financial Officer and Director – Human Resources Capital, Mr. Shibu provides strategic leadership that integrates financial stewardship with people-centric governance. He oversees long-term investment planning, financial performance management, budget governance, and human capital strategy across all Group companies. He also serves as a Board Member for several subsidiaries, supporting strong governance, ethical decision-making, and sustainable growth.",
      "With prior senior leadership experience in finance, accounting, and treasury roles across multinational organizations, Mr. Shibu brings a balanced approach combining operational discipline, strategic foresight, and a deep commitment to people and purpose.",
      "He is a CMA (USA), ACMA India with IFRS credentials and executive education in healthcare strategy from Harvard T.H. Chan School of Public Health",
    ],
    bioAr: [
      "يُعد شيبو توماس ماثيو أحد أعضاء فريق القيادة منذ تأسيس مستشفى رويال حياة، حيث انضم إلى فريق ما قبل الافتتاح عام 2006 وأسهم في بناء مؤسسة صحية عالمية موثوقة. عُيِّن مراقبًا ماليًا عام 2007 ثم تمت ترقيته إلى مدير مالي تنفيذي عام 2010.",
      "في إطار منصبه، يضطلع بالقيادة الاستراتيجية التي تدمج الإشراف المالي مع إدارة رأس المال البشري، حيث يشرف على التخطيط الاستثماري طويل المدى، وإدارة الأداء المالي، والحوكمة المالية، واستراتيجيات الموارد البشرية في جميع شركات المجموعة. كما يشغل عضوية مجلس إدارة عدد من الشركات التابعة، دعمًا للحوكمة الرشيدة والقرارات الأخلاقية السليمة والنمو المستدام.",
      "ويمتلك خبرة قيادية واسعة في مجالات المالية والمحاسبة والخزينة ضمن مؤسسات متعددة الجنسيات، ويجمع في أسلوبه القيادي بين الانضباط التشغيلي والرؤية الاستراتيجية والاهتمام بالعنصر البشري.",
      "هو حاصل على شهادة المحاسب الإداري المعتمد (CMA) من الولايات المتحدة الأمريكية، وعضو في معهد المحاسبين الإداريين المعتمدين (ACMA) في الهند، فضلًا عن حمله اعتماد المعايير الدولية لإعداد التقارير المالية (IFRS)، وشهادة التعليم التنفيذي في استراتيجية الرعاية الصحية من كلية هارفارد T.H. Chan للصحة العامة.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678708460-shibu-thomas-mathew.png",
  },
  {
    initials: "HG",
    nameEn: "Dr. Hamid Ghaderi",
    nameAr: "د. حميد القادري",
    roleEn:
      "Head of Anesthesia, ICU & Pain Management\nDeputy Medical Director\nConsultant Anesthesia, ICU & Pain Management",
    roleAr:
      "رئيس قسم التخدير والعناية المركزة وعلاج الألم\nنائب المدير الطبي\nاستشاري التخدير والعناية المركزة وعلاج الألم",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Graduating from the prestigious Medical School at the Elite University of Heidelberg in Germany, Dr. Hamid has built an impressive career in the field of anesthesia, intensive care, and pain management. At the University of Heidelberg, Dr. Hamid served as a Consultant and Lecturer, specializing in anesthesia, intensive care, and pain management. This expertise is further validated by a German Board certification in Anesthesia, Surgical Intensive Care, and Clinical Pain Management from the same university.",
      "Dr. Hamid has completed fellowships in both Intensive and Neonatal Care at the Children's Hospital, University of Heidelberg, and in Cardiac Anesthesia in Germany. As a recognized professional, Dr. Hamid is a member of both the German and European Society for Anesthesia, ICU, and Pain Management, as well as the European Society for Cardiac Anesthesia.",
      "With extensive experience in general and regional anesthesia for all specialties and high-risk patients, Dr. Hamid is adept at handling anesthesia for bariatric surgeries and providing epidural injections for normal delivery and cesarean sections. Dr. Hamid has a subspecialty in pediatrics, neonatal anesthesia, and anesthesia for special needs, alongside surgical intensive care medicine for both adults and pediatrics.",
      "In chronic pain management, Dr. Hamid focuses on spine pain with therapeutic injections and has pioneered CT-guided spine therapeutic injection, establishing the first qualified center in Kuwait and the Middle East. The expertise extends to managing chronic pain for conditions such as headaches, shingles, fibromyalgia, cancer pain, and other pain-related conditions.",
    ],
    bioAr: [
      "تخرّج د. حميد من كلية الطب بجامعة هايدلبرغ المرموقة في ألمانيا، وبنى مسيرة مهنية متميِّزة في مجالات التخدير والعناية المركزة وعلاج الألم حيث عمل استشاريًا ومحاضرًا في جامعة هايدلبرغ، وتخصص في التخدير والعناية المركزة وإدارة الألم.",
      "يحمل البورد الألماني في التخدير والعناية المركزة الجراحية وعلاج الألم السريري، كما أكمل زمالات متخصصة في العناية المركزة وحديثي الولادة وتخدير القلب في ألمانيا. وهو عضو في الجمعية الألمانية والأوروبية للتخدير والعناية المركزة وعلاج الألم، والجمعية الأوروبية لتخدير القلب.",
      "ويمتلك خبرة واسعة في التخدير العام والموضعي لمختلف التخصصات والحالات عالية الخطورة، بما في ذلك جراحات السمنة، وحقن التخدير للولادة الطبيعية والقيصرية. كما يتخصص في تخدير الأطفال وحديثي الولادة وذوي الاحتياجات الخاصة، إضافة إلى العناية المركزة للكبار والأطفال.",
      "وفي مجال علاج الألم المزمن، اشتُهر الدكتور حميد بريادته في علاج آلام العمود الفقري باستخدام الحقن العلاجية الموجهة بالأشعة المقطعية، حيث أسس أول مركز مؤهل لهذا النوع من العلاج في الكويت والشرق الأوسط، إلى جانب خبرته في علاج الصداع، وآلام السرطان، والفيبروميالغيا، وغيرها من الحالات المزمنة المرتبطة بالألم.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678707983-dr-hamid-ghaderi.png",
  },
  {
    initials: "MA",
    nameEn: "Marta Abril Garcia",
    nameAr: "مارتا أبريل غارسيا",
    roleEn: "Director of Hospitality",
    roleAr: "مديرة قسم الضيافة",
    credentialsEn: "",
    credentialsAr: "",
    bioEn: [
      "Marta Abril Garcia brings almost two decades of international hospitality expertise to her role as Director of Hospitality at Royale Hayat Hospital, where she has been instrumental in shaping a patient and guest experience that consistently sets the standard for luxury healthcare in Kuwait.",
      "With a Master's in Tourism Companies Management and Strategic Communication from ESERP Business School in Madrid, Marta built her career across some of the world's most demanding hospitality environments — from the front lines of luxury hotels in London to boutique wellness resorts in Bali — before channelling that depth of experience into the healthcare sector.",
      "At Royale Hayat, Marta oversees an exceptionally broad portfolio of departments spanning both guest-facing and back-of-house operations — including Guest Relations, Admissions, Outpatient Department, Patient Experience, the Spa, Food & Beverage, Events, the Call Center, Housekeeping, Maintenance, Security, and Kitchen — ensuring that every touchpoint, seen and unseen, reflects the Hospital's hallmark standard of care and elegance.",
      "Her leadership has contributed directly to Royale Hayat's recognition as the Best Private Hospital in Kuwait for 16 consecutive years, as well as its distinction as one of Kuwait's Top 3 Brands in 2022 and Top 10 Brands in 2025.",
      "Having lived and worked across Europe, Asia, the Middle East, and with extended personal travel experience across all five continents, Marta brings a truly global perspective to her work, one grounded in the belief that exceptional hospitality, whether in a five-star resort or a world-class hospital, is always, at its heart, about people.",
    ],
    bioAr: [
      "تتمتع مارتا أبريل غارسيا بخبرة دولية تمتد لما يقارب عقدين في مجال الضيافة، وتشغل منصب مديرة قطاع الضيافة في مستشفى رويال حياة، حيث كان لها دور محوري في تطوير تجربة المرضى والضيوف بما يرسّخ معايير الضيافة الصحية الفاخرة في الكويت.",
      "تحمل مارتا درجة الماجستير في إدارة شركات السياحة والاتصال الاستراتيجي من كلية ESERP للأعمال في مدريد، وقد بنت مسيرتها المهنية عبر العمل في بعض أكثر بيئات الضيافة تميُّزًا حول العالم، بدءًا من الفنادق الفاخرة في لندن وصولًا إلى المنتجعات الصحية الراقية في بالي، قبل أن تنقل هذه الخبرات الثرية إلى قطاع الرعاية الصحية.",
      "في رويال حياة، تشرف مارتا على مجموعة واسعة من الأقسام التشغيلية والخدمية، سواء المواجهة للعملاء أو الداعمة، بما يشمل: علاقات الضيوف، القبول والتسجيل، العيادات الخارجية، تجربة المرضى، السبا، الأغذية والمشروبات، الفعاليات، مركز خدمة العملاء، التدبير المنزلي، الصيانة، الأمن، والمطبخ، لضمان أن تعكس جميع نقاط التواصل المباشرة وغير المباشرة معايير المستشفى الرفيعة في الرعاية والأناقة.",
      "وقد ساهمت قيادتها بشكل مباشر في حصول مستشفى رويال حياة على لقب أفضل مستشفى خاص في الكويت لمدة 16 عامًا متتالية، بالإضافة إلى تصنيفه ضمن أفضل ثلاث علامات تجارية في الكويت لعام 2022، وضمن أفضل عشر علامات تجارية لعام 2025.",
      "وبفضل خبرتها المهنية والمعيشية في أوروبا وآسيا والشرق الأوسط، إلى جانب رحلاتها الواسعة عبر مختلف قارات العالم، تتمتع مارتا برؤية عالمية متكاملة، تنطلق من إيمان راسخ بأن الضيافة الاستثنائية، سواء في منتجع فاخر أو مستشفى عالمي، تتمحور دائمًا حول الإنسان أولًا.",
    ],
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780678709265-marta.png",
  },
];
const mapStaticLeaderToDisplay = (leader: (typeof staticLeaders)[number]): LeaderDisplay => ({
  key: leader.nameEn,
  initials: leader.initials,
  nameEn: leader.nameEn,
  nameAr: leader.nameAr,
  roleEn: leader.roleEn,
  roleAr: leader.roleAr,
  credentialsEn: leader.credentialsEn,
  credentialsAr: leader.credentialsAr,
  credentialsAfterRole: leader.credentialsAfterRole,
  bioEn: leader.bioEn,
  bioAr: leader.bioAr,
  image: leader.image,
});

const LeaderCard = ({ leader, lang }: { leader: LeaderDisplay; lang: string }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const name = lang === "ar" ? leader.nameAr : leader.nameEn;
  const role = lang === "ar" ? leader.roleAr : leader.roleEn;
  const roles = role.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const credentials = lang === "ar" ? leader.credentialsAr : leader.credentialsEn;
  const bio = lang === "ar" ? leader.bioAr : leader.bioEn;
  const displayInitials = leader.initials;
  const mobileImageOverride: Record<string, string> = {
    "Dr. Abubakr Elmardi": "",
    "Dr. Sulaiman Al Mazeedi": "",
  };
  const desktopImageOverride: Record<string, string> = {
    "Prof. Dr. Omar El Khateeb": "",
    "Dr. Hamid Ghaderi": "",
    "Shibu Thomas Mathew": "",
  };
  const mobileOverrideSrc = mobileImageOverride[leader.nameEn];
  const desktopOverrideSrc = desktopImageOverride[leader.nameEn];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-popover border border-border/50 rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 flex-shrink-0 bg-primary/5 flex items-center justify-center p-8 md:p-10">
          <div className={`w-44 h-44 md:w-60 md:h-60 rounded-2xl flex items-center justify-center border-4 border-primary/20 overflow-hidden ${leader.image ? "bg-white" : "bg-primary/10"}`}>
            {leader.image ? (
              <img
                src={leader.image}
                alt={name}
                className="w-full h-full object-contain md:object-cover md:object-top bg-white"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-serif text-primary">{displayInitials}</span>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8">
          <h3 className={`font-serif text-xl font-bold text-foreground mb-1 ${lang === "ar" ? "rtl-text" : ""}`}>{name}</h3>
          {(() => {
            const showRoleFirst = lang === "ar" && leader.credentialsAfterRole;
            const roleBlock = (
              <div className="space-y-0.5 mb-4">
                {roles.map((r, i) => (
                  <p key={i} className={`font-body text-sm text-accent ${lang === "ar" ? "rtl-text" : ""}`}>
                    {r}
                  </p>
                ))}
              </div>
            );
            const credentialsBlock = credentials ? (
              <p className={`font-body text-xs text-accent mb-2 ${lang === "ar" ? "rtl-text" : ""}`}>{credentials}</p>
            ) : null;
            if (showRoleFirst) {
              return (
                <>
                  {roleBlock}
                  {credentialsBlock}
                </>
              );
            }
            return (
              <>
                {credentialsBlock}
                {roleBlock}
              </>
            );
          })()}
          <div className={`space-y-3 overflow-hidden transition-all duration-500 ${expanded ? "max-h-[2000px]" : "max-h-[100px]"}`}>
            {bio.map((p, i) => (
              <p
                key={i}
                lang={lang === "ar" ? "ar" : "en"}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="font-body text-sm text-muted-foreground leading-relaxed text-justify [text-align-last:start]"
              >
                {p}
              </p>
            ))}
          </div>
          {bio.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-primary font-body text-xs tracking-wide mt-3 hover:underline"
            >
              {expanded
                ? (lang === "ar" ? "عرض أقل" : "Show Less")
                : t("learnMore")}
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
  const [apiLeaders, setApiLeaders] = useState<LeadershipItem[] | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [section]);

  useEffect(() => {
    let cancelled = false;

    getAllLeadership()
      .then((items) => {
        if (!cancelled) setApiLeaders(items);
      })
      .catch((error) => {
        console.error("Failed to load leadership team:", error);
        if (!cancelled) setApiLeaders([]);
      })
      .finally(() => {
        if (!cancelled) setApiLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayLeaders = useMemo(() => {
    if (apiLoaded && apiLeaders && apiLeaders.length > 0) {
      return apiLeaders.map(mapLeadershipToDisplay);
    }
    return staticLeaders.map(mapStaticLeaderToDisplay);
  }, [apiLoaded, apiLeaders]);

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
      {section !== "chairman" && (
        <section className="pt-12 pb-6 md:pt-16 md:pb-8 bg-primary/5">
          <div className="container mx-auto px-6 text-center">
            <ScrollAnimationWrapper>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {t("getToKnowUs")}
              </p>
              <h1
                className={`text-4xl md:text-5xl font-serif text-foreground mb-4 text-center ${
                  lang === "ar" ? "rtl-text-center" : ""
                }`}
              >
                {section === "history"
                  ? lang === "ar"
                    ? "قصتنا"
                    : "Our Story"
                  : section === "mission"
                    ? lang === "ar"
                      ? "الرسالة والقيم"
                      : "Mission & Values"
                    : section === "csr"
                      ? t("csrCelebratingLife")
                      : section === "leadership"
                        ? lang === "ar"
                          ? "فريق القيادة"
                          : "Leadership Team"
                        : t("aboutUs")}
              </h1>
              {showAll && (
                <div
                  className="about-hero-intro max-w-3xl mx-auto"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  lang={lang === "ar" ? "ar" : "en"}
                >
                  {(() => {
                    const intro = t("storyP1");
                    const hasHtml = intro.includes("<") && intro.includes(">");
                    return (
                      <p
                        className="text-muted-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line"
                        {...(hasHtml ? { dangerouslySetInnerHTML: { __html: intro } } : {})}
                      >
                        {!hasHtml ? intro : null}
                      </p>
                    );
                  })()}
                </div>
              )}
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      {show("history") && (
        <section className="pb-16 pt-2 bg-background" id="history">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-10">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  {t("ourStory")}
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
              ].map((p, i) => {
                const hasHtml = p.includes("<") && p.includes(">");
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`font-body text-sm md:text-base text-muted-foreground leading-relaxed text-center ${
                      lang === "ar" ? "rtl-text-center" : ""
                    }`}
                    {...(hasHtml ? { dangerouslySetInnerHTML: { __html: p } } : {})}
                  >
                    {!hasHtml ? p : null}
                  </motion.p>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {show("mission") && (
        <section className="pb-16 pt-2 bg-secondary/10" id="mission">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-10">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  {t("missionValues")}
                </p>
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  <Target className="w-4 h-4 inline mr-1" />
                  {t("ourMission")}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">{t("missionStatement")}</h2>
                <p
                  className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto italic leading-relaxed ${
                    lang === "ar" ? "rtl-text" : ""
                  }`}
                >
                  &ldquo;{t("missionText")}&rdquo;
                </p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
              <div className="text-center mb-8 mt-12">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("ourValues")}</p>
              </div>
            </ScrollAnimationWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {values.map((v, i) => (
                <motion.div
                  key={v.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-popover border border-border/50 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3
                    className={`font-serif text-base text-foreground mb-2 font-bold ${
                      lang === "ar" ? "rtl-text-center" : ""
                    }`}
                  >
                    {t(v.titleKey)}
                  </h3>
                  {(() => {
                    const desc = t(v.descKey);
                    const hasHtml = desc.includes("<") && desc.includes(">");
                    return (
                      <p
                        className={`font-body text-sm text-muted-foreground leading-relaxed ${
                          lang === "ar" ? "rtl-text" : ""
                        }`}
                        {...(hasHtml ? { dangerouslySetInnerHTML: { __html: desc } } : {})}
                      >
                        {!hasHtml ? desc : null}
                      </p>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {show("chairman") && (
        <>
          <section className="pt-12 pb-0 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              <ScrollAnimationWrapper>
                <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[88rem] mx-auto">
                  <h1
                    className={`text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-left lg:pl-[42%] xl:pl-[40%] ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                  >
                    {t("chairmanMessage")}
                  </h1>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
          <ChairmanMessage />
        </>
      )}
      {show("leadership") && <section className="pb-16 pt-16 bg-muted/20" id="leadership">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-10">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                {t("leadership")}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{t("leadershipSubtitle")}</h2>
              <p
                className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed ${
                  lang === "ar" ? "rtl-text" : ""
                }`}
              >
                {lang === "ar"
                  ? "تعرّفوا على فريقنا القيادي المتميّز برؤيته الاستراتيجية، والمسؤول عن تحقيق تطلعات مجموعة رويال حياة، وإدارة عمليات المستشفى باعتباره أحد أبرز مقدمي الرعاية الصحية المتميزة في الكويت، وقيادة المؤسسة نحو مستقبل أكثر إشراقًا وتميُّزًا."
                  : "Learn more about our visionary leadership team responsible for fulfilling the vision of our Group, managing Royale Hayat Hospital activities as the leading premium healthcare provider in Kuwait, and steering the organization towards a bright future."}
              </p>
            </div>
          </ScrollAnimationWrapper>
          <div className="max-w-5xl mx-auto space-y-6">
            {displayLeaders.map((leader) => (
              <LeaderCard key={leader.key} leader={leader} lang={lang} />
            ))}
          </div>
        </div>
      </section>}
      {show("csr") && (
        <Link to="/csr" className="block">
          <section className="pb-16 pt-2 bg-background cursor-pointer hover:bg-primary/5 transition">
            <div className="container mx-auto px-6">
              <ScrollAnimationWrapper>
                <div className="text-center mb-10">
                  <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {t("csrEyebrow")}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 text-center">
                    {t("csrCelebratingLife")}
                  </h2>
                  <div
                    className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-justify space-y-4 ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                  >
                    {[t("csrAboutP1"), t("csrAboutP2"), t("csrAboutP3")].map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    <p className={`font-serif text-foreground pt-2 text-center ${lang === "ar" ? "rtl-text-center" : ""}`}>
                      {t("csrAboutTagline")}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
        </Link>
      )}
      <style>{`
        .rtl-text {
          direction: rtl;
          text-align: right;
        }
        .rtl-text-center {
          direction: rtl;
          text-align: center;
        }
        #leadership [dir="rtl"].text-justify {
          -webkit-hyphens: none;
          hyphens: none;
        }
        @media (max-width: 767px) {
          .about-hero-intro p {
            text-align: justify !important;
            text-justify: inter-word;
            -webkit-hyphens: auto;
            hyphens: auto;
            text-align-last: left;
            word-break: normal;
            overflow-wrap: normal;
          }
          .about-hero-intro[dir="rtl"] p {
            text-align-last: right;
            -webkit-hyphens: none;
            hyphens: none;
          }
        }
      `}</style>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default AboutUs;
