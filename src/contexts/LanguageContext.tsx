import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  [key: string]: { en: string; ar: string };
}

const translations: Translations = {
  // Nav
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "عن المستشفى" },
  aboutUsNav: { en: "About Us", ar: "من نحن" },
  medicalServices: { en: "Medical Services", ar: "الخدمات الطبية" },
  royaleHomeHealth: { en: "Royale Home Health", ar: "رويال للرعاية المنزلية" },
  hospitalityServices: { en: "Hospitality Services", ar: "خدمات الضيافة" },
  patientsVisitors: { en: "Patients Info", ar: "معلومات للمرضى والزوار" },
  patientsVisitorsDropdownTitle: { en: "Information For Patients and Visitors", ar: "معلومات للمرضى والزوار" },
  departments: { en: "Departments", ar: "الأقسام" },
  doctors: { en: "Doctors", ar: "الأطباء" },
  bookAppointment: { en: "Book Appointment", ar: "طلب موعد" },
  login: { en: "My Medical Reports", ar: "تقاريري الطبية" },
  searchPlaceholder: { en: "Search symptoms, doctors, departments, services...", ar: "ابحث عن الأعراض، الأطباء، الأقسام، الخدمات..." },

  
  // Story Block
  getToKnowUs: { en: "Get To Know Us", ar: "تعرف علينا" },
  ourStory: { en: "Our Story", ar: "قصتنا" },
  storyTitle: {
    en: "Celebrating Life. Every Stage. Every Age.",
    ar: "لنحتفل معاً بالحياة. في كل مرحلة. في كل عمر.",
  },
  storyP1: {
    en: "At life's most meaningful moments, healthcare should feel deeply human. Since 2006, Royale Hayat Hospital has been celebrating life, beginning as a dedicated women's and children's hospital and growing into Kuwait's leading multi-disciplinary healthcare destination. From birth to lifelong wellness, we deliver world-class medical expertise with compassion, privacy, and comfort at the core.",
    ar: "في أعمق لحظات الحياة وأكثرها معنى، ينبغي للرعاية الصحية أن تلامس الإنسان في أعماقه. منذ عام 2006، يحتفي مستشفى رويال حياة بالحياة في كل مراحلها؛ إذ انطلق في مسيرته مستشفىً متخصصاً في رعاية المرأة والطفل، ليتطور اليوم إلى الوجهة الصحية الشاملة الأولى في الكويت. من اللحظة الأولى للميلاد وحتى مسيرة صحة تدوم العمر، نقدّم خبرات طبية عالمية المستوى تتمحور حول الرحمة والخصوصية والراحة.",
  },
  storyP2: {
    en: "Every patient receives personalized, exceptional care in an environment where luxury meets medicine and care goes beyond healing.",
    ar: "لكل مريض رعاية شخصية استثنائية، في بيئة يلتقي فيها الفخامة بالطب، وتتجاوز فيها العناية حدود الشفاء.",
  },

  // Our History
  historyTitle: { en: "The Journey of Royale Hayat Hospital", ar: "رحلة مستشفى رويال حياة" },
  historyP1: {
    en: "Healthcare in Kuwait has long been known for its medical excellence. Yet, for many families, the experience of care often felt rushed, impersonal, and emotionally distant. Healing addressed the body, but comfort, privacy, and hospitality were not always part of the journey.",
    ar: "لطالما عُرفت الرعاية الصحية في دولة الكويت بتميّزها الطبي، إلا أن تجربة الرعاية بالنسبة للعديد من العائلات كانت في كثير من الأحيان سريعة، تفتقر إلى الخصوصية والجانب الإنساني الدافئ. فقد كان التركيز ينصب على علاج البدني، بينما لم تكن الراحة، الضيافة، والاهتمام بالتفاصيل الاخرى جزءًا أساسيًا من رحلة العلاج.",
  },
  historyP2: {
    en: "In 2006, a different vision took shape. We set out to create a healthcare destination where patients would feel cared for in every sense, from the very first step inside to the moment they returned home. A space where healing would be serene, and every interaction would be attentive and respectful.",
    ar: "في عام 2006، وُلدت رؤية مختلفة. رؤية جديدة تهدف إلى إنشاء وجهة صحية يشعر فيها المرضى بالرعاية الحقيقية بكل تفاصيلها، منذ اللحظة الأولى لدخولهم وحتى عودتهم إلى منازلهم. مكان يجمع بين العلاج والسكينة، حيث تُقدَّم كل تجربة بعناية واحترام واهتمام صادق.",
  },
  historyP3: {
    en: "This vision became Royale Hayat Hospital.",
    ar: "ومن هنا، انطلقت قصة مستشفى رويال حياة",
  },
  historyP4: {
    en: "From the beginning, our purpose was clear: to deliver world-class healthcare within an environment defined by grace, calm, and meticulous attention to detail. Every space was designed to feel welcoming. Every touchpoint is carefully considered. Every patient is cared for individually.",
    ar: "منذ البداية، كان هدفنا واضحًا: تقديم رعاية صحية على كل من المستوى العالي والعالمي، ضمن بيئة تنبض بالأناقة والهدوء والاهتمام بأدق التفاصيل. حيثُ صُممت كل مساحة لتمنح شعورًا بالترحيب، مع دراسة كل نقطة تواصل بعناية، ليحظى كل مريض برعاية شخصية متكاملة.",
  },
  historyP5: {
    en: "As trust grew, so did our responsibility. We evolved steadily, ensuring that growth would only deepen the quality of care and comfort we offered. Expansion was guided not by scale, but by intention: to elevate the patient experience while preserving luxury, warmth, privacy, and dignity.",
    ar: "ومع تنامي ثقة المرضى بنا، ازدادت مسؤوليتنا تجاههم. فتطوّرنا بخطوات مدروسة، واضعين الجودة والراحة في مقدمة أولوياتنا. لم يكن التوسع بالنسبة لنا هدفًا بحد ذاته، بل وسيلة للارتقاء بتجربة المريض مع الحفاظ على الفخامة، والدفء، والخصوصية، والكرامة الإنسانية.",
  },
  historyP6: {
    en: "Over time, Royale Hayat Hospital matured into a complete healthcare destination, one that supports patients physically, emotionally, and personally. From tranquil interiors to attentive service, from advanced capabilities to compassionate presence, every element works together to create a seamless, reassuring experience.",
    ar: "ومع مرور الوقت، أصبح مستشفى رويال حياة وجهة صحية متكاملة، تهتم بالمريض جسديًا ونفسيًا وإنسانيًا. فمن التصاميم الهادئة إلى الخدمة الراقية، ومن الإمكانيات الطبية المتقدمة إلى الحضور الإنساني الرحيم، تعمل جميع العناصر بتناغم لتقديم تجربة صحية مطمئنة ومتكاملة.",
  },
  historyP7: {
    en: "Today, Royale Hayat Hospital stands as a reflection of that original promise. A place where advanced medical care is delivered with sensitivity and elegance. Where patients and families feel safe, heard, and respected. Where every detail from arrival to discharge is shaped around comfort, clarity, and peace of mind.",
    ar: "واليوم، يقدم مستشفى رويال حياة انعكاسًا لذلك الوعد الأول، مكان تُقدَّم فيه الرعاية الطبية المتقدمة بحس إنساني راقٍ وأناقة استثنائية. مكان يشعر فيه المرضى وعائلاتهم بالأمان، والاهتمام، والاحترام. حيث توفر كل تفصيل من لحظة الوصول وحتى الخروج، الراحة والوضوح وطمأنينة البال.",
  },
  historyP8: {
    en: "<strong>We are Royale Hayat Hospital, recognized as the “Best Hospital in Kuwait” for the past 16 consecutive years.</strong><br /><br />And our story has only just begun.",
    ar: "نحنُ مستشفى رويال حياة \"أفضل مستشفى في الكويت\" لمدة 16 عاماً على التوالي",
  },

  // Mission & Values
  missionValues: { en: "Mission & Values", ar: "الرسالة والقيم" },
  ourMission: { en: "Our Mission", ar: "رسالتنا" },
  ourValues: { en: "Our Values", ar: "قيمنا" },
  missionStatement: { en: "Mission Statement", ar: "بيان الرسالة" },
  missionText: {
    en: "Royale Hayat promises to deliver safe, modern, and quality medical care and services to society in an environment of compassion, comfort, and care. We will achieve this by redefining and setting global benchmarks in hospitality and through providing a culture of continuous learning, innovation, and excellence in healthcare.",
    ar: "يعد مستشفى رويال حياة بتقديم رعاية وخدمات طبية آمنة، حديثة، وعالية الجودة للمجتمع، وذلك ضمن بيئة قائمة على الرحمة، الراحة، والاهتمام. ونسعى إلى تحقيق ذلك من خلال إعادة تعريف معايير الضيافة ووضع مقاييس عالمية جديدة، إلى جانب ترسيخ ثقافة التعلم المستمر، الابتكار، والتميّز في الرعاية الصحية.",
  },
  patientCenteredCare: { en: "Patient-Centered Care", ar: "الرعاية المتمحورة حول المريض" },
  patientCenteredCareDesc: {
    en: "We put the needs of our patients at the core of what we do through outstanding clinical outcomes and a unique patient experience.",
    ar: "نضع احتياجات مرضانا في صميم كل ما نقوم به، وذلك من خلال تحقيق أفضل النتائج الطبية وتقديم تجربة استثنائية وفريدة للمريض",
  },
  compassion: { en: "Compassion", ar: "الرحمة والاهتمام" },
  compassionDesc: {
    en: "We care for your family like our own. We truly embody \"caring patients, inspiring recovery.\"",
    ar: "نعتني بعائلاتكم كما نعتني بعائلاتنا، لنجسد فعليًا مفهوم \"رعاية تهتم بالمريض، وتُلهم التعافي\"",
  },
  passionForExcellence: { en: "Passion for Excellence", ar: "الشغف بالتميّز" },
  passionForExcellenceDesc: {
    en: "We strive consistently to exceed the highest standards of quality in everything that we do.",
    ar: "نسعى دائمًا إلى تجاوز أعلى معايير الجودة في جميع خدماتنا وممارساتنا",
  },
  innovation: { en: "Innovation", ar: "الابتكار" },
  innovationDesc: {
    en: "We always seek opportunities to continuously improve our work to maintain the highest standards of patient care and service delivery.",
    ar: "نحرص باستمرار على تطوير خدماتنا وأعمالنا، للحفاظ على أعلى مستويات الرعاية الصحية وجودة الخدمة",
  },
  integrityProfessionalism: { en: "Integrity and Professionalism", ar: "النزاهة والاحترافية" },
  integrityProfessionalismDesc: {
    en: "We always do what is professional, ethical, and right.",
    ar: "نلتزم دائمًا بما هو مهني وأخلاقي وصحيح في جميع تعاملاتنا",
  },

  // CSR (About Us section)
  csrEyebrow: { en: "Our Commitment", ar: "التزامنا" },
  csrCelebratingLife: { en: "Celebrating Life", ar: "معلم لنحتفل معاً بالحياة" },
  csrAboutP1: {
    en: "A signature landmark by Royale Hayat Hospital, created to symbolize renewal, unity, and the beauty of life.",
    ar: "يُعد معلم \"لنحتفل معاً بالحياة\" أحد المعالم المميزة التي أطلقها مستشفى رويال حياة، ليجسد معاني التجدد، الترابط، وجمال الحياة.",
  },
  csrAboutP2: {
    en: "Inspired by a vision of healing that extends beyond hospital walls, the monument blends art, nature, and contemporary design into a meaningful urban statement.",
    ar: "استُلهم هذا المعلم من رؤية تؤمن بأن مفهوم الشفاء يمتد إلى ما هو أبعد من جدران المستشفى، حيث يجمع بين الفن، الطبيعة، والتصميم المعاصر ليشكّل رسالة حضرية ذات معنى إنساني عميق.",
  },
  csrAboutP3: {
    en: "With its circular form representing continuity and its blooming flower reflecting growth and vitality, the landmark stands as a tribute to hope, wellness, and community connection. More than a structure, it is a gift to Kuwait - beautifying the cityscape while embodying a lasting commitment to compassion, care, and optimism for generations to come.",
    ar: "ويمثل التصميم الدائري الاستمرارية والتواصل، بينما ترمز الزهرة المتفتحة إلى النمو والحيوية والأمل. وأكثر من كونه مجرد معلم جمالي، فهو هدية إلى دولة الكويت، تضيف لمسة جمالية للمشهد الحضري وتعكس التزامًا دائمًا بالرحمة، الرعاية، والتفاؤل للأجيال القادمة.",
  },
  csrAboutTagline: {
    en: "Royale Hayat Hospital ... More than care, A partner for life",
    ar: "مستشفى رويال حياة ... أكثر من مجرد رعاية، شريك للحياة",
  },
  csrInit1Title: {
    en: "Breast Cancer Awareness Lecture – Royale Hayat Hospital",
    ar: "محاضرة التوعية بسرطان الثدي – مستشفى رويال حياة",
  },
  csrInit1Date: { en: "held on 7 October 2025", ar: "أُقيمت بتاريخ 7 أكتوبر 2025" },
  csrInit1P1: {
    en: "Within its walls, Royale Hayat Hospital hosted an exclusive Breast Cancer Awareness lecture led by our team of expert consultants. The session emphasized early detection, advanced treatment options, and holistic patient care, including emotional well-being.",
    ar: "استضاف مستشفى رويال حياة محاضرة توعوية حصرية حول سرطان الثدي، قدّمها نخبة من استشاريين المستشفى، حيث ركزت الجلسة على أهمية الكشف المبكر، وأحدث الخيارات العلاجية، والرعاية الشاملة التي تراعي الجوانب النفسية والعاطفية للمريضات.",
  },
  csrInit1P2: {
    en: "This luxurious and informative initiative reflects our dedication to empowering women with knowledge, compassion, and exceptional healthcare standards.",
    ar: "وتعكس هذه المبادرة الراقية والتثقيفية التزامنا المستمر بتمكين المرأة بالمعرفة، والرعاية الإنسانية، وتقديم أعلى معايير الرعاية الصحية.",
  },
  csrInit2Title: {
    en: "Breast Cancer Awareness Lecture - Burgan Bank",
    ar: "محاضرة التوعية بسرطان الثدي – بنك برقان",
  },
  csrInit2Date: { en: "held on 16 October 2025", ar: "أُقيمت بتاريخ 16 أكتوبر 2025" },
  csrInit2P1: {
    en: "As part of its signature community initiatives, Royale Hayat Hospital hosted a distinguished Breast Cancer Awareness lecture at Burgan Bank. Our elite consultants guided attendees through the importance of early detection, self-examination, and proactive health practices, empowering women with knowledge and confidence.",
    ar: "ضمن مبادراته المجتمعية المتميزة، نظم مستشفى رويال حياة محاضرة توعوية خاصة بسرطان الثدي في بنك برقان، حيث قدّم استشاريو المستشفى للحضور معلومات مهمة حول الكشف المبكر، الفحص الذاتي، وأهمية اتباع الممارسات الصحية الوقائية، بما يسهم في تعزيز الوعي والثقة لدى النساء.",
  },
  csrInit2P2: {
    en: "This initiative epitomizes Royale Hayat’s dedication to preventive healthcare and elevating public health awareness.",
    ar: "تجسد هذه المبادرة التزام رويال حياة بدعم الرعاية الوقائية والارتقاء بمستوى الوعي الصحي في المجتمع.",
  },
  csrInit3Title: {
    en: "Royale Hayat Hospital participated in the 3rd Special Olympics Kuwait Health Screening Event",
    ar: "مشاركة مستشفى رويال حياة في فعالية الفحص الصحي للأولمبياد الخاص – الكويت",
  },
  csrInit3Date: { en: "held on 22 October 2025", ar: "أُقيمت بتاريخ 22 أكتوبر 2025" },
  csrInit3P1: {
    en: "Royale Hayat Hospital proudly participated in the 3rd Special Olympics Kuwait Health Screening Event through its dedicated medical team led by Dr. Alia Ali Ibrahim, Consultant in Internal and Respiratory Medicine. The initiative provided essential health screenings for 150 athletes with special needs across the State of Kuwait.",
    ar: "يفخر مستشفى رويال حياة بمشاركته في النسخة الثالثة من فعالية الفحص الصحي للأولمبياد الخاص – الكويت، من خلال فريقه الطبي المتخصص بقيادة د. عالية علي إبراهيم، استشارية الأمراض الباطنية والجهاز التنفسي. وقدمت المبادرة فحوصات صحية شاملة لـ 150 رياضيًا من ذوي الاحتياجات الخاصة في مختلف أنحاء دولة الكويت،",
  },
  csrInit3P2: {
    en: "This reflects the hospital’s continued commitment to community engagement, inclusivity, and promoting access to comprehensive, compassionate healthcare for all, especially athletes of determination.",
    ar: "في خطوة تعكس التزام المستشفى المستمر بخدمة المجتمع، تعزيز الشمولية، وتوفير رعاية صحية متكاملة وإنسانية للجميع، وخاصة لأصحاب الهمم.",
  },
  csrInit4Title: {
    en: "Royale Hayat Hospital's International Conference on Updates in Women's Health",
    ar: "المؤتمر الدولي لصحة المرأة – مستشفى رويال حياة",
  },
  csrInit4Date: { en: "held on 29 November 2025", ar: "أُقيم بتاريخ 29 نوفمبر 2025" },
  csrInit4P1: {
    en: "Royale Hayat Hospital had the honor of hosting an exclusive, high-level scientific conference on the latest advancements in women's health. Esteemed doctors and consultants from across the globe gathered to exchange insights, showcase best practices, and explore innovative approaches in women's healthcare.",
    ar: "تشرف مستشفى رويال حياة باستضافة مؤتمر علمي دولي رفيع المستوى حول أحدث المستجدات والتطورات في مجال صحة المرأة، بمشاركة نخبة من الأطباء والاستشاريين من مختلف أنحاء العالم. وشكّل المؤتمر منصة علمية متميزة لتبادل الخبرات، واستعراض أفضل الممارسات الطبية، ومناقشة أحدث الابتكارات في الرعاية الصحية للمرأة.",
  },
  csrInit4P2: {
    en: "This prestigious event reflects our unwavering commitment to delivering world-class, evidence-based care for women in Kuwait and the region.",
    ar: "ويعكس هذا الحدث المرموق التزامنا الراسخ بتقديم رعاية صحية عالمية المستوى قائمة على الأدلة العلمية، للمرأة في الكويت والمنطقة.",
  },

  // Leadership
  leadership: { en: "Leadership Team", ar: "فريق القيادة" },
  leadershipSubtitle: { en: "Leading the Journey to Excellence", ar: "قيادة مسيرة التميّز" },
  leadershipDesc: {
    en: "Learn more about our visionary leadership team responsible for fulfilling the vision of our Group, managing RHH activities as the leading luxurious healthcare provider in Kuwait, and steering the organization towards a bright future.",
    ar: "تعرّفوا على فريقنا القيادي صاحب الرؤية، والمسؤول عن تحقيق تطلعات مجموعة رويال حياة، وإدارة عمليات المستشفى باعتباره أحد أبرز مقدمي الرعاية الصحية الفاخرة في الكويت، وقيادة المؤسسة نحو مستقبل أكثر إشراقًا وتميزًا",
  },

  // Home Health
  careAtHome: { en: "Care at Home", ar: "الرعاية في المنزل" },
  homeHealthDesc: { en: "Premium medical care in the comfort of your home", ar: "رعاية طبية متميزة في راحة منزلك" },
  homeHealthFullDesc: { en: "Royale Home Health brings the excellence of hospital care to your doorstep. Our certified medical professionals provide comprehensive healthcare services including nursing, post-operative care, physiotherapy, and elder care — all within the comfort and privacy of your home.", ar: "يقدم رويال للرعاية المنزلية تميز الرعاية الصحية إلى عتبة بابك. يقدم المتخصصون الطبيون المعتمدون لدينا خدمات رعاية صحية شاملة تشمل التمريض والرعاية بعد العمليات والعلاج الطبيعي ورعاية كبار السن." },
  homeNursing: { en: "Home Nursing", ar: "التمريض المنزلي" },
  homeNursingDesc: { en: "Professional nursing care delivered at home by certified specialists.", ar: "رعاية تمريضية احترافية في المنزل من قبل متخصصين معتمدين." },
  postOpCare: { en: "Post-Op Care", ar: "رعاية ما بعد العملية" },
  postOpCareDesc: { en: "Comprehensive recovery support following surgical procedures.", ar: "دعم شامل للتعافي بعد الإجراءات الجراحية." },
  available247homeHealth: { en: "24/7 Available", ar: "متاح على مدار الساعة" },
  available247homeHealthDesc: { en: "Round-the-clock medical support whenever you need it.", ar: "دعم طبي على مدار الساعة متى احتجت إليه." },
  certifiedTeam: { en: "Certified Team", ar: "فريق معتمد" },
  certifiedTeamDesc: { en: "Internationally certified healthcare professionals.", ar: "متخصصون في الرعاية الصحية معتمدون دولياً." },
  teleconsultation: { en: "Teleconsultation", ar: "الاستشارة عن بعد" },
  teleconsultationDesc: { en: "Virtual consultations with our specialists from anywhere.", ar: "استشارات افتراضية مع متخصصينا من أي مكان." },
  elderCare: { en: "Elder Care", ar: "رعاية كبار السن" },
  elderCareDesc: { en: "Specialized care programs for elderly patients at home.", ar: "برامج رعاية متخصصة لكبار السن في المنزل." },

  // Hospitality
  premiumExperience: { en: "Premium Experience", ar: "تجربة استثنائية بمعايير راقية" },
  hospitalityServicesTitle: { en: "Hospitality Services", ar: "خدمات الضيافة" },
  hospitalityDesc: { en: "Experience exclusive healthcare like never before. Our hospitality services ensure every patient and family member feels welcomed, comfortable, and cared for throughout their stay.", ar: "اختبر الرعاية الصحية الفاخرة كما لم تختبرها من قبل. تضمن خدمات الضيافة لدينا أن يشعر كل مريض وأفراد عائلته بالترحيب والراحة والرعاية طوال إقامتهم." },
  exploreHospitality: { en: "Explore Hospitality", ar: "استكشف الضيافة" },
  vipSuites: { en: "Luxury Suites", ar: "أجنحة فاخرة" },
  vipSuitesDesc: { en: "Luxuriously appointed private suites with premium amenities and dedicated staff.", ar: "أجنحة خاصة فاخرة مع وسائل راحة متميزة وطاقم مخصص." },
  luxuryHalls: { en: "Luxury Halls", ar: "قاعات فاخرة" },
  luxuryHallsDesc: { en: "Elegant event spaces for celebrations and gatherings.", ar: "مساحات أنيقة للمناسبات والاحتفالات." },
  birthCelebrationHalls: { en: "Birth Celebration Halls", ar: "قاعات احتفالات الولادة" },
  exclusiveSuites: { en: "Exclusive Suites", ar: "الأجنحة الحصرية" },
  inRoomEvents: { en: "In-Suite Celebration Experiences", ar: "تجارب الاحتفال داخل الجناح" },
  inRoomEventsDesc: { en: "Create meaningful celebrations in the comfort and privacy of your own suite.", ar: "احتفل بلحظاتك الخاصة في راحة وخصوصية جناحك." },
  elementsSpa: { en: "Elements Spa", ar: "سبا إليمنتس" },
  elementsSpaByBanyanTree: { en: "Elements Spa (by Banyan Tree)", ar: "سبا إليمنتس (بانيان تري)" },
  fifthFloorCafe: { en: "The 5th Floor Café", ar: "مقهى الطابق الخامس" },
  elementsSpaDesc: { en: "Relaxation and wellness services to support recovery and well-being.", ar: "خدمات استرخاء وعافية لدعم التعافي والرفاهية." },
  alLiwanCafe: { en: "Al Liwan Bistro", ar: "كافيه الليوان بيسترو" },
  alLiwanCafeDesc: { en: "Fine dining and refreshments in an elegant setting.", ar: "مأكولات راقية ومرطبات في أجواء أنيقة." },
  conciergeService: { en: "Concierge", ar: "الكونسيرج" },
  conciergeServiceDesc: { en: "Personal concierge services to attend to every need during your stay.", ar: "خدمات كونسيرج شخصية لتلبية كل حاجة أثناء إقامتك." },
  gourmetDining: { en: "Gourmet Dining", ar: "المطبخ الراقي" },
  gourmetDiningDesc: { en: "Chef-prepared meals tailored to dietary needs and personal preferences.", ar: "وجبات يعدها طهاة محترفون مصممة حسب الاحتياجات الغذائية والتفضيلات الشخصية." },
  familyLounge: { en: "Family Lounge", ar: "صالة العائلة" },
  familyLoungeDesc: { en: "Comfortable family waiting areas with refreshments and entertainment.", ar: "مناطق انتظار مريحة للعائلة مع مرطبات وترفيه." },
  spaWellness: { en: "Spa & Wellness", ar: "السبا والعافية" },
  spaWellnessDesc: { en: "Relaxation and wellness services to support recovery and well-being.", ar: "خدمات استرخاء وعافية لدعم التعافي والرفاهية." },
  premiumAmenities: { en: "Premium Amenities", ar: "وسائل الراحة المتميزة" },
  premiumAmenitiesDesc: { en: "High-end toiletries, entertainment systems, and comfort essentials.", ar: "مستلزمات فاخرة وأنظمة ترفيه ومستلزمات الراحة." },

  // Al Safwa Program
  premiumLoyalty: { en: "Premium Loyalty", ar: "الولاء المتميز" },
  alSafwaProgram: { en: "Al Safwa Healthcare Program", ar: "برنامج الصفوة للرعاية الصحية" },
  alSafwaDesc: { en: "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle. Our team will craft a customized care plan just for you.", ar: "تحكم في صحتك بسهولة مع برنامجنا المخصص. سجّل عن طريق ملء نموذج تسجيل سريع. سيقوم فريقنا بإعداد خطة رعاية مخصصة لك." },
  priorityBooking: { en: "Priority Booking", ar: "أولوية الحجز" },
  dedicatedCoordinator: { en: "Dedicated Coordinator", ar: "منسق مخصص" },
  exclusiveDiscounts: { en: "Exclusive Discounts", ar: "خصومات حصرية" },

  // Patients & Visitors
  forOurPatients: { en: "For Our Patients", ar: "لمرضانا" },
  patientsVisitorsDesc: { en: "Everything you need to know for a comfortable and informed experience at Royale Hayat Hospital.", ar: "كل ما تحتاج معرفته لتجربة مريحة ومطلعة في مستشفى رويال حياة." },
  nursing: { en: "Nursing", ar: "التمريض" },
  nursingDesc: { en: "Dedicated nursing care with compassion and expertise.", ar: "رعاية تمريضية متفانية بالرحمة والخبرة." },
  admissionInfo: { en: "Admission Information", ar: "معلومات الدخول إلى المستشفى" },
  admissionInfoDesc: { en: "What to bring, documents needed, and pre-admission preparations.", ar: "ما تحتاجون معرفته لتجربة مريحة وواضحة عند الدخول إلى المستشفى." },
  healthInsurance: { en: "Health Insurance", ar: "التأمين الصحي" },
  healthInsuranceDesc: { en: "Our insurance desk helps with claims, pre-approvals, and coverage verification.", ar: "مكتب التأمين لدينا يساعد في المطالبات والموافقات المسبقة والتحقق من التغطية." },
  duringYourStay: { en: "During Your Stay", ar: "أثناء إقامتك" },
  duringYourStayDesc: { en: "From housekeeping to in-room dining, our team ensures your comfort around the clock.", ar: "من التنظيف إلى تناول الطعام في الغرفة، يضمن فريقنا راحتك على مدار الساعة." },
  patientBillOfRights: { en: "Patient Bill of Rights", ar: "وثيقة حقوق المريض" },
  patientBillOfRightsDesc: { en: "Your rights and responsibilities as a patient at Royale Hayat.", ar: "حقوقك ومسؤولياتك كمريض في رويال حياة." },
  internationalPatient: { en: "International Patient", ar: "المرضى الدوليون" },
  internationalPatientDesc: { en: "Dedicated support for international patients including travel coordination.", ar: "دعم مخصص للمرضى الدوليين بما في ذلك تنسيق السفر." },
  newbornPhotography: { en: "Newborn Photography Services", ar: "خدمات تصوير المواليد" },
  newbornPhotographyDesc: { en: "Capture precious first moments with professional newborn photography.", ar: "التقط اللحظات الأولى الثمينة مع تصوير احترافي للمواليد." },
  medicalRecordsForm: { en: "Medical Records Request Form", ar: "نموذج طلب السجل الطبي" },
  medicalRecordsFormDesc: { en: "Request a copy of your medical records securely.", ar: "اطلب نسخة من سجلاتك الطبية بأمان." },
  visitingHours: { en: "Visiting Hours", ar: "ساعات الزيارة" },
  visitingHoursDesc: { en: "General visiting: 4:00 PM - 9:00 PM. ICU: 11:00 AM - 12:00 PM & 5:00 PM - 6:00 PM.", ar: "الزيارة العامة: 4:00 م - 9:00 م. العناية المركزة: 11:00 ص - 12:00 م و 5:00 م - 6:00 م." },
  roomServices: { en: "Room Services", ar: "خدمات الغرف" },
  roomServicesDesc: { en: "From housekeeping to in-room dining, our team ensures your comfort around the clock.", ar: "من التنظيف إلى تناول الطعام في الغرفة، يضمن فريقنا راحتك على مدار الساعة." },
  patientGuide: { en: "Patient Guide", ar: "دليل المريض" },
  patientGuideDesc: { en: "A comprehensive guide covering admission, stay, discharge, and follow-up procedures.", ar: "دليل شامل يغطي إجراءات القبول والإقامة والخروج والمتابعة." },
  admissionChecklist: { en: "Admission Checklist", ar: "قائمة مراجعة القبول" },
  admissionChecklistDesc: { en: "What to bring, documents needed, and pre-admission preparations.", ar: "ما يجب إحضاره والوثائق المطلوبة والتحضيرات قبل القبول." },
  insuranceHelp: { en: "Insurance Help", ar: "مساعدة التأمين" },
  insuranceHelpDesc: { en: "Our insurance desk helps with claims, pre-approvals, and coverage verification.", ar: "مكتب التأمين لدينا يساعد في المطالبات والموافقات المسبقة والتحقق من التغطية." },
  recordsRequest: { en: "Records Request", ar: "طلب السجلات" },
  recordsRequestDesc: { en: "Request your medical records securely through our authorized form.", ar: "اطلب سجلاتك الطبية بأمان من خلال نموذجنا المعتمد." },
  faqs: { en: "FAQs", ar: "الأسئلة الشائعة" },
  faqsDesc: { en: "Answers to commonly asked questions about services, billing, and appointments.", ar: "إجابات على الأسئلة الشائعة حول الخدمات والفوترة والمواعيد." },
  supportDesk: { en: "Support Desk", ar: "مكتب الدعم" },
  supportDeskDesc: { en: "24/7 patient support for inquiries, complaints, and assistance.", ar: "دعم المرضى على مدار الساعة للاستفسارات والشكاوى والمساعدة." },

  // Awards
  awards: { en: "Awards", ar: "الجوائز" },

  // Hero
  luxuriousHospital: { en: "Welcome to Royale Hayat Hospital", ar: "مرحباً بكم في مستشفى رويال حياة" },
  exceptionalCare: { en: "Celebrating Life.", ar: "لنحتفل معاً بالحياة." },
  everyStage: { en: "Every Stage,", ar: "في كل مرحلة." },
  everyAge: { en: "Every Age.", ar: "في كل عمر." },
  heroIntro: {
    en: "",
    ar: "في أكثر لحظات الحياة عمقاً ومعنى، ينبغي للرعاية الصحية أن تكون إنسانية حقاً.",
  },
  heroDesc: {
    en: "In 2006, a different vision took shape. We set out to create a healthcare destination where patients would feel cared for in every sense, from the very first step inside to the moment they returned home. A space where healing would be serene, and every interaction would be attentive and respectful.\n\nThis vision became Royale Hayat Hospital.",
    ar: "في عام 2006، وُلدت رؤية مختلفة. رؤية جديدة تهدف إلى إنشاء وجهة صحية يشعر فيها المرضى بالرعاية الحقيقية بكل تفاصيلها، منذ اللحظة الأولى لدخولهم وحتى عودتهم إلى منازلهم. مكان يجمع بين العلاج والسكينة، حيث تُقدَّم كل تجربة بعناية واحترام واهتمام صادق.\n\nومن هنا، انطلقت قصة مستشفى رويال حياة",
  },
  heroTagline: { en: "A hospital experience unlike any other.", ar: "تجربة مستشفى لا مثيل لها." },
  bookAnAppointment: { en: "Book an Appointment", ar: "احجز موعداً" },
  exploreServices: { en: "Explore Services", ar: "للمزيد من الخدمات" },
  discover: { en: "Discover", ar: "اكتشف" },
  // Symptom checker
  aiPowered: { en: "AI-Powered Symptom Checker", ar: "فحص الأعراض بالذكاء الاصطناعي" },
  tellUsSymptoms: { en: "Tell Us Your Symptoms", ar: "أخبرنا بأعراضك" },
  symptomDesc: { en: "Our AI analyzes your symptoms and matches you with the right specialist -- instantly and confidentially.", ar: "يحلل الذكاء الاصطناعي أعراضك ويوصلك بالمختص المناسب فوراً وبسرية تامة." },
  howFeeling: { en: "How are you feeling?", ar: "كيف تشعر؟" },
  describeSymptoms: { en: "Describe your symptoms or select from common ones below.", ar: "صف أعراضك أو اختر من الأعراض الشائعة أدناه." },
  analyzeSymptoms: { en: "Analyze Symptoms", ar: "تحليل الأعراض" },
  analyzing: { en: "Analyzing symptoms...", ar: "جاري تحليل الأعراض..." },
  possibleConditions: { en: "Possible Conditions", ar: "حالات محتملة" },
  recommendedDepts: { en: "Recommended Departments", ar: "الأقسام الموصى بها" },
  continueToBook: { en: "Continue to Book Appointment", ar: "المتابعة لحجز موعد" },
  encrypted: { en: "Encrypted & confidential", ar: "مشفر وسري" },
  // Specialized care
  whatWeOffer: { en: "What We Offer", ar: "ما نقدمه" },
  specializedCare: { en: "Specialized Care", ar: "رعاية متخصصة" },
  specializedDesc: { en: "Tailored, premium medical services designed around your individual needs, delivered with compassion and clinical excellence.", ar: "خدمات طبية فاخرة مصممة حسب احتياجاتك الفردية، تُقدم بالرحمة والتميز السريري." },
  learnMore: { en: "Read More", ar: "اعرف المزيد" },
  // Departments
  ourSpecialties: { en: "Our Specialties", ar: "تخصصاتنا" },
  medicalDepartments: { en: "Medical Departments", ar: "الأقسام الطبية" },
  deptCount: {
    en: "Comprehensive medical departments led by internationally renowned physicians.",
    ar: "أقسام طبية متكاملة يقودها نخبة من الأطباء العالميين",
  },
  exploreSubSpecialties: { en: "Explore", ar: "تعرف على" },
  subSpecialties: { en: "Sub-Specialties", ar: "التخصصات الدقيقة" },
  viewAllDepts: { en: "VIEW ALL DEPARTMENTS", ar: "عرض جميع الأقسام" },
  showLess: { en: "SHOW LESS", ar: "عرض أقل" },
  // Booking flow
  aiAssistedBooking: { en: "AI-Assisted Booking", ar: "حجز بمساعدة الذكاء الاصطناعي" },
  bookYourAppointment: { en: "Request for Appointment", ar: "طلب موعد" },
  symptoms: { en: "Symptoms", ar: "الأعراض" },
  department: { en: "Department", ar: "القسم" },
  doctor: { en: "Doctor", ar: "الطبيب" },
  patientInfo: { en: "Patient Info", ar: "بيانات المريض" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  instantAI: { en: "Instant AI Analysis", ar: "تحليل فوري بالذكاء الاصطناعي" },
  clinicallyValidated: { en: "Clinically Validated", ar: "معتمد سريرياً" },
  available247: { en: "24/7 Available", ar: "متاح على مدار الساعة" },
  describeInDetail: { en: "Describe your symptoms in detail...", ar: "صف أعراضك بالتفصيل..." },
  quickSelect: { en: "Quick select symptoms", ar: "اختيار سريع للأعراض" },
  symptomsSelected: { en: "symptom(s) selected", ar: "عرض(أعراض) مختارة" },
  dataEncrypted: { en: "Your data is encrypted and confidential", ar: "بياناتك مشفرة وسرية" },
  aiRecommendedDepts: { en: "AI Recommended Departments", ar: "أقسام موصى بها" },
  aiMatch: { en: "AI Match", ar: "توصية ذكية" },
  searchDepartments: { en: "Search departments...", ar: "ابحث في الأقسام..." },
  aiRecommendedDocs: { en: "AI Recommended Doctors", ar: "أطباء موصى بهم" },
  aiPick: { en: "AI Pick", ar: "اختيار ذكي" },
  available: { en: "Available", ar: "متاح" },
  currentlyUnavailable: { en: "Currently Unavailable", ar: "غير متاح حالياً" },
  clickToRequest: { en: "Click to request an appointment (6-12 hr response)", ar: "انقر لطلب موعد (الرد خلال 6-12 ساعة)" },
  registeredPatient: { en: "Registered at Royal Hayat", ar: "مريض مسجل" },
  alreadyAccount: { en: "Already have an account? Log in to continue.", ar: "لديك حساب؟ سجل دخولك للمتابعة." },
  firstTimeVisitor: { en: "First-Time Visitor", ar: "زائر لأول مرة" },
  newToRoyale: { en: "New to Royale Hayat? Fill in your details.", ar: "جديد في رويال حياة؟ أدخل بياناتك." },
  patientDetails: { en: "Patient Details", ar: "بيانات المريض" },
  provideInfo: { en: "Please provide your information to complete the booking", ar: "يرجى إدخال بياناتكم لإكمال عملية الحجز" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  enterFullName: { en: "Enter your full name", ar: "أدخل الاسم الكامل" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
  phonePlaceholder: { en: "Phone number", ar: "رقم الهاتف" },
  age: { en: "Age", ar: "العمر" },
  enterAge: { en: "Enter your age", ar: "أدخل عمرك" },
  gender: { en: "Gender", ar: "الجنس" },
  selectGender: { en: "Select gender", ar: "اختر الجنس" },
  male: { en: "Male", ar: "ذكر" },
  female: { en: "Female", ar: "أنثى" },
  patientLogin: { en: "Patient Login", ar: "تسجيل دخول المريض" },
  loginToAccount: { en: "Log in to your Royale Hayat account", ar: "سجل دخولك إلى حساب رويال حياة" },
  username: { en: "Username", ar: "اسم المستخدم" },
  enterUsername: { en: "Enter your username", ar: "أدخل اسم المستخدم" },
  password: { en: "Password", ar: "كلمة المرور" },
  enterPassword: { en: "Enter your password", ar: "أدخل كلمة المرور" },
  forgotPassword: { en: "Forgot Password?", ar: "نسيت كلمة المرور؟" },
  changeSelection: { en: "Change selection", ar: "تغيير الاختيار" },
  reviewConfirm: { en: "Review & Confirm", ar: "مراجعة وتأكيد الحجز" },
  reviewSubmit: { en: "Review & Submit Request", ar: "مراجعة وتأكيد الحجز" },
  appointmentRequest: { en: "Appointment Request", ar: "طلب موعد" },
  requestNote: { en: "The selected doctor is currently not available. We will get back to you within 6-12 hours.", ar: "الطبيب المختار غير متاح حالياً. سنتواصل معك خلال 6-12 ساعة." },
  patient: { en: "Patient", ar: "معلومات المريض" },
  phone: { en: "Phone", ar: "الهاتف" },
  confirmBooking: { en: "Request Booking", ar: "تأكيد الحجز" },
  submitRequest: { en: "Submit Request", ar: "إرسال الطلب" },
  requestAppointment: { en: "Request Appointment", ar: "طلب موعد" },
  continue: { en: "Continue", ar: "متابعة" },
  previous: { en: "Previous", ar: "السابق" },
  backToHome: { en: "Back to Home", ar: "العودة إلى الصفحة الرئيسية" },
  // Confirmation
  requestSubmitted: { en: "Appointment Confirmed", ar: "تم استلام طلب الموعد!" },
  appointmentConfirmed: { en: "Appointment Confirmed", ar: "تم استلام طلب الموعد!" },
  requestConfirmMsg: { en: "Thank you for your request, we will contact you soon", ar: "شكراً لطلبك، سنتواصل معك قريباً." },
  bookingConfirmMsg: { en: "Thank you for your request, we will contact you soon", ar: "شكراً لطلبك، سنتواصل معك قريباً." },
  appointmentDetails: { en: "Appointment Details", ar: "تفاصيل الموعد" },
  date: { en: "Date", ar: "التاريخ" },
  time: { en: "Time", ar: "الوقت" },
  status: { en: "Status", ar: "الحالة" },
  pendingStatus: { en: "Pending - We will contact you within 6-12 hours", ar: "قيد الانتظار - سنتواصل معك خلال 6-12 ساعة" },
  nextSteps: { en: "Next Steps", ar: "الخطوات التالية" },
  step1: { en: "Bring a valid ID and insurance card", ar: "يرجى إحضار بطاقة الهوية وبطاقة التأمين الصحي" },
  step2: { en: "List of current medications", ar: "قائمة بالأدوية الحالية" },
  step3: { en: "Previous medical reports or lab results", ar: "التقارير الطبية أو نتائج الفحوصات السابقة" },
  step4: { en: "Arrive 15 minutes before your scheduled time", ar: "يرجى الحضور قبل موعدكم بـ 15 دقيقة" },
  // step5: { en: "Wear comfortable clothing for examination", ar: "ارتداء ملابس مريحة للفحص" },
  aiHealthInsights: { en: "AI Health Insights", ar: "رؤى صحية ذكية" },
  // Chairman
  chairmanMessage: { en: "Chairman's Message", ar: "كلمة رئيس مجلس الإدارة" },
  chairmanGreeting: { en: "Dear Patient / Visitor,", ar: "أعزّاءنا المرضى والزوار،" },
  chairmanP1: {
    en: "At Royale Hayat Hospital, our journey began in 2006 with a clear vision to create a healthcare institution where world-class medical expertise is guided by the principles of genuine hospitality. What began as a specialized center for women's and children's health has evolved into a leading multi-specialty hospital and a trusted destination for advanced care and hospitality.",
    ar: "انطلقت رحلتنا في مستشفى رويال حياة عام 2006 برؤية واضحة تتمثل في إنشاء مؤسسة صحية تجمع بين التميّز الطبي العالمي ومبادئ الضيافة الحقيقية. وما بدأ كمركز متخصص لصحة المرأة والطفل، تطوّر اليوم ليصبح مستشفى متعدد التخصصات ووجهة موثوقة للرعاية الصحية المتقدمة والضيافة الراقية.",
  },
  chairmanP2: {
    en: "We have thoughtfully shaped an environment where every detail is considered, and every interaction is carefully curated. We believe that at its core, the very idea of a hospital is rooted in hospitality, the act of caring for people with warmth, dignity, and respect. This philosophy defines The Royale Hayat Experience, where advanced healthcare is delivered with attentiveness, discretion, and a deeply personalized touch.",
    ar: "لقد حرصنا بعناية على تصميم بيئة تُؤخذ فيها كل التفاصيل بعين الاعتبار، وتُصاغ فيها كل تجربة بأسلوب مدروس بعناية. فنحن نؤمن بأن جوهر المستشفى يرتكز على مفهوم الضيافة، أي رعاية الإنسان بدفء، احترام، وكرامة. ومن هنا وُلدت تجربة رويال حياة، حيث تُقدَّم الرعاية الصحية المتقدمة بروح من الاهتمام، الخصوصية، واللمسة الإنسانية الراقية.",
  },
  chairmanP3: {
    en: "At the heart of our philosophy lies a commitment to patient care that goes beyond expectation. Every experience is thoughtfully designed to reflect a level of attention and refinement that ensures each individual feels valued, respected, and exceptionally cared for at every stage of their journey.",
    ar: "وفي صميم فلسفتنا يكمن التزامنا بتقديم رعاية تتجاوز التوقعات، حيث يتم تصميم كل تجربة بعناية لتعكس أعلى مستويات الاهتمام والرقي، بما يضمن أن يشعر كل فرد بالتقدير والاحترام والرعاية الاستثنائية في كل مرحلة من رحلته العلاجية.",
  },
  chairmanP4: {
    en: "Our distinction is built upon the strength of our team, our physicians, nurses, and clinical professionals, whose expertise, dedication, and quiet commitment to excellence define who we are. Being recognized as the Best Hospital in Kuwait for 16 years reflects their contribution and the enduring trust of our patients and community.",
    ar: "ويستند تميزنا إلى قوة فريقنا من الأطباء، والممرضين، والكوادر الطبية المتخصصة، الذين يشكّل تفانيهم وخبراتهم والتزامهم الهادئ بالتميّز جوهر هويتنا. كما أن حصولنا على لقب “أفضل مستشفى في الكويت” لمدة 16 عامًا متتالية، يعكس مساهماتهم القيّمة والثقة المستمرة التي منحنا إياها مرضانا ومجتمعنا.",
  },
  chairmanP5: {
    en: "As we look ahead, our focus remains clear: to continue advancing healthcare through innovation and a deeply personalized approach, while preserving the warmth, attentiveness, and human connection that define us. On behalf of our entire team, we look forward to welcoming you not just as a patient but as part of our extended family and ensuring your journey is defined by comfort, confidence, and exceptional care.",
    ar: "ومع تطلعنا إلى المستقبل، يبقى هدفنا ثابتًا على مواصلة تطوير الرعاية الصحية من خلال الابتكار ونهج الرعاية الشخصية، مع الحفاظ على الدفء، الاهتمام، والبعد الإنساني الذي لطالما تميزنا به. وبالنيابة عن جميع أفراد فريقنا، نتطلع إلى الترحيب بكم ليس فقط كمرضى، بل كجزء من عائلة رويال حياة، وأن نجعل رحلتكم معنا مليئة بالراحة، الثقة، والرعاية الاستثنائية.",
  },
  chairmanRegards: { en: "Kindest regards,", ar: "مع خالص التحيات والتقدير،" },
  chairmanClosing: {
    en: "Royale Hayat Hospital …your destination for better health and to celebrate life!",
    ar: "مستشفى رويال حياة … وجهتكم نحو صحة أفضل والاحتفاء بالحياة",
  },
  chairmanBestWishes: { en: "With best wishes,", ar: "" },
  // International
  internationalPatients: { en: "International Patients", ar: "المرضى الدوليون" },
  // Footer / misc
  contact: { en: "Contact", ar: "اتصل بنا" },
  luxuryServices: { en: "Services", ar: "الخدمات" },
  services: { en: "Services", ar: "الخدمات" },
  // Specialized care items
  womensHealth: { en: "Women's Health & Obstetrics", ar: "صحة المرأة والتوليد" },
  womensHealthDesc: { en: "Comprehensive maternity and women's healthcare with personalized birth plans and dedicated specialists.", ar: "رعاية شاملة للأمومة وصحة المرأة مع خطط ولادة شخصية ومتخصصين." },
  childrens: { en: "Children's Care & Neonatology", ar: "رعاية الأطفال وحديثي الولادة" },
  childrensDesc: { en: "Expert pediatric and neonatal care in a warm, family-centered environment with 24/7 NICU support.", ar: "رعاية متخصصة للأطفال وحديثي الولادة في بيئة عائلية دافئة مع دعم وحدة العناية المركزة على مدار الساعة." },
  cardiology: { en: "Cardiology & Heart Care", ar: "أمراض القلب والرعاية القلبية" },
  cardiologyDesc: { en: "Advanced cardiac diagnostics and interventional cardiology for comprehensive heart health programs.", ar: "تشخيص قلبي متقدم وقسطرة تداخلية لبرامج صحة القلب الشاملة." },
  orthopedics: { en: "Orthopedics & Sports Medicine", ar: "العظام والطب الرياضي" },
  orthopedicsDesc: { en: "Joint replacement, sports injury rehab, and minimally invasive musculoskeletal treatments.", ar: "استبدال المفاصل وإعادة تأهيل الإصابات الرياضية وعلاجات العضلات والعظام." },
  cosmetic: { en: "Cosmetic & Reconstructive Surgery", ar: "الجراحة التجميلية والترميمية" },
  cosmeticDesc: { en: "Board-certified surgeons offering aesthetic and reconstructive procedures in a luxurious setting.", ar: "جراحون معتمدون يقدمون إجراءات تجميلية وترميمية في بيئة فاخرة." },
  ivf: { en: "IVF & Reproductive Medicine", ar: "أطفال الأنابيب والطب التناسلي" },
  ivfDesc: { en: "World-class fertility treatments with cutting-edge technology and personalized care plans.", ar: "علاجات خصوبة عالمية المستوى بتقنيات متطورة وخطط رعاية شخصية." },

  // Why Royale Hayat
  whyRoyaleHayat: { en: "Why Royale Hayat", ar: "لماذا رويال حياة" },
  whereLuxuryMeets: { en: "Where Luxury Meets", ar: "حيث يلتقي الفخامة" },
  worldClass: { en: "World-Class", ar: "العالمية" },
  medicine: { en: "Medicine", ar: "بالطب" },
  whyDesc: { en: "Since 2006, Royale Hayat Hospital has grown into Kuwait's leading multi-disciplinary healthcare provider, delivering exceptional care in a setting that prioritizes privacy, comfort, and personalized attention.", ar: "منذ عام 2006، نمى مستشفى رويال حياة ليصبح المزود الرائد للرعاية الصحية متعددة التخصصات في الكويت، حيث يقدم رعاية استثنائية في بيئة تعطي الأولوية للخصوصية والراحة والاهتمام الشخصي." },
  internationallyAccredited: { en: "Internationally Accredited", ar: "معتمد دولياً" },
  internationallyAccreditedDesc: { en: "Diamond Award & CAP Accredited — the highest global standards.", ar: "جائزة الماس واعتماد CAP — أعلى المعايير العالمية." },
  vipExperience: { en: "VIP Experience", ar: "تجربة كبار الشخصيات" },
  vipExperienceDesc: { en: "Every patient treated with personalized attention and luxury comfort.", ar: "كل مريض يُعامل باهتمام شخصي وراحة فاخرة." },
  awardWinningCare: { en: "Award-Winning Care", ar: "رعاية حائزة على جوائز" },
  awardWinningCareDesc: { en: "Service Hero & PCC Award recipients for patient-centered excellence.", ar: "حاصل على جائزة Service Hero و PCC للتميز في الرعاية المتمحورة حول المريض." },
  compassionateApproach: { en: "Compassionate Approach", ar: "نهج رحيم" },
  compassionateApproachDesc: { en: "From birth to every stage — comprehensive, compassionate care.", ar: "من الولادة إلى كل مرحلة — رعاية شاملة ورحيمة." },
  patientSatisfaction: { en: "Patient Satisfaction", ar: "رضا المرضى" },

  // Stats
  yearsOfExcellence: { en: "/* Years of Excellence */", ar: "سنوات من التميز" },
  specialistDoctors: { en: "Healthcare Professionals", ar: "متخصصون في الرعاية الصحية" },
  departmentsLabel: { en: "Departments", ar: "الأقسام" },

  // Chairman
  aMessageFrom: { en: "A Message From", ar: "رسالة من" },
  theChairman: { en: "The Chairman", ar: "رئيس مجلس الإدارة" },
  chairmanQuote: {
    en: "At Royale Hayat Hospital, our journey began in 2006 with a clear vision to create a healthcare institution where world class medical expertise is guided by the principles of genuine hospitality.What began as aspecialized center for women's and children's health has evolved into a leading multi specialty hospital and a trusted destination for advanced care and hospitality.",
    ar: "في عام 2006، تصورت ما اعتقد الكثيرون أنه مستحيل — رؤية قليلون يمكنهم تخيلها، إبداع بُني بالإيمان والعزيمة والحب.حلمت بجمع الخبرة الطبية العالمية مع الرحمة والخصوصية والراحة، وتقديم رعاية شخصية حقيقية في بيئة يلتقي فيها الفخامة بالطب المتقدم.اليوم، بعد ما يقرب من عقدين، يقف ذلك الحلم أمامكم كمؤسسة عظيمة نفخر بتسميتها مستشفى رويال حياة."
  },
  chairmanName: { en: "Pradeep K Handa", ar: "براديب ك. هاندا" },
  chairmanTitle: { en: "Chairman, Royale Hayat Executive Board", ar: "رئيس مجلس رويال حياة التنفيذي" },
  chairmanFullMessage: { en: "We have thoughtfully shaped an environment where every detail is considered, and every interaction is carefully curated. We believe that at its core, the very idea of a hospital is rooted in hospitality the act of caring for people with warmth, dignity, and respect. This philosophy defines The Royale Hayat Experience, where advanced healthcare is delivered with attentiveness, discretion, and a deeply personalized touch.\n\nAt the heart of our philosophy lies a commitment to patient care that goes beyond expectation. Every experience is thoughtfully designed to reflect ·a level of attention and refinement that ensures each individual feels valued, respected, and exceptionally cared for at every stage of their journey.\n\nOur distinction is built upon the strength of our team our physicians, nurses, and clinical professionals whose expertise, dedication, and quiet commitment to excellence define who we are.Being recognized as the Best Hospital in Kuwait for 16 years reflects their contribution and the enduring trust of our patients and community.\n\nAs we look ahead, our focus remains clear to continue advancing healthcare through innovation and adeeply personalized approach, while preserving the warmth, attentiveness, and human connection that define us. On behalf of our entire team, we look forward to welcoming you not just as a patient, but as part of our extended family and ensuring your journey is defined by comfort, confidence, and exceptional care.", ar: "وراء هذا الجو الفندقي الفاخر تكمن تقنيات متقدمة وبنية تحتية عالمية وفريق من الأطباء والممرضين والمهنيين السريريين المتميزين المكرسين لتقديم رعاية استثنائية. كل تفصيل مصمم ليس فقط لإراحة الحواس بل لدعم أعلى معايير التميز الطبي وسلامة المرضى.\n\nللعائلات التي تبدأ رحلتها أو تنميها، نحن نفهم مدى ثمينة كل لحظة. من الحمل والرعاية قبل الولادة إلى الولادة ودعم ما بعد الولادة، تسير فرقنا المتمرسة بجانبك بالرحمة والمهارة والاهتمام الثابت.\n\nتم الاعتراف بمستشفى رويال حياة كأفضل مستشفى في الكويت على مدار الـ 15 عامًا الماضية، حيث يمزج الضيافة مع التميز السريري بطريقة فريدة حقاً. هذا ما نفخر بتسميته \"تجربة رويال حياة\" — حيث يلتقي الدفء بالخبرة وتتعايش الفخامة بسلاسة مع الرعاية الصحية المتقدمة.\n\nنيابة عن فريقنا بأكمله، نتطلع إلى الترحيب بكم — ليس فقط كمريض، بل كجزء من عائلتنا الممتدة — وضمان أن إقامتكم تتميز بالراحة والثقة والرعاية الاستثنائية." },
  chairmanClosingEn: { en: "Royale Hayat Hospital ...your destination for better health and to celebrate life!", ar: "مستشفى رويال حياة ...وجهتك لصحة أفضل والاحتفاء بالحياة!" },

  // Doctors
  ourTeam: { en: "Our Medical Team", ar: "فريقنا الطبي" },
  meetOurDoctors: { en: "Meet Our Doctors", ar: "تعرف على أطبائنا" },
  meetOurDoctorsSubtitle: {
    en: "A team of specialized physicians delivering world-class healthcare",
    ar: "فريق من الأطباء المتخصصين يقدّم رعاية صحية على مستوى عالمي",
  },
  viewAllDoctors: { en: "View All Doctors", ar: "عرض جميع الأطباء" },
  viewProfile: { en: "View Profile", ar: "عرض الملف الشخصي ←" },

  // Testimonials
  testimonials: { en: "Testimonials", ar: "شهادات المرضى" },
  patientFeedback: { en: "Patient Feedback", ar: "آراء المرضى" },

  // Awards
  recognition: { en: "Recognition", ar: "التقدير" },
  certificatesAwards: { en: "Certificates &", ar: "الشهادات و" },
  
  // Insurance
  trustedBy: { en: "Trusted By", ar: "موثوق من قبل" },
  insurancePartners: { en: "Insurance Partners", ar: "شركاء التأمين" },
  verified: { en: "Verified", ar: "معتمد" },
  identitySendingRequest: {
    en: "Sending authentication request to your phone…",
    ar: "جارِ إرسال طلب المصادقة إلى هاتفك…",
  },
  identityWaitingTitle: {
    en: "Authenticate in Kuwait Mobile ID",
    ar: "المصادقة عبر تطبيق هويتي",
  },
  identityWaitingBody: {
    en: "Open the Kuwait Mobile ID (Hawyti) app on your phone and approve the authentication request. This page will update automatically when you finish.",
    ar: "افتح تطبيق الهوية الرقمية (هويتي) على هاتفك ووافق على طلب المصادقة. سيتم تحديث هذه الصفحة تلقائياً بعد إتمام الموافقة.",
  },
  identityConfirmingHospitalRecord: {
    en: "Checking your hospital registration…",
    ar: "جارِ التحقق من تسجيلك في المستشفى…",
  },
  /** TrakCare — RHH integration spec (without "Error:" prefix) */
  patientNotFoundAfterPaci: {
    en: "Patient not found — no match on URN or National ID",
    ar: "لم يتم العثور على المريض — لا يوجد تطابق لرقم الملف أو الرقم المدني",
  },
  patientMergedUrn: {
    en: "URN belongs to a merged patient record — URN resolves only to inactive (merged) rows; the portal should prompt the user to search by National ID instead",
    ar: "رقم الملف يخص سجل مريض تم دمجه — يعود الرقم إلى سجلات غير نشطة (مدمجة) فقط؛ يرجى البحث باستخدام الرقم المدني بدلاً من ذلك",
  },
  patientDuplicateNationalId: {
    en: "Multiple Patient with the Same National ID Found — data-quality issue; needs merge/cleanup in TrakCare before booking can proceed",
    ar: "تم العثور على أكثر من مريض بنفس الرقم المدني — مشكلة في جودة البيانات؛ يلزم دمج السجلات وتصحيحها في نظام المستشفى قبل إتمام الحجز",
  },
  patientInputTooLong: {
    en: "Input too long, max 50 characters per identifier — URN or National ID exceeds 50 characters",
    ar: "المدخل طويل جداً، الحد الأقصى 50 حرفاً لكل معرّف — الرقم المدني أو رقم الملف يتجاوز 50 حرفاً",
  },
  patientInactiveOrMerged: {
    en: "Patient is inactive or has been merged",
    ar: "سجل المريض غير نشط أو تم دمجه",
  },
  patientLookupUnavailable: {
    en: "The hospital registration system is temporarily unavailable. Please try again in a few minutes.",
    ar: "نظام تسجيل المرضى غير متاح مؤقتاً. يرجى المحاولة مرة أخرى بعد قليل.",
  },
  patientLookupFailed: {
    en: "Could not confirm your hospital registration. Please try again or contact reception.",
    ar: "تعذر التحقق من تسجيلك في المستشفى. يرجى المحاولة مرة أخرى أو التواصل مع الاستقبال.",
  },
  bookAsFirstTimePatient: {
    en: "Book as first-time patient",
    ar: "الحجز كمريض لأول مرة",
  },
  patientLookupGoBack: {
    en: "Go back",
    ar: "رجوع",
  },
  dontSeeInsurance: { en: "Don't see your insurance provider?", ar: "لا ترى شركة التأمين الخاصة بك؟" },
  contactUs: { en: "Contact us", ar: "اتصل بنا" },
  toVerifyCoverage: { en: "to verify your coverage.", ar: "للتحقق من تغطيتك." },

  // International Patients
  welcomeWorldwide: { en: "Welcome Worldwide", ar: "مرحباً بالعالم" },
  internationalPatientsTitle: { en: "International Patients", ar: "المرضى الدوليون" },
  internationalPatientsDesc: { en: "Royale Hayat Hospital welcomes patients from around the world. Our dedicated international office ensures a seamless experience from arrival to recovery.", ar: "يرحب مستشفى رويال حياة بالمرضى من جميع أنحاء العالم. مكتبنا الدولي المخصص يضمن تجربة سلسة من الوصول حتى التعافي." },
  travelCoordination: { en: "Travel Coordination", ar: "تنسيق السفر" },
  travelCoordinationDesc: { en: "Airport transfers, visa assistance, and hotel arrangements", ar: "نقل المطار والمساعدة في التأشيرة وترتيبات الفنادق" },
  concierge247: { en: "24/7 Concierge", ar: "خدمة الكونسيرج على مدار الساعة" },
  concierge247Desc: { en: "Multilingual support throughout your medical journey", ar: "دعم متعدد اللغات طوال رحلتك العلاجية" },
  insuranceLiaison: { en: "Insurance Liaison", ar: "تنسيق التأمين" },
  insuranceLiaisonDesc: { en: "International insurance coordination and billing support", ar: "تنسيق التأمين الدولي ودعم الفواتير" },
  patientLoginBtn: { en: "Patient Login", ar: "تسجيل دخول المريض" },
  registerBtn: { en: "Register", ar: "تسجيل" },

  // Footer
  quickLinks: { en: "Quick Links", ar: "روابط سريعة" },
  aboutUs: { en: "About Us", ar: "من نحن" },
  ourServices: { en: "Our Services", ar: "خدماتنا" },
  findADoctor: { en: "Find a Doctor", ar: "ابحث عن طبيب" },
  contactUsFooter: { en: "Contact Us", ar: "اتصل بنا" },
  footerDesc: { en: "Celebrating Life. Kuwait's premier multi-disciplinary healthcare provider since 2006.", ar: "نحتفي بالحياة. المزود الرائد للرعاية الصحية متعددة التخصصات في الكويت منذ 2006." },
  hotline247: { en: "24/7 Hotline", ar: "خط ساخن على مدار الساعة" },
  emergencyServices247: { en: "Emergency Services", ar: "خدمات الطوارئ على مدار الساعة" },
  callAmbulance: { en: "Call Ambulance", ar: "اتصل بالإسعاف" },
  allRightsReserved: { en: "\u00a9 2026 Royale Hayat Hospital. All rights reserved.", ar: "\u00a9 2026 مستشفى رويال حياة. جميع الحقوق محفوظة." },
  androidApp: { en: "Android App", ar: "تطبيق أندرويد" },
  iosApp: { en: "iOS App", ar: "تطبيق iOS" },
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },

  // Chat
  chatAssistantName: { en: "Royale Hayat Assistant", ar: "مساعد رويال حياة" },
  aiHealthConcierge: { en: "AI Health Concierge", ar: "كونسيرج صحي ذكي" },
  chatPlaceholder: { en: "Ask about appointments, symptoms...", ar: "اسأل عن المواعيد، الأعراض..." },
  chatWelcome: { en: "Hello! I'm your **Royale Hayat AI Health Assistant**.\n\nHow can I help you today? You can ask about appointments, departments, doctors, insurance, or describe your symptoms.", ar: "مرحباً! أنا **مساعد رويال حياة الصحي الذكي**.\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك السؤال عن المواعيد والأقسام والأطباء والتأمين أو وصف أعراضك." },
  chatBookAppt: { en: "Book Appointment", ar: "حجز موعد" },
  chatAlSafwa: { en: "Al Safwa HealthCare", ar: "الصفوة للرعاية الصحية" },
  chatJobs: { en: "Jobs", ar: "الوظائف" },
  chatRoyalHomeHealth: { en: "Royal Home Health", ar: "رويال للرعاية المنزلية" },
  chatGuidedSteps: { en: "Quick steps", ar: "خطوات سريعة" },
  chatNeedHelp: { en: "Need help?", ar: "هل تحتاج مساعدة؟" },
  chatNeedMoreHelp: { en: "Need more help?", ar: "هل تحتاج مزيداً من المساعدة؟" },
  chatContinueWhatsApp: { en: "Continue on WhatsApp", ar: "المتابعة عبر واتساب" },
  chatTopicAppt: { en: "You can book an appointment online in a few minutes. Follow these steps:", ar: "يمكنك حجز موعد عبر الإنترنت خلال دقائق. اتبع الخطوات التالية:" },
  chatTopicSafwa: { en: "Learn about the Al Safwa elite healthcare program and how to enroll.", ar: "تعرّف على برنامج الصفوة للرعاية الصحية وكيفية التسجيل." },
  chatTopicJobs: { en: "Explore current career opportunities at Royale Hayat Hospital.", ar: "استكشف فرص العمل الحالية في مستشفى رويال حياة." },
  chatTopicHomeHealth: { en: "Royale Home Health brings hospital-quality care to your home.", ar: "رويال للرعاية المنزلية يقدّم رعاية بمستوى المستشفى في منزلك." },
  chatStepAppt1: { en: "Open the Book Appointment page", ar: "افتح صفحة حجز الموعد" },
  chatStepAppt2: { en: "Choose your department or doctor", ar: "اختر القسم أو الطبيب" },
  chatStepAppt3: { en: "Select date, time, and confirm your booking", ar: "اختر التاريخ والوقت وأكد الحجز" },
  chatStepSafwa1: { en: "Visit the Al Safwa program page", ar: "زر صفحة برنامج الصفوة" },
  chatStepSafwa2: { en: "Review program benefits and enrollment details", ar: "اطلع على مزايا البرنامج وتفاصيل التسجيل" },
  chatStepSafwa3: { en: "Complete the registration form to get started", ar: "أكمل نموذج التسجيل للبدء" },
  chatStepJobs1: { en: "Go to Work With Us — Open Positions", ar: "انتقل إلى انضم إلينا — الوظائف المتاحة" },
  chatStepJobs2: { en: "Browse roles by category", ar: "تصفح الوظائف حسب التصنيف" },
  chatStepJobs3: { en: "Apply online with your CV", ar: "قدّم طلبك عبر الإنترنت مع سيرتك الذاتية" },
  chatStepHomeHealth1: { en: "Open the Royale Home Health page", ar: "افتح صفحة رويال للرعاية المنزلية" },
  chatStepHomeHealth2: { en: "Explore nursing, physiotherapy, and post-operative care", ar: "استكشف التمريض والعلاج الطبيعي والرعاية بعد العمليات" },
  chatStepHomeHealth3: { en: "Contact us to request home care services", ar: "تواصل معنا لطلب خدمات الرعاية المنزلية" },
  chatDepartments: { en: "Departments", ar: "الأقسام" },
  chatEmergency: { en: "Emergency", ar: "الطوارئ" },
  chatInsurance: { en: "Insurance", ar: "التأمين" },

  // Registered patient check
  areYouRegistered: { en: "Are you a registered patient at Royale Hayat Hospital?", ar: "هل أنت مريض مسجل في مستشفى رويال حياة؟" },
  yes: { en: "Yes", ar: "نعم" },
  no: { en: "No", ar: "لا" },
  departmentDoctors: { en: "Department Doctors", ar: "أطباء القسم" },
  searchSymptoms: { en: "Search symptoms, doctor, department...", ar: "ابحث عن الأعراض، الطبيب، القسم..." },
  searchResults: { en: "Search Results", ar: "نتائج البحث" },
  noResults: { en: "No results found. Try different keywords.", ar: "لم يتم العثور على نتائج. حاول بكلمات مختلفة." },
  findDoctor: {
    en: "Find the right doctor by symptom or specialty",
    ar: "ابحث عن الطبيب المناسب حسب الأعراض أو التخصص الطبي الذي تحتاجه",
  },
  backToDoctors: { en: "Back to Doctors", ar: "العودة للأطباء" },
  aboutDoctor: { en: "About", ar: "نبذة" },
  areasOfExpertise: { en: "Areas of Expertise", ar: "مجالات الخبرة" },
  languagesSpoken: { en: "Languages", ar: "اللغات" },
  pleaseSelect: { en: "Please select the option that applies to you to continue", ar: "يرجى اختيار ما ينطبق عليك للمتابعة" },
  downloads: { en: "Downloads", ar: "التحميلات" },
  downloadsTitle: { en: "Downloads", ar: "التحميلات" },
  downloadsDesc: { en: "Download our brochures, guides and informational documents.", ar: "قم بتحميل الكتيبات والأدلة والمستندات المعلوماتية." },
  downloadFile: { en: "Download", ar: "تحميل" },
  birthing_packages: { en: "Birthing Packages for Royale Orchid and Orchid Patients", ar: "باقات الولادة لمرضى رويال أوركيد وأوركيد" },
  insurance_lightbox: { en: "RHH Insurance Lightbox Poster Report", ar: "تقرير ملصق التأمين الإعلاني" },

  internationalPatientLink: { en: "International Patient", ar: "المرضى الدوليون" },

  // Work With Us
  workWithUs: { en: "Work With Us", ar: "اعمل معنا" },

  // Al Safwa
  eliteHealthcare: { en: "Elite Healthcare", ar: "رعاية صحية متميزة" },
  alSafwaSpotlightDesc: { en: "Take control of your health effortlessly with our personalized elite medical care program, designed to fit seamlessly into your busy lifestyle.", ar: "تحكم بصحتك بسهولة مع برنامجنا الشخصي للرعاية الطبية المتميزة، المصمم ليتناسب بسلاسة مع أسلوب حياتك المزدحم." },

  // Footer extra links
  faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  disclaimer: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
  exchangeLogin: { en: "Exchange Login", ar: "تسجيل دخول البريد" },
  sitemailLogin: { en: "Sitemail Login", ar: "تسجيل دخول البريد الإلكتروني" },
  termsPrivacy: { en: "Terms & Privacy", ar: "الشروط والخصوصية" },
  medicalRepVisitBooking: { en: "Medical Rep. Visit Booking", ar: "حجز زيارة مندوب طبي" },
  medicalRecordsRequestForm: { en: "Medical Records Request Form", ar: "نموذج طلب السجلات الطبية" },

  // FAQ page
  faqTitle: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  faqGeneral: { en: "General", ar: "عام" },
  faqQ1: { en: "How can I get an appointment with a doctor?", ar: "كيف يمكنني الحصول على موعد مع طبيب؟" },
  faqA1: { en: "You can book an appointment through our website, by calling our 24/7 hotline at +965 2536 0000, or by visiting the hospital reception.", ar: "يمكنك حجز موعد من خلال موقعنا الإلكتروني أو بالاتصال بخطنا الساخن على مدار الساعة +965 2536 0000 أو بزيارة استقبال المستشفى." },
  faqQ2: { en: "Can I come to be seen by a doctor even without an appointment?", ar: "هل يمكنني الحضور لرؤية طبيب بدون موعد؟" },
  faqA2: { en: "Yes, walk-in patients are welcome. However, we recommend booking an appointment to minimize waiting time and ensure availability.", ar: "نعم، المرضى بدون مواعيد مرحب بهم. ومع ذلك، ننصح بحجز موعد لتقليل وقت الانتظار وضمان التوفر." },
  faqQ3: { en: "What information and documents are needed for patient registration?", ar: "ما المعلومات والمستندات المطلوبة لتسجيل المريض؟" },
  faqA3: { en: "You will need a valid Civil ID or passport, insurance card (if applicable), and any relevant medical reports or referral letters.", ar: "ستحتاج إلى بطاقة مدنية سارية أو جواز سفر، وبطاقة تأمين (إن وجدت)، وأي تقارير طبية أو خطابات إحالة ذات صلة." },
  faqQ4: { en: "Where can I find information concerning the admission process?", ar: "أين يمكنني العثور على معلومات حول عملية القبول؟" },
  faqA4: { en: "Detailed admission information is available on our Information for Patients & Visitors page, or you can contact our reception desk for personalized guidance.", ar: "تتوفر معلومات القبول التفصيلية في صفحة معلومات للمرضى والزوار، أو يمكنك الاتصال بمكتب الاستقبال للحصول على إرشادات شخصية." },
  faqQ5: { en: "What are the available suites or rooms?", ar: "ما هي الأجنحة أو الغرف المتاحة؟" },
  faqA5: { en: "Royale Hayat Hospital offers a range of luxurious suites and rooms including Royal Suites, VIP Suites, Orchid Rooms, and Standard Rooms — all designed for comfort and privacy.", ar: "يقدم مستشفى رويال حياة مجموعة من الأجنحة والغرف الفاخرة تشمل الأجنحة الملكية وأجنحة كبار الشخصيات وغرف الأوركيد والغرف العادية — جميعها مصممة للراحة والخصوصية." },
  faqQ6: { en: "Is Medical Insurance accepted in your hospital?", ar: "هل يتم قبول التأمين الطبي في مستشفاكم؟" },
  faqA6: { en: "Yes, we accept most major insurance providers in Kuwait. Please check our Insurance Partners section or contact us to verify your specific coverage.", ar: "نعم، نقبل معظم مزودي التأمين الرئيسيين في الكويت. يرجى التحقق من قسم شركاء التأمين لدينا أو الاتصال بنا للتحقق من تغطيتك المحددة." },
  disclaimerTitle: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
  disclaimerText: { en: "The information provided on this website is for general informational purposes only. It is not intended as medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. Royale Hayat Hospital does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on this website.", ar: "المعلومات المقدمة على هذا الموقع هي لأغراض إعلامية عامة فقط. لا يُقصد بها أن تكون نصيحة طبية أو تشخيصاً أو علاجاً. استشر دائماً طبيبك أو مقدم الرعاية الصحية المؤهل بشأن أي أسئلة قد تكون لديك حول حالة طبية." },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => { },
  t: (key) => key,
  dir: "ltr",
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string) => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
