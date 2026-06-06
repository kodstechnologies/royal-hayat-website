export interface DepartmentDetailSection {
  title: string;
  titleAr?: string;
  content?: string;
  contentAr?: string;
  items?: string[];
  itemsAr?: string[];
  subsections?: { title: string; titleAr?: string; content?: string; contentAr?: string; items?: string[]; itemsAr?: string[] }[];
}
export interface DepartmentDetail {
  slug: string;
  name: string;
  nameAr: string;
  intro: string;
  introAr?: string;
  sections: DepartmentDetailSection[];
  subDepartments?: {
    slug: string;
    name: string;
    nameAr: string;
    intro: string;
    introAr?: string;
    sections: DepartmentDetailSection[];
  }[];
}
export const departmentDetails: DepartmentDetail[] = [
  {
    slug: "obstetrics-gynecology",
    name: "Obstetrics & Gynecology",
    nameAr: "أمراض النساء والولادة",
    intro:
      "At Royale Hayat Hospital, we know that pregnancy and childbirth are life-changing experiences. Our expert team is here to guide you, offering compassionate care tailored to your needs, ensuring safety and comfort for you and your baby.",
    introAr:
      "في مستشفى رويال حياة، نؤمن بأن رحلة الحمل والولادة تُعد من أهم المحطات في حياة المرأة، ولذلك نحرص على تقديم رعاية طبية متكاملة تجمع بين الخبرة الطبية العالية والاهتمام الإنساني الدقيق. ويعمل فريقنا المتخصص على مرافقتك في كل مرحلة، لضمان تجربة آمنة ومريحة لكِ ولطفلك.",
    sections: [
      {
        title: "World-Class, Personalized Care",
        titleAr: "رعاية عالمية بمعايير شخصية",
        content:
          "Supported by a team of healthcare professionals, including dedicated nurses, anesthetists, and neonatologists, we provide comprehensive care every step of the way. Our collaborative approach ensures personalized attention throughout pregnancy, delivery, and recovery.",
        contentAr:
          "يضم القسم فريقًا متكاملاً من الاستشاريين والمتخصصين، إلى جانب طواقم التمريض، وأطباء التخدير، وأطباء حديثي الولادة، لتقديم رعاية شاملة وفق أعلى المعايير الطبية العالمية. ويعتمد نهجنا على التعاون بين مختلف التخصصات لضمان متابعة دقيقة ورعاية مصممة بما يتناسب مع احتياجات كل حالة، بدءًا من الحمل وحتى ما بعد الولادة.",
      },
      {
        title: "State-of-the-Art Birthing Suites",
        titleAr: "أجنحة ولادة حديثة ومتطورة",
        content:
          "Our birthing center on the 5th floor offers calming, private suites equipped with modern pain management technologies. Each suite is connected to our Operating Theatres, ICU, and Neonatal Department for immediate specialized care if needed.",
        contentAr:
          "يضم مركز الولادة في الطابق الخامس أجنحة خاصة توفر أجواء هادئة ومريحة، ومجهزة بأحدث التقنيات الطبية الخاصة بإدارة وتخفيف آلام الولادة. كما ترتبط الأجنحة مباشرة بغرف العمليات، ووحدة العناية المركزة، وقسم حديثي الولادة، لضمان سرعة التدخل وتوفير الرعاية التخصصية الفورية عند الحاجة.",
      },
      {
        title: "Our Maternity Suite Features:",
        titleAr: "مميزات جناح الولادة:",
        items: [
          "Private birthing suites",
          "Mimosa Suites for low-risk births",
          "High Dependency Units (HDUs)",
          "Isolation room for special cases",
        ],
        itemsAr: [
          "أجنحة ولادة خاصة",
          "أجنحة \"ميموزا\" المخصصة لحالات الولادة منخفضة الخطورة",
          "وحدات رعاية عالية الاعتمادية (HDU)",
          "غرفة عزل مجهزة للحالات الخاصة",
        ],
      },
      {
        title: "Highlights of Our Obstetrics Services:",
        titleAr: "أبرز خدمات النساء والتوليد:",
        items: [
          "Preconception Planning: Tailored consultations for a healthy start.",
          "Prenatal Care: Monitoring and managing normal and high-risk pregnancies.",
          "24/7 Consultant Availability: Immediate access to senior specialists.",
          "Maternal-Fetal Medicine: Advanced care for complex cases.",
          "Obstetric Ultrasound: Detailed fetal assessments.",
          "Labor Pain Management: Options including epidurals.",
          "Care for Multiples: Specialized support for twins and more.",
          "Management of Conditions: From gestational diabetes to IUGR.",
          "Vaginal and Cesarean Deliveries: Safe, personalized birth plans.",
          "Genetic Counselling: Guidance on hereditary risks.",
        ],
        itemsAr: [
          "التخطيط للحمل: استشارات متخصصة لدعم بداية صحية وآمنة للحمل",
          "رعاية ما قبل الولادة: متابعة دقيقة للحمل الطبيعي والحالات عالية الخطورة",
          "توفر الاستشاريين على مدار الساعة: رعاية فورية بإشراف نخبة من كبار الأطباء",
          "طب الأم والجنين: رعاية متقدمة للحالات المعقدة والحمل عالي الخطورة",
          "التصوير بالموجات فوق الصوتية: تقييمات دقيقة لصحة ونمو الجنين",
          "إدارة آلام الولادة: خيارات متقدمة تشمل التخدير النصفي",
          "رعاية الحمل المتعدد: متابعة متخصصة لحالات التوائم والحمل المتعدد",
          "إدارة مضاعفات الحمل: مثل سكري الحمل وتأخر نمو الجنين داخل الرحم",
          "الولادة الطبيعية والقيصرية: خطط ولادة آمنة ومخصصة لكل أم",
          "الاستشارات الوراثية: تقييم وإرشاد متخصص حول المخاطر الوراثية المحتملة",
        ],
      },
    ],
    subDepartments: [
      {
        slug: "womens-health",
        name: "Women's Health",
        nameAr: "صحة المرأة",
        intro:
          "At Royale Hayat Hospital, we provide expert care tailored to women's unique needs, from adolescence to the golden years. Our compassionate, patient-centered approach ensures you receive the best preventive and advanced treatments in a supportive environment.",
        introAr:
          "في مستشفى رويال حياة، نقدم رعاية متخصصة مصممة لتلبية احتياجات المرأة الصحية في مختلف مراحل حياتها، من مرحلة المراهقة وحتى سنوات النضج. ومن خلال نهجنا الإنساني الذي يضع المريضة في المقام الأول، نحرص على توفير أفضل الخدمات الوقائية والعلاجية المتقدمة ضمن بيئة داعمة ومريحة.",
        sections: [
          {
            title: "Adolescence: A Time of Change",
            titleAr: "مرحلة المراهقة: مرحلة التغيير والنمو",
            content:
              "We support young women through their transformative years with services like annual physical exams, menstrual health management, and the HPV vaccine. Our clinic offers a safe space for guidance and care.",
            contentAr:
              "ندعم الفتيات خلال هذه المرحلة المهمة من حياتهن من خلال خدمات تشمل الفحوصات السنوية، ومتابعة صحة الدورة الشهرية، وتقديم لقاح فيروس الورم الحليمي البشري (HPV). كما نوفر بيئة آمنة تتيح التوجيه والرعاية الصحية المناسبة.",
          },
          {
            title: "Youth: Empowering Your Journey",
            titleAr: "مرحلة الشباب: تمكين رحلتك الصحية",
            content:
              "During childbearing years, we offer state-of-the-art obstetric care, infertility treatments, and family planning. Our team provides personalized support for hormonal changes and wellness needs.",
            contentAr:
              "خلال سنوات الخصوبة، نقدم أحدث خدمات الرعاية النسائية والتوليد، علاجات تأخر الإنجاب، وتنظيم الأسرة. كما يوفّر فريقنا دعمًا شخصيًا للتعامل مع التغيرات الهرمونية واحتياجات الصحة العامة.",
          },
          {
            title: "Midlife: Health and Vitality",
            titleAr: "منتصف العمر: الصحة والحيوية",
            content:
              "Stay strong and active with our midlife services, including annual exams, urinary incontinence treatment, and uterine disorder management. Our recommended screenings help detect issues early, keeping you in stride.",
            contentAr:
              "حافظي على نشاطك وصحتك من خلال خدماتنا المتخصصة لمرحلة منتصف العمر، والتي تشمل الفحوصات الدورية، علاج سلس البول، ومتابعة اضطرابات الرحم. كما تساعد الفحوصات الوقائية الموصى بها على الاكتشاف المبكر لأي مشكلات صحية للحفاظ على جودة حياتك.",
          },
          {
            title: "Mature Years: Focus on You",
            titleAr: "سنوات النضج: رعاية تركز عليكِ",
            content:
              "In your golden years, enjoy personalized hormone therapy, bone health management, and menopause support. We emphasize preventive screenings and treatments to maintain your independence and well-being.",
            contentAr:
              "في هذه المرحلة، نوفر برامج علاجية مخصصة تشمل العلاج الهرموني، العناية بصحة العظام، ودعم مرحلة سن اليأس. كما نركز على الفحوصات الوقائية والعلاجات التي تساعدك على الحفاظ على استقلاليتك وصحتك العامة.",
          },
          {
            title: "Start Your Journey to Lifelong Wellness",
            titleAr: "ابدئي رحلتك نحو صحة تدوم مدى الحياة",
            content:
              "Take control of your health with our gender-specific programs, designed to support you at every life stage. Schedule your consultation today at 25360000 and partner with a physician dedicated to your lifelong well-being.\n\nYour health, your future—let's take the next step together.",
            contentAr:
              "امنحي صحتك الأولوية من خلال برامجنا المتخصصة المصممة لدعم المرأة في كل مرحلة من مراحل الحياة. احجزي موعدك اليوم على الرقم 25360000 وابدئي رحلتك مع فريق طبي يلتزم برعايتك وصحتك على المدى الطويل.\n\n**صحتكِ اليوم… هي مستقبلُكِ غدًا**",
          },
        ],
      },
      {
        slug: "urogynecology",
        name: "Urogynecology",
        nameAr: "أمراض المسالك البولية النسائية",
        intro:
          "At our Women's Urogynecology Clinic, we provide expert care for urinary and pelvic health challenges. Our specialized team uses the latest diagnostic tools and treatments to offer personalized, evidence-based care in a luxurious, supportive environment.",
        introAr:
          "في عيادة أمراض المسالك البولية النسائية بمستشفى رويال حياة، نقدم رعاية متخصصة لصحة الجهاز البولي وقاع الحوض لدى المرأة. ويعتمد فريقنا الطبي على أحدث وسائل التشخيص والعلاج لتوفير رعاية شخصية قائمة على أفضل الممارسات الطبية، ضمن بيئة راقية وداعمة تضمن أعلى مستويات الراحة والخصوصية.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Urinary Incontinence Treatment: Advanced therapies to manage urine leakage.",
              "Pelvic Floor Muscle Rehabilitation: Strengthening treatments for pelvic muscles.",
              "Cystometrography: Bladder function testing for precise diagnosis.",
              "Postpartum Muscle Relaxation Therapies: Restorative care after childbirth.",
              "Pelvic Muscle Exercises: Guided programs to enhance bladder control.",
              "Bladder Muscle Therapy: Support for relaxed bladder muscles.",
              "Menstrual Pain Management: Relief for pelvic discomfort during menstruation.",
              "Bladder Imaging: Non-invasive techniques to assess bladder health.",
            ],
            itemsAr: [
              "علاج سلس البول: توفير أحدث العلاجات المتقدمة للمساعدة في التحكم بتسرّب البول وتحسين جودة الحياة",
              "إعادة تأهيل عضلات قاع الحوض: برامج علاجية متخصصة لتقوية عضلات الحوض ودعم وظائفها الطبيعية",
              "فحص ديناميكية المثانة: اختبارات دقيقة لتقييم وظائف المثانة والمساعدة في التشخيص الصحيح للحالة",
              "علاجات ارتخاء العضلات بعد الولادة: رعاية تأهيلية للمساعدة في استعادة قوة ووظائف عضلات الحوض بعد الولادة",
              "تمارين عضلات الحوض: برامج تدريبية موجهة لتحسين التحكم بالمثانة وتعزيز صحة الحوض",
              "علاج عضلات المثانة الضعيفة: خطط علاجية لدعم عضلات المثانة وتحسين أدائها الوظيفي",
              "علاج آلام الدورة الشهرية: خيارات علاجية فعّالة للتخفيف من آلام الحوض والانزعاج المرتبط بالدورة الشهرية",
              "تصوير المثانة: تقنيات تصوير غير جراحية لتقييم صحة المثانة وتشخيص المشكلات بدقة",
            ],
          },
        ],
      },
      {
        slug: "cosmetic-gynecology",
        name: "Cosmetic Gynecology",
        nameAr: "التجميل النسائي",
        intro:
          "Introducing Kuwait's first Cosmetic Gynecology Unit at Royale Hayat Hospital. We offer the latest surgical and non-surgical procedures tailored to women's unique needs.",
        introAr:
          "يفتخر مستشفى رويال حياة بتقديم أول وحدة متخصصة في طب النساء التجميلي في الكويت، حيث نوفر أحدث الإجراءات الجراحية وغير الجراحية المصممة لتلبية احتياجات المرأة الصحية والجمالية بأعلى معايير الخصوصية والرعاية.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "EVA (Vaginal Radiofrequency Therapy): Non-invasive vaginal tightening and mild urinary stress incontinence treatment.",
              "Preventive Women's Healthcare: Comprehensive wellness, pregnancy care, and cervical cancer vaccinations.",
              "Management of Menstrual Disorders: Expert care for heavy and painful cycles to improve quality of life.",
              "Hormonal Skin Treatments: Targeted therapies for acne and hormonal skin conditions.",
              "Hair Reduction Treatments: Solutions to reduce frequent shaving.",
              "Annual Physical Exams: Routine assessments for long-term well-being.",
              "Cervical Cancer Vaccination: HPV vaccine for women aged 11 to 26.",
            ],
            itemsAr: [
              "العلاج بالتردد الحراري المهبلي: علاج غير جراحي للمساعدة في شد المنطقة المهبلية وعلاج السلس البولي الخفيف الناتج عن الإجهاد",
              "الرعاية الوقائية لصحة المرأة: برامج شاملة للعناية بصحة المرأة، تشمل متابعة الحمل والتطعيمات الوقائية لسرطان عنق الرحم.",
              "علاج اضطرابات الدورة الشهرية: رعاية متخصصة لعلاج غزارة الدورة الشهرية وآلامها بما يساهم في تحسين جودة الحياة",
              "العلاجات الهرمونية للبشرة: حلول علاجية مخصصة لعلاج حب الشباب والمشكلات الجلدية المرتبطة بالتغيرات الهرمونية",
              "علاجات تقليل نمو الشعر: خيارات فعّالة للمساعدة في تقليل نمو الشعر غير المرغوب فيه وتقليل الحاجة إلى الحلاقة المتكررة",
              "الفحوصات السنوية الدورية: تقييمات صحية شاملة لدعم الصحة العامة والوقاية على المدى الطويل",
              "لقاح سرطان عنق الرحم: توفير لقاح فيروس الورم الحليمي البشري، للفتيات والنساء من عمر 11 إلى 26 عاما",
            ],
          },
          {
            title: "A New Standard in Women's Health",
            titleAr: "معيار جديد لصحة المرأة",
            content:
              "Our Cosmetic Gynecology Unit offers comprehensive, customized care that addresses both medical and lifestyle needs, setting a new standard for women's health in Kuwait.",
            contentAr:
              "تقدم وحدة طب النساء التجميلي في رويال حياة رعاية شاملة ومخصصة تجمع بين الاحتياجات الطبية والجمالية ونمط الحياة، لتضع معيارًا جديدًا لصحة المرأة في الكويت.",
          },
        ],
      },
      {
        slug: "gynecologic-oncology",
        name: "Gynecologic Oncology",
        nameAr: "الأورام النسائية",
        intro: "Our Gynecologic Oncology unit provides specialized care for gynecological cancers and related conditions.",
        introAr:
          "تقدم وحدة أورام النساء في مستشفى رويال حياة رعاية متخصصة ومتقدمة لتشخيص وعلاج السرطانات النسائية والحالات المرتبطة بها، وذلك من خلال فريق طبي متعدد التخصصات يلتزم بتقديم رعاية شاملة تتمحور حول المريضة.",
        sections: [],
      },
      {
        slug: "physiotherapy",
        name: "Physiotherapy",
        nameAr: "العلاج الطبيعي",
        intro:
          "At Royale Hayat Hospital, our Physiotherapy Clinic offers advanced treatments tailored to support women's health throughout life. We collaborate with other departments for comprehensive recovery and rehabilitation.",
        introAr:
          "في مستشفى رويال حياة، تقدم عيادة العلاج الطبيعي برامج علاجية متقدمة ومخصصة لدعم صحة المرأة في مختلف مراحل حياتها. ويعمل فريقنا بالتعاون مع الأقسام الطبية الأخرى لضمان تقديم رعاية شاملة تدعم التعافي وإعادة التأهيل بأعلى المعايير.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Urogynecological Disorders Management: Treatment for urinary incontinence, pelvic organ prolapse, vaginismus, and menstrual pain.",
              "Pre and Postnatal Care: Physiotherapy for safe delivery and faster recovery.",
              "Pregnancy-Related Discomfort Relief: Managing back pain, leg swelling, and muscle weakness.",
            ],
            itemsAr: [
              "علاج اضطرابات المسالك البولية النسائية: رعاية متخصصة لعلاج سلس البول، هبوط أعضاء الحوض، التشنج المهبلي، وآلام الدورة الشهرية",
              "الرعاية قبل وبعد الولادة: برامج علاج طبيعي تساعد على التحضير لولادة آمنة وتسريع التعافي بعد الولادة",
              "تخفيف آلام ومضاعفات الحمل: علاج مشكلات الحمل الشائعة مثل آلام الظهر، تورم الساقين، وضعف العضلات",
              "علاج مشكلات الجهاز العضلي الهيكلي: رعاية متخصصة لحالات خشونة المفاصل، تيبس الكتف، وإصابات العمود الفقري، وآلام عصب عرق النسا.",
              "العلاج الطبيعي التنفسي: جلسات علاجية لتحسين التنفس والتخفيف من ضيق التنفس خلال الحمل وبعد الولادة.",
              "العناية بالندبات بعد الولادة القيصرية: تقنيات علاجية للمساعدة في تقليل الألم وتحسين التئام الندبات واستعادة مرونة الأنسجة.",
              "إعادة التأهيل بعد العمليات الجراحية: برامج تأهيلية بعد عمليات السمنة أو الجراحات التجميلية لدعم التعافي وتحسين النتائج العلاجية.",
              "إعادة التأهيل بعد جراحات الثدي: علاج طبيعي يهدف إلى استعادة الحركة وتقليل الألم بعد العمليات الجراحية الخاصة بالثدي.",
            ],
          },
          {
            title: "Musculoskeletal Management",
            content: "Care for osteoarthritis, frozen shoulder, spinal injuries, and sciatic pain.",
          },
          {
            title: "Pulmonary Physiotherapy",
            content: "Breathing therapy for pregnancy and postpartum breathlessness.",
          },
          {
            title: "Scar Management After Cesarean",
            content: "Techniques to reduce pain and enhance healing.",
          },
          {
            title: "Post-Surgical Rehabilitation",
            content: "Care following bariatric or cosmetic surgery to promote healing.",
          },
          {
            title: "Breast Surgery Rehabilitation",
            content: "Therapy to restore movement and reduce pain after breast surgery.",
          },
        ],
      },
      {
        slug: "parent-childbirth-education",
        name: "Parent and Childbirth Education",
        nameAr: "تثقيف الوالدين والولادة",
        intro:
          "At Royale Hayat Hospital, we offer comprehensive educational programs for expectant parents, ensuring a calm and informed birthing experience.",
        introAr:
          "في مستشفى رويال حياة، نقدم برامج تعليمية شاملة للآباء والأمهات المنتظرين، بهدف توفير تجربة ولادة هادئة، آمنة، ومبنية على المعرفة والثقة.",
        sections: [
          {
            title: "Pre-Birthing Program",
            titleAr: "برنامج ما قبل الولادة",
            content: "Prepare for labor, delivery, and postpartum with:",
            contentAr: "استعدّي لمرحلة المخاض والولادة وما بعد الولادة من خلال برامجنا التثقيفية التي تشمل:",
            items: [
              "Education on labor stages and pain relief options",
              "Relaxation and breathing techniques",
              "Guided tours of our maternity wards and birthing suites",
              "Introduction to our supportive nursing staff",
            ],
            itemsAr: [
              "التوعية بمراحل المخاض وخيارات تخفيف الألم",
              "تقنيات الاسترخاء والتنفس",
              "جولات تعريفية داخل أجنحة وغرف الولادة",
              "التعرف على فريق التمريض والدعم المتخصص",
            ],
          },
          {
            title: "Breastfeeding Classes",
            titleAr: "دورات الرضاعة الطبيعية",
            content: "Led by certified lactation specialists, these sessions include:",
            contentAr: "تُقدَّم هذه الجلسات بإشراف أخصائيات رضاعة طبيعية معتمدات، وتشمل:",
            items: [
              "Hands-on breastfeeding guidance",
              "Postpartum breast care",
              "Benefits of breastfeeding for mother and baby",
              "Private, in-suite support after delivery",
            ],
            itemsAr: [
              "إرشادات عملية حول الرضاعة الطبيعية",
              "العناية بالثدي بعد الولادة",
              "فوائد الرضاعة الطبيعية للأم والطفل",
              "دعم خاص داخل الجناح بعد الولادة",
            ],
          },
          {
            title: "Newborn & Childcare Program",
            titleAr: "برنامج رعاية حديثي الولادة والأطفال",
            content: "Gain practical skills for newborn care:",
            contentAr: "اكتسبي المهارات الأساسية للعناية بمولودك الجديد من خلال:",
            items: [
              "Handling, hygiene, and swaddling techniques",
              "Understanding sleep patterns and needs",
              "Early signs of common concerns",
              "Support for bonding with your baby",
            ],
            itemsAr: [
              "طرق حمل الطفل، والنظافة، وتقنيات اللفّ",
              "فهم أنماط نوم الطفل واحتياجاته",
              "التعرف المبكر على العلامات الشائعة التي تستدعي الانتباه",
              "دعم بناء العلاقة والترابط مع طفلك",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "al-safwa-healthcare-program",
    name: "Al Safwa Healthcare Program",
    nameAr: "برنامج الصفوة للرعاية الصحية",
    intro: "In today's fast-paced world, health can often take a backseat. The Al Safwa Program at Royale Hayat Hospital offers elite medical care designed to fit seamlessly into your busy lifestyle.",
    sections: [
      {
        title: "Program Overview",
        content: "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle. Our team will craft a customized care plan just for you.",
      },
      {
        title: "Objectives",
        items: [
          "Deliver premium, personalized healthcare",
          "Identify and mitigate health risks early",
          "Efficiently manage chronic and hereditary conditions",
          "Provide immunization updates",
          "Enhance overall health and well-being",
        ],
      },
      {
        title: "Features",
        items: [
          "Access top specialists in Cardiology, Gastroenterology, and more",
          "Enjoy elegant, private executive suites",
          "Benefit from a dedicated Executive Coordinator for seamless scheduling",
        ],
      },
      {
        title: "Preparing for Your Visit",
        content: "To ensure accurate results, please fast for 12 hours before, and consult your doctor about medications. Arrive early to complete registration and relax in your executive suite.",
      },
      {
        title: "What to Bring",
        items: [
          "Current medication list or samples",
          "Previous medical records and lab results",
          "Contact details of your referring physician",
          "Comfortable clothing for overnight stays",
        ],
      },
      {
        title: "Register Today",
        content: "Visit our website to join the Al Safwa Program and prioritize your health with luxury and ease.",
      },
    ],
  },
  {
    slug: "reproductive-medicine-ivf",
    name: "Reproductive Medicine & IVF",
    nameAr: "طب الإنجاب وأطفال الأنابيب",
    intro:
      "At Royale Hayat Hospital, we blend expertise with cutting-edge technology to offer the most advanced infertility treatments. Our dedicated team of physicians, counsellors, and specialists ensures high-quality, compassionate care in a luxurious setting.",
    introAr:
      "في مستشفى رويال حياة، نجمع بين الخبرة الطبية والتقنيات الحديثة المتقدمة لتقديم أحدث علاجات تأخر الإنجاب، ضمن بيئة علاجية راقية وفريق متخصص من الأطباء والاستشاريين والمرشدين لضمان رعاية طبية وإنسانية عالية الجودة.",
    sections: [
      {
        title: "Our Services Include:",
        titleAr: "تشمل خدمات القسم:",
        items: [
          "Clomid Cycles: Stimulate ovulation for irregular cycles",
          "Male Factor Infertility: Comprehensive evaluations and tailored treatments",
          "Artificial Insemination (IUI): Less invasive conception options",
          "IVF and Frozen Embryo Transfer (FET): Effective assisted reproductive technologies",
          "Intracytoplasmic Sperm Injection (ICSI): Advanced treatment for severe male infertility",
          "Pre-implantation Genetic Diagnosis (PGD): Screen embryos for genetic conditions",
          "Treatment for Endometriosis and PCOS: Manage conditions affecting fertility",
        ],
        itemsAr: [
          "تنشيط الإباضة باستخدام أدوية محفزة لتنظيم الدورات غير المنتظمة",
          "علاج العقم عند الرجال عبر تقييم شامل وخطط علاجية مخصصة",
          "التلقيح داخل الرحم كأحد الخيارات المساعدة على الحمل",
          "أطفال الأنابيب ونقل الأجنة المجمدة كإحدى تقنيات الإخصاب المساعد",
          "الحقن المجهري لعلاج حالات العقم الذكري الشديد",
          "التشخيص الوراثي قبل إرجاع الأجنة للكشف عن الأمراض الوراثية",
          "علاج بطانة الرحم المهاجرة ومتلازمة تكيس المبايض لتحسين فرص الحمل",
        ],
      },
    ],
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    nameAr: "طب الأطفال",
    intro:
      "At Royale Hayat Hospital, we provide world-class pediatric care with warmth and a child-centered approach. Our goal is to support your child's health with expert pediatricians, experienced nurses, and a comforting environment.",
    introAr:
      "في مستشفى رويال حياة، نقدم رعاية متقدمة لطب الأطفال وفق أعلى المعايير الطبية العالمية، ضمن بيئة مصممة بعناية لتوفير الراحة والطمأنينة للأطفال وعائلاتهم. ويعمل فريقنا من أطباء الأطفال والكفاءات التمريضية المتخصصة على تقديم رعاية شاملة تتمحور حول احتياجات الطفل الصحية في بيئة مريحة.",
    sections: [
      {
        title: "Our Pediatric Services Include:",
        titleAr: "تشمل خدمات طب الأطفال:",
        items: [
          "General Infant Check-ups: Routine assessments for health and development",
          "Growth & Development Monitoring: Track physical and cognitive progress",
          "High-Risk Infant Follow-Up: Specialized care for premature infants",
          "Pediatric Intensive Care Unit (PICU): Advanced critical care for serious conditions",
          "Infant Hearing Screening: Early detection for timely intervention",
          "Emergency & Observation Unit: Immediate care for acute injuries",
          "Inpatient Pediatric Unit: Safe hospitalization designed for children",
          "Preventive Care & Vaccinations: Immunizations to protect health",
        ],
        itemsAr: [
          "الفحوصات الدورية للأطفال الرضع: متابعة شاملة للنمو والصحة العامة",
          "متابعة النمو والتطور: تقييم التطور الجسدي والإدراكي والسلوكي للطفل",
          "متابعة الأطفال ذوي الخطورة العالية: رعاية متخصصة للأطفال الخدّج والحالات التي تحتاج إلى متابعة دقيقة",
          "وحدة العناية المركزة للأطفال: رعاية متقدمة للحالات الحرجة والمعقدة",
          "فحص السمع لحديثي الولادة والأطفال: الكشف المبكر لضمان التدخل العلاجي في الوقت المناسب",
          "قسم الطوارئ والملاحظة للأطفال: رعاية فورية للحالات الطارئة والإصابات الحادة",
          "وحدة تنويم الأطفال: بيئة علاجية آمنة ومهيأة خصيصًا للأطفال",
          "الرعاية الوقائية والتطعيمات: برامج تطعيم متكاملة للحفاظ على صحة الطفل وتعزيز الوقاية",
        ],
      },
      {
        title: "Pediatric Surgical Services",
        titleAr: "جراحة الأطفال",
        content: "Safe surgical solutions for children.",
        contentAr: "حلول جراحية متقدمة وآمنة للأطفال.",
      },
      {
        title: "Pediatric Anesthesia",
        titleAr: "تخدير الأطفال",
        content: "Specialized care tailored for young patients.",
        contentAr: "رعاية تخديرية متخصصة تراعي احتياجات الأطفال المختلفة.",
      },
      {
        title: "Pediatric Cardiology",
        titleAr: "أمراض قلب الأطفال",
        content: "Management of heart conditions.",
        contentAr: "تشخيص وعلاج ومتابعة أمراض القلب لدى الأطفال.",
      },
      {
        title: "Pediatric Dentistry",
        titleAr: "طب أسنان الأطفال",
        content: "Dental care for infants, children, and teens.",
        contentAr: "رعاية متكاملة لأسنان الرضع والأطفال.",
      },
      {
        title: "Newborn Screening",
        titleAr: "فحوصات حديثي الولادة",
        content: "Early detection of disorders.",
        contentAr: "الكشف المبكر عن الاضطرابات والحالات الصحية.",
      },
      {
        title: "Endocrinology & Diabetes Management",
        titleAr: "أمراض الغدد الصماء والسكري للأطفال",
        content: "Care for hormonal imbalances.",
        contentAr: "تشخيص وعلاج اضطرابات الهرمونات والسكري.",
      },
      {
        title: "Pediatric ENT",
        titleAr: "الأنف والأذن والحنجرة للأطفال",
        content: "Treatment for ENT-related conditions.",
        contentAr: "تشخيص وعلاج الحالات المتعلقة بالأنف والأذن والحنجرة.",
      },
      {
        title: "Pediatric Intensive Care Unit (PICU)",
        titleAr: "وحدة العناية المركزة للأطفال",
        content:
          "At Royale Hayat Hospital, we know that a PICU admission can be stressful. Our goal is to provide top-tier clinical care in a compassionate, supportive environment for your family.",
        contentAr:
          "في مستشفى رويال حياة، ندرك أن دخول الطفل إلى وحدة العناية المركزة قد يكون تجربة مقلقة للعائلة، لذلك نحرص على توفير أعلى مستويات الرعاية الطبية ضمن بيئة إنسانية داعمة تمنح الطفل وذويه الشعور بالأمان والطمأنينة.",
      },
      {
        title: "Why Choose Our PICU?",
        titleAr: "لماذا وحدة العناية المركزة للأطفال لدينا؟",
        items: [
          "Staffed by board-certified pediatric intensivists",
          "24/7 specialized medical attention",
          "Personalized care tailored to your child's unique needs",
        ],
        itemsAr: [
          "يشرف عليها أطباء عناية مركزة للأطفال معتمدون وذوو خبرة عالية",
          "رعاية طبية متخصصة ومتواصلة على مدار الساعة",
          "خطط علاجية شخصية مصممة وفق احتياجات كل طفل وحالته الصحية",
        ],
      },
    ],
  },
  {
    slug: "neonatal",
    name: "Neonatal",
    nameAr: "حديثي الولادة",
    intro:
      "At Royale Hayat Hospital, your newborn's health is paramount. Our Level III Neonatal Unit, the highest in Kuwait's private sector, offers specialized care for premature and critically ill infants from 24 weeks of gestation.",
    introAr:
      "في مستشفى رويال حياة، نضع صحة المولود الجديد في مقدمة أولوياتنا، من خلال توفير رعاية طبية متقدمة وحديثة بأعلى المعايير. ويُعد قسم العناية المركزة لحديثي الولادة من المستوى الثالث الأعلى ضمن القطاع الصحي الخاص في الكويت، حيث يختص برعاية الأطفال الخدّج وحديثي الولادة ذوي الحالات الحرجة ابتداءً من عمر 24 أسبوعًا من الحمل.",
    sections: [
      {
        title: "Expert Care and Facilities",
        titleAr: "خبرات متخصصة وتجهيزات متقدمة",
        items: [
          "Our team of neonatologists and specialists provides 24/7 care using the latest technologies.",
          "7 Intensive Care Cots: For critically ill newborns needing constant monitoring.",
          "15 Special Care Baby Cots: For additional medical support.",
          "1 Isolation Cot: For specialized infection control.",
        ],
        itemsAr: [
          "يضم القسم نخبة من أطباء حديثي الولادة والمتخصصين الذين يقدمون رعاية متواصلة على مدار الساعة، مدعومة بأحدث التقنيات والتجهيزات الطبية المتطورة.",
          "7 أسرّة للعناية المركزة مخصصة للحالات الحرجة التي تتطلب مراقبة دقيقة ومستمرة",
          "15 سريرًا للرعاية الخاصة لتقديم دعم ورعاية طبية متقدم",
          "سرير عزل مجهز للحالات التي تتطلب إجراءات خاصة لمكافحة العدوى",
        ],
      },
      {
        title: "Comprehensive Services",
        titleAr: "رعاية شاملة لمختلف الحالات",
        content:
          "We manage conditions like premature birth complications, respiratory disorders, infections, congenital malformations, and neurological issues.",
        contentAr:
          "يوفر القسم رعاية متقدمة لمجموعة واسعة من الحالات، بما في ذلك مضاعفات الولادة المبكرة، واضطرابات الجهاز التنفسي، والالتهابات، والتشوهات الخلقية، والمشكلات العصبية.",
      },
      {
        title: "On-site Support Includes:",
        titleAr: "الخدمات الداعمة داخل القسم تشمل:",
        items: [
          "Blood gas analysis",
          "Advanced respiratory therapy",
          "Nutritional and lactation support",
          "Pharmacy management",
        ],
        itemsAr: [
          "تحليل غازات الدم",
          "علاجات تنفسية متقدمة",
          "دعم التغذية والرضاعة الطبيعية",
          "إدارة ومتابعة العلاج الدوائي",
        ],
      },
      {
        title: "24/7 Neonatal Transport Team",
        titleAr: "فريق متخصص لنقل حديثي الولادة 24/7",
        content: "Ensuring safe transfer of critically ill newborns with a fully-equipped transport.",
        contentAr:
          "نحرص على توفير نقل آمن وحديث للحالات الحرجة من حديثي الولادة، من خلال فريق متخصص ومركبات مجهزة بالكامل بأحدث التقنيات الطبية لضمان أعلى مستويات الرعاية أثناء النقل.",
      },
      {
        title: "International Standards",
        titleAr: "معايير عالمية للرعاية",
        content: "Aligned with Vermont Oxford Network standards, our unit meets global benchmarks for excellence in neonatal care.",
        contentAr:
          "يعمل القسم وفق معايير شبكة فيرمونت أوكسفورد العالمية، بما يضمن الالتزام بأعلى مستويات الجودة والتميز في رعاية حديثي الولادة.",
      },
      {
        title: "Special Care Baby Unit (SCBU)",
        titleAr: "وحدة الرعاية الخاصة لحديثي الولادة",
        content:
          "At Royale Hayat Hospital, our SCBU offers comprehensive care for newborns needing close monitoring and specialized attention. Staffed by experienced pediatricians and neonatal nurses, we ensure personalized, compassionate care.",
        contentAr:
          "توفر وحدة الرعاية الخاصة لحديثي الولادة في مستشفى رويال حياة رعاية متكاملة للأطفال الذين يحتاجون إلى متابعة دقيقة واهتمام طبي متخصص، بإشراف فريق ذي خبرة عالية من أطباء الأطفال وكوادر التمريض المتخصصة في رعاية حديثي الولادة.",
      },
      {
        title: "Our SCBU Services Include:",
        titleAr: "تشمل خدمات وحدة الرعاية الخاصة:",
        items: [
          "Continuous monitoring and specialized care",
          "Comprehensive examinations and newborn screenings",
          "Early detection and management of health conditions",
          "Coordination of specialty referrals",
          "Parent education and support for home care",
        ],
        itemsAr: [
          "المراقبة المستمرة والرعاية الطبية المتخصصة",
          "الفحوصات الشاملة وبرامج فحص حديثي الولادة",
          "الاكتشاف المبكر للحالات الصحية وعلاجها",
          "التنسيق مع مختلف التخصصات الطبية عند الحاجة",
          "توعية ودعم الأهل حول الرعاية المنزلية للمولود الجديد",
        ],
      },
    ],
  },
  {
    slug: "internal-medicine",
    name: "Internal Medicine",
    nameAr: "الأمراض الباطنية",
    intro:
      "At Royale Hayat Hospital, our Internal Medicine Department is your trusted partner for health management. Whether managing chronic conditions or seeking preventive care, we support you at every stage.",
    introAr:
      "في مستشفى رويال حياة، يُعد قسم الأمراض الباطنية شريكك الموثوق في إدارة الصحة العامة، سواء في التعامل مع الأمراض المزمنة أو تقديم الرعاية الوقائية، مع دعمك في جميع مراحل الرعاية الصحية.",
    sections: [
      {
        title: "Our Approach",
        titleAr: "نهجنا:",
        content:
          "Our expert physicians specialize in diagnosing and managing both acute and chronic illnesses, particularly complex conditions. We prioritize preventive care, early detection, and personalized treatment plans to enhance your well-being.",
        contentAr:
          "يتخصص أطباؤنا في تشخيص وعلاج الأمراض الحادة والمزمنة، خصوصًا الحالات المعقدة، مع التركيز على الوقاية والكشف المبكر ووضع خطط علاجية مخصصة لكل مريض بهدف تحسين جودة الحياة والصحة العامة.",
      },
      {
        title: "Health Check Program",
        titleAr: "برنامج الفحوصات الصحية:",
        content:
          "Our personalized health check-ups screen for potential issues in a comfortable, confidential setting, ensuring proactive health management.",
        contentAr:
          "نقدم برامج فحص صحي شاملة ومصممة خصيصًا لكل فرد، للكشف المبكر عن أي مشكلات صحية محتملة ضمن بيئة مريحة وسرية، بما يضمن إدارة صحية استباقية وفعالة.",
      },
      {
        title: "Your Check-Up Includes:",
        titleAr: "يشمل الفحص:",
        items: [
          "Personal and family medical history review",
          "Comprehensive physical examination",
          "Health risk evaluation",
          "Lifestyle and wellness recommendations",
          "Diagnostic laboratory testing",
          "Cardiovascular testing",
          "Resting Electrocardiogram (ECG)",
          "Radiology studies",
          "Exercise Treadmill Test",
        ],
        itemsAr: [
          "مراجعة التاريخ الطبي الشخصي والعائلي",
          "فحص سريري شامل",
          "تقييم عوامل الخطورة الصحية",
          "توصيات نمط الحياة والصحة العامة",
          "الفحوصات المخبرية التشخيصية",
          "فحوصات القلب والأوعية الدموية",
          "تخطيط القلب أثناء الراحة",
          "الفحوصات الإشعاعية",
          "اختبار الجهد على جهاز المشي.",
        ],
      },
    ],
    subDepartments: [
      {
        slug: "cardiology",
        name: "Cardiology",
        nameAr: "أمراض القلب",
        intro:
          "At Royale Hayat Hospital, we prioritize preventive cardiac care to promote long-term heart health and well-being. Our Cardiology Unit offers expert support, education, and treatment for a healthier life.",
        introAr:
          "في مستشفى رويال حياة، نولي أهمية كبيرة للرعاية القلبية الوقائية بهدف تعزيز صحة القلب على المدى الطويل وتحسين جودة الحياة. يقدم قسم أمراض القلب لدينا دعمًا طبيًا متخصصًا، وبرامج توعوية، وخيارات علاجية متقدمة لضمان قلب أكثر صحة وحياة أكثر توازنًا:",
        sections: [
          {
            title: "Our Cardiac Program",
            titleAr: "البرنامج القلبي:",
            content: "Designed for individuals with:",
            contentAr: "تم تصميم برنامجنا القلبي خصيصًا للأشخاص الذين لديهم:",
            items: [
              "Risk factors for coronary artery disease",
              "History of heart surgery, angioplasty, or heart attack",
              "Conditions like heart failure, cardiomyopathy, or angina",
            ],
            itemsAr: [
              "عوامل خطورة للإصابة بأمراض الشرايين التاجية",
              "تاريخ مرضي لجراحات القلب، أو القسطرة القلبية، أو الجلطات القلبية",
              "حالات مثل فشل القلب، أو اعتلال عضلة القلب، أو الذبحة الصدرية",
            ],
          },
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Comprehensive Heart Health Check-up",
              "Preventive Cardiac Screening",
              "Hypertension, Diabetes, and Cholesterol Monitoring",
              "Coronary Artery Disease Diagnosis & Treatment",
              "Echocardiography (Echo) and Stress Testing",
              "Arrhythmia Detection & Management",
            ],
            itemsAr: [
              "الفحوصات الشاملة لصحة القلب",
              "الفحوصات القلبية الوقائية",
              "متابعة ضغط الدم والسكري والكوليسترول",
              "تشخيص وعلاج أمراض الشرايين التاجية",
              "تخطيط صدى القلب واختبار الجهد",
              "تشخيص وإدارة اضطرابات نظم القلب",
            ],
          },
        ],
      },
      {
        slug: "nephrology",
        name: "Nephrology",
        nameAr: "أمراض الكلى",
        intro:
          "At Royale Hayat Hospital, our Nephrology Clinic provides top-tier diagnostic, preventive, and therapeutic services for kidney-related conditions. Our expert team delivers personalized care for your unique health needs.",
        introAr:
          "في مستشفى رويال حياة، تقدم عيادة أمراض الكلى خدمات تشخيصية ووقائية وعلاجية متكاملة لأمراض الكلى، وفق أعلى المعايير الطبية العالمية. ويحرص فريقنا الطبي المتخصص على تقديم رعاية شخصية تلبي احتياجات كل مريض بدقة واهتمام.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Care for Acute & Chronic Kidney Conditions",
              "Management of Acute Kidney Injury (AKI) & Chronic Kidney Disease (CKD)",
              "Diabetic Nephropathy & Hypertension Management",
              "Urinary Tract Infections & Kidney Stone Treatment",
              "Inflammatory & Glomerular Disorders",
              "Lupus Nephritis & Kidney Disease During Pregnancy",
              "Electrolyte, Fluid, and Acid-Base Imbalance Management",
              "Dialysis Support (Hemodialysis & Peritoneal Dialysis)",
              "Pre & Post-Kidney Transplant Evaluation",
              "Geriatric Nephrology: Specialized care for aging patients",
            ],
            itemsAr: [
              "رعاية أمراض الكلى الحادة والمزمنة",
              "إدارة الفشل الكلوي الحاد والمزمن",
              "اعتلال الكلى السكري وارتفاع ضغط الدم",
              "التهابات المسالك البولية وحصى الكلى",
              "الأمراض الالتهابية وأمراض الكبيبات الكلوية",
              "التهاب الكلى الذئبي وأمراض الكلى أثناء الحمل",
              "اضطرابات الأملاح والسوائل والاتزان الحمضي القاعدي",
              "دعم الغسيل الكلوي",
              "تقييم ما قبل وما بعد زراعة الكلى",
              "طب الكلى لكبار السن",
            ],
          },
        ],
      },
      {
        slug: "gastroenterology",
        name: "Gastroenterology",
        nameAr: "أمراض الجهاز الهضمي",
        intro:
          "At Royale Hayat Hospital's Center for Digestive Diseases, we combine world-class expertise with cutting-edge technology to treat a wide range of gastrointestinal conditions.",
        introAr:
          "في مركز أمراض الجهاز الهضمي في مستشفى رويال حياة، نجمع بين الخبرة الطبية العالمية وأحدث التقنيات لتشخيص وعلاج مجموعة واسعة من أمراض الجهاز الهضمي.",
        sections: [
          {
            title: "Our Expertise",
            titleAr: "خبراتنا",
            content:
              "Our experienced gastroenterologists specialize in the prevention, diagnosis, and treatment of diseases affecting the esophagus, stomach, intestines, liver, pancreas, and biliary system. With Kuwait's only endoscopic ultrasound system, we offer an exclusive diagnostic advantage.",
            contentAr:
              "يتخصص أطباؤنا في الوقاية والتشخيص والعلاج لأمراض المريء، والمعدة، والأمعاء، والكبد، والبنكرياس، والجهاز الصفراوي. وباستخدام نظام الموجات فوق الصوتية التنظيرية الوحيد في الكويت، نقدم ميزة تشخيصية متقدمة ودقيقة.",
          },
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا",
            items: [
              "Upper GI Endoscopy: Examines the esophagus, stomach, and duodenal bulb; diagnoses gastric infections and food allergies",
              "Liver & Biliary Tract Assessment: Manages hepatitis, gallstones, biliary obstructions, and liver tumors",
              "Pancreatic Evaluation: Uses ultrasound and endoscopic imaging to diagnose and treat pancreatitis and pancreatic tumors",
              "Colonoscopy & Rectal Examinations: Diagnose inflammatory bowel diseases, IBS, colorectal tumors, and chronic constipation",
              "Therapeutic & Diagnostic ERCP: Offers minimally invasive treatment for bile and pancreatic duct disorders",
            ],
            itemsAr: [
              "تنظير الجهاز الهضمي العلوي: فحص المريء والمعدة والجزء العلوي من الاثني عشر، وتشخيص التهابات المعدة وحساسية الطعام",
              "تقييم الكبد والقنوات الصفراوية: تشخيص وعلاج التهاب الكبد، حصوات المرارة، انسدادات القنوات الصفراوية، وأورام الكبد",
              "تقييم البنكرياس: استخدام التصوير بالموجات فوق الصوتية والتنظير لتشخيص وعلاج التهاب وأورام البنكرياس",
              "تنظير القولون وفحوصات المستقيم: تشخيص أمراض التهاب الأمعاء، القولون العصبي، أورام القولون والمستقيم، والإمساك المزمن",
              "التنظير العلاجي والتشخيصي للقنوات الصفراوية والبنكرياس: إجراءات طفيفة التوغل لعلاج اضطرابات القنوات الصفراوية والبنكرياسية",
            ],
          },
          {
            title: "Pain Management Integration",
            titleAr: "وحدة إدارة الألم",
            content:
              "Our Pain Management Unit collaborates with the GI team to alleviate gastrointestinal discomfort, enhancing patient comfort and outcomes.",
            contentAr:
              "تعمل وحدة إدارة الألم بالتعاون مع فريق الجهاز الهضمي لتخفيف الانزعاج وتحسين راحة المرضى ونتائج العلاج.",
          },
        ],
      },
      {
        slug: "endocrinology-metabolism",
        name: "Endocrinology & Metabolism",
        nameAr: "الغدد الصماء والتمثيل الغذائي",
        intro:
          "At Royale Hayat Hospital, our Endocrinology and Metabolism Clinic offers comprehensive care for endocrine and metabolic disorders. Our skilled team uses the latest technology to provide compassionate, personalized treatment plans that restore well-being and enhance quality of life.",
        introAr:
          "في مستشفى رويال حياة، تقدم عيادة الغدد الصماء والتمثيل الغذائي رعاية شاملة لاضطرابات الغدد والهرمونات والأمراض الأيضية. ويعتمد فريقنا الطبي على أحدث التقنيات لتقديم خطط علاجية متخصصة ومصممة خصيصًا لكل مريض، بهدف استعادة التوازن الصحي وتحسين جودة الحياة.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Thyroid Disorders: Management of hypothyroidism, hyperthyroidism, goiter, thyroid nodules, and thyroid cancer",
              "Adrenal, Parathyroid & Pituitary Disorders: Treatment for Cushing's syndrome, Addison's disease, hormone imbalances, and pituitary tumors",
              "Growth & Development Disorders: Evaluation and treatment of growth delays in adolescents, with hormone therapy as needed",
            ],
            itemsAr: [
              "اضطرابات الغدة الدرقية: تشخيص وعلاج قصور وفرط نشاط الغدة الدرقية، تضخم الغدة، العقيدات الدرقية، وسرطان الغدة الدرقية",
              "اضطرابات الغدة الكظرية، الجار درقية، والغدة النخامية: علاج متقدم لحالات متلازمة كوشينغ، داء أديسون، اختلالات الهرمونات، وأورام الغدة النخامية",
              "اضطرابات النمو والتطور: تقييم وعلاج تأخر النمو لدى المراهقين باستخدام العلاج الهرموني عند الحاجة",
            ],
          },
          {
            title: "Calcium & Bone Health",
            titleAr: "صحة العظام والكالسيوم",
            content: "Diagnosis and treatment of osteoporosis and vitamin D deficiency.",
            contentAr: "تشخيص وعلاج هشاشة العظام ونقص فيتامين-د.",
          },
          {
            title: "Diabetes Management",
            titleAr: "إدارة مرض السكري",
            content: "Comprehensive care for Type 1 and Type 2 diabetes, including lifestyle support and complication prevention.",
            contentAr: "رعاية شاملة لمرضى السكري من النوع الأول والثاني، مع دعم نمط الحياة والوقاية من المضاعفات.",
          },
          {
            title: "Lipid & Metabolic Disorders",
            titleAr: "اضطرابات الدهون والأيض",
            content: "Management of hyperlipidemia and metabolic syndrome.",
            contentAr: "علاج ارتفاع الدهون في الدم ومتلازمة الأيض.",
          },
          {
            title: "Hormonal & Sexual Health",
            titleAr: "الصحة الهرمونية والجنسية",
            content: "Addressing hormonal imbalances affecting sexual health in men and women.",
            contentAr: "معالجة الاختلالات الهرمونية التي تؤثر على الصحة الجنسية لدى الرجال والنساء.",
          },
          {
            title: "General Endocrine Consultations",
            titleAr: "الاستشارات الغدد الصماء العامة",
            content: "Screening and management of complex conditions with ongoing monitoring and education.",
            contentAr: "تقييم شامل ومتابعة مستمرة للحالات المعقدة مع التثقيف الطبي والمتابعة الدورية.",
          },
        ],
      },
      {
        slug: "rheumatology",
        name: "Rheumatology",
        nameAr: "أمراض الروماتيزم",
        intro:
          "At Royale Hayat Hospital, our Rheumatology Clinic is dedicated to providing expert consultations and treatments for a wide range of musculoskeletal and autoimmune disorders. Integrated with the Department of Internal Medicine, our team of experienced physicians and nursing staff delivers personalized care tailored to your specific needs.",
        introAr:
          "في مستشفى رويال حياة، تقدم عيادة الروماتيزم استشارات وعلاجات متخصصة لمجموعة واسعة من أمراض الجهاز العضلي الهيكلي وأمراض المناعة الذاتية. وبالتكامل مع قسم الطب الباطني، يوفّر فريقنا من الأطباء والممرضين ذوي الخبرة رعاية شخصية مصممة لتلبية احتياجات كل مريض على حدة.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Detailed evaluation of joint pain through comprehensive patient history and physical examination",
              "Portable, non-invasive musculoskeletal ultrasound for accurate diagnosis",
              "Intra-articular joint injections using Steroids, Hyaluronic Acid, and Platelet-Rich Plasma (PRP) to relieve pain and inflammation",
              "Diagnosis, treatment, and management of all rheumatologic conditions, including: Osteoarthritis, Rheumatoid Arthritis, Gout, Psoriatic Arthritis, Fibromyalgia, Myositis, Vasculitis, Systemic Lupus Erythematosus (SLE)",
              "Evaluation and treatment of Low Vitamin D levels and Osteoporosis",
              "Ongoing management and follow-up of multiple general medical conditions related to rheumatology",
            ],
            itemsAr: [
              "تقييم آلام المفاصل: تقييم شامل لحالات آلام المفاصل من خلال التاريخ الطبي المفصل والفحص السريري الدقيق",
              "التصوير بالموجات فوق الصوتية العضلية الهيكلية المحمولة: تقنية تشخيصية غير جراحية تساعد على تحديد الحالة بدقة عالية",
              "الحقن داخل المفاصل: استخدام علاجات متقدمة لتخفيف الألم والالتهاب مثل الكورتيزون، حمض الهيالورونيك، البلازما الغنية بالصفائح الدموية",
              "تشخيص وعلاج أمراض الروماتيزم، إدارة شاملة لمختلف الحالات مثل: الفصال العظمي، التهاب المفاصل الروماتويدي، النقرس، التهاب المفاصل الصدفي، الألم العضلي الليفي، التهاب العضلات، التهاب الأوعية الدموية، والذئبة الحمراء",
              "علاج نقص فيتامين د وهشاشة العظام، تقييم وعلاج اضطرابات العظام ودعم صحة الهيكل العظمي",
              "المتابعة الطبية المستمرة، رعاية طويلة الأمد للحالات المزمنة والمتعددة المرتبطة بأمراض الروماتيزم",
            ],
          },
        ],
      },
      {
        slug: "clinical-nutrition-dietetics",
        name: "Clinical Nutrition & Dietetics",
        nameAr: "التغذية العلاجية والحمية",
        intro:
          "At Royale Hayat Hospital, our Nutrition and Diet Clinic is dedicated to promoting optimal health through personalized nutritional care aligned with World Health Organization standards. Our mission is to help you adopt healthier lifestyle patterns for a vibrant, energetic body. Our expert dietitians offer tailored services for all ages, providing practical advice and scientifically backed nutrition plans.",
        introAr:
          "في مستشفى رويال حياة، تلتزم عيادة التغذية العلاجية والحمية بتعزيز الصحة المثلى من خلال رعاية غذائية مخصصة تتماشى مع معايير منظمة الصحة العالمية، بهدف مساعدتك على تبنّي أنماط حياة صحية تعزز الحيوية والنشاط وجودة الحياة.\n\nويقدّم فريقنا من أخصائيي التغذية خدمات مخصصة لجميع الفئات العمرية، مع تقديم نصائح عملية وخطط غذائية مبنية على أسس علمية دقيقة.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Weight Management: Customized weight-loss and weight-gain plans",
              "Chronic Disease Nutrition: Management for diabetes, hypertension, and high cholesterol",
              "Post-Bariatric Surgery Nutrition: Specialized recovery and maintenance plans",
              "Maternal and Pediatric Nutrition: Programs for children, pregnant, and breastfeeding women",
              "Digestive Health: Support for gastrointestinal disorders",
              "Sports Nutrition: Plans to enhance athletic performance and recovery",
              "Advanced Body Composition Analysis: Precision measurement and targeted interventions",
              "Food Allergy & Intolerance: Testing and management plans",
              "Convenient Meal Delivery: Home delivery of healthy, balanced meals",
            ],
            itemsAr: [
              "إدارة الوزن: برامج غذائية مخصصة لإنقاص أو زيادة الوزن بشكل صحي ومتوازن",
              "التغذية للأمراض المزمنة: إدارة غذائية لمرضى السكري، وارتفاع ضغط الدم، وارتفاع الكوليسترول",
              "التغذية بعد جراحات السمنة: خطط متخصصة لدعم التعافي والحفاظ على النتائج بعد عمليات السمنة",
              "التغذية للأم والطفل: برامج غذائية للأطفال، والحوامل، والمرضعات لدعم النمو والصحة العامة",
              "صحة الجهاز الهضمي: دعم غذائي للحالات المرتبطة باضطرابات الجهاز الهضمي",
              "التغذية الرياضية: خطط لتعزيز الأداء الرياضي وتسريع الاستشفاء",
              "تحليل مكونات الجسم المتقدم: قياسات دقيقة لتكوين الجسم مع تدخلات غذائية موجهة لتحقيق أفضل النتائج",
              "حساسية وعدم تحمّل الطعام: اختبارات وخطط غذائية لإدارة الحساسية وعدم تحمّل بعض الأطعمة",
              "خدمة توصيل الوجبات الصحية: توصيل وجبات صحية ومتوازنة إلى المنزل لدعم نمط حياة صحي",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "general-laparoscopic-surgery",
    name: "General & Laparoscopic Surgery",
    nameAr: "الجراحة العامة والمنظار",
    intro:
      "At Royale Hayat Hospital, our General and Laparoscopic Surgery Department offers exceptional care, blending expert skills with advanced technology. Our internationally recognized surgeons focus on precision, safety, and quick recovery.",
    introAr:
      "في مستشفى رويال حياة، يقدم قسم الجراحة العامة والجراحة بالمنظار رعاية طبية متقدمة تجمع بين الخبرة الجراحية العالية وأحدث التقنيات الطبية، مع تركيز خاص على الدقة والأمان وسرعة التعافي. ويضم القسم نخبة من الجراحين المعتمدين دوليًا والذين يتمتعون بخبرة واسعة في مختلف التخصصات الجراحية.",
    sections: [
      {
        title: "Our Services Include:",
        titleAr: "تشمل خدمات القسم:",
        items: [
          "Breast Surgery",
          "Liver & Gallbladder Surgery",
          "Upper Gastrointestinal Surgeries (Esophagus, Intestines, Duodenum)",
          "Lower Gastrointestinal & Anorectal Surgeries",
          "Endocrine Surgeries (Thyroid & Parathyroid)",
          "Laparoscopic Surgery (Minimally Invasive)",
          "Oncologic Surgery (Cancer Treatment)",
          "Hernia Surgery",
          "Pediatric Surgery",
        ],
        itemsAr: [
          "جراحة الثدي",
          "جراحة الكبد والمرارة",
          "جراحات الجهاز الهضمي العلوي مثل المريء والأمعاء والاثني عشر",
          "جراحات الجهاز الهضمي السفلي وجراحات الشرج والمستقيم",
          "جراحات الغدد الصماء مثل الغدة الدرقية وجارات الدرقية",
          "الجراحة بالمنظار ذات التدخل المحدود",
          "جراحة الأورام وعلاج السرطان",
          "جراحة الفتق",
          "جراحة الأطفال.",
        ],
      },
    ],
    subDepartments: [
      {
        slug: "obesity-bariatric-surgery",
        name: "Obesity Bariatric Surgery",
        nameAr: "جراحات السمنة المفرطة",
        intro:
          "Royale Hayat Hospital's Bariatric Surgery Center is the first in the Middle East and Africa to be recognized by the Surgical Review Corporation as an International Center of Excellence in weight loss surgeries. With over 1,200 successful procedures, we offer safe and effective bariatric solutions for lasting results.",
        introAr:
          "يُعد مركز جراحات السمنة في مستشفى رويال حياة الأول في الشرق الأوسط وأفريقيا الذي يحصل على اعتماد المؤسسة العالمية لمراجعة الجراحة كمركز دولي متميز في جراحات إنقاص الوزن. ومع أكثر من 1,200 عملية ناجحة، نقدم حلولًا آمنة وفعّالة لتحقيق نتائج مستدامة وتحسين جودة الحياة.",
        sections: [
          {
            title: "Our Surgical Offerings Include:",
            titleAr: "تشمل خدماتنا الجراحية:",
            items: [
              "Gastric Sleeve",
              "Gastric Bypass",
              "Biliopancreatic Diversion (BPD)",
              "Revision Procedures",
              "Adolescent Weight Loss Surgeries",
              "Laparoscopic and Single Incision Surgeries",
            ],
            itemsAr: [
              "تكميم المعدة",
              "تحويل مسار المعدة",
              "تحويل مسار البنكرياس والقنوات الصفراوية",
              "عمليات تصحيح وإعادة جراحات السمنة",
              "جراحات إنقاص الوزن للمراهقين",
              "الجراحات بالمنظار والجراحات ذات الشق الواحد",
            ],
          },
          {
            title: "Excellence Recognized",
            titleAr: "تميز معترف به عالميًا",
            content:
              "In 2012, we were named an International Bariatric Surgery Center of Excellence, confirming our commitment to superior quality, exceptional outcomes, and innovative care within a state-of-the-art environment.",
            contentAr:
              "في عام 2012، تم تصنيف مركز جراحات السمنة في رويال حياة كمركز عالمي متميز في جراحات السمنة، تأكيدًا لالتزامنا بأعلى معايير الجودة، النتائج العلاجية الاستثنائية، والرعاية المبتكرة ضمن بيئة طبية متطورة.",
          },
          {
            title: "A Holistic Approach",
            titleAr: "نهج علاجي متكامل",
            content:
              "Recognizing obesity as a complex disease, our comprehensive program integrates medical, behavioural, nutritional, and surgical care. Each patient undergoes a detailed assessment with our multidisciplinary team, ensuring personalized, long-term treatment success.",
            contentAr:
              "إيمانًا منا بأن السمنة مرض معقّد يتطلب رعاية شاملة، يعتمد برنامجنا على دمج الرعاية الطبية، والسلوكية، والتغذوية، والجراحية ضمن خطة علاجية متكاملة. ويخضع كل مريض لتقييم دقيق من قبل فريق متعدد التخصصات لضمان تصميم خطة علاج شخصية تدعم النجاح على المدى الطويل.",
          },
          {
            title: "Customized Treatment Planning",
            titleAr: "خطط علاجية مخصصة",
            content: "Our team develops individualized plans aimed at:",
            contentAr: "يقوم فريقنا بوضع برامج علاجية فردية تهدف إلى:",
            items: [
              "Alleviating obesity-related conditions",
              "Minimizing nutritional risks",
              "Enhancing physical appearance, including post-weight loss contouring",
            ],
            itemsAr: [
              "التخفيف من الأمراض المرتبطة بالسمنة",
              "تقليل المخاطر الغذائية والصحية",
              "تحسين المظهر الجسدي، بما في ذلك إجراءات شد الجسم بعد فقدان الوزن",
            ],
          },
          {
            title: "Advanced Minimally Invasive Surgery",
            titleAr: "الجراحة المتقدمة بالمنظار",
            content: "Our surgeons are pioneers in FDA-approved laparoscopic techniques, offering:",
            contentAr:
              "يُعتبر أطباؤنا من الرواد في استخدام تقنيات المنظار المعتمدة من هيئة الغذاء والدواء الأمريكية والتي توفر:",
            items: ["Smaller incisions", "Reduced pain", "Shorter hospital stays", "Faster recovery"],
            itemsAr: [
              "شقوقًا جراحية أصغر",
              "ألمًا أقل بعد الجراحة",
              "فترة إقامة أقصر في المستشفى",
              "تعافيًا أسرع",
            ],
          },
          {
            title: "Long-Term Support & Success",
            titleAr: "دعم طويل الأمد لتحقيق النجاح",
            content:
              "Patients receive a minimum of five years of follow-up, consistently surpassing international benchmarks. Our dedicated team provides ongoing support to maintain an ideal weight and a healthy lifestyle.",
            contentAr:
              "يحصل المرضى على متابعة طبية مستمرة لمدة لا تقل عن خمس سنوات، مع نتائج تتجاوز المعايير العالمية. كما يوفّر فريقنا المتخصص دعمًا مستمرًا لمساعدة المرضى على الحفاظ على الوزن المثالي واتباع نمط حياة صحي ومستدام.",
          },
        ],
      },
      {
        slug: "breast-surgical-oncology",
        name: "Breast Surgical Oncology",
        nameAr: "جراحة أورام الثدي",
        intro:
          "At Royale Hayat Hospital, our Breast Surgical Oncology Clinic offers exceptional care for breast health. Our experienced team provides expert examinations, precise diagnoses, and advanced treatments for various breast conditions.",
        introAr:
          "في مستشفى رويال حياة، تقدم عيادة جراحة أورام الثدي رعاية متخصصة وشاملة لصحة الثدي، من خلال فريق طبي ذو خبرة عالية يوفّر الفحوصات الدقيقة، والتشخيص المتقدم، وخطط العلاج الحديثة لمختلف حالات وأمراض الثدي.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Breast Cancer Screening",
              "Advanced Diagnosis and Treatment of Breast Cancers",
              "Management of Benign and Malignant Breast Diseases",
              "Specialist Care for Breast Diseases and Cancer",
              "Diagnosis and Treatment of Breast Lumps, Pain, and Nipple Discharge",
              "Ongoing Follow-up for High-Risk Patients and Survivors",
            ],
            itemsAr: [
              "فحوصات الكشف المبكر عن سرطان الثدي",
              "تشخيص وعلاج سرطان الثدي",
              "علاج أمراض الثدي الحميدة والخبيثة",
              "الرعاية التخصصية لأمراض وسرطان الثدي",
              "تشخيص وعلاج كتل الثدي وآلامه وإفرازات الحلمة",
              "المتابعة المستمرة للحالات عالية الخطورة والناجيات من السرطان",
            ],
          },
        ],
      },
      {
        slug: "abdominal-wall-reconstruction",
        name: "Abdominal Wall Reconstruction",
        nameAr: "إعادة ترميم جدار البطن",
        intro: "Our Abdominal Wall Reconstruction unit provides specialized surgical care for complex abdominal wall conditions.",
        introAr:
          "تقدم وحدة إعادة ترميم جدار البطن في مستشفى رويال حياة رعاية جراحية متخصصة لعلاج الحالات المعقدة المتعلقة بجدار البطن، وذلك باستخدام أحدث التقنيات الجراحية والأساليب العلاجية المتقدمة.",
        sections: [],
      },
      {
        slug: "clinical-nutrition-dietetics",
        name: "Clinical Nutrition & Dietetics",
        nameAr: "التغذية العلاجية والحمية",
        intro:
          "At Royale Hayat Hospital, our Nutrition and Diet Clinic is dedicated to promoting optimal health through personalized nutritional care aligned with World Health Organization standards. Our mission is to help you adopt healthier lifestyle patterns for a vibrant, energetic body.\n\nOur expert dietitians offer tailored services for all ages, providing practical advice and scientifically backed nutrition plans.",
        introAr:
          "في مستشفى رويال حياة، تلتزم عيادة التغذية العلاجية والحمية بتعزيز الصحة العامة من خلال برامج غذائية مخصصة تتماشى مع معايير منظمة الصحة العالمية، بهدف مساعدتك على تبنّي نمط حياة صحي يمنحك الحيوية والطاقة وجودة الحياة.\n\nويقدّم فريقنا من أخصائيي التغذية خدمات متخصصة لجميع الفئات العمرية، مع خطط غذائية مبنية على أسس علمية ونصائح عملية تناسب احتياجات كل فرد.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل خدماتنا:",
            items: [
              "Weight Management: Customized weight-loss and weight-gain plans",
              "Chronic Disease Nutrition: Management for diabetes, hypertension, and high cholesterol",
              "Post-Bariatric Surgery Nutrition: Specialized recovery and maintenance plans",
              "Maternal and Pediatric Nutrition: Programs for children, pregnant, and breastfeeding women",
              "Digestive Health: Support for gastrointestinal disorders",
              "Sports Nutrition: Plans to enhance athletic performance and recovery",
              "Advanced Body Composition Analysis: Precision measurement and targeted interventions",
              "Food Allergy & Intolerance: Testing and management plans",
              "Convenient Meal Delivery: Home delivery of healthy, balanced meals",
            ],
            itemsAr: [
              "إدارة الوزن: برامج غذائية مخصصة لإنقاص أو زيادة الوزن بطريقة صحية وآمنة",
              "التغذية العلاجية للأمراض المزمنة: خطط غذائية لدعم علاج السكري، وارتفاع ضغط الدم، وارتفاع الكوليسترول",
              "التغذية بعد جراحات السمنة: برامج متخصصة لدعم التعافي والحفاظ على النتائج بعد عمليات السمنة",
              "تغذية الأم والطفل: خطط غذائية للأطفال، والحوامل، والمرضعات لدعم النمو والصحة العامة",
              "صحة الجهاز الهضمي: دعم غذائي للحالات المرتبطة باضطرابات الجهاز الهضمي",
              "التغذية الرياضية: برامج غذائية تهدف إلى تحسين الأداء الرياضي وتسريع التعافي",
              "تحليل مكونات الجسم المتقدم: قياسات دقيقة لتكوين الجسم مع خطط علاجية موجهة لتحقيق أفضل النتائج الصحية",
              "حساسية وعدم تحمّل الطعام: فحوصات وخطط غذائية لإدارة الحساسية وعدم تحمّل بعض الأطعمة",
              "خدمة توصيل الوجبات الصحية: توصيل وجبات متوازنة وصحية إلى المنزل لراحة أكبر ودعم أسلوب حياة صحي",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "plastic-surgery",
    name: "Plastic Surgery & Cosmetology",
    nameAr: "الجراحة التجميلية والتجميل",
    intro:
      "At Royale Hayat Hospital, our renowned General and Plastic Surgery & Cosmetology Department is led by internationally certified physicians, offering advanced surgical and non-surgical solutions with precision and discretion. Our all-female medical team is available for those who prefer.",
    introAr:
      "في مستشفى رويال حياة، يقدم قسم الجراحة التجميلية والتجميل رعاية متقدمة تحت إشراف نخبة من الأطباء المعتمدين دوليًا، مع توفير حلول جراحية وغير جراحية دقيقة وذات نتائج طبيعية وبأعلى درجات الخصوصية. كما يتوفر فريق طبي نسائي متكامل لمن يفضل ذلك.",
    sections: [
      {
        title: "Our Approach",
        titleAr: "نهجنا:",
        content:
          "We enhance natural beauty with safe, predictable, and natural-looking results. Patients also benefit from comprehensive health check-ups and preventive services.",
        contentAr:
          "نحرص على تعزيز الجمال الطبيعي من خلال نتائج آمنة ومتناغمة وقابلة للتوقع، مع التركيز على الحفاظ على التوازن الجمالي لكل حالة بشكل فردي، إضافة إلى تقديم برامج فحوصات صحية شاملة وخدمات وقائية تدعم الصحة العامة.",
      },
      {
        title: "Advanced Non-Surgical Solutions",
        titleAr: "الحلول غير الجراحية المتقدمة:",
        content: "Our Cosmetic Center uses cutting-edge technologies for effective non-surgical treatments:",
        contentAr: "يعتمد مركز التجميل لدينا على أحدث التقنيات الطبية في الإجراءات غير الجراحية، وتشمل:",
        items: [
          "Thermage (5th Gen): Skin tightening for face and body.",
          "Fraxel Dual (5th Gen): Improves texture, treats scars, and wrinkles.",
          "Laser Hair Removal (10th Gen): Safe for all skin types.",
          "Injectables & Rejuvenation: Botox, fillers, and advanced facials.",
        ],
        itemsAr: [
          "تقنية ثيرماج الجيل الخامس لشد البشرة للوجه والجسم",
          "تقنية فراكسل دوال الجيل الخامس لتحسين ملمس البشرة وعلاج الندبات والتجاعيد",
          "إزالة الشعر بالليزر الجيل العاشر المناسبة لجميع أنواع البشرة",
          "الحقن التجميلية وعلاجات التجديد مثل البوتوكس والفيلر والعلاجات التجميلية المتقدمة",
        ],
      },
      {
        title: "Life-Enhancing Surgical Solutions",
        titleAr: "الحلول الجراحية لتحسين الشكل والحياة:",
        content:
          "Our multidisciplinary team offers expert cosmetic and reconstructive procedures tailored to individual goals for optimal safety and satisfaction.",
        contentAr:
          "يقدم فريق متعدد التخصصات إجراءات تجميلية وترميمية متقدمة مصممة وفق أهداف كل مريض مع التركيز على أعلى معايير الأمان والنتائج المرضية.",
      },
      {
        title: "Surgical Services Include:",
        titleAr: "تشمل الخدمات الجراحية:",
        items: [
          "Body Contouring: Tummy tuck, arm lift, thigh lift",
          "Breast Surgery: Augmentation, reduction, nipple reshaping",
          "Facial Surgery: Face lifts, cheek implants, otoplasty, lip reshaping",
        ],
        itemsAr: [
          "تجميل ونحت الجسم مثل شد البطن وشد الذراعين وشد الفخذين",
          "جراحات الثدي مثل التكبير والتصغير وإعادة تشكيل الحلمة",
          "جراحات الوجه مثل شد الوجه وزراعة الخدود وجراحة الأذن التجميلية وتجميل الشفاه",
        ],
      },
    ],
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    nameAr: "الأمراض الجلدية",
    intro:
      "At Royale Hayat Hospital, our highly qualified dermatologists provide expert care for all your dermatological needs. We combine clinical excellence with the latest advances to deliver exceptional outcomes for both adults and children.",
    introAr:
      "في مستشفى رويال حياة، يقدم قسم الجلدية رعاية طبية متخصصة على يد نخبة من الأطباء المؤهلين لعلاج جميع الحالات الجلدية، مع دمج الخبرة السريرية بأحدث التطورات الطبية لضمان أفضل النتائج للبالغين والأطفال على حد سواء.",
    sections: [
      {
        title: "Our Expertise",
        titleAr: "خبرتنا:",
        content:
          "Our board-certified dermatologists diagnose and manage a wide range of conditions, including chronic skin diseases, infections, allergies, autoimmune disorders, and skin cancers. We offer a patient-centered approach with evidence-based care in a compassionate setting.",
        contentAr:
          "يضم القسم أطباء جلدية معتمدين يتعاملون مع مجموعة واسعة من الحالات مثل الأمراض الجلدية المزمنة، والالتهابات الجلدية، والحساسية، واضطرابات المناعة، وسرطانات الجلد، مع اعتماد نهج علاجي يتمحور حول المريض وبأسس علمية دقيقة ضمن بيئة علاجية إنسانية.",
      },
      {
        title: "Specialized Services Include:",
        titleAr: "الخدمات المتخصصة تشمل:",
        items: [
          "Botox and Dermal Fillers: For rejuvenation",
          "Chemical Peels: Skin renewal",
          "PRP Therapy: Skin rejuvenation and hair loss",
          "Laser Treatments: Hair removal, skin rejuvenation, scars, tattoos, body contouring",
          "Dermapen & Dermaroller: Acne scars and revitalization",
          "Skin Cancer Care: Screening, diagnosis, and treatment",
          "Electrocautery & Cryotherapy: For benign growths and lesions",
          "Dermoscopy and Skin Biopsies: Accurate Diagnoses",
        ],
        itemsAr: [
          "حقن البوتوكس والفيلر لتجديد مظهر البشرة",
          "التقشير الكيميائي لتجديد وتحسين الجلد",
          "العلاج بالبلازما الغنية بالصفائح الدموية لتجديد البشرة وعلاج تساقط الشعر",
          "العلاجات بالليزر لإزالة الشعر وتجديد البشرة وعلاج الندبات وإزالة الوشم ونحت الجسم",
          "الديرمابن والديرما رولر لعلاج ندبات حب الشباب وتحسين نضارة البشرة",
          "رعاية وعلاج سرطان الجلد من خلال الفحص والتشخيص والعلاج",
          "الكي الكهربائي والعلاج بالتجميد لإزالة الزوائد الجلدية الحميدة",
          "تنظير الجلد وأخذ الخزعات الجلدية للحصول على تشخيص دقيق للحالات الجلدية",
        ],
      },
    ],
  },
  {
    slug: "ent",
    name: "ENT (Ear, Nose & Throat)",
    nameAr: "الأنف والأذن والحنجرة",
    intro:
      "At Royale Hayat Hospital, our ENT Department provides expert care for conditions affecting the ear, nose, throat, head, and neck. We offer both medical and surgical expertise for all ages, utilizing the latest technologies for precise diagnosis and optimal outcomes.",
    introAr:
      "في مستشفى رويال حياة، يقدم قسم الأنف والأذن والحنجرة رعاية طبية متخصصة لمختلف الحالات التي تصيب الأذن والأنف والحنجرة والرأس والرقبة، مع توفير خبرات طبية وجراحية متكاملة لجميع الفئات العمرية، وباستخدام أحدث التقنيات لضمان دقة التشخيص وأفضل النتائج العلاجية.",
    sections: [
      {
        title: "Our Services Include:",
        titleAr: "تشمل خدمات القسم:",
        items: [
          "Otolaryngology for all ages",
          "Otology/Neurotology: Hearing and balance disorders",
          "Head and Neck Surgery",
          "Rhinology: Nasal and sinus care",
          "Sleep and Snoring Disorders",
          "General ENT Care",
        ],
        itemsAr: [
          "طب الأنف والأذن والحنجرة لجميع الفئات العمرية",
          "أمراض الأذن والسمع والتوازن",
          "جراحة الرأس والرقبة",
          "أمراض الأنف والجيوب الأنفية",
          "اضطرابات النوم والشخير",
          "الرعاية العامة لأمراض الأنف والأذن والحنجرة",
        ],
      },
      {
        title: "Advanced Procedures:",
        titleAr: "الإجراءات المتقدمة:",
        items: [
          "Rigid Scope Examination",
          "Tympanometry (Middle Ear Testing)",
          "Tonsillectomy, Adenoidectomy, Ear Tube Insertion",
          "Functional Endoscopic Sinus Surgery (FESS)",
          "Nasal Endoscopy & Biopsy",
          "Micro Laryngeal Surgery",
          "Tympanoplasty & Stapedectomy",
          "Diagnosis and Management of Vertigo",
          "Treatment of Snoring and Sleep Apnea",
          "Coblation Surgery for Snoring and Allergic Rhinitis",
        ],
        itemsAr: [
          "فحص المنظار الصلب",
          "اختبار طبلة الأذن ووظائف الأذن الوسطى",
          "استئصال اللوزتين واللحمية وتركيب أنابيب الأذن",
          "جراحة الجيوب الأنفية بالمنظار الوظيفي",
          "تنظير الأنف وأخذ العينات النسيجية",
          "جراحة الحنجرة الميكروسكوبية",
          "ترميم طبلة الأذن وجراحة عظيمات الأذن",
          "تشخيص وعلاج الدوخة والدوار",
          "علاج الشخير وانقطاع التنفس أثناء النوم",
          "جراحة الكوبليشن لعلاج الشخير والحساسية الأنفية",
        ],
      },
    ],
  },
  {
    slug: "family-medicine",
    name: "Family Medicine",
    nameAr: "طب العائلة",
    intro:
      "At Royale Hayat Hospital, our Family Clinic offers continuous, personalized care for individuals and families of all ages. Our Family Medicine Physicians coordinate all aspects of your health journey with expertise and compassion.",
    introAr:
      "في مستشفى رويال حياة، تقدم عيادة طب العائلة رعاية صحية متكاملة ومستمرة للأفراد والعائلات من جميع الأعمار، من خلال نهج يقوم على المتابعة الشخصية والتنسيق الشامل لكل جوانب الرعاية الصحية.",
    sections: [
      {
        title: "Why Choose Our Family Clinic?",
        titleAr: "لماذا تختار عيادة طب الأسرة:",
        items: [
          "One Point of Contact: Your dedicated physician manages your care, including specialist referrals and medication management",
          "Whole-Family Care: From children to seniors, we provide preventive care, routine check-ups, and chronic disease management",
          "Coordinated Care: Enjoy a seamless health journey with a coordinated plan, avoiding unnecessary treatments and ensuring timely follow-ups",
          "Health Maintenance & Prevention: Focus on disease prevention and wellness through lifestyle counselling, screenings, and education",
          "Guidance & Support: Your physician evaluates and guides you to the appropriate care, saving time and reducing stress",
        ],
        itemsAr: [
          "نقطة اتصال واحدة حيث يتولى طبيبك الخاص إدارة جميع جوانب رعايتك الصحية بما في ذلك الإحالات إلى التخصصات الأخرى وإدارة الأدوية",
          "رعاية شاملة للعائلة من الأطفال إلى كبار السن مع التركيز على الوقاية والفحوصات الدورية وإدارة الأمراض المزمنة",
          "رعاية منسقة عبر خطة صحية متكاملة تقلل من الإجراءات غير الضرورية وتضمن متابعة دقيقة وفي الوقت المناسب",
          "الوقاية والمحافظة على الصحة من خلال التوعية الصحية والفحوصات الدورية وتعديل نمط الحياة",
          "التوجيه والدعم حيث يقوم الطبيب بتقييم الحالة وإرشاد المريض إلى المسار العلاجي الأنسب لتوفير الوقت وتقليل التوتر",
        ],
      },
      {
        title: "Our Services Include:",
        titleAr: "تشمل خدمات القسم:",
        items: [
          "Preventive Care and Screenings",
          "Chronic Condition Management (e.g., Diabetes, Hypertension)",
          "Acute Illness and Injury Treatment",
          "Immunizations and Vaccinations",
          "Pediatric and Geriatric Care",
          "Women's and Men's Health",
          "Lifestyle and Nutritional Counselling",
          "Mental Health Support",
          "Coordination with Specialty Services",
        ],
        itemsAr: [
          "الرعاية الوقائية والفحوصات الدورية",
          "إدارة الأمراض المزمنة مثل السكري وارتفاع ضغط الدم",
          "علاج الأمراض الحادة والإصابات البسيطة",
          "التطعيمات واللقاحات",
          "رعاية الأطفال وكبار السن",
          "صحة المرأة وصحة الرجل",
          "الإرشاد الغذائي ونمط الحياة الصحي",
          "دعم الصحة النفسية",
          "التنسيق مع التخصصات الطبية الأخرى",
        ],
      },
    ],
  },
  {
    slug: "dental-clinic",
    name: "Dental Clinic",
    nameAr: "طب الأسنان",
    intro:
      "At Royale Hayat Hospital, our Dental Clinic offers exceptional dental care in a luxurious setting. Our specialized dentists use advanced technology to deliver personalized treatments for all ages, ensuring a seamless, pain-free experience.",
    introAr:
      "في مستشفى رويال حياة، يقدم عيادة الأسنان رعاية متكاملة ومتميزة ضمن بيئة علاجية راقية، بإشراف نخبة من أطباء الأسنان المتخصصين الذين يستخدمون أحدث التقنيات لتقديم علاجات مخصصة لجميع الفئات العمرية، مع ضمان تجربة علاجية مريحة وخالية من الألم.",
    sections: [
      {
        title: "Our Dental Services Include:",
        titleAr: "تشمل خدمات طب الأسنان:",
        items: [
          "Pediatric Dentistry: Gentle, child-friendly care",
          "Cosmetic Dentistry: Lumineers, veneers, and aesthetic crowns",
          "Crowns & Bridges: Durable restorations for damaged teeth",
          "Teeth Whitening: Professional treatments for a radiant smile",
          "Oral Surgery: Expert procedures, including extractions",
          "Periodontology: Gum disease diagnosis and treatment",
          "Implantology: Advanced dental implants for tooth replacement",
          "Orthodontics: Braces and aligners for straightening",
          "Restorative Dentistry: Repair of decayed or damaged teeth",
          "Endodontics: Precision root canal treatments",
          "Oral Hygiene & Prophylaxis: Comprehensive cleaning and preventive care",
        ],
        itemsAr: [
          "طب أسنان الأطفال مع رعاية لطيفة ومناسبة للأطفال",
          "طب الأسنان التجميلي مثل اللومينيرز والفينير والتيجان التجميلية",
          "التيجان والجسور لتعويض الأسنان التالفة واستعادة وظيفتها",
          "تبييض الأسنان للحصول على ابتسامة أكثر إشراقًا",
          "جراحة الفم وخلع الأسنان والإجراءات الجراحية المتخصصة",
          "أمراض اللثة وتشخيصها وعلاجها",
          "زراعة الأسنان لتعويض الأسنان المفقودة بطرق متقدمة",
          "تقويم الأسنان باستخدام التقويم التقليدي أو الشفاف",
          "طب الأسنان الترميمي لإصلاح الأسنان المتضررة أو المتسوسة",
          "علاج جذور الأسنان بدقة عالية للحفاظ على الأسنان الطبيعية",
          "تنظيف الأسنان والوقاية الشاملة للحفاظ على صحة الفم والأسنان",
        ],
      },
    ],
  },
  {
    slug: "pain-management",
    name: "Pain Management",
    nameAr: "علاج الألم",
    intro:
      "At Royale Hayat Hospital, our Pain Management Unit enhances the quality of life for those with acute or chronic pain. Our comprehensive program offers advanced, compassionate care to help patients regain comfort and functionality.",
    introAr:
      "في مستشفى رويال حياة، تهدف وحدة علاج الألم إلى تحسين جودة حياة المرضى الذين يعانون من الألم الحاد أو المزمن، من خلال تقديم رعاية متقدمة وشاملة تجمع بين الخبرة الطبية والنهج الإنساني، لمساعدة المرضى على استعادة الراحة والقدرة الوظيفية.",
    sections: [
      {
        title: "Our Multidisciplinary Team",
        titleAr: "فريق متعدد التخصصات:",
        content:
          "Comprising board-certified anesthesiologists, internal medicine specialists, and physical therapists, supported by expert psychologists, we provide both outpatient and inpatient consultations tailored to individual needs.",
        contentAr:
          "يضم القسم نخبة من أطباء التخدير المعتمدين، وأطباء الطب الباطني، وأخصائيي العلاج الطبيعي، بالإضافة إلى دعم متخصص من الأخصائيين النفسيين، حيث يتم تقديم استشارات علاجية داخل العيادات الخارجية أو ضمن التنويم حسب احتياج كل حالة بشكل فردي.",
      },
      {
        title: "Our Services Include:",
        titleAr: "تشمل الخدمات:",
        items: [
          "Epidural Anesthesia: For labor and delivery comfort",
          "Regional Anesthesia: For surgical procedures, including spinal and epidural options",
          "General Anesthesia: When required for medical or surgical interventions",
          "Chronic Pain Management: Addressing headache, facial pain, neck and back pain, neuropathic pain, joint and rheumatic pain, post-operative pain, and sports injuries",
        ],
        itemsAr: [
          "التخدير فوق الجافية لتخفيف الألم أثناء الولادة",
          "التخدير الإقليمي مثل التخدير النصفي وفوق الجافية للإجراءات الجراحية",
          "التخدير العام عند الحاجة للتدخلات الطبية أو الجراحية",
          "علاج الألم المزمن بما يشمل الصداع وآلام الوجه والرقبة والظهر وآلام الأعصاب وآلام المفاصل والروماتيزم وآلام ما بعد العمليات والإصابات الرياضية",
        ],
      },
    ],
  },
  {
    slug: "anesthesia",
    name: "Anesthesia",
    nameAr: "التخدير",
    intro:
      "At Royale Hayat Hospital, our Anesthesia Department ensures patient safety and comfort for all surgical and childbirth procedures. We deliver top-tier anesthesia services using the latest techniques and technologies.",
    introAr:
      "في مستشفى رويال حياة، يضمن قسم التخدير أعلى مستويات الأمان والراحة للمرضى خلال جميع العمليات الجراحية وعمليات الولادة، من خلال تقديم خدمات تخدير متقدمة باستخدام أحدث التقنيات الطبية.",
    sections: [
      {
        title: "Our Commitment",
        titleAr: "التزامنا:",
        content:
          "Safety is our priority. We use advanced methods - including general, local, conscious sedation, and regional anesthesia - tailored to each individual. Precise dosage control with brainwave monitoring ensures optimal safety.\n\nOur experienced anesthesiologists provide care for patients of all ages and conditions, ensuring a safe and comfortable experience for surgeries and childbirth.",
        contentAr:
          "سلامة المريض هي أولويتنا القصوى، حيث نستخدم أساليب تخدير متطورة تشمل التخدير العام والتخدير الموضعي والتخدير الإقليمي والتخدير المهدئ الواعي، ويتم اختيار الطريقة الأنسب لكل حالة بشكل فردي مع التحكم الدقيق بالجرعات باستخدام مراقبة نشاط الدماغ لضمان أعلى درجات الأمان.\n\nيقدم فريق أطباء التخدير ذوي الخبرة رعاية متكاملة للمرضى من جميع الأعمار والحالات الصحية، لضمان تجربة آمنة ومريحة أثناء العمليات الجراحية والولادة.",
      },
      {
        title: "Key Services Include:",
        titleAr: "تشمل الخدمات:",
        items: [
          "General Anesthesia",
          "Local and Regional Anesthesia (spinal and epidural)",
          "Conscious Sedation",
          "Advanced Brainwave Monitoring",
          "Anesthesia for High-Risk Patients",
          "Pain Relief During Labor and Childbirth",
          "Preoperative Evaluation and Postoperative Recovery",
        ],
        itemsAr: [
          "التخدير العام",
          "التخدير الموضعي والإقليمي مثل التخدير النصفي وفوق الجافية",
          "التخدير المهدئ الواعي",
          "المراقبة المتقدمة لنشاط الدماغ",
          "التخدير للحالات عالية الخطورة",
          "تسكين الألم أثناء الولادة",
          "التقييم قبل العمليات الجراحية والمتابعة بعد العمليات",
        ],
      },
    ],
  },
  {
    slug: "intensive-care",
    name: "Intensive Care",
    nameAr: "العناية المركزة",
    intro:
      "At Royale Hayat Hospital, our ICU offers round-the-clock monitoring and care for severe, life-threatening conditions with cutting-edge technology.",
    introAr:
      "في مستشفى رويال حياة، توفر وحدة العناية المركزة رعاية طبية متقدمة ومراقبة دقيقة على مدار الساعة للحالات الحرجة والمهددة للحياة، باستخدام أحدث التقنيات والأجهزة الطبية لضمان أعلى مستويات الرعاية والأمان.",
    sections: [
      {
        title: "Services Include:",
        titleAr: "تشمل الخدمات",
        items: [
          "Invasive catheter interventions",
          "Bronchoscopy for airway and lung management",
          "Treatment for serious conditions such as heart failure, severe hypertension, acute asthma attacks, stroke, hyperglycemia, acute bronchitis, and post-operative complications",
        ],
        itemsAr: [
          "التدخلات العلاجية بالقسطرة والأجهزة التداخلية",
          "منظار الشعب الهوائية لتشخيص وعلاج مشكلات الجهاز التنفسي والرئتين",
          "علاج الحالات الحرجة مثل قصور القلب وارتفاع ضغط الدم الحاد ونوبات الربو الحادة والسكتات الدماغية وارتفاع مستويات السكر الحاد والتهابات الشعب الهوائية الحادة ومضاعفات ما بعد العمليات الجراحية",
        ],
      },
    ],
  },
  {
    slug: "center-for-diagnostic-imaging",
    name: "Center for Diagnostic Imaging",
    nameAr: "الأشعة التشخيصية",
    intro:
      "At Royale Hayat Hospital, our Center for Diagnostic Imaging offers advanced diagnostic and image-guided therapeutic services. Combining expert professionals with state-of-the-art technology, we ensure accurate diagnoses and timely care.",
    introAr:
      "في مستشفى رويال حياة، يقدم مركز الأشعة التشخيصية خدمات متقدمة في التشخيص والتدخلات العلاجية الموجهة بالتصوير الطبي، من خلال الجمع بين الخبرات الطبية المتخصصة وأحدث التقنيات لضمان دقة التشخيص وسرعة تقديم الرعاية المناسبة.",
    sections: [
      {
        title: "Subspecialty Expertise:",
        titleAr: "خبرات دقيقة في التخصصات الفرعية",
        content: "Our Western-trained consultant radiologists provide comprehensive interpretations in:",
        contentAr:
          "يضم المركز نخبة من استشاريي الأشعة المؤهلين والمدربين وفق أعلى المعايير العالمية، لتقديم تقارير وتشخيصات دقيقة في مختلف التخصصات، وتشمل:",
        items: [
          "Abdominal & Women's Imaging",
          "Breast Imaging",
          "Cardiovascular & Thoracic Imaging",
          "Musculoskeletal Imaging",
          "Neuroradiology, Head & Neck Imaging",
          "Pediatric Imaging",
          "Vascular & Interventional Radiology",
        ],
        itemsAr: [
          "أشعة البطن وتصوير المرأة",
          "تصوير الثدي",
          "أشعة القلب والصدر",
          "أشعة الجهاز العضلي والهيكلي",
          "الأشعة العصبية وتصوير الرأس والرقبة",
          "التصوير التشخيصي للأطفال",
          "الأشعة التداخلية والأوعية الدموية",
        ],
      },
      {
        title: "Advanced Imaging Technology:",
        titleAr: "أحدث تقنيات التصوير الطبي",
        content: "Equipped with cutting-edge systems for high-resolution imaging:",
        contentAr: "يضم المركز أنظمة تصوير متطورة توفر صورًا عالية الدقة لدعم التشخيص والعلاج، وتشمل:",
        items: [
          "MRI (Magnetic Resonance Imaging)",
          "CT (Computerized Tomography)",
          "Fluoroscopy",
          "4D Ultrasound & Color Doppler",
          "Bone Densitometry",
          "Full-Field Digital Mammography",
        ],
        itemsAr: [
          "التصوير بالرنين المغناطيسي",
          "التصوير المقطعي المحوسب",
          "التصوير بالأشعة المتحركة",
          "التصوير بالموجات فوق الصوتية رباعية الأبعاد والدوبلر الملون",
          "فحص كثافة العظام",
          "التصوير الرقمي الكامل للثدي",
        ],
      },
      {
        title: "International Collaboration:",
        titleAr: "تعاون دولي",
        content:
          "We partner with leading European universities and imaging centers for remote consultations and peer reviews, ensuring the highest diagnostic accuracy.",
        contentAr:
          "يتعاون المركز مع جامعات ومراكز أشعة رائدة في أوروبا لتقديم الاستشارات الطبية والمراجعات التشخيصية عن بُعد، بما يضمن أعلى مستويات الدقة والجودة في التشخيص الطبي.",
      },
    ],
    subDepartments: [
      {
        slug: "abdominal-womens-imaging",
        name: "The Abdominal & Women's Imaging",
        nameAr: "أشعة البطن وتصوير المرأة",
        intro:
          "At Royale Hayat Hospital, our Abdominal & Women's Imaging Unit excels in diagnosing and managing abdominal and pelvic conditions. Our multidisciplinary approach ensures precise diagnosis and optimized care in collaboration with specialists in gastroenterology, gynecology, surgery, urology, and oncology.",
        introAr:
          "في مستشفى رويال حياة، تتميز وحدة أشعة البطن وتصوير المرأة بتقديم خدمات تشخيصية متقدمة للحالات المتعلقة بالبطن والحوض، من خلال نهج طبي متكامل يضم التعاون بين تخصصات الجهاز الهضمي وأمراض النساء والجراحة والمسالك البولية والأورام، لضمان دقة التشخيص ووضع الخطط العلاجية المناسبة.",
        sections: [
          {
            title: "Comprehensive Diagnostics:",
            titleAr: "خدمات تشخيصية متكاملة",
            content:
              "We diagnose and support treatment planning for conditions affecting the liver, pancreas, kidneys, gallbladder, colon, adrenal glands, and reproductive organs.",
            contentAr:
              "تختص الوحدة بتشخيص ودعم الخطط العلاجية للحالات التي تؤثر على الكبد والبنكرياس والكلى والمرارة والقولون والغدد الكظرية والأعضاء التناسلية.",
          },
          {
            title: "Advanced Imaging Capabilities:",
            titleAr: "تقنيات تصوير متقدمة",
            content: "Our team utilizes state-of-the-art CT, MRI, and ultrasound technologies, offering:",
            contentAr:
              "يعتمد الفريق على أحدث تقنيات التصوير الطبي بالرنين المغناطيسي والتصوير المقطعي والموجات فوق الصوتية، وتشمل الخدمات:",
            items: ["Virtual Colonoscopy", "CT Angiography (CT Angio)", "CT Urography", "MR and CT Enterography for GI disorders"],
            itemsAr: [
              "تنظير القولون الافتراضي",
              "تصوير الأوعية الدموية بالتصوير المقطعي",
              "تصوير الجهاز البولي بالتصوير المقطعي",
              "تصوير الأمعاء بالرنين المغناطيسي والتصوير المقطعي لتشخيص أمراض الجهاز الهضمي",
            ],
          },
          {
            title: "Interventional Expertise:",
            titleAr: "الإجراءات التداخلية",
            content: "We provide a range of image-guided interventions, including:",
            contentAr: "توفر الوحدة مجموعة من الإجراءات العلاجية الموجهة بالتصوير الطبي، وتشمل:",
            items: ["Ultrasound and CT-guided biopsies", "Abscess drainage", "Interventional pain management"],
            itemsAr: [
              "أخذ الخزعات باستخدام التوجيه بالموجات فوق الصوتية أو التصوير المقطعي",
              "تصريف الخراجات والسوائل المتجمعة",
              "الإجراءات التداخلية لعلاج الألم",
            ],
          },
        ],
      },
      {
        slug: "breast-imaging",
        name: "The Breast Imaging",
        nameAr: "تصوير الثدي",
        intro:
          "At Royale Hayat Hospital, our Breast Imaging Unit offers advanced, patient-centered diagnostic and interventional services. We provide high-quality breast cancer screenings and a comprehensive range of tools to detect and treat breast conditions.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة تصوير الثدي خدمات تشخيصية وتداخلية متقدمة ترتكز على راحة المريضة ودقة التشخيص، مع توفير برامج متطورة للكشف المبكر عن سرطان الثدي ومجموعة شاملة من التقنيات لتشخيص وعلاج مختلف حالات الثدي.",
        sections: [
          {
            title: "Our Services Include:",
            titleAr: "تشمل الخدمات:",
            items: [
              "Full Field Digital Mammography (FFDM): High-resolution imaging",
              "Ductography: Evaluates nipple discharge and ductal abnormalities",
              "Breast Ultrasound: Ideal for dense tissue evaluation and guided procedures",
              "MR DWI and Spectroscopy: Detailed tissue evaluation",
              "Image-Guided Needle Biopsies: Using ultrasound, MRI, and stereotactic techniques",
              "Preoperative Wire Localization: Precisely pinpoints small lesions for minimal-impact removal",
            ],
            itemsAr: [
              "التصوير الرقمي الكامل للثدي عالي الدقة",
              "تصوير القنوات اللبنية لتقييم إفرازات الحلمة واضطرابات القنوات",
              "التصوير بالموجات فوق الصوتية للثدي خاصة للأنسجة الكثيفة والإجراءات الموجهة",
              "التصوير بالرنين المغناطيسي المتقدم لتقييم دقيق للأنسجة",
              "الخزعات الموجهة بالتصوير باستخدام الموجات فوق الصوتية، الرنين المغناطيسي، التوجيه التجسيمي",
              "تحديد موضع الآفات قبل الجراحة بدقة لتسهيل الاستئصال المحدود والحفاظ على الأنسجة",
            ],
          },
          {
            title: "Advanced Technology:",
            titleAr: "تقنيات متقدمة",
            content:
              "We utilize AI-driven Computer-Aided Diagnosis (CAD) software to enhance detection and improve diagnostic accuracy.\n\nOur specialists collaborate with surgeons, oncologists, and other providers to ensure coordinated, personalized care.",
            contentAr:
              "تعتمد الوحدة على أنظمة ذكية مدعومة بالذكاء الاصطناعي للمساعدة في التشخيص وتعزيز دقة اكتشاف الحالات المرضية.\n\nكما يعمل أخصائيو الوحدة بالتعاون مع الجراحين وأطباء الأورام ومختلف التخصصات الطبية لضمان رعاية متكاملة وخطة علاجية مخصصة لكل مريضة.",
          },
        ],
      },
      {
        slug: "cardiovascular-thoracic-imaging",
        name: "The Cardiovascular & Thoracic Imaging",
        nameAr: "أشعة القلب والصدر",
        intro:
          "At Royale Hayat Hospital, our Cardiovascular & Thoracic Imaging Unit provides advanced diagnostics for heart and thoracic conditions in adults and children. We specialize in coronary artery disease, heart conditions, valvular disorders, cardiomyopathies, and structural abnormalities.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة أشعة القلب والصدر خدمات تشخيصية متقدمة لأمراض القلب والصدر لدى البالغين والأطفال، مع تخصص دقيق في تشخيص أمراض الشرايين التاجية وأمراض صمامات القلب واعتلال عضلة القلب والتشوهات القلبية الخلقية والحالات المتعلقة بالصدر.",
        sections: [
          {
            title: "Conditions We Evaluate:",
            titleAr: "الحالات التي يتم تقييمها:",
            items: [
              "Chest pain and shortness of breath",
              "Coronary artery disease",
              "Valvular heart disease",
              "Cardiomyopathies",
              "Congenital heart disease",
              "Pulmonary, pleural, mediastinal, and chest wall diseases",
            ],
            itemsAr: [
              "آلام الصدر وضيق التنفس",
              "أمراض الشرايين التاجية",
              "أمراض صمامات القلب",
              "اعتلال عضلة القلب",
              "أمراض القلب الخلقية",
              "أمراض الرئة والغشاء البلوري والمنصف وجدار الصدر",
            ],
          },
          {
            title: "Advanced Technology:",
            titleAr: "تقنيات متقدمة",
            content: "We utilize state-of-the-art tools, including:",
            contentAr: "تعتمد الوحدة على أحدث تقنيات التصوير الطبي، وتشمل:",
            items: [
              "Cardiac MRI for detailed cardiac analysis",
              "128-slice CT scanner for precise imaging",
              "Low-radiation coronary CT angiography (CTA)",
              "CTA of the thoracic and abdominal aorta",
            ],
            itemsAr: [
              "التصوير بالرنين المغناطيسي للقلب لتحليل دقيق لوظائف القلب وتركيبته",
              "جهاز التصوير المقطعي المتطور بـ 128 شريحة للحصول على صور عالية الدقة",
              "تصوير الشرايين التاجية بالتصوير المقطعي بجرعات إشعاع منخفضة",
              "تصوير الشريان الأورطي الصدري والبطني بالتصوير المقطعي",
            ],
          },
          {
            title: "Services Offered:",
            titleAr: "الخدمات المقدمة",
            items: [
              "Chest X-rays, CT scans, and cardiac MRI",
              "Coronary CTA for low- to intermediate-risk patients",
              "Thoracic lesion biopsies",
              "Image-guided thoracic drainage",
            ],
            itemsAr: [
              "أشعة الصدر والتصوير المقطعي والتصوير بالرنين المغناطيسي للقلب",
              "تصوير الشرايين التاجية للمرضى ذوي الخطورة المنخفضة إلى المتوسطة",
              "أخذ خزعات من آفات الصدر باستخدام التوجيه بالأشعة",
              "تصريف السوائل والإجراءات التداخلية الموجهة بالتصوير لمنطقة الصدر",
            ],
          },
        ],
      },
      {
        slug: "musculoskeletal-imaging",
        name: "The Musculoskeletal Imaging",
        nameAr: "أشعة الجهاز العضلي والهيكلي",
        intro:
          "At Royale Hayat Hospital, our Musculoskeletal Imaging Unit offers advanced imaging services to diagnose and evaluate disorders of the bones, joints, spine, and soft tissues.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة أشعة الجهاز العضلي والهيكلي خدمات تصوير متقدمة لتشخيص وتقييم أمراض العظام والمفاصل والعمود الفقري والأنسجة الرخوة بدقة عالية.",
        sections: [
          {
            title: "Collaboration with Experts:",
            titleAr: "تعاون متعدد التخصصات",
            content:
              "Our skilled team collaborates with orthopedic surgeons, rheumatologists, and sports medicine specialists to provide precise diagnostic information for effective treatment planning.",
            contentAr:
              "يعمل فريق الوحدة بالتعاون مع أطباء جراحة العظام وأطباء الروماتيزم وطب الإصابات الرياضية لتوفير معلومات تشخيصية دقيقة تساعد في وضع الخطط العلاجية المناسبة لكل حالة.",
          },
          {
            title: "Conditions We Evaluate:",
            titleAr: "الحالات التي يتم تقييمها:",
            items: [
              "Spine, joint, and limb disorders",
              "Sports injuries and overuse syndromes",
              "Arthritis and inflammatory joint diseases",
              "Bone and soft tissue tumors",
              "Osteoporosis and metabolic bone diseases",
            ],
            itemsAr: [
              "أمراض العمود الفقري والمفاصل والأطراف",
              "الإصابات الرياضية وإصابات الإجهاد المتكرر",
              "التهاب المفاصل والأمراض الالتهابية للمفاصل",
              "أورام العظام والأنسجة الرخوة",
              "هشاشة العظام واضطرابات العظام الأيضية",
            ],
          },
          {
            title: "Advanced Imaging Services:",
            titleAr: "خدمات التصوير المتقدمة:",
            items: [
              "MRI: High-resolution imaging of joints, soft tissues, and spine",
              "CT Scan: 128-slice CT for detailed 3D reconstructions",
              "Musculoskeletal Ultrasound: Dynamic tendon and ligament evaluation",
              "Arthrography: Contrast-enhanced joint imaging",
              "Bone Mineral Density (DEXA) Scans: Osteoporosis assessment",
              "Sports Medicine Imaging: Targeted evaluation of athletic injuries",
            ],
            itemsAr: [
              "التصوير بالرنين المغناطيسي لتقييم المفاصل والأنسجة الرخوة والعمود الفقري بدقة عالية",
              "التصوير المقطعي المتطور بـ 128 شريحة لإعادة بناء الصور ثلاثية الأبعاد",
              "التصوير بالموجات فوق الصوتية لتقييم الأوتار والأربطة أثناء الحركة",
              "تصوير المفاصل بالصبغة للحصول على صور دقيقة للمفاصل",
              "فحص كثافة المعادن في العظام لتقييم هشاشة العظام",
              "تصوير الإصابات الرياضية لتقييم إصابات الرياضيين بدقة",
            ],
          },
          {
            title: "Interventional & Pain Management:",
            titleAr: "الإجراءات التداخلية وعلاج الألم",
            items: [
              "Image-guided bone and soft tissue biopsies",
              "Joint and spinal injections for pain relief",
              "Cyst aspiration and drainage",
            ],
            itemsAr: [
              "أخذ خزعات من العظام والأنسجة الرخوة باستخدام التوجيه بالأشعة",
              "حقن المفاصل والعمود الفقري لتخفيف الألم",
              "سحب وتصريف الأكياس والتجمعات السائلة",
            ],
          },
        ],
      },
      {
        slug: "neuroradiology-head-neck-imaging",
        name: "The Neuroradiology and Head & Neck Imaging",
        nameAr: "الأشعة العصبية وتصوير الرأس والرقبة",
        intro:
          "At Royale Hayat Hospital, our Neuroradiology and Head & Neck Imaging Unit provides accurate diagnosis for neurological and ENT-related conditions using cutting-edge technologies.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة الأشعة العصبية وتصوير الرأس والرقبة خدمات تشخيصية دقيقة للحالات العصبية وحالات الأنف والأذن والحنجرة باستخدام أحدث تقنيات التصوير الطبي لضمان أعلى مستويات الدقة في التشخيص.",
        sections: [
          {
            title: "Specialized Evaluations:",
            titleAr: "التقييمات المتخصصة",
            items: [
              "Stroke and cerebrovascular disease",
              "Brain and spinal tumors",
              "Epilepsy and seizure disorders",
              "Multiple sclerosis",
              "Congenital brain anomalies",
              "Pituitary gland disorders",
              "ENT pathologies",
            ],
            itemsAr: [
              "السكتات الدماغية وأمراض الأوعية الدماغية",
              "أورام الدماغ والحبل الشوكي",
              "اضطرابات الصرع والنوبات",
              "التصلب المتعدد",
              "التشوهات الخلقية في الدماغ",
              "اضطرابات الغدة النخامية",
              "أمراض الأنف والأذن والحنجرة",
            ],
          },
          {
            title: "Advanced Imaging Techniques:",
            titleAr: "تقنيات التصوير المتقدمة",
            content: "Our expert neuroradiologists utilize:",
            contentAr: "يعتمد فريق أخصائيي الأشعة العصبية لدينا على:",
            items: [
              "Diffusion Weighted Imaging (DWI): Early stroke detection",
              "Susceptibility Weighted Imaging (SWI): Detects microbleeds and calcifications",
              "Magnetic Resonance Spectroscopy (MRS): Evaluates brain metabolism",
              "Functional MRI (fMRI): Pre-surgical brain mapping",
              "MR and CT Angiography: Assesses cerebral and neck vessels",
              "Spine MRI & CT: Detailed spinal evaluation",
            ],
            itemsAr: [
              "التصوير بالانتشار لتشخيص السكتات الدماغية المبكرة",
              "التصوير بالوزن المغناطيسي الحساسية يكشف عن النزيفات الدقيقة والتكلسات",
              "مطيافية الرنين المغناطيسي لتقييم نشاط الدماغ الأيضي",
              "التصوير بالرنين المغناطيسي الوظيفي لتخطيط الدماغ قبل العمليات الجراحية",
              "تصوير الأوعية الدموية بالرنين المغناطيسي والتصوير المقطعي للأوعية الدماغية والرقبة",
              "التصوير بالرنين المغناطيسي والمقطعي المحوري للعمود الفقري",
            ],
          },
          {
            title: "Vascular & Ultrasound Capabilities:",
            titleAr: "تقنيات الأوعية الدموية والموجات فوق الصوتية",
            items: [
              "Color Doppler Ultrasound: Detects plaques and assesses stroke risk",
              "Transcranial Doppler: Non-invasive intracranial blood flow assessment",
            ],
            itemsAr: [
              "دوبلر الألوان للكشف عن التصلب وتقييم خطر السكتة الدماغية",
              "دوبلر عبر الجمجمة لتقييم تدفق الدم داخل الدماغ بطريقة غير جراحية",
            ],
          },
          {
            title: "Specialized Focus:",
            titleAr: "مجالات متخصصة",
            items: [
              "Pituitary Gland Imaging: MRI for detecting microadenomas",
              "High-Resolution ENT Imaging: z-UHR CT technology for detailed evaluation",
            ],
            itemsAr: [
              "تصوير الغدة النخامية بالرنين المغناطيسي للكشف عن الأورام الدقيقة",
              "تصوير عالي الدقة للأنف والأذن والحنجرة باستخدام تقنية الأشعة المتقدمة عالية الوضوح",
            ],
          },
        ],
      },
      {
        slug: "pediatric-imaging",
        name: "The Pediatric Imaging",
        nameAr: "التصوير التشخيصي للأطفال",
        intro:
          "At Royale Hayat Hospital, our Pediatric Imaging Unit caters to the unique diagnostic needs of infants, children, and adolescents. We offer a full range of imaging services, from basic radiography to advanced modalities, ensuring safe and accurate diagnoses.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة تصوير الأطفال خدمات تشخيصية متكاملة تلبي الاحتياجات الخاصة للرضع والأطفال والمراهقين، مع توفير جميع تقنيات التصوير الطبي من الفحوصات الأساسية إلى التقنيات المتقدمة، لضمان تشخيص دقيق وآمن.",
        sections: [
          {
            title: "Services Offered:",
            titleAr: "الخدمات المقدمة",
            items: [
              "X-ray (Radiography)",
              "Ultrasound",
              "CT (Computed Tomography)",
              "MRI & Fetal MRI",
              "Fluoroscopy",
              "Imaging-guided interventional procedures",
            ],
            itemsAr: [
              "الأشعة السينية",
              "الموجات فوق الصوتية",
              "التصوير المقطعي",
              "التصوير بالرنين المغناطيسي وتصوير الجنين بالرنين المغناطيسي",
              "تصوير الأشعة المتحركة",
              "الإجراءات التداخلية الموجهة بالتصوير",
            ],
          },
          {
            title: "Pediatric MRI with Sedation:",
            titleAr: "التصوير بالرنين المغناطيسي للأطفال مع التخدير",
            content:
              "We proudly offer the region's first dedicated pediatric MRI unit, supported by pediatric anesthesiologists. This child-focused setup ensures a safe, comfortable environment, especially for young or anxious children needing sedation.",
            contentAr:
              "توفر الوحدة خدمة متقدمة للتصوير بالرنين المغناطيسي للأطفال مع التخدير بإشراف أطباء تخدير متخصصين في طب الأطفال، ضمن بيئة آمنة ومريحة تراعي احتياجات الأطفال، خاصة الحالات التي تتطلب تهدئة أو تخدير لضمان جودة الفحص ودقته.",
          },
          {
            title: "Expertise in Pediatric Diseases:",
            titleAr: "التخصصات التشخيصية للأطفال",
            content: "Our specialized radiologists collaborate with pediatricians to diagnose:",
            contentAr: "تتعاون وحدة الأشعة مع أطباء الأطفال لتشخيص مجموعة واسعة من الحالات، بما في ذلك:",
            items: [
              "Congenital anomalies",
              "Infectious diseases",
              "Pediatric malignancies",
              "Trauma-related injuries",
            ],
            itemsAr: [
              "التشوهات الخلقية",
              "الأمراض المعدية",
              "الأورام عند الأطفال",
              "الإصابات الناتجة عن الحوادث",
            ],
          },
          {
            title: "Safety Comes First:",
            titleAr: "السلامة أولًا",
            content:
              "We use advanced low-dose imaging protocols with CARE Dose™ and CARE Vision™ technologies, reducing radiation exposure by up to 93%.",
            contentAr:
              "تعتمد الوحدة على تقنيات تصوير متقدمة منخفضة الجرعة لتقليل التعرض للإشعاع بشكل كبير بنسبة ٩٣٪، مع الالتزام بأعلى معايير السلامة لضمان حماية الأطفال أثناء جميع إجراءات التصوير الطبي.",
          },
        ],
      },
      {
        slug: "vascular-interventional-radiology",
        name: "The Vascular & Interventional Radiology",
        nameAr: "الأشعة التداخلية والأوعية الدموية",
        intro:
          "At Royale Hayat Hospital, our Vascular & Interventional Radiology Unit offers cutting-edge, minimally invasive procedures to diagnose and treat various conditions, prioritizing patient safety, comfort, and rapid recovery.",
        introAr:
          "في مستشفى رويال حياة، تقدم وحدة الأشعة التداخلية والأوعية الدموية إجراءات طبية متقدمة قليلة التوغل لتشخيص وعلاج مختلف الحالات، مع التركيز على سلامة المريض وراحته وتسريع فترة التعافي.",
        sections: [
          {
            title: "What We Offer:",
            titleAr: "ما نقدمه",
            content: "Utilizing advanced imaging technologies like Fluoroscopy, CT, and Ultrasound, our expert team performs:",
            contentAr:
              "باستخدام تقنيات التصوير المتقدمة مثل الأشعة المتحركة والتصوير المقطعي والموجات فوق الصوتية، يقوم فريقنا المتخصص بإجراء مجموعة من الإجراءات الدقيقة، تشمل:",
            items: [
              "Uterine Fibroid Embolization",
              "Thrombectomy (Clot Removal)",
              "Abscess and Fluid Drainage",
              "Central Line and Catheter Placement",
              "Gastrointestinal & Genitourinary Interventions",
            ],
            itemsAr: [
              "قسطرة وحقن شرايين الأورام الليفية الرحمية",
              "إزالة الجلطات الدموية من الأوعية الدموية",
              "تصريف الخراجات والتجمعات السائلة",
              "تركيب القسطرة الوريدية المركزية والقسطرة الطبية",
              "إجراءات الجهاز الهضمي والجهاز البولي التناسلي التداخلية",
            ],
          },
          {
            title: "Integrated, Multidisciplinary Care:",
            titleAr: "رعاية متكاملة متعددة التخصصات",
            content:
              "Our interventional radiologists collaborate with other departments to provide comprehensive care from diagnosis to post-procedure follow-up, supported by nurse practitioners and clinical staff.",
            contentAr:
              "يعمل أطباء الأشعة التداخلية بالتعاون مع مختلف الأقسام الطبية لتقديم رعاية شاملة تبدأ من التشخيص وحتى المتابعة بعد الإجراء، مع دعم من طاقم التمريض والفريق السريري لضمان أفضل النتائج العلاجية.",
          },
          {
            title: "Technology-Driven Precision:",
            titleAr: "تقنيات دقيقة مدعومة بالتكنولوجيا",
            content: "We use the latest fusion imaging software for:",
            contentAr: "نعتمد على أحدث برامج الدمج والتوجيه بالتصوير لتحقيق:",
            items: [
              "Pinpoint targeting of diseased tissue",
              "Reduced procedure times",
              "Minimized discomfort and complications",
              "Enhanced treatment success",
            ],
            itemsAr: [
              "أعلى درجات الدقة في تحديد المناطق المصابة",
              "يساعد على تقليل وقت الإجراءات",
              "تقليل المضاعفات",
              "تحسين نسب النجاح",
            ],
          },
          {
            title: "Specialized Interventional Pain Management:",
            titleAr: "علاج الألم التداخلي المتخصص",
            content:
              "Our team excels in image-guided pain management, providing relief with real-time imaging for maximum effectiveness and minimal invasiveness.",
            contentAr:
              "يتميز الفريق بخبرة عالية في علاج الألم باستخدام التوجيه بالتصوير الطبي المباشر، لتوفير تسكين فعال للألم مع تدخل بسيط وأقل قدر من التدخل الجراحي.",
          },
        ],
      },
    ],
  },
  {
    slug: "laboratory-services",
    name: "Laboratory Services",
    nameAr: "الخدمات المخبرية",
    intro:
      "At Royale Hayat Hospital, our state-of-the-art Clinical Laboratory is essential for accurate diagnosis and personalized treatment, offering comprehensive services with some of the region's fastest turnaround times.",
    introAr:
      "في مستشفى رويال حياة، يُعد المختبر السريري المتطور عنصرًا أساسيًا في دقة التشخيص ووضع الخطط العلاجية المناسبة، حيث يوفر خدمات مخبرية شاملة وفق أعلى المعايير الطبية وبأوقات إنجاز تُعد من الأسرع على مستوى المنطقة.",
    sections: [
      {
        title: "Trusted Nationwide:",
        titleAr: "ثقة تمتد على مستوى الكويت",
        content:
          "We serve internal departments and external healthcare providers across Kuwait. As a national referral laboratory, we deliver trusted diagnostic insights backed by internationally recognized standards.",
        contentAr:
          "يقدم المختبر خدماته لجميع أقسام المستشفى إضافة إلى العديد من الجهات الصحية الخارجية في الكويت، بصفته مختبرًا مرجعيًا وطنيًا يعتمد عليه في تقديم نتائج وتشخيصات دقيقة وفق معايير عالمية معترف بها.",
        items: [
          "24/7 Operation: Around-the-clock urgent and routine testing",
          "Cutting-edge Equipment: Latest diagnostic technology",
          "Expert Team: Board-certified pathologists and skilled technologists",
          "CAP Accreditation: Excellence in lab quality and accuracy",
        ],
        itemsAr: [
          "تشغيل على مدار الساعة لتوفير الفحوصات العاجلة والدورية",
          "أحدث الأجهزة والتقنيات المخبرية المتقدمة",
          "فريق متخصص من أطباء المختبرات والاستشاريين والفنيين المؤهلين",
          "اعتماد عالمي للجودة والدقة في الخدمات المخبرية",
        ],
      },
      {
        title: "Our Laboratory Services Include:",
        titleAr: "تشمل خدمات المختبر",
        items: [
          "Blood Bank & Transfusion: Safe, efficient blood typing and support",
          "Chemical Pathology: Biochemical analysis for organ function and disease detection",
          "Cytology: Cell studies for cancer screening and disease diagnosis",
          "Histopathology: Tissue examination for precise diagnosis",
          "Hematology: Comprehensive blood testing for various disorders",
          "Immunology: Testing for immune-related and allergic conditions",
          "Microbiology: Detection of bacterial, viral, fungal, and parasitic infections",
        ],
        itemsAr: [
          "بنك الدم ونقل الدم لضمان توفير خدمات نقل الدم بأعلى درجات الأمان والكفاءة",
          "الكيمياء الحيوية لتحليل وظائف الأعضاء والكشف عن الأمراض",
          "علم الخلايا للكشف المبكر عن السرطان وتشخيص الأمراض",
          "فحص الأنسجة للتشخيص الدقيق للحالات المرضية",
          "أمراض الدم وإجراء التحاليل المتخصصة لمختلف اضطرابات الدم",
          "علم المناعة لتشخيص أمراض المناعة والحساسية",
          "علم الأحياء الدقيقة للكشف عن العدوى البكتيرية والفيروسية والفطرية والطفيليات",
        ],
      },
    ],
  },
  {
    slug: "royale-hayat-pharmacy",
    name: "Royale Hayat Pharmacy",
    nameAr: "صيدلية رويال حياة",
    intro:
      "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs. Our pharmacists collaborate closely with clinical and nursing teams to ensure the highest standard of pharmaceutical care.",
    introAr:
      "تقع صيدلية مستشفى رويال حياة في الطابق الأرضي، وتعمل على مدار الساعة بإشراف نخبة من الصيادلة المؤهلين لتقديم الاستشارات الدوائية والدعم المتخصص لجميع الاحتياجات العلاجية. كما يتعاون فريق الصيدلة بشكل وثيق مع الكوادر الطبية والتمريضية لضمان أعلى مستويات الرعاية الدوائية.",
    sections: [
      {
        title: "Serving the Community:",
        titleAr: "خدمة تمتد إلى المجتمع",
        content:
          "The Royale Pharmacy caters to both inpatients and the wider community, offering a comprehensive selection of over-the-counter products to support the well-being of patients, visitors, and families.",
        contentAr:
          "تخدم صيدلية رويال حياة المرضى المنومين والزوار والمجتمع بشكل عام، من خلال توفير مجموعة واسعة من الأدوية والمنتجات الصحية التي تدعم صحة المرضى وعائلاتهم ورفاهيتهم.",
      },
      {
        title: "Our Services:",
        titleAr: "تشمل الخدمات",
        items: [
          "Inpatient Prescriptions: Safe, timely medication dispensing for hospitalized patients",
          "Outpatient Prescriptions: Fulfilment of prescriptions for clinic visitors",
          "Medication Guidance: Expert drug information and personalized advice",
          "Usage Instructions: Clear, accurate advice on correct medication use",
          "Over-the-Counter Products: A wide variety of non-prescription medicines and health supplements",
          "Specialty Medications: Access to unique medications, including nutritional supplements and vitamins",
          "Discharge Counselling: Detailed medication guidance for patients at discharge",
          "Skincare & Wellness Products: Curated range of quality skincare and wellness items",
        ],
        itemsAr: [
          "صرف الأدوية للمرضى المنومين بدقة وسرعة وفق أعلى معايير السلامة",
          "صرف الوصفات الطبية لمرضى العيادات الخارجية",
          "تقديم الإرشادات الدوائية والاستشارات العلاجية المتخصصة",
          "توضيح الطريقة الصحيحة لاستخدام الأدوية ومواعيدها",
          "توفير مجموعة متنوعة من الأدوية والمنتجات الصحية التي لا تتطلب وصفة طبية",
          "توفير الأدوية المتخصصة والمكملات الغذائية والفيتامينات",
          "تقديم الإرشادات الدوائية للمرضى عند الخروج من المستشفى",
          "توفير منتجات العناية بالبشرة ومنتجات الصحة والعافية المختارة بعناية",
        ],
      },
    ],
  },
  {
    slug: "clinical-pharmacy",
    name: "Clinical Pharmacy",
    nameAr: "الصيدلة الإكلينيكية",
    intro:
      "At Royale Hayat Hospital, our Clinical Pharmacy team plays a vital role in ensuring safe, effective, and evidence-based medication practices, enhancing overall patient care.",
    introAr:
      "في مستشفى رويال حياة، يلعب فريق الصيدلة السريرية دورًا محوريًا في ضمان الاستخدام الآمن والفعال للأدوية وفق أحدث الممارسات الطبية المعتمدة، بما يسهم في تعزيز جودة الرعاية الصحية وتحقيق أفضل النتائج العلاجية للمرضى.",
    sections: [
      {
        title: "Our Approach:",
        titleAr: "نهجنا",
        content:
          "We utilize advanced tools and integrated electronic systems to deliver timely, efficient, and high-quality services.",
        contentAr:
          "نعتمد على أنظمة إلكترونية متطورة وأدوات تقنية حديثة لتقديم خدمات دوائية دقيقة وسريعة وعالية الجودة، بما يضمن كفاءة الرعاية وسلامة المرضى.",
      },
      {
        title: "Core Services:",
        titleAr: "تشمل الخدمات الأساسية",
        items: [
          "Pharmaceutical Care: Collaborating with healthcare providers for optimal outcomes",
          "Therapeutic Care Plans: Personalized medication plans tailored to clinical needs",
          "Medication Education: Comprehensive counselling to ensure understanding at discharge",
          "Multi-Disciplinary Approach: Coordination among specialties for holistic care",
          "Medication Reconciliation: Thorough review at admission and discharge to prevent errors",
          "Patient Medication History Review: Safe prescribing through past medication assessment",
          "Drug Review and Evaluation: Monitoring effectiveness and safety",
          "Follow-Up Care: Continued oversight of patient progress",
        ],
        itemsAr: [
          "الرعاية الدوائية من خلال التعاون مع الفريق الطبي لتحقيق أفضل النتائج العلاجية",
          "إعداد خطط علاجية دوائية مخصصة وفق الحالة السريرية لكل مريض",
          "تثقيف المرضى حول الأدوية وآلية استخدامها قبل الخروج من المستشفى",
          "نهج متعدد التخصصات يضمن التكامل والتنسيق بين مختلف الأقسام الطبية",
          "مراجعة الأدوية عند الدخول والخروج من المستشفى للحد من الأخطاء الدوائية",
          "مراجعة التاريخ الدوائي للمريض لضمان وصف العلاجات بشكل آمن",
          "تقييم ومتابعة فعالية الأدوية وسلامتها",
          "المتابعة المستمرة لتطور الحالة العلاجية للمريض",
        ],
      },
      {
        title: "Medication Therapy Management (MTM):",
        titleAr: "إدارة العلاج الدوائي",
        content: "Our MTM services aim to:",
        contentAr: "تهدف خدمات إدارة العلاج الدوائي إلى",
        items: [
          "Strengthen collaboration between pharmacists and healthcare professionals",
          "Improve communication with patients",
          "Empower patients in managing their medication therapy",
        ],
        itemsAr: [
          "تعزيز التعاون بين الصيادلة والمتخصصين في الرعاية الصحية",
          "تحسين التواصل مع المرضى",
          "تمكين المرضى من فهم وإدارة خططهم العلاجية بشكل أفضل",
        ],
      },
      {
        title: "Patient Engagement and Education:",
        titleAr: "تثقيف المرضى وتوعيتهم",
        content: "As part of MTM, patients are educated on:",
        contentAr: "يتم توعية المرضى حول",
        items: [
          "Purpose and necessity of each medication",
          "Medication names, strengths, and appearances",
          "Proper administration and timing",
          "Managing potential side effects",
          "Aware of drug interactions",
        ],
        itemsAr: [
          "أهمية ودور كل دواء ضمن الخطة العلاجية",
          "أسماء الأدوية وتركيزاتها وأشكالها المختلفة",
          "الطريقة الصحيحة لاستخدام الأدوية ومواعيدها",
          "كيفية التعامل مع الآثار الجانبية المحتملة",
          "التوعية بالتداخلات الدوائية المحتملة",
        ],
      },
    ],
  },
  {
    slug: "home-health",
    name: "Royale Home Health",
    nameAr: "رويال هوم هيلث للرعاية المنزلية",
    intro:
      "Royale Home Health is an exclusive extension of Royale Hayat Hospital, offering exceptional health and wellness support delivered directly to your home. Our services blend high-quality medical care with the signature luxury and hospitality that Royale Hayat is known for. Backed by a multi-disciplinary team of healthcare professionals, we provide personalized, compassionate, and expert care aligned with the highest international standards.",
    introAr:
      "تُعد خدمات الرعاية الصحية المنزلية في مستشفى رويال حياة امتدادًا حصريًا لخدمات المستشفى، حيث توفر رعاية صحية وعلاجية متكاملة داخل المنزل، تجمع بين الجودة الطبية العالية ومستوى الضيافة والرعاية الراقية التي تتميز بها رويال حياة. ويشرف على هذه الخدمات فريق متعدد التخصصات من الكوادر الطبية المؤهلة لتقديم رعاية شخصية وإنسانية وفق أعلى المعايير العالمية.",
    sections: [
      {
        title: "Rehabilitation Services",
        titleAr: "خدمات التأهيل والعلاج الطبيعي",
        content:
          "Our home-based rehabilitation programs are designed to restore health, enhance mobility, and improve quality of life across a range of conditions:",
        contentAr:
          "تم تصميم برامج التأهيل المنزلي للمساعدة في استعادة الصحة وتحسين الحركة وجودة الحياة لمختلف الحالات، وتشمل:",
        items: [
          "Women's health, wellness, and recovery",
          "Cardiac rehabilitation",
          "Stroke rehabilitation",
          "Back pain management",
          "Musculoskeletal and mobility issues",
          "Strength training and mobility optimization",
          "Therapeutic massage",
          "Pediatric rehabilitation",
        ],
        itemsAr: [
          "صحة المرأة والتعافي بعد الولادة",
          "التأهيل القلبي",
          "التأهيل بعد الجلطات والسكتات الدماغية",
          "علاج آلام الظهر",
          "مشكلات الجهاز العضلي والحركي",
          "تقوية العضلات وتحسين الحركة",
          "العلاج بالتدليك العلاجي",
          "تأهيل الأطفال",
        ],
      },
      {
        title: "Specialized Nursing Services",
        titleAr: "خدمات التمريض المتخصصة",
        content:
          "Our specialized nursing team offers comprehensive medical services in the comfort of your home, including:",
        contentAr: "يقدم فريق التمريض خدمات طبية متكاملة داخل المنزل تشمل:",
        subsections: [
          {
            title: "Short-Term Visits",
            titleAr: "الزيارات قصيرة المدى",
            items: [
              "Injections and IVF-related care",
              "IV therapy (fluid replacement, antibiotics)",
              "Wound care and dressing changes",
              "Drain checks and blood draws",
              "Post-natal care",
              "Pain management and palliative care",
              "Urinary catheterization",
              "Electrocardiography (ECG)",
              "Cardiotocography (CTG)",
              "Enteral and parenteral feeding",
              "Ostomy care",
              "Nebulization",
              "Blood sugar and vital signs monitoring",
            ],
            itemsAr: [
              "الحقن والرعاية المتعلقة بعلاجات الإخصاب",
              "العلاج الوريدي مثل تعويض السوائل والمضادات الحيوية",
              "العناية بالجروح وتغيير الضمادات",
              "متابعة الأنابيب الطبية وسحب عينات الدم",
              "الرعاية بعد الولادة",
              "إدارة الألم والرعاية التلطيفية",
              "تركيب القسطرة البولية",
              "تخطيط القلب",
              "تخطيط نبضات الجنين وتقلصات الرحم",
              "التغذية المعوية والوريدية",
              "العناية بفتحات الإخراج الجراحية",
              "العلاج بجهاز البخار",
              "متابعة مستوى السكر والعلامات الحيوية",
            ],
          },
          {
            title: "Long-Term Visits (24/7 Care)",
            titleAr: "الزيارات طويلة المدى والرعاية على مدار الساعة",
            items: ["Baby care and newborn monitoring", "Senior (geriatric) care"],
            itemsAr: ["رعاية الأطفال وحديثي الولادة", "رعاية كبار السن"],
          },
        ],
      },
    ],
  },
  {
    slug: "al-safwa-healthcare",
    name: "Al Safwa HealthCare",
    nameAr: "برنامج الصفوة للرعاية الصحية",
    intro:
      "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle. Our team will craft a customized care plan just for you.",
    introAr:
      "في مستشفى رويال حياة، يتيح برنامج الصفوة للرعاية الصحية تجربة متكاملة لإدارة صحتك بكل سهولة وخصوصية، من خلال برنامج شخصي مصمم وفق احتياجاتك الصحية ونمط حياتك. ويمكن الانضمام إلى البرنامج عبر استكمال نموذج تسجيل مبسط يتضمن نبذة عن التاريخ الطبي ونمط الحياة، ليقوم فريقنا بعد ذلك بإعداد خطة رعاية مخصصة لك.",
    sections: [
      {
        title: "Elite Medical Care",
        titleAr: "رعاية طبية بمعايير استثنائية",
        content:
          "The Al Safwa Program offers elite medical care designed to fit seamlessly into your busy lifestyle, prioritizing both health and luxury. Our customized care plans are tailored to your unique medical profile and goals.",
        contentAr:
          "يوفر برنامج الصفوة رعاية طبية راقية صممت لتواكب أسلوب الحياة العصري المزدحم، مع التركيز على الجمع بين الجودة الطبية العالية والراحة والخصوصية. كما يتم إعداد خطط الرعاية الصحية بما يتناسب مع الحالة الطبية والأهداف الصحية لكل مشترك بشكل فردي.",
      },
    ],
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    nameAr: "العلاج الطبيعي",
    intro:
      "We offer advanced physiotherapy treatments tailored to support women's health throughout life. We collaborate with other departments for comprehensive recovery and rehabilitation.",
    introAr:
      "في مستشفى رويال حياة، نقدم خدمات علاج طبيعي متقدمة مصممة لدعم صحة المرأة في مختلف مراحل الحياة، مع التعاون المستمر بين الأقسام الطبية المختلفة لضمان رعاية متكاملة وخطط علاجية فعالة للتعافي وإعادة التأهيل.",
    sections: [
      {
        title: "Comprehensive Rehabilitation Services",
        titleAr: "خدمات إعادة التأهيل المتكاملة",
        content:
          "Our team of specialized physical therapists provides expert care for a wide range of conditions, ensuring a safe and effective recovery process.",
        contentAr:
          "يضم القسم فريقًا متخصصًا من أخصائيي العلاج الطبيعي ذوي الخبرة في التعامل مع مجموعة واسعة من الحالات، مع التركيز على تقديم رعاية آمنة وفعالة تساعد المرضى على استعادة الحركة وتحسين جودة الحياة.",
      },
      {
        title: "Our Services Include:",
        titleAr: "خدماتنا تشمل",
        items: [
          "Urogynecological Disorders Management: Specialized treatment for pelvic health and related conditions.",
          "Pre and Postnatal Care: Physiotherapy support for safe delivery and enhanced postpartum recovery",
          "Pregnancy-Related Discomfort Relief: Expert management of back pain and muscle weakness during pregnancy",
          "Musculoskeletal Management: Care for osteoarthritis, spinal injuries, and joint pain",
          "Pulmonary Physiotherapy: Breathing therapy and respiratory support",
          "Post-Surgical Rehabilitation: Specialized recovery care following surgical procedures",
        ],
        itemsAr: [
          "علاج اضطرابات أمراض النساء والمسالك البولية المرتبطة بصحة الحوض",
          "العلاج الطبيعي قبل الولادة وبعدها لدعم الولادة الآمنة وتسريع التعافي",
          "علاج الآلام والمشكلات المصاحبة للحمل مثل آلام الظهر وضعف العضلات",
          "علاج مشكلات الجهاز العضلي والهيكلي مثل خشونة المفاصل وإصابات العمود الفقري وآلام المفاصل",
          "العلاج الطبيعي التنفسي لتحسين وظائف التنفس ودعم الجهاز التنفسي",
          "برامج إعادة التأهيل بعد العمليات الجراحية",
        ],
      },
      {
        title: "Specialized Women's Health Physiotherapy",
        titleAr: "العلاج الطبيعي المتخصص لصحة المرأة",
        content:
          "We offer dedicated programs for women's health, including scar management after Cesarean sections and rehabilitation following breast surgery.",
        contentAr:
          "يوفر القسم برامج متخصصة لصحة المرأة تشمل علاج الندبات بعد العمليات القيصرية وبرامج التأهيل بعد جراحات الثدي.",
      },
    ],
  },
];
