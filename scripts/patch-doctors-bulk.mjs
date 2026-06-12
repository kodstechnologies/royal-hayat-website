import fs from 'fs';

const TARGETS = [
  'd:/PRAJWALA/Royal-hayat-main/RoyalHayat/src/data/doctors.ts',
  'd:/PRAJWALA/Royal-hayat-main/RoyalHayat/src/data/doctorsWithClinicCodes.ts',
  'd:/PRAJWALA/Royal-hayat-main/Royal-hayat-Backend/doctorsWithClinicCodes.ts',
  'd:/PRAJWALA/Royal-hayat-main/Royal-hayat-admin-frontend/src/data/doctors.ts',
];

const patches = {
  'dr-anood-yousef-aljasser-alrajahi': {
    title: 'Specialist Dentist',
    titleAr: 'اختصاصي طب أسنان',
    qualifications: [
      'Membership of the Royal College of Surgeons of England in Pediatric Dentistry (MPaed Dent RCSEng)',
      'Postgraduate Certificate in Advanced Clinical Dental Practice \u2013 King\u2019s College London',
      'Master of Science in Pediatric Dentistry \u2013 King\u2019s College London (MSc in Pediatric Dentistry)',
      'Diploma of Member of the Faculty of Dentistry of the Royal College of Surgeons in Ireland (MFDRCSI)',
      'Bachelor of Dental Surgery \u2013 Kuwait University (BDS)',
      'Bachelor of Medical Science \u2013 Kuwait University (BMS)',
    ],
    qualificationsAr: [
      'عضوية الكلية الملكية للجراحين في إنجلترا في طب أسنان الأطفال (ماجستير في طب أسنان الأطفال، دبلوم في هندسة الأسنان)',
      'شهادة دراسات عليا في ممارسة طب الأسنان السريرية المتقدمة \u2013 كلية كينجز لندن',
      'ماجستير في طب أسنان الأطفال \u2013 كلية كينجز لندن',
      'دبلوم عضو هيئة تدريس طب الأسنان في الكلية الملكية للجراحين في أيرلندا (MFDRCSI)',
      'بكالوريوس جراحة الأسنان \u2013 جامعة الكويت (BDS)',
      'بكالوريوس العلوم الطبية \u2013 جامعة الكويت (BMS)',
    ],
    expertise: [
      'Comprehensive Dental treatment (preventive and aesthetic restorations, crowns, pulp treatment, and extractions)',
      'Treating children with special needs',
      'Managing children with medically compromised diseases and syndromes',
      'Dental treatment for children with cleft lip and/or palate',
      'Dental emergencies and oral trauma cases',
      'General Anesthesia',
    ],
    expertiseAr: [
      'علاج أسنان شامل (ترميمات وقائية وتجميلية، تيجان، علاج لب الأسنان، وخلع الأسنان)',
      'علاج الأطفال ذوي الاحتياجات الخاصة',
      'إدارة الأطفال المصابين بأمراض ومتلازمات صحية خطيرة',
      'علاج أسنان الأطفال المصابين بالشفة الأرنبية و/أو الحنك المشقوق',
      'حالات طوارئ الأسنان وإصابات الفم',
      'التخدير العام',
    ],
  },
  'dr-salman-ben-nakhi': {
    qualifications: [
      'Full-time faculty staff at KBPD (Kuwait Board of Pediatric Dentistry)',
      'Membership of the Royal College of Surgeons of Edinburgh (MPaedDent RCSEd)',
      'Professional Doctorate of Pediatric Dentistry \u2013 University of Leeds, United Kingdom (DClinDent)',
      'Bachelor of Dental Medicine \u2013 Kuwait University (BDM)',
      'Bachelor of Basic Medical Sciences \u2013 Kuwait University (BMS)',
    ],
    qualificationsAr: [
      'هيئة تدريس متفرغة في المجلس الكويتي لطب أسنان الأطفال (KBPD)',
      'عضوية الكلية الملكية للجراحين في إدنبرة (MPaedDent RCSEd)',
      'دكتوراه مهنية في طب أسنان الأطفال \u2013 جامعة ليدز، المملكة المتحدة (DClinDent)',
      'بكالوريوس طب الأسنان \u2013 جامعة الكويت (BDM)',
      'بكالوريوس العلوم الطبية الأساسية \u2013 جامعة الكويت (BMS)',
    ],
    expertise: [
      'Comprehensive dental treatment (preventive and aesthetic restorations, crowns, pulp treatment, and extractions)',
      'Treating oncology and bleeding disorders patients',
      'Treating children with Special Needs',
      'Managing children with medically compromised disorders and syndromes',
      'Dental treatment for children with cleft lip and/or palate',
      'Dental emergencies and oral trauma cases',
      'Pediatric dental treatment under general anesthesia',
    ],
    expertiseAr: [
      'علاج أسنان شامل (ترميمات وقائية وتجميلية، تيجان، علاج لب الأسنان، وخلع الأسنان)',
      'علاج مرضى الأورام واضطرابات النزيف',
      'علاج الأطفال ذوي الاحتياجات الخاصة',
      'إدارة الأطفال الذين يعانون من اضطرابات ومتلازمات صحية',
      'علاج أسنان الأطفال المصابين بالشفة الأرنبية و/أو الحنك المشقوق',
      'حالات طوارئ الأسنان وإصابات الفم',
      'علاج أسنان الأطفال تحت التخدير العام',
    ],
  },
  'dr-sanketa-patil': {
    qualifications: [
      'Bachelor\u2019s degree in dental surgery (B.D.S.), RGUHS Bangalore, India',
      'Master\u2019s degree in dental surgery (M.D.S.) (Periodontology) Ayush University, Raipur, India',
      'Former Assistant Professor, Ayush University, Raipur, India',
      'Life member of the Indian Society of Periodontology (ISP)',
    ],
    qualificationsAr: [
      'بكالوريوس في جراحة الأسنان (بكالوريوس جراحة الأسنان) من جامعة راجستان الحكومية للعلوم الصحية، بنغالور، الهند',
      'ماجستير في جراحة الأسنان (ماجستير جراحة الأسنان) (طب دواعم الأسنان) من جامعة أيوش، رايبور، الهند',
      'أستاذ مساعد سابق في جامعة أيوش، رايبور، الهند',
      'عضو دائم في الجمعية الهندية لطب دواعم الأسنان (ISP)',
    ],
    expertise: [
      'Flap surgery (Pocket reduction)',
      'Regenerative Surgeries: Bone grafts, GTR',
      'Mucogingival surgeries: Gum corrections',
      'Scaling and Root planning (Deep scaling)',
      'Teeth whitening / Bleaching',
    ],
    expertiseAr: [
      'جراحة رفرفة الأسنان (تصغير الجيوب)',
      'جراحات التجديد: ترقيع العظام، وزراعة اللثة',
      'جراحات اللثة المخاطية: تصحيح اللثة',
      'تنظيف الجذور (التنظيف العميق)',
      'تبييض الأسنان',
    ],
  },
  'dr-nourah-adnan-saad-alrubaian': {
    qualifications: [
      'Membership of the Royal College of Surgeons of Edinburgh (MPaed Dent RCSEd)',
      'Postgraduate Certificate in Advanced Clinical Dental Practice in Pediatric Dentistry-King\u2019s College London',
      'Master of Science in Pediatric Dentistry-King\u2019s College London',
      'Membership of the Faculty of Dentistry of the Royal College of Surgeons in Ireland (MFD RCSI)-Part 1',
      'Bachelor of Dental Medicine-Kuwait University',
      'Bachelor of Medical Science-Kuwait University',
      'Seconded clinical supervisor in the Faculty of Dentistry at Kuwait University',
    ],
    qualificationsAr: [
      'عضوية الكلية الملكية للجراحين في إدنبرة (ماجستير في طب أسنان الأطفال، ( RCSEd)',
      'شهادة دراسات عليا في الممارسة السريرية المتقدمة لطب أسنان الأطفال \u2013 كلية كينجز لندن',
      'ماجستير في طب أسنان الأطفال \u2013 كلية كينجز لندن',
      'عضوية كلية طب الأسنان في الكلية الملكية للجراحين في أيرلندا (MFD RCSI) \u2013 الجزء الأول',
      'بكالوريوس طب الأسنان \u2013 جامعة الكويت',
      'بكالوريوس العلوم الطبية \u2013 جامعة الكويت',
      'مشرف سريري مُعار في كلية طب الأسنان بجامعة الكويت',
    ],
    expertise: [
      'Comprehensive dental treatment for children and special needs patients',
      'Treating children with medically compromised conditions and syndromes',
      'Management of dental phobia/anxiety',
      'Dental trauma and emergencies',
      'Dental treatment under general anesthesia',
    ],
    expertiseAr: [
      'علاج أسنان شامل للأطفال والمرضى ذوي الاحتياجات الخاصة',
      'علاج الأطفال الذين يعانون من حالات طبية طارئة ومتلازمات',
      'إدارة رهاب/قلق طبيب الأسنان',
      'إصابات الأسنان وحالات الطوارئ',
      'علاج الأسنان تحت التخدير العام',
    ],
  },
  'dr-rajesh-r-patil': {
    qualifications: [
      'Bachelor\u2019s degree in dental surgery (BDS) KUD, Dharwad, India',
      'Master\u2019s degree in dental surgery (Conservative dentistry and Endodontics), K.L.E University, Belgaum, India',
      'Former associate professor and postgraduate guide (affiliated with Ayush University, Raipur, India)',
      'Life member of the Indian Association of conservative dentistry and Endodontics (IACDE) AND Indian endodontic society (IES)',
    ],
    qualificationsAr: [
      'بكالوريوس في جراحة الأسنان (BDS) من جامعة KUD، دارواد، الهن.',
      'ماجستير في جراحة الأسنان (طب الأسنان المحافظ وعلاج لب الأسنان) من جامعة K.L.E، بلجاوم، الهند',
      'أستاذ مشارك سابق ومرشد دراسات عليا (منتسب إلى جامعة أيوش، رايبور، الهند)',
      'عضو دائم في الجمعية الهندية لطب الأسنان المحافظ وعلاج لب الأسنان (IACDE) والجمعية الهندية لعلاج لب الأسنان (IES)',
    ],
    expertise: [
      'Recent Endodontic Techniques (Root Canal Treatment)',
      'Non- surgical retreatodontics re-treatment',
      'Teeth scaling and whitening',
      'Emergency cases',
      'Aesthetic Tooth Restorations',
      'Dental treatment under General Anesthesia',
    ],
    expertiseAr: [
      'أحدث تقنيات علاج لب الأسنان (علاج قناة الجذر)',
      'إعادة علاج الأسنان بدون جراحة',
      'تنظيف وتبييض الأسنان',
      'حالات الطوارئ',
      'ترميم الأسنان التجميلي',
      'علاج الأسنان تحت التخدير العام',
    ],
  },
  'dr-hamid-ghaderi': {
    titleAr: 'رئيس قسم التخدير والعناية المركزة وعلاج الآلم، استشاري التخدير، نائب المدير الطبي',
    qualifications: [
      'Consultant Anesthesia, ICU & Pain Management',
      'Graduated from the Medical School at the Elite University of Heidelberg, Germany',
      'Practiced at the University of Heidelberg in Germany as Consultant and Lecturer for Anesthesia, Intensive Care, and Pain Management',
      'German Board-certified Anesthesia, Surgical Intensive Care, and clinical pain management from the University of Heidelberg \u2013 Germany',
      'Fellowship in Intensive and Neonatal Care Unit at Children\u2019s Hospital, University of Heidelberg \u2013 Germany',
      'Fellowship in Cardiac Anesthesia, Germany',
      'Member of the German and European Society for Anesthesia, ICU, and Pain Management',
      'Member of the European Society for Cardiac Anesthesia',
    ],
    qualificationsAr: [
      'استشاري تخدير، وحدة العناية المركزة، وعلاج الألم',
      'تخرج من كلية الطب بجامعة هايدلبرغ المرموقة في ألمانيا',
      'مارس عمله في جامعة هايدلبرغ بألمانيا كاستشاري ومحاضر في التخدير، العناية المركزة، وعلاج الألم',
      'حاصل على شهادة البورد الألماني في التخدير، العناية المركزة الجراحية، وعلاج الألم السريري من جامعة هايدلبرغ \u2013 ألمانيا',
      'زمالة في وحدة العناية المركزة وحديثي الولادة في مستشفى الأطفال بجامعة هايدلبرغ \u2013 ألمانيا',
      'زمالة في تخدير القلب \u2013 ألمانيا',
      'عضو في الجمعية الألمانية والأوروبية للتخدير، وحدة العناية المركزة، وعلاج الألم',
      'عضو في الجمعية الأوروبية لتخدير القلب',
    ],
    expertise: [
      'General and Regional Anesthesia for all Specialties and for High-Risk Patients',
      'Anesthesia for Bariatric Surgeries',
      'Epidural Injection for Normal Delivery and Caesarian Section',
      'Subspecialty for pediatrics, neonatal Anesthesia, and Anesthesia for Special needs',
      'Surgical Intensive Care Medicine for Adults and Pediatrics',
      'Chronic Spine Pain (Cervical/Lumbar) with Therapeutic Injections',
      'CT\u2013Guided Cervical/Lumbar Spine Therapeutic Injection (First Qualified Center in Kuwait and the Middle East)',
      'Chronic Pain Management for Headache, Zoster/Shingles, Fibromyalgia, Cancer Pain, and other Pain Conditions',
    ],
    expertiseAr: [
      'التخدير العام والموضعي للحالات الروتينية والحرجة',
      'التخدير الدقيق لعمليات التكميم والسمنة',
      'إعطاء أبرة الظهر للولادة الطبيعية والقيصرية',
      'خبرة دقيقة في تخدير الأطفال الخدج وحديثي الولادة وذوي الاحتياجات الخاصة',
      'العناية المركزة الجراحية والتنفس الصناعي لجميع مراحل العمر',
      'علاج آلام العمود الفقري المزمنة، ألام الرقبة وأسفل الظهر مع إعطاء الأبر العلاجية',
      'المركز الأول والوحيد في الشرق الوسط لإعطاء الأبر العلاجية تحت الأشعة المقطعية لعلاج آلام العمود الفقري والرقبة',
      'علاج آلام الركبة والكتف وبقية المفاصل',
      'علاج الألآم المزمنة الأخرى مثل الصداع بأنواعه والحزام الناري والتليف العضلي وآلام السرطان',
    ],
  },
  'prof-omar-el-khateeb': {
    qualifications: [
      'Consultant of Anesthesia & Intensive Care',
      '40 years of experience in Anesthesia and Painless Labor',
      'Graduate of the Faculty of Medicine \u2013 Alexandria University, Egypt',
      'Master\u2019s Degree in Anesthesia and Surgical Intensive Care \u2013 Alexandria School of Medicine',
      'Doctorate Degree \u2013 Anesthesia Intensive Care and Pain Management \u2013 University of Alexandria 1982',
      'Member of the International Association for the Study of Pain (IASP)',
    ],
    qualificationsAr: [
      'استشاري تخدير وعناية مركزة',
      'خبرة 40 عامًا في التخدير والولادة بدون ألم',
      'خريج كلية الطب – جامعة الإسكندرية، مصر',
      'ماجستير في التخدير والعناية المركزة الجراحية – كلية طب الإسكندرية',
      'دكتوراه – تخدير وعناية مركزة وعلاج الألم – جامعة الإسكندرية، 1982',
      'عضو في الجمعية الدولية لدراسة الألم  (IASP)',
    ],
    expertise: [
      'Obstetric Anesthesia and Analgesia',
      'Epidural Block for Childbirth',
      'Anesthesia for High-Risk Patients',
      'Anesthesia for Elderly Patients',
      'Surgical Intensive Care Medicine for Adults and Pediatrics',
      'Anesthesia for Bariatric Surgeries',
    ],
    expertiseAr: [
      'تخدير وتسكين آلام الولادة',
      'خبرة خاصة في طرق التخدير الموضعي لتخفيف آلام الولادة',
      'تخدير الحالات العالية الخطورة',
      'تخدير الحالات الحرجة وكبار السن',
      'العناية المركزة الجراحية والتنفس الصناعي لجميع مراحل العمر\nالتخدير الدقيق لعمليات التكميم والسمنة',
    ],
  },
  'dr-yasser-haggag': {
    qualifications: [
      'Fellow of the Royal College of Anaesthetists \u2013 Dublin \u2013 Ireland',
      'Member of the Royal College of Anaesthetists \u2013 London, UK',
      'Member of the Obstetric Anaesthetists\u2019 Association \u2013 UK',
      'Member of the Association of Anaesthetists of Great Britain \u2013 Ireland',
      'Member of the British Medical Association \u2013 UK',
      'Member of the Association of Cardio-thoracic Anaesthetists \u2013 Europe',
    ],
    qualificationsAr: [
      'زميل الكلية الملكية لأطباء التخدير – دبلن – أيرلندا',
      'عضو الكلية الملكية لأطباء التخدير – لندن، المملكة المتحدة',
      'عضو جمعية أطباء التخدير التوليدي – المملكة المتحدة',
      'عضو جمعية أطباء التخدير في بريطانيا العظمى – أيرلندا',
      'عضو الجمعية الطبية البريطانية – المملكة المتحدة',
      'عضو جمعية أطباء التخدير لأمراض القلب والصدر – أوروبا',
    ],
    expertise: [
      'Obstetrics & Gynecology: providing regional anaesthesia and analgesia for women in labour or undergoing Caesarean Sections. Including Epidural, Spinal, or CSE techniques',
      'General surgery: providing general anaesthesia, sedation, and pain management techniques to a variety of cases, including laparoscopic and day case surgical procedures',
      'Bariatric surgery',
      'Anaesthesia for Plastics, cosmetic',
      'Pediatric anaesthesia: healthy children and those with special needs',
      'Dental anaesthesia',
      'Intensive Care Medicine: optimising high-risk patients with co-morbidity and those who are in critical conditions before, during, and after surgery',
    ],
    expertiseAr: [
      'النساء والولادة: التخدير النصفي والابيديورال للعمليات القيصرية وتسكين آلام الولادة',
      'الجراحة العامة: وتشمل جراحة المناظير وجراحات اليوم الواحد',
      'جراحة السمنة',
      'جراحات التجميل المختلفة',
      'جراحات الأطفال وذوي الاحتياجات الخاصة',
      'جراحة الأسنان',
      'الرعاية المركزة: الحالات ذات الخطورة الجراحية المتقدمة كحالات، داء السكري، وأمراض الجهاز التنفسي، وأمراض القلب والأوعية الدموية. قبل واثناء وبعد الجراحة',
    ],
  },
  'dr-alaa-abdullah': {
    qualifications: [
      'Bachelor degree in Medicine & Surgery \u2013 Kuwait University, Faculty of Medicine',
      'Kuwaiti Board of Clinical Microbiology',
      'Fellow of the Royal College of Pathologists \u2013 UK',
    ],
    qualificationsAr: [
      'بكالوريوس طب وجراحة جامعة الكويت',
      'البورد الكويتي للأحياء الدقيقة الإكلينيكية',
      'زمالة الكلية الملكية للباثولوجيين \u2013 بريطانيا',
    ],
    expertise: [
      'Diagnosis and management of various infectious diseases',
      'Follow-up and advice on optimal choice of antimicrobial therapy for infection and prophylaxis, including multi-drug resistant organisms',
      'Reporting of all bacteriology, parasitology, mycology, molecular biology, and serological tests',
      'Implementing strategies for the Antibiotic Stewardship Program',
      'Hospital antibiogram interpretation and clinical correlation',
      'Revising and updating Hospital antibiotic policies',
      'Hospital infection control activities',
    ],
    expertiseAr: [
      'تشخيص وعلاج جميع الأمراض المعدية',
      'متابعة وإعطاء الاستشارات لاستخدام المضادات الحيوية للعلاج والوقاية من الالتهابات البكتيرية بأنواعها، بما فيها البكتيريا المقاومة للمضادات الحيوية',
      'اعتماد وإصدار التقارير لجميع نتائج المختبر',
      'تطبيق استراتيجيات برنامج ترشيد استخدام المضادات الحيوية (Antibiotic Stewardship Program)',
      'تفسير نتائج خريطة حساسية المضادات الحيوية بالمستشفى (Antibiogram) وربطها بالحالة السريرية',
      'مراجعة وتجديد لوائح استخدام المضادات الحيوية في المستشفى',
      'الإشراف على نشاطات قسم الأمراض المعدية في المستشفى',
    ],
  },
  'dr-najat-rouhaldeen': {
    qualifications: [
      'Graduate of Kuwait University Faculty of Medicine',
      'Fellow of the Royal College of Pathologists UK',
      'Member of the Kuwait Clinical Laboratory Association / Society',
      'Member of the Clinical Hematology Association / Society',
    ],
    qualificationsAr: [
      'خريج كلية الطب بجامعة الكويت',
      'زميل الكلية الملكية البريطانية لعلم الأمراض',
      'عضو في جمعية المختبرات السريرية الكويتية',
      'عضو في جمعية أمراض الدم السريرية',
    ],
    expertise: [
      'Providing integrated services in diagnosing and treating the following cases:',
      'Acquired anemia',
      'Hereditary anemia diseases',
      'White blood cells and immune disorders',
      'Platelet abnormalities',
      'Acquired and hereditary bleeding diseases',
      'Thrombotic disease and venous thromboembolism',
      'bone marrow disorder',
      'Diagnosis and treatment of the following categories:',
      'Blood diseases during pregnancy and after childbirth',
      'Hematology of premature babies and children',
      'Blood diseases associated with the elderly',
      'Blood diseases associated with chronic disease states',
      'Blood diseases before and after bariatric operations',
      'Follow-up patients treated with different blood thinners',
    ],
    expertiseAr: [
      'تقديم خدمات متكاملة من تشخيص وعلاج الحالات التالية:',
      'أمراض فقر الدم المكتسبة',
      'امراض فقر الدم الوراثية',
      'اضطرابات كريات الدم البيضاء والمناعة',
      'اختلال الصفائح الدموية',
      'أمراض النزيف المكتسب والوراثي',
      'أمراض التخثر والجلطات الوريدية',
      'اضطراب نخاع العظم',
      'تشخيص وعلاج الفئات التالية :',
      'أمراض الدم خلال الحمل وبعد الولادة',
      'أمراض الدم الخدج والأطفال',
      'أمراض الدم المصاحبة لكبار السن',
      'أمراض الدم المصاحبة للحالات المرضية المزمنة.',
      'أمراض الدم قبل وبعد عمليات التخسيس',
    ],
  },
  'dr-salah-al-wuhaib': {
    qualifications: [
      'Graduate of the Kuwait University Faculty of Medicine',
      'Fellow of The Royal College of Physicians of Canada',
      'Fellow of The Royal College of Pathologists of the UK',
      'Diplomate of the American Board of Pathology',
      'Member of the European Board of Pathologists',
      'Specialty in Kidney diseases from Harvard University',
      'Assistant Professor, Kuwait University Faculty of Medicine',
    ],
    qualificationsAr: [
      'خريج جامعة الكويت كلية الطب',
      'زميل الكلية الملكية للأطباء في كندا',
      'زميل الكلية الملكية لعلم الأمراض في المملكة المتحدة',
      'البورد الأمريكي في علم الأمراض',
      'عضو في المجلس الأوروبي لعلم الأمراض',
      'تخصص في أمراض الكلى من جامعة هارفارد',
      'أستاذ مساعد، كلية الطب جامعة الكويت',
    ],
    expertise: [
      'Fine needle aspiration of Tumours',
      'Microscopic Diagnosis of Tissue',
      'Microscopic Diagnosis of Cells',
      'Microscopic Diagnosis of Tumours',
      'Specialized in the diagnosis of Kidney biopsies',
      'Specialized in the Genetics of Kidney Diseases',
      'Specialized in Diagnosis of Muscle Biospies',
      'Specialized in Electron Microscopy',
    ],
    expertiseAr: [
      'سحب عينات بالإبر الدقيقه من الأورام',
      'التشخيص المجهري للأنسجة',
      'التشخيص المجهري للخلايا',
      'التشخيص المجهري للأورام',
      'متخصص في تشخيص خزعات الكلى',
      'متخصص في علم الوراثة في أمراض الكلى',
      'متخصص في تشخيص خزعات العضلات',
      'متخصص في الميكروسكوب الالكتروني في تشخيص الأنسجة',
    ],
  },
  'dr-adel-al-ali': {
    qualifications: [
      'Professor, Faculty of Medicine, Kuwait University',
      'American Board of Radiology (Diagnostic Radiology)',
      'American Board in Vascular & Interventional Radiology (Endovascular Surgery)',
      'Fellowship in Body Imaging, University of Miami',
      'Fellowship in Vascular & Interventional Radiology. (Endovascular Surgery), University of Vermont',
      'Fellowship in Musculoskeletal Radiology, University of Miami',
    ],
    qualificationsAr: [
      'أستاذ بكلية الطب، جامعة الكويت',
      'البورد الأمريكي في الأشعة (الأشعة التشخيصية)',
      'البورد الأمريكي في الأشعة الوعائية والتداخلية (جراحة الأوعية الدموية الداخلية)',
      'زمالة في تصوير الجسم، جامعة ميامي',
      'زمالة في الأشعة الوعائية والتداخلية (جراحة الأوعية الدموية الداخلية)، جامعة فيرمونت',
      'زمالة في أشعة الجهاز العضلي الهيكلي، جامعة ميامي',
    ],
    expertise: [
      'The following conditions can be treated without surgery, using the latest minimally invasive technology:',
      'Varicose Veins and Spider Veins',
      'Uterine Fibroids',
      'Women\u2019s Health: Pelvic Pain, Infertility',
      'Men\u2019s Health: Varicocele',
      'Angioplasty and Stent Placement',
      'Abdominal Aortic Aneurysm',
      'Deep Vein Thrombosis (DVT)',
      'Central Venous Access Cathetars (CVAC)',
      'Gastrostomy (Feeding Tubes)',
      'Peripheral Arterial Disease',
    ],
    expertiseAr: [
      'علاج الحالات التالية من دون تدخل جراحي وباستخدام أحدث التقنيات الدقيقة',
      'دوالي الساق',
      'الأورام الليفية في الرحم (الألياف)',
      'آلام في منطقة الحوض عند النساء',
      'العقم عند النساء ( إنسداد قناة الفالوب)',
      'دوالي الخصية (العقم عند الرجال)',
      'علاج ضيق الشرايين في البطن والأطراف السفلى',
      'القسطرة الوريدية المركزية (CVAC)',
      'علاج الجلطات الوريدية (DTV)',
      'تركيب قساطر غسيل الكلى',
      'تركيب أنابيب التغذية في المعدة',
    ],
  },
  'dr-osama-al-saeed': {
    qualifications: [
      'American Board of Radiology',
      'Fellowship in Body imaging. Miami-USA',
      'Professor in Clinical Radiology \u2013 Faculty of Medicine \u2013 Kuwait University',
      'International reviewer for major radiology journals',
      'Prior Head of Department in Kuwait University and Amiri Hospital',
    ],
    qualificationsAr: [
      'البورد الامريكي في الاشعة التشخيصية',
      'زمالة الرنين المغناطيسي والاشعة المقطعية – ميامي – الولايات المتحدة الامريكية',
      'أستاذ الأشعة السريرية جامعة الكويت',
      'رئيس قسم الاشعة السابق في كلية الطب ومستشفى الاميري',
      'مراجع دولي لأبحاث ودراسات الاشعة الرنين المغناطيسي في الولايات المتحدة',
    ],
    expertise: [
      'More than 30 Years of Experience in Clinical Radiology in Kuwait and the United States',
      'Expert in MRI imaging. \u2013 Expert in Computerized Tomography',
      'Diagnosis of all Brain Disorders with MRI',
      'Diagnosis of all Neck and Back pains/disorders with MRI',
      'Diagnosis of all Joint disorders with MRI',
      'Diagnosis of Congenital Disorders in Children',
      'Diagnosis of Vascular Disorders in the Head and Neck',
    ],
    expertiseAr: [
      'أكثر من 30 سنة خبرة بالأشعة التشخيصية والرنين المغناطيسي بالولايات المتحدة والكويت',
      'خبرة دقيقة بالرنين المغناطيسي والاشعة المقطعية لكافة اعضاء الجسم',
      'خبرة بتشخيص جميع امراض الجهاز العصبي والمخ',
      'خبرة بتشخيص جميع الام الرقبة والظهر بالرنين المغناطيسي',
      'خبرة بتشخيص جميع امراض والام المفاصل',
      'تشخيص الاصابات الرياضية وامراض الروماتيزم للعضلات والمفاصل',
      'تشخيص التشوهات الخلقية لدى الاطفال',
      'تشخيص امراض وضيق الاوعية الدموية بالرقبة والرأس',
    ],
  },
  'dr-yomna-abdelaal-husseiny': {
    qualifications: [
      'Ass. Lecturer of Radiodignosis- Faculty of Medicine, Al-Azhar University',
      'Master\u2019s degree in radiodiagnosis, Al-Azhar University',
      'Member of the European Society of Radiology',
      'Member of the Egyptian Society of Radiology',
      'Member of the Kuwait Society of Radiology',
    ],
    qualificationsAr: [
      'أستاذ مساعد في التشخيص الإشعاعي \u2013 كلية الطب، جامعة الأزهر',
      'ماجستير في التشخيص الإشعاعي، جامعة الأزهر',
      'عضو الجمعية الأوروبية للأشعة',
      'عضو الجمعية المصرية للأشعة',
      'عضو الجمعية الكويتية للأشعة',
    ],
    expertise: [
      'Diagnosis of gastrointestinal diseases by ultrasound',
      'Diagnosis of genitourinary diseases by ultrasound',
      'Diagnosis of breast cancer and disease by ultrasound',
      'Early detection of fetal anomalies by ultrasound',
      'Diagnosis of endocrine neoplasm and diseases by ultrasound',
      'Diagnosis of vascular diseases by Color Doppler ultrasound',
      'Diagnosis of Musculoskeletal pain by superficial ultrasound',
      'Assessment of subdermal filler injections by superficial ultrasound',
      'Diagnosis of uterine and tubal diseases causing infertility and recurrent abortion by HSG',
    ],
    expertiseAr: [
      'تشخيص أمراض الجهاز الهضمي بالموجات فوق الصوتية',
      'تشخيص أمراض الجهاز البولي التناسلي بالموجات فوق الصوتية',
      'تشخيص سرطان الثدي وأمراضه بالموجات فوق الصوتية',
      'الكشف المبكر عن تشوهات الأجنة بالموجات فوق الصوتية',
      'تشخيص أورام الغدد الصماء وأمراضها بالموجات فوق الصوتية',
      'تشخيص أمراض الأوعية الدموية بالموجات فوق الصوتية دوبلر الملون',
      'تشخيص آلام الجهاز العضلي الهيكلي بالموجات فوق الصوتية السطحية',
      'تقييم حقن الفيلر تحت الجلد بالموجات فوق الصوتية السطحية',
      'تشخيص أمراض الرحم وقناتي فالوب المسببة للعقم والإجهاض المتكرر عن طريق تصوير الرحم بالصبغة (HSG)',
    ],
  },
  'dr-mustafa-alfiki': {
    name: 'Mustafa Alfiki',
    nameAr: 'مصطفى الفقى',
    qualifications: [
      'Bachelor\u2019s Degree in Clinical Pharmaceutical Science (BPharm)',
      'Master\u2019s Degree in Clinical Pharmacology and Toxicology, Cairo University',
      'Doctor of Pharmacy Degree (PharmD)',
      'Published and contributed to several research papers',
      'Member of the Kuwait Pharmaceutical Association',
      'Over 10 years of experience in all aspects of medication management and pharmacy operations',
    ],
    qualificationsAr: [
      'درجة البكالوريوس في علوم الصيدلة الاكلينيكية',
      'درجة الماجستير في العلم السريرى للأدوية والسموم، جامعة القاهرة',
      'درجة دكتور في الصيدلة',
      'نشر والمساهمة في عدة أبحاث علمية',
      'عضو في جمعية الصيادلة الكويتية',
      'أكثر من 10 سنوات من الخبرة في جميع جوانب التحكم فى الأدوية وتطوير الصيدليات',
    ],
    expertise: [
      'Clinical pharmacy care in various settings, including Critical Care (ICU, CCU, NICU), PACU, different inpatient wards, oncology, and outpatient care',
      'IV mixtures & TPN (Total Parenteral Nutrition)',
      'Medication Management Therapy (MMT)',
      'Medication Safety',
      'Identifying and mitigation medication related risks through risk assessments and safety initiatives',
      'Implementing strategies to prevent medication errors and adverse drug events',
      'Conducting regular audits to ensure proper medication use, minimize errors, and maintain regulatory standards compliance',
      'Therapeutic Drug Monitoring (TDM)',
      'Medication Reconciliation',
      'Patient Counseling & Education',
      'Drug Therapy Consultations',
      'Medication Management Accreditation Programs, including JCI and Canadian accreditations',
      'Antimicrobial stewardship programs and infection control practices',
      'Delivering tailored training programs to enhance the skills and knowledge of healthcare professionals from diverse backgrounds',
      'Over a decade of expertise in all facets of pharmacy operations and management',
    ],
    expertiseAr: [
      'الرعاية الصيدلانية الاكلينيكية في مختلف الأقسام بما في ذلك العنايات المركزة بمختلف أنواعها، الأجنحة المختلفة للمرضى الداخليين، الأورام والعيادات الخارجية',
      'الوريدية بمختلف أنواعها وأيضا محاليل التغذية الوريدية الكاملة تحضير الأدوية',
      'إدارة العلاج باستخدام الأدوية',
      'تحقيق السلامة فى استخدام الأدوية',
      'تحديد وتخفيف المخاطر المتعلقة بالأدوية من خلال تقييم المخاطر',
      'تنفيذ استراتيجيات لمنع الأخطاء فى استخدام الأدوية وأثارها الجانبية',
      'إجراء تدقيقات منتظمة لضمان الاستخدام السليم للأدوية، تقليل الأخطاء، والحفاظ على الامتثال للمعايير التنظيمية',
      'مراقبة المستوى العلاجي للأدوية',
      'تثقيف وارشاد المرضى',
      'استشارات الخطط العلاجية',
      'برامج اعتماد إدارة استخدام الأدوية، بما في ذلك الاعتمادات الدولية من كندا وأمريكا',
      'برامج إدارة استخدام مضادات الميكروبات وممارسات السيطرة على العدوى',
      'تقديم برامج تدريب مخصصة لتعزيز مهارات ومعرفة المتخصصين في الرعاية الصحية من خلفيات متنوعة',
      'أكثر من عقد من الخبرة في جميع جوانب عمليات وادارة الصيدليات',
    ],
  },
  'dr-mirvat-sameer-ghanem': {
    name: 'Mirvat Sameer Ghanem',
    nameAr: 'مـيــرفــت غــانـــم',
    qualifications: [
      'B. Sc. in Pharmacy \u2013 University of Jordan',
      'More than 20 years in Pharmacy Management & Development',
      'Member of the Jordan Pharmaceutical Association',
      'Member of the Kuwait Pharmaceutical Association',
      'Certified Purchasing Professional (CPP) AURORA, ILLINOIS \u2013 USA',
    ],
    qualificationsAr: [
      'بكالوريوس صيدلة \u2013 الجامعة الأردنية',
      'أكثر من 20 عاماً خبرة في إدارة وتطوير الصيدليات',
      'عضو الجمعية الصيدلية الأردنية',
      'عضو الجمعية الصيدلية الكويتية',
      'حاصل على الشهادة الاحترافية المعتمدة في المشتريات \u2013 إلينوي، الولايات المتحدة الأمريكية',
    ],
    expertise: [
      'All Aspects of the Pharmacy Operations (more than 20 years)',
      'Pharmacological Uses and Side Effects of Drugs and Controlled Substances',
      'Medications Reconciliation',
      'Patient Counseling & Education',
      'All aspects of Infection Prevention & Control',
      'Medication Safety (Achieve Zero Harm)',
      'Medication Management Therapy (MMT)',
      'Medication Management Self- Assessment Team (MMSAT) for Accreditation Canada International (ACI)',
      'Revenue Cycle Management',
      'Training and coaching the pharmacy team, Clinical Staff, and University Medical Senior students to ensure they achieve excellence',
    ],
    expertiseAr: [
      'كافة جوانب عمليات الصيدلية (أكثر من 20 عاماً)',
      'الاستخدامات الدوائية والآثار الجانبية للأدوية والمواد الخاضعة للرقابة / (المواد المخدرة)',
      'التوفيق بين الأدوية / (الاختيار الأمثل للأدوية)',
      'إرشاد وتثقيف المرضى',
      'جميع جوانب الوقاية والسيطرة على العدوى',
      'سلامة الأدوية (تحقيق انعدام الضرر) / (تحقيق صفر أضرار)',
      'العلاج بالإدارة الدوائية / (العلاج الدوائي) (MMT)',
      'فريق تقييم الإدارة الذاتية للأدوية (MMSAT) للحصول على شهادة الاعتماد الكندي الدولي (ACI)',
      'إدارة دورة الإيرادات',
      'تدريب وتوجيه فريق الصيدلة والطاقم السريري وطلاب الطب الجامعيين الكبار لضمان تحقيق التميز',
    ],
  },
};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatArray(name, items) {
  return `${name}: [\n${items.map((s) => `      '${esc(s)}',`).join('\n')}\n    ]`;
}

function patchScalar(block, key, value) {
  const re = new RegExp(`${key}: '[^']*',`);
  if (!re.test(block)) return block;
  return block.replace(re, `${key}: '${esc(value)}',`);
}

function patchDoctorBlock(block, data) {
  for (const key of ['name', 'nameAr', 'title', 'titleAr']) {
    if (data[key]) block = patchScalar(block, key, data[key]);
  }
  for (const key of ['qualifications', 'qualificationsAr', 'expertise', 'expertiseAr']) {
    if (!data[key]) continue;
    const keyStart = block.indexOf(`${key}: [`);
    if (keyStart === -1) continue;
    const keyEnd = block.indexOf('],', keyStart);
    if (keyEnd === -1) continue;
    const replacement = formatArray(key, data[key]);
    block = block.slice(0, keyStart) + replacement + block.slice(keyEnd + 1);
  }
  return block;
}

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [id, data] of Object.entries(patches)) {
    const marker = `id: '${id}'`;
    const start = content.indexOf(marker);
    if (start === -1) {
      console.log(`SKIP ${id} in ${filePath}`);
      continue;
    }
    const nextId = content.indexOf("\n  {\n    id: '", start + 10);
    const end = nextId === -1 ? content.length : nextId;
    const block = content.slice(start, end);
    const patched = patchDoctorBlock(block, data);
    content = content.slice(0, start) + patched + content.slice(end);
    count++;
  }
  fs.writeFileSync(filePath, content);
  console.log(`patched ${count} doctors in ${filePath}`);
}

for (const file of TARGETS) {
  patchFile(file);
}

console.log('done');
