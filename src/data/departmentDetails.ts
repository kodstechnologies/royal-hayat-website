export interface DepartmentDetail {
  slug: string;
  name: string;
  nameAr: string;
  intro: string;
  sections: {
    title: string;
    content?: string;
    items?: string[];
    subsections?: { title: string; content?: string; items?: string[] }[];
  }[];
  subDepartments?: {
    slug: string;
    name: string;
    nameAr: string;
    intro: string;
    sections: {
      title: string;
      content?: string;
      items?: string[];
      subsections?: { title: string; content?: string; items?: string[] }[];
    }[];
  }[];
}

export const departmentDetails: DepartmentDetail[] = [
  {
    slug: "obstetrics-gynecology",
    name: "Obstetrics & Gynecology",
    nameAr: "التوليد وأمراض النساء",
    intro: "At Royale Hayat Hospital, we know that pregnancy and childbirth are life-changing experiences. Our expert team is here to guide you, offering compassionate care tailored to your needs, ensuring safety and comfort for you and your baby.",
    sections: [
      {
        title: "World-Class, Personalized Care",
        content: "Supported by a team of healthcare professionals, including dedicated nurses, anesthetists, and neonatologists, we provide comprehensive care every step of the way. Our collaborative approach ensures personalized attention throughout pregnancy, delivery, and recovery.",
      },
      {
        title: "State-of-the-Art Birthing Suites",
        content: "Our birthing center on the 5th floor offers calming, private suites equipped with modern pain management technologies. Each suite is connected to our Operating Theatres, ICU, and Neonatal Department for immediate specialized care if needed.",
      },
      {
        title: "Our Maternity Suite Features:",
        items: [
          "Private birthing suites",
          "Mimosa Suites for low-risk births",
          "High Dependency Units (HDUs)",
          "Isolation room for special cases",
        ],
      },
      {
        title: "Highlights of Our Obstetrics Services:",
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
          "Genetic Counseling: Guidance on hereditary risks.",
        ],
      },
    ],
    subDepartments: [
      {
        slug: "womens-health",
        name: "Women's Health",
        nameAr: "صحة المرأة",
        intro: "At Royale Hayat Hospital, we provide expert care tailored to women's unique needs, from adolescence to the golden years. Our compassionate, patient-centered approach ensures you receive the best preventive and advanced treatments in a supportive environment.",
        sections: [
          {
            title: "Adolescence: A Time of Change",
            content: "We support young women through their transformative years with services like annual physical exams, menstrual health management, and the HPV vaccine. Our clinic offers a safe space for guidance and care.",
          },
          {
            title: "Youth: Empowering Your Journey",
            content: "During childbearing years, we offer state-of-the-art obstetric care, infertility treatments, and family planning. Our team provides personalized support for hormonal changes and wellness needs.",
          },
          {
            title: "Midlife: Health and Vitality",
            content: "Stay strong and active with our midlife services, including annual exams, urinary incontinence treatment, and uterine disorder management. Our recommended screenings help detect issues early, keeping you in stride.",
          },
          {
            title: "Mature Years: Focus on You",
            content: "In your golden years, enjoy personalized hormone therapy, bone health management, and menopause support. We emphasize preventive screenings and treatments to maintain your independence and well-being.",
          },
          {
            title: "Start Your Journey to Lifelong Wellness",
            content: "Take control of your health with our gender-specific programs, designed to support you at every life stage. Schedule your consultation today at 25360000 and partner with a physician dedicated to your lifelong well-being.\n\nYour health, your future—let's take the next step together.",
          },
        ],
      },
      {
        slug: "urogynecology",
        name: "Urogynecology",
        nameAr: "أمراض المسالك البولية النسائية",
        intro: "At our Women's Urogynecology Clinic, we provide expert care for urinary and pelvic health challenges. Our specialized team uses the latest diagnostic tools and treatments to offer personalized, evidence-based care in a luxurious, supportive environment.",
        sections: [
          {
            title: "Our Services Include:",
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
          },
        ],
      },
      {
        slug: "cosmetic-gynecology",
        name: "Cosmetic Gynecology",
        nameAr: "أمراض النساء التجميلية",
        intro: "Introducing Kuwait's first Cosmetic Gynecology Unit at Royale Hayat Hospital. We offer the latest surgical and non-surgical procedures tailored to women's unique needs.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "EVA (Vaginal Radiofrequency Therapy): Non-invasive vaginal tightening and mild urinary stress incontinence treatment.",
              "Preventive Women's Healthcare: Comprehensive wellness, pregnancy care, and cervical cancer vaccinations.",
              "Management of Menstrual Disorders: Expert care for heavy and painful cycles to improve quality of life.",
              "Hormonal Skin Treatments: Targeted therapies for acne and hormonal skin conditions.",
              "Hair Reduction Treatments: Solutions to reduce frequent shaving.",
              "Annual Physical Exams: Routine assessments for long-term well-being.",
              "Cervical Cancer Vaccination: HPV vaccine for women aged 11 to 26.",
            ],
          },
          {
            title: "A New Standard in Women's Health",
            content: "Our Cosmetic Gynecology Unit offers comprehensive, customized care that addresses both medical and lifestyle needs, setting a new standard for women's health in Kuwait.",
          },
        ],
      },
      {
        slug: "gynecologic-oncology",
        name: "Gynecologic Oncology",
        nameAr: "أورام النساء",
        intro: "Our Gynecologic Oncology unit provides specialized care for gynecological cancers and related conditions.",
        sections: [],
      },
      {
        slug: "physiotherapy",
        name: "Physiotherapy",
        nameAr: "العلاج الطبيعي",
        intro: "At Royale Hayat Hospital, our Physiotherapy Clinic offers advanced treatments tailored to support women's health throughout life. We collaborate with other departments for comprehensive recovery and rehabilitation.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "Urogynecological Disorders Management: Treatment for urinary incontinence, pelvic organ prolapse, vaginismus, and menstrual pain.",
              "Pre and Postnatal Care: Physiotherapy for safe delivery and faster recovery.",
              "Pregnancy-Related Discomfort Relief: Managing back pain, leg swelling, and muscle weakness.",
            ],
          },
          { title: "Musculoskeletal Management", content: "Care for osteoarthritis, frozen shoulder, spinal injuries, and sciatic pain." },
          { title: "Pulmonary Physiotherapy", content: "Breathing therapy for pregnancy and postpartum breathlessness." },
          { title: "Scar Management After Cesarean", content: "Techniques to reduce pain and enhance healing." },
          { title: "Post-Surgical Rehabilitation", content: "Care following bariatric or cosmetic surgery to promote healing." },
          { title: "Breast Surgery Rehabilitation", content: "Therapy to restore movement and reduce pain after breast surgery." },
        ],
      },
      {
        slug: "parent-childbirth-education",
        name: "Parent and Childbirth Education",
        nameAr: "تثقيف الوالدين والولادة",
        intro: "At Royale Hayat Hospital, we offer comprehensive educational programs for expectant parents, ensuring a calm and informed birthing experience.",
        sections: [
          {
            title: "Pre-Birthing Program",
            content: "Prepare for labor, delivery, and postpartum with:",
            items: [
              "Education on labor stages and pain relief options",
              "Relaxation and breathing techniques",
              "Guided tours of our maternity wards and birthing suites",
              "Introduction to our supportive nursing staff",
            ],
          },
          {
            title: "Breastfeeding Classes",
            content: "Led by certified lactation specialists, these sessions include:",
            items: [
              "Hands-on breastfeeding guidance",
              "Postpartum breast care",
              "Benefits of breastfeeding for mother and baby",
              "Private, in-suite support after delivery",
            ],
          },
          {
            title: "Newborn & Childcare Program",
            content: "Gain practical skills for newborn care:",
            items: [
              "Handling, hygiene, and swaddling techniques",
              "Understanding sleep patterns and needs",
              "Early signs of common concerns",
              "Support for bonding with your baby",
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
    nameAr: "الطب التناسلي وأطفال الأنابيب",
    intro: "At Royale Hayat Hospital, we blend expertise with cutting-edge technology to offer the most advanced infertility treatments. Our dedicated team of physicians, counselors, and specialists ensures high-quality, compassionate care in a luxurious setting.",
    sections: [
      {
        title: "Our Services Include:",
        items: [
          "Clomid Cycles: Stimulate ovulation for irregular cycles.",
          "Male Factor Infertility: Comprehensive evaluations and tailored treatments.",
          "Artificial Insemination (IUI): Less invasive conception options.",
          "IVF and Frozen Embryo Transfer (FET): Effective assisted reproductive technologies.",
          "Intracytoplasmic Sperm Injection (ICSI): Advanced treatment for severe male infertility.",
          "Pre-implantation Genetic Diagnosis (PGD): Screen embryos for genetic conditions.",
          "Treatment for Endometriosis and PCOS: Manage conditions affecting fertility.",
        ],
      },
    ],
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    nameAr: "طب الأطفال",
    intro: "At Royale Hayat Hospital, we provide world-class pediatric care with warmth and a child-centered approach. Our goal is to support your child's health with expert pediatricians, experienced nurses, and a comforting environment.",
    sections: [
      {
        title: "Our Pediatric Services Include:",
        items: [
          "General Infant Check-ups: Routine assessments for health and development.",
          "Growth & Development Monitoring: Track physical and cognitive progress.",
          "High-Risk Infant Follow-Up: Specialized care for premature infants.",
          "Pediatric Intensive Care Unit (PICU): Advanced critical care for serious conditions.",
          "Infant Hearing Screening: Early detection for timely intervention.",
          "Emergency & Observation Unit: Immediate care for acute injuries.",
          "Inpatient Pediatric Unit: Safe hospitalization designed for children.",
          "Preventive Care & Vaccinations: Immunizations to protect health.",
        ],
      },
      { title: "Pediatric Surgical Services", content: "Safe surgical solutions for children." },
      { title: "Pediatric Anesthesia", content: "Specialized care tailored for young patients." },
      { title: "Pediatric Cardiology", content: "Management of heart conditions." },
      { title: "Pediatric Dentistry", content: "Dental care for infants, children, and teens." },
      { title: "Newborn Screening", content: "Early detection of disorders." },
      { title: "Endocrinology & Diabetes Management", content: "Care for hormonal imbalances." },
      { title: "Pediatric ENT", content: "Treatment for ENT-related conditions." },
      // { title: "Immunology & Allergy Services", content: "Comprehensive allergy and asthma care." },
      {
        title: "Pediatric Intensive Care Unit (PICU)",
        content: "At Royale Hayat Hospital, we know that a PICU admission can be stressful. Our goal is to provide top-tier clinical care in a compassionate, supportive environment for your family.",
        subsections: [
          {
            title: "Why Choose Our PICU?",
            items: [
              "Staffed by board-certified pediatric intensivists",
              "24/7 specialized medical attention",
              "Personalized care tailored to your child's unique needs",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "neonatal",
    name: "Neonatal",
    nameAr: "حديثي الولادة",
    intro: "At Royale Hayat Hospital, your newborn's health is paramount. Our Level III Neonatal Unit, the highest in Kuwait's private sector, offers specialized care for premature and critically ill infants from 24 weeks of gestation.",
    sections: [
      {
        title: "Expert Care and Facilities",
        content: "Our team of neonatologists and specialists provides 24/7 care using the latest technologies.",
        items: [
          "7 Intensive Care Cots: For critically ill newborns needing constant monitoring.",
          "15 Special Care Baby Cots: For additional medical support.",
          "1 Isolation Cot: For specialized infection control.",
        ],
      },
      {
        title: "Comprehensive Services",
        content: "We manage conditions like premature birth complications, respiratory disorders, infections, congenital malformations, and neurological issues.",
      },
      {
        title: "On-site Support Includes:",
        items: [
          "Blood gas analysis",
          "Advanced respiratory therapy",
          "Nutritional and lactation support",
          "Pharmacy management",
        ],
      },
      { title: "24/7 Neonatal Transport Team", content: "Ensuring safe transfer of critically ill newborns with a fully-equipped transport." },
      { title: "International Standards", content: "Aligned with Vermont Oxford Network standards, our unit meets global benchmarks for excellence in neonatal care." },
      {
        title: "Special Care Baby Unit (SCBU)",
        content: "At Royale Hayat Hospital, our SCBU offers comprehensive care for newborns needing close monitoring and specialized attention. Staffed by experienced pediatricians and neonatal nurses, we ensure personalized, compassionate care.",
        subsections: [
          {
            title: "Our SCBU Services Include:",
            items: [
              "Continuous monitoring and specialized care",
              "Comprehensive examinations and newborn screenings",
              "Early detection and management of health conditions",
              "Coordination of specialty referrals",
              "Parent education and support for home care",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "internal-medicine",
    name: "Internal Medicine",
    nameAr: "الطب الباطني",
    intro: "At Royale Hayat Hospital, our Internal Medicine Department is your trusted partner for health management. Whether managing chronic conditions or seeking preventive care, we support you at every stage.",
    sections: [
      {
        title: "Our Approach",
        content: "Our expert physicians specialize in diagnosing and managing both acute and chronic illnesses, particularly complex conditions. We prioritize preventive care, early detection, and personalized treatment plans to enhance your well-being.",
      },
      {
        title: "Health Check Program",
        content: "Our personalized health check-ups screen for potential issues in a comfortable, confidential setting, ensuring proactive health management.",
      },
      {
        title: "Your Check-Up Includes:",
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
      },
    ],
    subDepartments: [
      {
        slug: "cardiology",
        name: "Cardiology",
        nameAr: "أمراض القلب",
        intro: "At Royale Hayat Hospital, we prioritize preventive cardiac care to promote long-term heart health and well-being. Our Cardiology Unit offers expert support, education, and treatment for a healthier life.",
        sections: [
          {
            title: "Our Cardiac Program",
            content: "Designed for individuals with:",
            items: [
              "Risk factors for coronary artery disease",
              "History of heart surgery, angioplasty, or heart attack",
              "Conditions like heart failure, cardiomyopathy, or angina",
            ],
          },
          {
            title: "Our Services Include:",
            items: [
              "Comprehensive Heart Health Check-up",
              "Preventive Cardiac Screening",
              "Hypertension, Diabetes, and Cholesterol Monitoring",
              "Coronary Artery Disease Diagnosis & Treatment",
              "Echocardiography (Echo) and Stress Testing",
              "Arrhythmia Detection & Management",
            ],
          },
        ],
      },
      {
        slug: "nephrology",
        name: "Nephrology",
        nameAr: "أمراض الكلى",
        intro: "At Royale Hayat Hospital, our Nephrology Clinic provides top-tier diagnostic, preventive, and therapeutic services for kidney-related conditions. Our expert team delivers personalized care for your unique health needs.",
        sections: [
          {
            title: "Our Services Include:",
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
          },
        ],
      },
      {
        slug: "gastroenterology",
        name: "Gastroenterology",
        nameAr: "أمراض الجهاز الهضمي",
        intro: "At Royale Hayat Hospital's Center for Digestive Diseases, we combine world-class expertise with cutting-edge technology to treat a wide range of gastrointestinal conditions.",
        sections: [
          {
            title: "Our Expertise",
            content: "Our experienced gastroenterologists specialize in the prevention, diagnosis, and treatment of diseases affecting the esophagus, stomach, intestines, liver, pancreas, and biliary system. With Kuwait's only endoscopic ultrasound system, we offer an exclusive diagnostic advantage.",
          },
          {
            title: "Our Services Include:",
            items: [
              "Upper GI Endoscopy: Examines the esophagus, stomach, and duodenal bulb; diagnoses gastric infections and food allergies.",
              "Liver & Biliary Tract Assessment: Manages hepatitis, gallstones, biliary obstructions, and liver tumors.",
              "Pancreatic Evaluation: Uses ultrasound and endoscopic imaging to diagnose and treat pancreatitis and pancreatic tumors.",
              "Colonoscopy & Rectal Examinations: Diagnose inflammatory bowel diseases, IBS, colorectal tumors, and chronic constipation.",
              "Therapeutic & Diagnostic ERCP: Offers minimally invasive treatment for bile and pancreatic duct disorders.",
            ],
          },
          {
            title: "Pain Management Integration",
            content: "Our Pain Management Unit collaborates with the GI team to alleviate gastrointestinal discomfort, enhancing patient comfort and outcomes.",
          },
        ],
      },
      {
        slug: "endocrinology-metabolism",
        name: "Endocrinology & Metabolism",
        nameAr: "الغدد الصماء والتمثيل الغذائي",
        intro: "At Royale Hayat Hospital, our Endocrinology and Metabolism Clinic offers comprehensive care for endocrine and metabolic disorders. Our skilled team uses the latest technology to provide compassionate, personalized treatment plans that restore well-being and enhance quality of life.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "Thyroid Disorders: Management of hypothyroidism, hyperthyroidism, goiter, thyroid nodules, and thyroid cancer.",
              "Adrenal, Parathyroid & Pituitary Disorders: Treatment for Cushing's syndrome, Addison's disease, hormone imbalances, and pituitary tumors.",
              "Growth & Development Disorders: Evaluation and treatment of growth delays in adolescents, with hormone therapy as needed.",
            ],
          },
          { title: "Calcium & Bone Health", content: "Diagnosis and treatment of osteoporosis and vitamin D deficiency." },
          { title: "Diabetes Management", content: "Comprehensive care for Type 1 and Type 2 diabetes, including lifestyle support and complication prevention." },
          { title: "Lipid & Metabolic Disorders", content: "Management of hyperlipidemia and metabolic syndrome." },
          { title: "Hormonal & Sexual Health", content: "Addressing hormonal imbalances affecting sexual health in men and women." },
          { title: "General Endocrine Consultations", content: "Screening and management of complex conditions with ongoing monitoring and education." },
        ],
      },
      {
        slug: "rheumatology",
        name: "Rheumatology",
        nameAr: "أمراض الروماتيزم",
        intro: "At Royale Hayat Hospital, our Rheumatology Clinic is dedicated to providing expert consultations and treatments for a wide range of musculoskeletal and autoimmune disorders. Integrated with the Department of Internal Medicine, our team of experienced physicians and nursing staff delivers personalized care tailored to your specific needs.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "Detailed evaluation of joint pain through comprehensive patient history and physical examination",
              "Portable, non-invasive musculoskeletal ultrasound for accurate diagnosis",
              "Intra-articular joint injections using Steroids, Hyaluronic Acid, and Platelet-Rich Plasma (PRP) to relieve pain and inflammation",
              "Diagnosis, treatment, and management of all rheumatologic conditions, including: Osteoarthritis, Rheumatoid Arthritis, Gout, Psoriatic Arthritis, Fibromyalgia, Myositis, Vasculitis, Systemic Lupus Erythematosus (SLE)",
              "Evaluation and treatment of Low Vitamin D levels and Osteoporosis",
              "Ongoing management and follow-up of multiple general medical conditions related to rheumatology",
            ],
          },
        ],
      },
      {
        slug: "clinical-nutrition-dietetics",
        name: "Clinical Nutrition & Dietetics",
        nameAr: "التغذية السريرية",
        intro: "At Royale Hayat Hospital, our Nutrition and Diet Clinic is dedicated to promoting optimal health through personalized nutritional care aligned with World Health Organization standards. Our mission is to help you adopt healthier lifestyle patterns for a vibrant, energetic body.\n\nOur expert dietitians offer tailored services for all ages, providing practical advice and scientifically backed nutrition plans.",
        sections: [
          {
            title: "Our Services Include:",
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
          },
        ],
      },
    ],
  },
  {
    slug: "general-laparoscopic-surgery",
    name: "General & Laparoscopic Surgery",
    nameAr: "الجراحة العامة والمنظار",
    intro: "At Royale Hayat Hospital, our General and Laparoscopic Surgery Department offers exceptional care, blending expert skills with advanced technology. Our internationally recognized surgeons focus on precision, safety, and quick recovery.",
    sections: [
      {
        title: "Our Services Include:",
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
      },
    ],
    subDepartments: [
      {
        slug: "obesity-bariatric-surgery",
        name: "Obesity Bariatric Surgery",
        nameAr: "جراحة السمنة",
        intro: "Royale Hayat Hospital's Bariatric Surgery Center is the first in the Middle East and Africa to be recognized by the Surgical Review Corporation as an International Center of Excellence in weight loss surgeries. With over 1,200 successful procedures, we offer safe and effective bariatric solutions for lasting results.",
        sections: [
          {
            title: "Our Surgical Offerings Include:",
            items: [
              "Gastric Sleeve",
              "Gastric Bypass",
              "Biliopancreatic Diversion (BPD)",
              "Revision Procedures",
              "Adolescent Weight Loss Surgeries",
              "Laparoscopic and Single Incision Surgeries",
            ],
          },
          { title: "Excellence Recognized", content: "In 2012, we were named an International Bariatric Surgery Center of Excellence, confirming our commitment to superior quality, exceptional outcomes, and innovative care within a state-of-the-art environment." },
          { title: "A Holistic Approach", content: "Recognizing obesity as a complex disease, our comprehensive program integrates medical, behavioral, nutritional, and surgical care. Each patient undergoes a detailed assessment with our multidisciplinary team, ensuring personalized, long-term treatment success." },
          {
            title: "Customized Treatment Planning",
            content: "Our team develops individualized plans aimed at:",
            items: [
              "Alleviating obesity-related conditions",
              "Minimizing nutritional risks",
              "Enhancing physical appearance, including post-weight loss contouring",
            ],
          },
          {
            title: "Advanced Minimally Invasive Surgery",
            content: "Our surgeons are pioneers in FDA-approved laparoscopic techniques, offering:",
            items: ["Smaller incisions", "Reduced pain", "Shorter hospital stays", "Faster recovery"],
          },
          { title: "Long-Term Support & Success", content: "Patients receive a minimum of five years of follow-up, consistently surpassing international benchmarks. Our dedicated team provides ongoing support to maintain an ideal weight and a healthy lifestyle." },
        ],
      },
      {
        slug: "breast-surgical-oncology",
        name: "Breast Surgical Oncology",
        nameAr: "أورام الثدي الجراحية",
        intro: "At Royale Hayat Hospital, our Breast Surgical Oncology Clinic offers exceptional care for breast health. Our experienced team provides expert examinations, precise diagnoses, and advanced treatments for various breast conditions.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "Breast Cancer Screening",
              "Advanced Diagnosis and Treatment of Breast Cancers",
              "Management of Benign and Malignant Breast Diseases",
              "Specialist Care for Breast Diseases and Cancer",
              "Diagnosis and Treatment of Breast Lumps, Pain, and Nipple Discharge",
              "Ongoing Follow-up for High-Risk Patients and Survivors",
            ],
          },
        ],
      },
      {
        slug: "abdominal-wall-reconstruction",
        name: "Abdominal Wall Reconstruction",
        nameAr: "إعادة بناء جدار البطن",
        intro: "Our Abdominal Wall Reconstruction unit provides specialized surgical care for complex abdominal wall conditions.",
        sections: [],
      },
      {
        slug: "nutrition-and-diet-surgery",
        name: "Clinical Nutrition & Dietetics",
        nameAr: "التغذية السريرية",
        intro: "At Royale Hayat Hospital, our Nutrition and Diet Clinic is dedicated to promoting optimal health through personalized nutritional care aligned with World Health Organization standards. Our mission is to help you adopt healthier lifestyle patterns for a vibrant, energetic body.\n\nOur expert dietitians offer tailored services for all ages, providing practical advice and scientifically backed nutrition plans.",
        sections: [
          {
            title: "Our Services Include:",
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
          },
        ],
      },
    ],
  },
  {
    slug: "plastic-surgery",
    name: "Plastic Surgery & Cosmetology",
    nameAr: "الجراحة التجميلية",
    intro: "At Royale Hayat Hospital, our renowned General and Plastic Surgery & Cosmetology Department is led by internationally certified physicians, offering advanced surgical and non-surgical solutions with precision and discretion. Our all-female medical team is available for those who prefer.",
    sections: [
      {
        title: "Our Approach",
        content: "We enhance natural beauty with safe, predictable, and natural-looking results. Patients also benefit from comprehensive health checkups and preventive services.",
      },
      {
        title: "Advanced Non-Surgical Solutions",
        content: "Our Cosmetic Center uses cutting-edge technologies for effective non-surgical treatments:",
        items: [
          "Thermage (5th Gen): Skin tightening for face and body.",
          "Fraxel Dual (5th Gen): Improves texture, treats scars, and wrinkles.",
          "Laser Hair Removal (10th Gen): Safe for all skin types.",
          "Injectables & Rejuvenation: Botox, fillers, and advanced facials.",
        ],
      },
      {
        title: "Life-Enhancing Surgical Solutions",
        content: "Our multidisciplinary team offers expert cosmetic and reconstructive procedures tailored to individual goals for optimal safety and satisfaction.",
      },
      {
        title: "Surgical Services Include:",
        items: [
          "Body Contouring: Tummy tuck, arm lift, thigh lift",
          "Breast Surgery: Augmentation, reduction, nipple reshaping",
          "Facial Surgery: Face lifts, cheek implants, otoplasty, lip reshaping",
        ],
      },
    ],
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    nameAr: "الأمراض الجلدية",
    intro: "At Royale Hayat Hospital, our highly qualified dermatologists provide expert care for all your dermatological needs. We combine clinical excellence with the latest advances to deliver exceptional outcomes for both adults and children.",
    sections: [
      {
        title: "Our Expertise",
        content: "Our board-certified dermatologists diagnose and manage a wide range of conditions, including chronic skin diseases, infections, allergies, autoimmune disorders, and skin cancers. We offer a patient-centered approach with evidence-based care in a compassionate setting.",
      },
      {
        title: "Specialized Services Include:",
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
      },
    ],
  },
  {
    slug: "ent",
    name: "ENT (Ear, Nose & Throat)",
    nameAr: "الأنف والأذن والحنجرة",
    intro: "At Royale Hayat Hospital, our ENT Department provides expert care for conditions affecting the ear, nose, throat, head, and neck. We offer both medical and surgical expertise for all ages, utilizing the latest technologies for precise diagnosis and optimal outcomes.",
    sections: [
      {
        title: "Our Services Include:",
        items: [
          "Pediatric Otolaryngology",
          "Otology/Neurotology: Hearing and balance disorders",
          "Head and Neck Surgery",
          "Rhinology: Nasal and sinus care",
          "Sleep and Snoring Disorders",
          "General ENT Care",
        ],
      },
      {
        title: "Advanced Procedures:",
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
      },
    ],
  },
  {
    slug: "family-medicine",
    name: "Family Medicine",
    nameAr: "طب الأسرة",
    intro: "At Royale Hayat Hospital, our Family Clinic offers continuous, personalized care for individuals and families of all ages. Our Family Medicine Physicians coordinate all aspects of your health journey with expertise and compassion.",
    sections: [
      {
        title: "Why Choose Our Family Clinic?",
        items: [
          "One Point of Contact: Your dedicated physician manages your care, including specialist referrals and medication management.",
          "Whole-Family Care: From children to seniors, we provide preventive care, routine check-ups, and chronic disease management.",
          "Coordinated Care: Enjoy a seamless health journey with a coordinated plan, avoiding unnecessary treatments and ensuring timely follow-ups.",
          "Health Maintenance & Prevention: Focus on disease prevention and wellness through lifestyle counseling, screenings, and education.",
          "Guidance & Support: Your physician evaluates and guides you to the appropriate care, saving time and reducing stress.",
        ],
      },
      {
        title: "Our Services Include:",
        items: [
          "Preventive Care and Screenings",
          "Chronic Condition Management (e.g., Diabetes, Hypertension)",
          "Acute Illness and Injury Treatment",
          "Immunizations and Vaccinations",
          "Pediatric and Geriatric Care",
          "Women's and Men's Health",
          "Lifestyle and Nutritional Counseling",
          "Mental Health Support",
          "Coordination with Specialty Services",
        ],
      },
    ],
  },
  {
    slug: "dental-clinic",
    name: "Dental Clinic",
    nameAr: "عيادة الأسنان",
    intro: "At Royale Hayat Hospital, our Dental Clinic offers exceptional dental care in a luxurious setting. Our specialized dentists use advanced technology to deliver personalized treatments for all ages, ensuring a seamless, pain-free experience.",
    sections: [
      {
        title: "Our Dental Services Include:",
        items: [
          "Pediatric Dentistry: Gentle, child-friendly care",
          "Cosmetic Dentistry: Lumineers, veneers, and esthetic crowns",
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
      },
    ],
  },
  {
    slug: "pain-management",
    name: "Pain Management",
    nameAr: "إدارة الألم",
    intro: "At Royale Hayat Hospital, our Pain Management Unit enhances quality of life for those with acute or chronic pain. Our comprehensive program offers advanced, compassionate care to help patients regain comfort and functionality.",
    sections: [
      {
        title: "Our Multidisciplinary Team",
        content: "Comprising board-certified anesthesiologists, internal medicine specialists, and physical therapists, supported by expert psychologists, we provide both outpatient and inpatient consultations tailored to individual needs.",
      },
      {
        title: "Our Services Include:",
        items: [
          "Epidural Anesthesia: For labor and delivery comfort.",
          "Regional Anesthesia: For surgical procedures, including spinal and epidural options.",
          "General Anesthesia: When required for medical or surgical interventions.",
          "Chronic Pain Management: Addressing headache, facial pain, neck and back pain, neuropathic pain, joint and rheumatic pain, post-operative pain, and sports injuries.",
        ],
      },
    ],
  },
  {
    slug: "anesthesia",
    name: "Anesthesia",
    nameAr: "التخدير",
    intro: "At Royale Hayat Hospital, our Anesthesia Department ensures patient safety and comfort for all surgical and childbirth procedures. We deliver top-tier anesthesia services using the latest techniques and technologies.",
    sections: [
      {
        title: "Our Commitment",
        content: "Safety is our priority. We use advanced methods—including general, local, conscious sedation, and regional anesthesia—tailored to each individual. Precise dosage control with brainwave monitoring ensures optimal safety.\n\nOur experienced anesthesiologists provide care for patients of all ages and conditions, ensuring a safe and comfortable experience for surgeries and childbirth.",
      },
      {
        title: "Key Services Include:",
        items: [
          "General Anesthesia",
          "Local and Regional Anesthesia (spinal and epidural)",
          "Conscious Sedation",
          "Advanced Brainwave Monitoring",
          "Anesthesia for High-Risk Patients",
          "Pain Relief During Labor and Childbirth",
          "Preoperative Evaluation and Postoperative Recovery",
        ],
      },
    ],
  },
  {
    slug: "intensive-care",
    name: "Intensive Care",
    nameAr: "العناية المركزة",
    intro: "At Royale Hayat Hospital, our ICU offers round-the-clock monitoring and care for severe, life-threatening conditions with cutting-edge technology.",
    sections: [
      {
        title: "Services Include:",
        items: [
          "Invasive catheter interventions",
          "Bronchoscopy for airway and lung management",
          "Treatment for serious conditions such as heart failure, severe hypertension, acute asthma attacks, stroke, hyperglycemia, acute bronchitis, and post-operative complications",
        ],
      },
    ],
  },
  {
    slug: "center-for-diagnostic-imaging",
    name: "Center for Diagnostic Imaging",
    nameAr: "مركز التصوير التشخيصي",
    intro: "At Royale Hayat Hospital, our Center for Diagnostic Imaging offers advanced diagnostic and image-guided therapeutic services. Combining expert professionals with state-of-the-art technology, we ensure accurate diagnoses and timely care.",
    sections: [
      {
        title: "Subspecialty Expertise:",
        content: "Our Western-trained consultant radiologists provide comprehensive interpretations in:",
        items: [
          "Abdominal & Women's Imaging",
          "Breast Imaging",
          "Cardiovascular & Thoracic Imaging",
          "Musculoskeletal Imaging",
          "Neuroradiology, Head & Neck Imaging",
          "Pediatric Imaging",
          "Vascular & Interventional Radiology",
        ],
      },
      {
        title: "Advanced Imaging Technology:",
        content: "Equipped with cutting-edge systems for high-resolution imaging:",
        items: [
          "MRI (Magnetic Resonance Imaging)",
          "CT (Computerized Tomography)",
          "Fluoroscopy",
          "4D Ultrasound & Color Doppler",
          "Bone Densitometry",
          "Full-Field Digital Mammography",
        ],
      },
      {
        title: "International Collaboration:",
        content: "We partner with leading European universities and imaging centers for remote consultations and peer reviews, ensuring the highest diagnostic accuracy.",
      },
    ],
    subDepartments: [
      {
        slug: "abdominal-womens-imaging",
        name: "The Abdominal & Women's Imaging",
        nameAr: "تصوير البطن والمرأة",
        intro: "At Royale Hayat Hospital, our Abdominal & Women's Imaging Unit excels in diagnosing and managing abdominal and pelvic conditions. Our multidisciplinary approach ensures precise diagnosis and optimized care in collaboration with specialists in gastroenterology, gynecology, surgery, urology, and oncology.",
        sections: [
          {
            title: "Comprehensive Diagnostics:",
            content: "We diagnose and support treatment planning for conditions affecting the liver, pancreas, kidneys, gallbladder, colon, adrenal glands, and reproductive organs.",
          },
          {
            title: "Advanced Imaging Capabilities:",
            content: "Our team utilizes state-of-the-art CT, MRI, and ultrasound technologies, offering:",
            items: ["Virtual Colonoscopy", "CT Angiography (CT Angio)", "CT Urography", "MR and CT Enterography for GI disorders"],
          },
          {
            title: "Interventional Expertise:",
            content: "We provide a range of image-guided interventions, including:",
            items: ["Ultrasound and CT-guided biopsies", "Abscess drainage", "Interventional pain management"],
          },
        ],
      },
      {
        slug: "breast-imaging",
        name: "The Breast Imaging",
        nameAr: "تصوير الثدي",
        intro: "At Royale Hayat Hospital, our Breast Imaging Unit offers advanced, patient-centered diagnostic and interventional services. We provide high-quality breast cancer screenings and a comprehensive range of tools to detect and treat breast conditions.",
        sections: [
          {
            title: "Our Services Include:",
            items: [
              "Full Field Digital Mammography (FFDM): High-resolution imaging",
              "Ductography: Evaluates nipple discharge and ductal abnormalities",
              "Breast Ultrasound: Ideal for dense tissue evaluation and guided procedures",
              "MR DWI and Spectroscopy: Detailed tissue evaluation",
              "Image-Guided Needle Biopsies: Using ultrasound, MRI, and stereotactic techniques",
              "Preoperative Wire Localization: Precisely pinpoints small lesions for minimal-impact removal",
            ],
          },
          {
            title: "Advanced Technology:",
            content: "We utilize AI-driven Computer-Aided Diagnosis (CAD) software to enhance detection and improve diagnostic accuracy.\n\nOur specialists collaborate with surgeons, oncologists, and other providers to ensure coordinated, personalized care.",
          },
        ],
      },
      {
        slug: "cardiovascular-thoracic-imaging",
        name: "The Cardiovascular & Thoracic Imaging",
        nameAr: "تصوير القلب والصدر",
        intro: "At Royale Hayat Hospital, our Cardiovascular & Thoracic Imaging Unit provides advanced diagnostics for heart and thoracic conditions in adults and children. We specialize in coronary artery disease, heart conditions, valvular disorders, cardiomyopathies, and structural abnormalities.",
        sections: [
          {
            title: "Conditions We Evaluate:",
            items: [
              "Chest pain and shortness of breath",
              "Coronary artery disease",
              "Valvular heart disease",
              "Cardiomyopathies",
              "Congenital heart disease",
              "Pulmonary, pleural, mediastinal, and chest wall diseases",
            ],
          },
          {
            title: "Advanced Technology:",
            content: "We utilize state-of-the-art tools, including:",
            items: [
              "Cardiac MRI for detailed cardiac analysis",
              "128-slice CT scanner for precise imaging",
              "Low-radiation coronary CT angiography (CTA)",
              "CTA of the thoracic and abdominal aorta",
            ],
          },
          {
            title: "Services Offered:",
            items: [
              "Chest X-rays, CT scans, and cardiac MRI",
              "Coronary CTA for low- to intermediate-risk patients",
              "Thoracic lesion biopsies",
              "Image-guided thoracic drainage",
            ],
          },
        ],
      },
      {
        slug: "musculoskeletal-imaging",
        name: "The Musculoskeletal Imaging",
        nameAr: "تصوير العضلات والعظام",
        intro: "At Royale Hayat Hospital, our Musculoskeletal Imaging Unit offers advanced imaging services to diagnose and evaluate disorders of the bones, joints, spine, and soft tissues.",
        sections: [
          {
            title: "Collaboration with Experts:",
            content: "Our skilled team collaborates with orthopedic surgeons, rheumatologists, and sports medicine specialists to provide precise diagnostic information for effective treatment planning.",
          },
          {
            title: "Conditions We Evaluate:",
            items: [
              "Spine, joint, and limb disorders",
              "Sports injuries and overuse syndromes",
              "Arthritis and inflammatory joint diseases",
              "Bone and soft tissue tumors",
              "Osteoporosis and metabolic bone diseases",
            ],
          },
          {
            title: "Advanced Imaging Services:",
            items: [
              "MRI: High-resolution imaging of joints, soft tissues, and spine",
              "CT Scan: 128-slice CT for detailed 3D reconstructions",
              "Musculoskeletal Ultrasound: Dynamic tendon and ligament evaluation",
              "Arthrography: Contrast-enhanced joint imaging",
              "Bone Mineral Density (DEXA) Scans: Osteoporosis assessment",
              "Sports Medicine Imaging: Targeted evaluation of athletic injuries",
            ],
          },
          {
            title: "Interventional & Pain Management:",
            items: [
              "Image-guided bone and soft tissue biopsies",
              "Joint and spinal injections for pain relief",
              "Cyst aspiration and drainage",
            ],
          },
        ],
      },
      {
        slug: "neuroradiology-head-neck-imaging",
        name: "The Neuroradiology and Head & Neck Imaging",
        nameAr: "الأشعة العصبية",
        intro: "At Royale Hayat Hospital, our Neuroradiology and Head & Neck Imaging Unit provides accurate diagnosis for neurological and ENT-related conditions using cutting-edge technologies.",
        sections: [
          {
            title: "Specialized Evaluations:",
            items: [
              "Stroke and cerebrovascular disease",
              "Brain and spinal tumors",
              "Epilepsy and seizure disorders",
              "Multiple sclerosis",
              "Congenital brain anomalies",
              "Pituitary gland disorders",
              "ENT pathologies",
            ],
          },
          {
            title: "Advanced Imaging Techniques:",
            content: "Our expert neuroradiologists utilize:",
            items: [
              "Diffusion Weighted Imaging (DWI): Early stroke detection",
              "Susceptibility Weighted Imaging (SWI): Detects microbleeds and calcifications",
              "Magnetic Resonance Spectroscopy (MRS): Evaluates brain metabolism",
              "Functional MRI (fMRI): Pre-surgical brain mapping",
              "MR and CT Angiography: Assesses cerebral and neck vessels",
              "Spine MRI & CT: Detailed spinal evaluation",
            ],
          },
          {
            title: "Vascular & Ultrasound Capabilities:",
            items: [
              "Color Doppler Ultrasound: Detects plaques and assesses stroke risk",
              "Transcranial Doppler: Non-invasive intracranial blood flow assessment",
            ],
          },
          {
            title: "Specialized Focus:",
            items: [
              "Pituitary Gland Imaging: MRI for detecting microadenomas",
              "High-Resolution ENT Imaging: z-UHR CT technology for detailed evaluation",
            ],
          },
        ],
      },
      {
        slug: "pediatric-imaging",
        name: "The Pediatric Imaging",
        nameAr: "تصوير الأطفال",
        intro: "At Royale Hayat Hospital, our Pediatric Imaging Unit caters to the unique diagnostic needs of infants, children, and adolescents. We offer a full range of imaging services, from basic radiography to advanced modalities, ensuring safe and accurate diagnoses.",
        sections: [
          {
            title: "Services Offered:",
            items: [
              "X-ray (Radiography)",
              "Ultrasound",
              "CT (Computed Tomography)",
              "MRI & Fetal MRI",
              "Fluoroscopy",
              "Imaging-guided interventional procedures",
            ],
          },
          {
            title: "Pediatric MRI with Sedation:",
            content: "We proudly offer the region's first dedicated pediatric MRI unit, supported by pediatric anesthesiologists. This child-focused setup ensures a safe, comfortable environment, especially for young or anxious children needing sedation.",
          },
          {
            title: "Expertise in Pediatric Diseases:",
            content: "Our specialized radiologists collaborate with pediatricians to diagnose:",
            items: [
              "Congenital anomalies",
              "Infectious diseases",
              "Pediatric malignancies",
              "Trauma-related injuries",
            ],
          },
          {
            title: "Safety Comes First:",
            content: "We use advanced low-dose imaging protocols with CARE Dose™ and CARE Vision™ technologies, reducing radiation exposure by up to 93%.",
          },
        ],
      },
      {
        slug: "vascular-interventional-radiology",
        name: "The Vascular & Interventional Radiology",
        nameAr: "الأشعة الوعائية والتدخلية",
        intro: "At Royale Hayat Hospital, our Vascular & Interventional Radiology Unit offers cutting-edge, minimally invasive procedures to diagnose and treat various conditions, prioritizing patient safety, comfort, and rapid recovery.",
        sections: [
          {
            title: "What We Offer:",
            content: "Utilizing advanced imaging technologies like Fluoroscopy, CT, and Ultrasound, our expert team performs:",
            items: [
              "Uterine Fibroid Embolization",
              "Thrombectomy (Clot Removal)",
              "Abscess and Fluid Drainage",
              "Central Line and Catheter Placement",
              "Gastrointestinal & Genitourinary Interventions",
            ],
          },
          {
            title: "Integrated, Multidisciplinary Care:",
            content: "Our interventional radiologists collaborate with other departments to provide comprehensive care from diagnosis to post-procedure follow-up, supported by nurse practitioners and clinical staff.",
          },
          {
            title: "Technology-Driven Precision:",
            content: "We use the latest fusion imaging software for:",
            items: [
              "Pinpoint targeting of diseased tissue",
              "Reduced procedure times",
              "Minimized discomfort and complications",
              "Enhanced treatment success",
            ],
          },
          {
            title: "Specialized Interventional Pain Management:",
            content: "Our team excels in image-guided pain management, providing relief with real-time imaging for maximum effectiveness and minimal invasiveness.",
          },
        ],
      },
    ],
  },
  {
    slug: "laboratory-services",
    name: "Laboratory Services",
    nameAr: "خدمات المختبر",
    intro: "At Royale Hayat Hospital, our state-of-the-art Clinical Laboratory is essential for accurate diagnosis and personalized treatment, offering comprehensive services with some of the region's fastest turnaround times.",
    sections: [
      {
        title: "Trusted Nationwide:",
        content: "We serve internal departments and external healthcare providers across Kuwait. As a national referral laboratory, we deliver trusted diagnostic insights backed by internationally recognized standards.",
        items: [
          "24/7 Operation: Around-the-clock urgent and routine testing",
          "Cutting-edge Equipment: Latest diagnostic technology",
          "Expert Team: Board-certified pathologists and skilled technologists",
          "CAP Accreditation: Excellence in lab quality and accuracy",
        ],
      },
      {
        title: "Our Laboratory Services Include:",
        items: [
          "Blood Bank & Transfusion: Safe, efficient blood typing and support",
          "Chemical Pathology: Biochemical analysis for organ function and disease detection",
          "Cytology: Cell studies for cancer screening and disease diagnosis",
          "Histopathology: Tissue examination for precise diagnosis",
          "Hematology: Comprehensive blood testing for various disorders",
          "Immunology: Testing for immune-related and allergic conditions",
          "Microbiology: Detection of bacterial, viral, fungal, and parasitic infections",
        ],
      },
    ],
  },
  {
    slug: "royale-hayat-pharmacy",
    name: "Royale Hayat Pharmacy",
    nameAr: "صيدلية رويال حياة",
    intro: "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs. Our pharmacists collaborate closely with clinical and nursing teams to ensure the highest standard of pharmaceutical care.",
    sections: [
      {
        title: "Serving the Community:",
        content: "The Royale Pharmacy caters to both inpatients and the wider community, offering a comprehensive selection of over-the-counter products to support the well-being of patients, visitors, and families.",
      },
      {
        title: "Our Services:",
        items: [
          "Inpatient Prescriptions: Safe, timely medication dispensing for hospitalized patients",
          "Outpatient Prescriptions: Fulfillment of prescriptions for clinic visitors",
          "Medication Guidance: Expert drug information and personalized advice",
          "Usage Instructions: Clear, accurate advice on correct medication use",
          "Over-the-Counter Products: A wide variety of non-prescription medicines and health supplements",
          "Specialty Medications: Access to unique medications, including nutritional supplements and vitamins",
          "Discharge Counselling: Detailed medication guidance for patients at discharge",
          "Skincare & Wellness Products: Curated range of quality skincare and wellness items",
        ],
      },
    ],
  },
  {
    slug: "clinical-pharmacy",
    name: "Clinical Pharmacy",
    nameAr: "الصيدلة السريرية",
    intro: "At Royale Hayat Hospital, our Clinical Pharmacy team plays a vital role in ensuring safe, effective, and evidence-based medication practices, enhancing overall patient care.",
    sections: [
      {
        title: "Our Approach:",
        content: "We utilize advanced tools and integrated electronic systems to deliver timely, efficient, and high-quality services.",
      },
      {
        title: "Core Services:",
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
      },
      {
        title: "Medication Therapy Management (MTM):",
        content: "Our MTM services aim to:",
        items: [
          "Strengthen collaboration between pharmacists and healthcare professionals",
          "Improve communication with patients",
          "Empower patients in managing their medication therapy",
        ],
      },
      {
        title: "Patient Engagement and Education:",
        content: "As part of MTM, patients are educated on:",
        items: [
          "Purpose and necessity of each medication",
          "Medication names, strengths, and appearances",
          "Proper administration and timing",
          "Managing potential side effects",
          "Aware of drug interactions",
        ],
      },
    ],
  },
  {
    slug: "home-health",
    name: "Royale Home Health",
    nameAr: "رويال للرعاية المنزلية",
    intro: "Royale Home Health is an exclusive extension of Royale Hayat Hospital, offering exceptional health and wellness support delivered directly to your home. Our services blend high-quality medical care with the signature luxury and hospitality that Royale Hayat is known for. Backed by a multi-disciplinary team of healthcare professionals, we provide personalized, compassionate, and expert care aligned with the highest international standards.",
    sections: [
      {
        title: "Rehabilitation Services",
        content: "Our home-based rehabilitation programs are designed to restore health, enhance mobility, and improve quality of life across a range of conditions:",
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
      },
      {
        title: "Specialized Nursing Services",
        content: "Our specialized nursing team offers comprehensive medical services in the comfort of your home, including:",
        subsections: [
          {
            title: "Short-Term Visits",
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
          },
          {
            title: "Long-Term Visits (24/7 Care)",
            items: [
              "Baby care and newborn monitoring",
              "Senior (geriatric) care",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "al-safwa-healthcare",
    name: "Al Safwa HealthCare",
    nameAr: "الصفوة للرعاية الصحية",
    intro: "Take control of your health effortlessly with our personalized program. Enroll by completing a quick registration form, providing a snapshot of your medical history and lifestyle. Our team will craft a customized care plan just for you.",
    sections: [
      {
        title: "Elite Medical Care",
        content: "The Al Safwa Program offers elite medical care designed to fit seamlessly into your busy lifestyle, prioritizing both health and luxury. Our customized care plans are tailored to your unique medical profile and goals.",
      },
    ],
  },
  {
    slug: "royale-hayat-pharmacy",
    name: "Royale Hayat Pharmacy",
    nameAr: "صيدلية رويال حياة",
    intro: "Conveniently located on the ground floor, Royale Pharmacy is staffed by highly qualified pharmacists available 24/7 to provide expert guidance for all your medicinal needs.",
    sections: [
      {
        title: "Expert Pharmaceutical Care",
        content: "Our pharmacists collaborate closely with clinical and nursing teams to ensure the highest standard of pharmaceutical care. We are open round-the-clock to ensure immediate access to consultations and medications.",
      },
    ],
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    nameAr: "العلاج الطبيعي",
    intro: "We offer advanced physiotherapy treatments tailored to support women's health throughout life. We collaborate with other departments for comprehensive recovery and rehabilitation.",
    sections: [
      {
        title: "Comprehensive Rehabilitation Services",
        content: "Our team of specialized physical therapists provides expert care for a wide range of conditions, ensuring a safe and effective recovery process.",
      },
      {
        title: "Our Services Include:",
        items: [
          "Urogynecological Disorders Management: Specialized treatment for pelvic health and related conditions.",
          "Pre and Postnatal Care: Physiotherapy support for safe delivery and enhanced postpartum recovery.",
          "Pregnancy-Related Discomfort Relief: Expert management of back pain and muscle weakness during pregnancy.",
          "Musculoskeletal Management: Care for osteoarthritis, spinal injuries, and joint pain.",
          "Pulmonary Physiotherapy: Breathing therapy and respiratory support.",
          "Post-Surgical Rehabilitation: Specialized recovery care following surgical procedures.",
        ],
      },
      {
        title: "Specialized Women's Health Physiotherapy",
        content: "We offer dedicated programs for women's health, including scar management after Cesarean sections and rehabilitation following breast surgery.",
      },
    ],
  },
];
