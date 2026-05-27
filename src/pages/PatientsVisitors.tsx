import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import InsurancePartners from "@/components/InsurancePartners";
import { Stethoscope, Shield, Bed, ClipboardList, Scale, Globe, CheckCircle2, Phone, Clock, Wifi, Tv, Newspaper, UtensilsCrossed, Sparkles, Search, AlertTriangle, Baby, Lock, Radio, Users, ChevronDown, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import { Link, useSearchParams } from "react-router-dom";
const PatientsVisitors = () => {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const showAll = !tab;
  const show = (s: string) => showAll || tab === s;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [tab]);

  // ─── ROOMS PACKAGE PDF LINKS ───────────────────────────────────────────
  // Using local PDF files from /public/images/doctors/
  const roomsPdfEn = "https://royal-hayat.s3.eu-central-1.amazonaws.com/doctors/RHHBirthingPackagesEng6Jan2026.pdf";
  const roomsPdfAr = "https://royal-hayat.s3.eu-central-1.amazonaws.com/doctors/RHHBirthingPackagesArb6Jan2026.pdf";
  // ───────────────────────────────────────────────────────────────────────

  const sectionClass = "scroll-mt-[calc(var(--header-height,76px)+2rem)]";

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden flex flex-col [&_.text-accent]:text-[#816107]">
      <Header />

      {/* Hero */}
      <section className={`bg-primary/5 ${tab === "rooms-package" ? "py-6 md:py-8" : "py-16 md:py-20"}`}>
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {lang === "ar" ? (tab === "admission" ? "للمرضى" : "لمرضانا") : "For Our Patients"}
            </p>
            <h1 className={`font-serif text-foreground mb-4 ${tab === "rooms-package" ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"}`}>
              {tab === "nursing" ? (lang === "ar" ? "التمريض" : "Nursing")
                : tab === "admission" ? (lang === "ar" ? "معلومات الدخول إلى المستشفى" : "Admission Information")
                  : tab === "insurance" ? (lang === "ar" ? "التأمين الصحي" : "Health Insurance")
                    : tab === "during-stay" ? (lang === "ar" ? "أثناء إقامتك" : "During Your Stay")
                      : tab === "rooms-package" ? (lang === "ar" ? "باقات أجنحة الولادة" : "Birthing Suites Packages")
                        : tab === "bill-of-rights" ? (lang === "ar" ? "وثيقة حقوق المريض" : "Patient Bill of Rights")
                          : (lang === "ar" ? "معلومات للمرضى والزوار" : "Information for Patients & Visitors")}
            </h1>
            {tab !== "rooms-package" && (
              <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">
                {lang === "ar"
                  ? tab === "admission"
                    ? "كل ما تحتاجون معرفته لتجربة مريحة وواضحة في مستشفى رويال حياة."
                    : tab === "nursing"
                      ? "كل ما تحتاجون معرفته لضمان تجربة مريحة وواضحة خلال زيارتكم وإقامتكم في مستشفى رويال حياة."
                      : "كل ما تحتاج معرفته لتجربة مريحة ومطلعة في مستشفى رويال حياة."
                  : "Everything you need to know for a comfortable and informed experience at Royale Hayat Hospital."}
              </p>
            )}
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* All Sections */}
      <section className={tab === "rooms-package" ? "flex-1 flex flex-col py-0" : "py-12 md:py-16"}>
        <div className={tab === "rooms-package" ? "w-full flex-1 flex flex-col" : "container mx-auto px-6"}>
          <div className={tab === "rooms-package" ? "w-full flex-1 flex flex-col" : "max-w-4xl mx-auto space-y-20"}>
            {showAll && (
              <ScrollAnimationWrapper>
                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-serif text-foreground mb-3">{lang === "ar" ? "مرحباً بكم في صفحة معلومات للمرضى والزوار" : "Welcome to Information for Patients & Visitors"}</h2>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {lang === "ar" ? "في مستشفى رويال حياة، نلتزم بتقديم تجربة استثنائية لكل مريض وزائر، وذلك من خلال خدمات متكاملة تجمع بين الرعاية الطبية المتقدمة والراحة والاهتمام بأدق التفاصيل. هنا ستجدون جميع المعلومات المتعلقة بإقامتكم والخدمات المقدمة لكم بكل سهولة ووضوح." : "This is a test text that will be replaced later. We are committed to providing an exceptional experience for every patient and visitor at Royale Hayat Hospital. Here you will find all the information related to your stay and our services."}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            )}

            {/* NURSING */}
            {show("nursing") && <div id="section-nursing" className={sectionClass}>
              <ScrollAnimationWrapper>
                {showAll && <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "التمريض" : "Nursing"}</h2>
                </div>}

                <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
                  <p>
                    {lang === "ar" ? "نفخر في مستشفى رويال حياة بتقديم رعاية تمريضية استثنائية من خلال فريق من الممرضين والممرضات المؤهلين والمعتمدين، المعروفين باحترافيتهم العالية وروحهم الإنسانية." : "At Royale Hayat Hospital, we take pride in delivering exceptional nursing care through a team of highly trained, qualified, and certified professionals. Renowned for their dedication and compassion, our nurses are at the heart of every patient experience, ensuring comfort, safety, and support 24 hours a day."}
                  </p>
                  <p>
                    {lang === "ar" ? "يشكل فريق التمريض محور تجربة المريض، حيث يعمل على توفير الراحة والأمان والدعم على مدار الساعة، سواء للمرضى المنومين أو المراجعين الخارجيين." : "Whether you're receiving inpatient or outpatient care, you are in capable hands. Each nursing unit is led by an experienced director, supported by a team of registered nurses who uphold the highest standards of clinical excellence."}
                  </p>
                  {lang === "ar" && (
                    <p>
                      يقود كل قسم تمريضي مدير تمريض ذو خبرة، مدعوم بفريق من الممرضين المسجلين الذين يلتزمون بأعلى معايير الجودة والرعاية السريرية.
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="font-serif text-lg text-foreground mb-4">{lang === "ar" ? "التزامنا يشمل:" : "Our Commitment Includes:"}</h3>
                  <div className="space-y-3">
                    {(lang === "ar" ? [
                      "رعاية تمريضية متواصلة على مدار 24 ساعة وفق احتياجات كل مريض",
                      "إشراف ومتابعة من الكوادر التمريضية القيادية في جميع الأقسام",
                    ] : [
                      "Round-the-clock nursing care tailored to patient needs",
                      "Leadership and supervision by senior nursing staff in every department",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                    <div className="bg-popover border border-border/50 rounded-xl px-5 py-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-body text-sm text-foreground">{lang === "ar" ? "تطوير مهني مستمر من خلال برامج تدريبية متخصصة تشمل:" : "Ongoing professional development through structured training in:"}</span>
                          <ul className="mt-2 ml-4 space-y-1">
                            <li className="font-body text-sm text-muted-foreground">• {lang === "ar" ? "الإسعافات الأولية" : "First aid"}</li>
                            <li className="font-body text-sm text-muted-foreground">• {lang === "ar" ? "مكافحة العدوى" : "Infection control"}</li>
                            <li className="font-body text-sm text-muted-foreground">• {lang === "ar" ? "أحدث ممارسات رعاية المرضى المتقدمة" : "Advanced patient care practices"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>}

            {/* HEALTH INSURANCE */}
            {show("insurance") && <div id="section-insurance" className={sectionClass}>
              <ScrollAnimationWrapper>
                {showAll && <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "التأمين الصحي" : "Health Insurance"}</h2>
                </div>}

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                  {lang === "ar"
                    ? "يحرص قسم التأمين الصحي في مستشفى رويال حياة على جعل تجربتكم العلاجية أكثر سهولة وراحة، من خلال التعاون مع معظم شركات التأمين الطبي الخاصة المعتمدة في الكويت، وتوفير حلول دفع مرنة للمرضى المشمولين بالتغطية التأمينية."
                    : "At Royale Hayat Hospital, our Medical Insurance Department is dedicated to making your healthcare experience as smooth and stress-free as possible. We have established partnerships with most major private medical insurance companies and offer a tailored payment scheme for patients covered under private insurance programs."}
                </p>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "خدمة المطالبات المباشرة" : "Direct Billing Support"}</h3>
                  {lang === "ar" ? (
                    <>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                        يقوم فريقنا بإدارة جميع معاملات المطالبات والتنسيق المباشر مع شركة التأمين الخاصة بكم لتقليل أي إجراءات إضافية عليكم.
                      </p>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                        ولضمان الاستفادة من الخدمة، يرجى التأكد من توفير المعلومات التالية بشكل صحيح:
                      </p>
                    </>
                  ) : (
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                      We handle all billing submissions and facilitate direct billing to your insurance provider, ensuring minimal hassle for you. To enable this service, please ensure the following information is accurately provided:
                    </p>
                  )}
                  <div className="space-y-2">
                    {(lang === "ar" ? ["رقم وثيقة التأمين", "رقم المجموعة", "العنوان البريدي الصحيح"] : ["Insurance policy number", "Group number", "Correct mailing address"]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "خدمات دعم التأمين" : "Comprehensive Insurance Assistance"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar"
                      ? "فريق التأمين المتخصص لدينا جاهز لمساعدتكم في جميع مراحل الإجراءات، وتشمل الخدمات:"
                      : "Our experienced insurance team is here to guide you through every step of the process. Services include:"}
                  </p>
                  <div className="space-y-2">
                    {(lang === "ar" ? [
                      "شرح تفاصيل وثيقة التأمين والتغطية",
                      "المساعدة في التسجيل والتقديرات المالية",
                      "التنسيق للحصول على الموافقات المسبقة للتنويم والعمليات الجراحية",
                    ] : [
                      "Educating patients on insurance policy details",
                      "Assistance with registration and financial estimates",
                      "Coordinating pre-approvals for inpatient admissions and surgical procedures",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg text-foreground">{lang === "ar" ? "ساعات العمل" : "Operating Hours"}</h3>
                  </div>
                  {lang === "ar" ? (
                    <>
                      <p className="font-body text-sm text-muted-foreground mb-3">يفتح مكتب التأمين أبوابه خلال الأوقات التالية:</p>
                      <p className="font-body text-sm text-foreground mb-1">الأحد إلى الخميس:</p>
                      <p className="font-body text-sm text-foreground mb-3">8:00 صباحًا – 8:00 مساءً</p>
                      <p className="font-body text-sm text-foreground mb-1">السبت:</p>
                      <p className="font-body text-sm text-foreground">8:00 صباحًا – 4:00 مساءً</p>
                    </>
                  ) : (
                    <>
                      <p className="font-body text-sm text-muted-foreground mb-1">Our insurance office is open:</p>
                      <p className="font-body text-sm text-foreground">Sunday – Thursday: 8:00 AM – 8:00 PM</p>
                      <p className="font-body text-sm text-foreground">Saturday: 8:00 AM – 4:00 PM</p>
                    </>
                  )}
                  <div className="flex items-center gap-2 mt-4">
                    <Phone className="w-4 h-4 text-accent" />
                    <p className="font-body text-sm text-foreground">
                      {lang === "ar"
                        ? "للاستفسارات أو للتأكد من قبول شركة التأمين الخاصة بكم:"
                        : "For inquiries or to verify if your insurance plan is accepted, please contact us at "}
                      <a href="tel:+96525360453" className="text-accent hover:underline font-semibold">25360453</a>
                      {lang === "en" && "."}
                    </p>
                  </div>
                </div>

                <div className="mt-10 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
                  <InsurancePartners />
                </div>
              </ScrollAnimationWrapper>
            </div>}

            {/* BIRTHING SUITES PACKAGES */}
            {show("rooms-package") && <div id="section-rooms-package" className={tab === "rooms-package" ? "flex-1 flex flex-col" : sectionClass}>
              <ScrollAnimationWrapper className={tab === "rooms-package" ? "flex-1 flex flex-col" : ""}>
                {tab === "rooms-package" ? (
                  /* Dedicated Tab View — images stacked one by one */
                  <div className="w-full">
                    {/* Desktop (md+): PC version images */}
                    <div className="hidden md:block w-full space-y-6 px-6 py-6 bg-background">
                      {(lang === "ar"
                        ? [1, 2, 3, 4, 5, 6].map(n => `https://royal-hayat.s3.eu-central-1.amazonaws.com/pc-version/birthing-packages-AR/Birthing+Packages+for_PC+Version_AR_${n}.jpg`)
                        : [1, 2, 3, 4, 5, 6, 7].map(n => `https://royal-hayat.s3.eu-central-1.amazonaws.com/pc-version/birthing-packages-EN/Birthing+Packages+for_PC+Version_Eng_${n}.jpg`)
                      ).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={lang === "ar" ? `باقات الغرف ${i + 1}` : `Birthing Suites Package ${i + 1}`}
                          className="w-full block rounded-2xl shadow-sm"
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      ))}
                    </div>

                    {/* Mobile (< md): Mobile version images */}
                    <div className="md:hidden w-full">
                      {(lang === "ar"
                        ? [1, 2, 3, 4, 5, 6, 7].map(n => `https://royal-hayat.s3.eu-central-1.amazonaws.com/mobile-version/birthing-packages-AR/Birthing+Packages+for_Mobile+Version_AR_${n}.jpg`)
                        : [1, 2, 3, 4, 5, 6, 7].map(n => `https://royal-hayat.s3.eu-central-1.amazonaws.com/mobile-version/birthing-packages-EN/Birthing+Packages+for_Mobile+Version_Eng_${n}.jpg`)
                      ).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={lang === "ar" ? `باقات الغرف ${i + 1}` : `Birthing Suites Package ${i + 1}`}
                          className="w-full block"
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Regular Section View for "All" page - like other sections */
                  <div>
                    {showAll && <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bed className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "باقات أجنحة الولادة" : "Birthing Suites Packages"}</h2>
                    </div>}
                    {/* 
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                      {lang === "ar"
                        ? "يوفر مستشفى رويال حياة مجموعة من الأجنحة الفاخرة. يمكنك استعراض كافة التفاصيل والباقات."
                        : "Royale Hayat Hospital offers a range of luxurious birthing suites. Explore all details and packages."}
                    </p> */}

                    {/* Single preview image */}
                    <div className="w-full rounded-2xl shadow-lg bg-white border border-border/30 overflow-hidden mb-6">
                      <img
                        src={lang === "ar"
                          ? "/images/Birthing-packages/Birthing Packages for_PC Version_AR jpg/Birthing Packages for_PC Version_AR_1.jpg"
                          : "/images/Birthing-packages/Birthing Packages for_PC Version_Eng jpg/Birthing Packages for_PC Version_Eng_1.jpg"
                        }
                        alt={lang === "ar" ? "باقات أجنحة الولادة" : "Birthing Suites Packages"}
                        className="w-full block"
                      />
                    </div>

                    {/* Read More button */}
                    <div className="flex justify-center">
                      <Link
                        to="/patients-visitors?tab=rooms-package"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-sm hover:bg-primary/90 transition-colors shadow-md"
                      >
                        {lang === "ar" ? "اقرأ المزيد" : "Read More"}
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                )}
              </ScrollAnimationWrapper>
            </div>}

            {/* INTERNATIONAL PATIENT */}
            {show("international") && <div id="section-international" className={sectionClass}>
              <ScrollAnimationWrapper>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "مركز المرضى الدوليين" : "International Patient Center"}</h2>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {lang === "ar"
                    ? "يقدّم مركز المرضى الدوليين الدعم الكامل للمرضى من خارج الكويت، من خلال المساعدة في الإجراءات الإدارية، وحجز المواعيد، وترتيبات النقل، والتنسيق المالي، بالإضافة إلى توفير خدمات الترجمة بعدة لغات لضمان تجربة مريحة وسلسة. تبدأ رعاية المرضى الدوليين قبل وصولكم إلى المستشفى، وتستمر طوال فترة إقامتكم. كما يوفّر المركز خدمات متكاملة للمرضى والأطباء المحوِّلين الراغبين في الحصول على استشارة طبية، أو رأي طبي ثانٍ، أو علاج للحالات المعقدة."
                    : "For detailed information about our International Patient Center services, enquiry form, and contact details, please visit the dedicated page."}
                </p>

                <Link
                  to="/international-patient"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {lang === "ar" ? "زيارة مركز المرضى الدوليين" : "Visit International Patient Center"}
                </Link>
              </ScrollAnimationWrapper>
            </div>}

            {/* ADMISSION INFORMATION */}
            {show("admission") && <div id="section-admission" className={sectionClass}>
              <ScrollAnimationWrapper>
                {showAll && <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "معلومات الدخول إلى المستشفى" : "Admission Information"}</h2>
                </div>}

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                  {lang === "ar"
                    ? "في مستشفى رويال حياة، تبدأ راحتكم ورعايتكم منذ لحظة الدخول. سواء تم تحويلكم من طبيب داخل المستشفى أو من جهة خارجية، فإن إجراءات الدخول لدينا تتم بسلاسة لضمان تجربة مريحة لأي عملية جراحية أو إجراء طبي مجدول."
                    : "At Royale Hayat Hospital, your comfort and care begin the moment you're admitted. Whether you're referred by an in-house specialist or an external physician, our streamlined admission process ensures a smooth entry for any planned surgery or medical procedure."}
                </p>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "كيفية الدخول إلى المستشفى" : "How to Get Admitted"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar"
                      ? "يتم ترتيب الدخول مسبقًا بالتنسيق مع فريق المستشفى، وذلك بناءً على:"
                      : "Admission is arranged in advance through coordination with our hospital team. Patients are admitted based on:"}
                  </p>
                  <div className="space-y-2">
                    {(lang === "ar" ? [
                      "تحويل من طبيب داخل المستشفى أو من خارجها",
                      "تحديد موعد مؤكد للدخول من خلال فريق خدمات المرضى",
                    ] : [
                      "A referral from an in-house or external doctor",
                      "A confirmed date of admission is scheduled through our patient services team",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "المستندات المطلوبة للتسجيل" : "What You'll Need for Registration"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar"
                      ? "يرجى تجهيز المستندات التالية لإتمام إجراءات الدخول:"
                      : "To complete your admission, please prepare the following documents:"}
                  </p>
                  <div className="space-y-2">
                    {(lang === "ar" ? [
                      "خطاب تحويل من الطبيب",
                      "اختيار نوع الجناح حسب الرغبة والتوافر",
                      "تعبئة نماذج الدخول (متوفرة في المستشفى أو إلكترونيًا)",
                    ] : [
                      "Doctor's referral letter",
                      "Selection of a suite based on your preference and availability",
                      "Completed admission forms (available at the hospital or online)",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                    <div className="ml-7 space-y-1">
                      <p className="font-body text-sm text-foreground">{lang === "ar" ? "المستندات الرسمية وتشمل:" : "Official documents, including:"}</p>
                      <ul className="ml-4 space-y-1">
                        <li className="font-body text-sm text-muted-foreground">• {lang === "ar" ? "البطاقة المدنية" : "Civil ID"}</li>
                        <li className="font-body text-sm text-muted-foreground">• {lang === "ar" ? "عقد الزواج (لخدمات الولادة أو الخدمات ذات الصلة)" : "Marriage certificate (for maternity or related services)"}</li>
                      </ul>
                    </div>
                    {(lang === "ar" ? [
                      "السجلات الطبية السابقة، مثل نتائج الفحوصات والتقارير والصور الطبية",
                      "بطاقة التأمين أو خطاب الضمان، في حال وجود تأمين صحي",
                    ] : [
                      "Previous medical records, such as test results, imaging, and lab reports",
                      "If insured, please bring your insurance card or letter of guarantee",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "للمرضى الذين لديهم تأمين" : "For Insured Patients"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {lang === "ar"
                      ? "إذا كنتم مشمولين بتأمين صحي خاص، سيقوم قسم التأمين الطبي بمساعدتكم في الحصول على الموافقات المسبقة وتسهيل إجراءات الفوترة المباشرة."
                      : "If you are covered by a private health insurance provider, our Medical Insurance Department will support you in securing pre-approval and facilitating direct billing."}
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mt-2">
                    {lang === "ar" ? (
                      <>
                        يرجى مراجعة{" "}
                        <Link to="/patients-visitors?tab=insurance" className="text-accent hover:underline font-semibold">
                          قسم التأمين الصحي
                        </Link>{" "}
                        للحصول على مزيد من التفاصيل ووسائل التواصل.
                      </>
                    ) : (
                      <>
                        Be sure to review the{" "}
                        <Link to="/patients-visitors?tab=insurance" className="text-accent hover:underline font-semibold">
                          Health Insurance section
                        </Link>{" "}
                        for more detailed information and contact points.
                      </>
                    )}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            </div>}

            {/* DURING YOUR STAY */}
            {show("during-stay") && <div id="section-during-stay" className={sectionClass}>
              <ScrollAnimationWrapper>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bed className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "أثناء إقامتك في مستشفى رويال حياة" : "During Your Stay at Royale Hayat Hospital"}</h2>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                  {lang === "ar" ? "في مستشفى رويال حياة، نلتزم بجعل إقامتك مريحة وآمنة وممتعة قدر الإمكان. اكتشف مجموعة المرافق الفاخرة والخدمات الشخصية المتوفرة لك خلال فترة إقامتك معنا." : "At Royale Hayat Hospital, we are committed to making your stay as comfortable, safe, and pleasant as possible. Explore the range of premium amenities and personalized services available to you during your time with us."}
                </p>

                <h3 className="font-serif text-xl text-foreground mb-5">{lang === "ar" ? "وسائل الراحة المجانية" : "Complimentary Amenities"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {(lang === "ar" ? [
                    { icon: Wifi, title: "خدمة الإنترنت", desc: "ابقَ على اتصال من خلال خدمة الإنترنت عالية السرعة المجانية المتوفرة في جميع أنحاء المستشفى." },
                    { icon: Phone, title: "الهواتف", desc: "استمتع بالمكالمات المحلية والداخلية المجانية. يمكنك استخدام هاتف الغرفة للتواصل مع خدمات الضيافة، أو قسم التدبير المنزلي، أو لطلب خدمة الطعام الخاصة." },
                    { icon: Tv, title: "الترفيه", desc: "استرخِ أمام شاشة التلفاز العريضة، والتي توفر إمكانية الوصول إلى شبكة أوربت-شوتايم، بالإضافة إلى خدمات خاصة بالمستشفى مثل كاميرا القبلة والعناق لمتابعة طفلك حديث الولادة في أي وقت." },
                    { icon: Newspaper, title: "مواد القراءة", desc: "نوفر مجموعة مختارة من أبرز الصحف والمجلات باللغة الإنجليزية والعربية لتستمتع بها خلال إقامتك." },
                  ] : [
                    { icon: Wifi, title: "Wi-Fi Access", desc: "Stay connected with high-speed, complimentary Wi-Fi throughout the hospital." },
                    { icon: Phone, title: "Telephones", desc: "Enjoy free local and internal calls. Use your room telephone to contact Guest Services, Housekeeping, or place a private dining order." },
                    { icon: Tv, title: "Entertainment", desc: "Relax with your wide flat-screen TV, offering access to the Orbit-Showtime Network, as well as hospital-specific services like the Hugs & Kisses Baby Camera, allowing you to check in on your newborn anytime." },
                    { icon: Newspaper, title: "Reading Material", desc: "We provide a selection of leading newspapers and magazines in both English and Arabic for your enjoyment." },
                  ]).map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="bg-popover border border-border/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-accent" />
                        </div>
                        <h4 className="font-serif text-base text-foreground">{item.title}</h4>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <h3 className="font-serif text-xl text-foreground mb-5">{lang === "ar" ? "خدمات الغرف" : "Room Services"}</h3>
                <div className="space-y-4 mb-10">
                  {(lang === "ar" ? [
                    { icon: UtensilsCrossed, title: "الطعام الخاص", desc: "استمتع بأطباق فاخرة من قائمة طعامنا المتنوعة، والتي تشمل المأكولات العالمية، والمتوسطية، والآسيوية، بالإضافة إلى خيارات مخصصة تُحضّر بواسطة طهاتنا التنفيذيين الحائزين على جوائز." },
                    { icon: Sparkles, title: "خدمة التدبير المنزلي", desc: "نوفر خدمة تنظيف الغرف على مدار 24 ساعة مع تجديد يومي للغرفة. كما يمكنك تحديد وقت الخدمة بما يناسبك." },
                    { icon: Search, title: "المفقودات", desc: "في حال فقدان أي غرض، فإن فريق خدمات الضيافة جاهز لمساعدتك. يرجى التواصل معنا لتقديم بلاغ إلى قسم الأمن. وعلى الرغم من أننا لا نتحمل مسؤولية المتعلقات الشخصية، إلا أننا نبذل كل الجهود الممكنة للمساعدة في العثور عليها." },
                  ] : [
                    { icon: UtensilsCrossed, title: "Private Dining", desc: "Savor gourmet dishes from our extensive menu, featuring Continental, Mediterranean, Pan-Asian, and personalized cuisine—all prepared by our award-winning executive chefs." },
                    { icon: Sparkles, title: "Housekeeping", desc: "Enjoy 24-hour housekeeping service with daily room refresh. You may also schedule service at a time that suits you best." },
                    { icon: Search, title: "Lost & Found", desc: "If you misplace an item, our Guest Services team is here to help. Please contact us to file a Lost & Found report with the Security Department. While we are not liable for personal items, we will make every effort to assist in locating them." },
                  ]).map((item, i) => (
                    <div key={i} className="bg-popover border border-border/50 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base text-foreground mb-1">{item.title}</h4>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">{lang === "ar" ? "سياسة الزوار" : "Visitors Policy"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar" ? "يلعب أحباؤك دورًا مهمًا في رحلة تعافيك. ولضمان سلامتك وراحتك، نرجو من الزوار الالتزام بالإرشادات التالية:" : "Your loved ones play a key role in your healing journey. To ensure your safety and comfort, we kindly ask visitors to follow these guidelines:"}
                  </p>
                  <div className="space-y-2">
                    {(lang === "ar" ? [
                      "يُرجى عدم الجلوس على سرير المريض أو لمس الأجهزة الطبية.",
                      "نرجو من جميع الزوار تعقيم أيديهم عند دخول الغرفة وعند مغادرتها.",
                      "يُطلب من الزوار الذين ظهرت عليهم أعراض مثل الحمى، القيء، الإسهال، الطفح الجلدي، أو السعال خلال آخر 72 ساعة الامتناع عن الزيارة.",
                    ] : [
                      "Please do not sit on the patient's bed or handle any medical equipment.",
                      "We request that all visitors sanitize their hands when entering and exiting your room.",
                      "Visitors who have experienced symptoms such as fever, vomiting, diarrhea, rash, or cough within the past 72 hours should refrain from visiting.",
                    ]).map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>}

            {/* PATIENT BILL OF RIGHTS */}
            {show("bill-of-rights") && <div id="section-bill-of-rights" className={sectionClass}>
              <ScrollAnimationWrapper>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "حقوق ومسؤوليات المريض" : "Patient Bill of Rights and Responsibilities"}</h2>
                </div>

                {lang === "ar" && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                    في مستشفى رويال حياة، نلتزم بتقديم رعاية صحية تتمحور حول المريض، مع احترام كامل لحقوقه، إلى جانب تعزيز مسؤولياته لضمان تجربة علاجية آمنة وفعّالة.
                  </p>
                )}

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-4">{lang === "ar" ? "أولاً: حقوق المريض" : "You have the right to:"}</h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    {(lang === "ar" ? [
                      "معرفة جميع المعلومات المتعلقة بحالتك الصحية، ورعايتك، وأسباب جميع الفحوصات والإجراءات التشخيصية، وكذلك الرسوم المفروضة على حسابك، وذلك بلغة تفهمها.",
                      "قبول أو رفض التوقيع على الموافقة لأي إجراء جراحي أو تشخيصي.",
                      "تلقي رعاية صحية رحيمة ومحترمة في جميع الأوقات، بغض النظر عن العمر، أو الجنس، أو العرق، أو الثقافة، أو الجنسية، أو اللغة، أو التوجه، أو الوضع الاجتماعي والاقتصادي، أو القدرة الجسدية أو الذهنية، أو الدين، أو التشخيص.",
                      "الحصول على إقامة مريحة في بيئة نظيفة وآمنة، خالية من أي إساءة لفظية أو جسدية، مع الحفاظ على الخصوصية الشخصية.",
                      "معرفة آلية تقديم الشكاوى بشكل مناسب، سواء شفهيًا أو كتابيًا، إلى المدير المناوب (هاتف: 66321214) أو محامي/ممثل المرضى (هاتف: 67051626).",
                      "الحفاظ على سرية وخصوصية المعلومات المتعلقة بحالتك الصحية.",
                      "الحصول على أي معلومات أو مستندات طبية مثل التقرير الطبي، أو إجازة مرضية، أو ملخص الخروج.",
                      "ضمان استمرارية الرعاية الصحية حتى الخروج والمتابعة.",
                      "الحصول على رأي طبي ثانٍ من طبيب مرخص، سواء داخل مستشفى رويال حياة أو في أي مؤسسة صحية أخرى، على أن يتحمل المريض التكاليف الإضافية إن وجدت.",
                      "تحويلك إلى مؤسسة صحية أخرى إذا اقتضت الحالة الطبية ذلك، أو بناءً على طلبك أو طلب ولي الأمر القانوني.",
                      "مغادرة المستشفى حتى في حال مخالفة رأي الطبيب، بعد توقيع نموذج \"الخروج ضد النصيحة الطبية\".",
                      "معرفة أسماء ومناصب مقدمي الرعاية الصحية، وأن يتم مناداتك باسمك الصحيح.",
                      "الحصول على شرح واضح للتكاليف وأي قيود محتملة على التغطية التأمينية.",
                      "إشراكك أنت وعائلتك أو ممثلك القانوني في قرارات العلاج، بما في ذلك النتائج المتوقعة وغير المتوقعة، والمخاطر، والقرارات العلاجية.",
                      "معرفة إجراءات السلامة التي يتم اتخاذها بعد التقييم، بما في ذلك المخاطر السريرية والجسدية والنفسية مثل خطر السقوط، والأدوية، والتفاعلات الدوائية، والعدوى.",
                      "الإبلاغ عن أي نتائج سلبية غير متوقعة.",
                      "الموافقة أو رفض الموافقة على التصوير أو التسجيل المرئي.",
                    ] : [
                      'Know, in a language you understand, all information about your condition, your care, and the reasons for all investigations, diagnostic procedures, and the charges made to your account.',
                      'Accept or refuse to sign a consent for any operative or diagnostic procedure.',
                      'Receive compassionate and respectful care at all times regardless of age, gender, ethnicity, culture, national origin, language, sexual orientation, socioeconomic status, physical or mental ability, religion, or diagnosis.',
                      'Have a comfortable stay in a clean, safe environment, free from verbal or physical abuse, and enjoy personal privacy.',
                      'Be informed of the process to raise complaints appropriately, either verbally or in writing, to the Manager on Duty (Mob: 66321214) or Patient Advocate (Mob: 67051626).',
                      'Privacy and confidentiality of information regarding your condition.',
                      'Obtain any information or documents, such as Medical Report, Sick Leave, Discharge Summary, etc.',
                      'Expect continuity of care till discharge and follow-up.',
                      'Obtain a second opinion from a physician holding a valid license, whether working in Royale Hayat Hospital or any other medical facility, either private or public, provided that you meet the additional expenses, if any.',
                      'Be referred to another healthcare organization if the medical condition warrants, and/or on the request of the patient/legal guardian.',
                      'Leave the hospital even against the advice of the physician after signing the "Discharge Against Medical Advice (DAMA)" form.',
                      'Know the names and professional titles of your caregivers and be called by your proper name.',
                      'Receive well-explained information about charges that you may be responsible for, and any potential limitations to your insurance coverage.',
                      'Involve you and your family or legal representative in your treatment, expected as well as unexpected outcomes, risk & service decisions.',
                      'Know the safety measures to be taken after the assessment that include clinical, physical, and psychological status, i.e., risk of fall, medications, drug reaction, cross-infection, etc.',
                      'Be informed about any unanticipated adverse outcomes.',
                      'Give or refuse consent before filming or recording images.',
                    ]).map((item, i) => (
                      <li key={i} className="font-body text-sm text-foreground leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-4">{lang === "ar" ? "ثانياً: مسؤوليات المريض" : "As a patient, it is your responsibility to:"}</h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    {(lang === "ar" ? [
                      "الالتزام بالقوانين والأنظمة المعمول بها في مستشفى رويال حياة.",
                      "تقديم معلومات كاملة ودقيقة عن حالتك الصحية، بما في ذلك التاريخ المرضي والأدوية التي تتناولها.",
                      "تقديم المستندات المطلوبة وفقًا للقوانين أو البروتوكولات قبل الدخول أو إجراء أي إجراءات طبية.",
                      "إبلاغ الطاقم الطبي بأي تغييرات في حالتك الصحية أو الأعراض، بما في ذلك الألم.",
                      "طلب التوضيح في حال عدم فهم المعلومات المتعلقة بحالتك أو علاجك.",
                      "سداد الفواتير كاملة قبل الخروج والالتزام بجميع الالتزامات المالية المتعلقة بالرعاية.",
                      "الالتزام بالمواعيد وإبلاغ المستشفى أو الطبيب عند التعذر عن الحضور.",
                      "ترك المتعلقات الشخصية في المنزل أو تسليمها للعائلة، أو حفظها في الخزنة المتوفرة بالغرفة.",
                      "مراعاة حقوق المرضى الآخرين والموظفين وتجنب أي إزعاج.",
                      "المشاركة الفعالة في خطة العلاج واتباع تعليمات الفريق الطبي.",
                      "اتخاذ التدابير الوقائية في حالات الأمراض المعدية.",
                      "التعامل باحترام مع الأطباء والتمريض وجميع العاملين في المستشفى.",
                      "إدراك أن الحالات الطارئة لها الأولوية في تقديم الخدمة.",
                      "المحافظة على ممتلكات المستشفى مثل الأجهزة الطبية والأثاث والسجلات الطبية.",
                      "إبلاغ المستشفى في حال الرغبة بتغيير مقدم الخدمة أو المستشفى.",
                      "المشاركة في الحفاظ على سلامة المريض ومنع أي ضرر أو إصابة كما أوضح مقدمو الخدمة.",
                    ] : [
                      'Follow the rules and regulations of RHH.',
                      'Give us complete and accurate information about your health, including previous medical history and all the medications you are taking.',
                      'Submit documents required as per the law/protocol before admission or undergoing specific procedures.',
                      'Inform our clinical staff of changes in your condition or symptoms, including pain.',
                      "Let us know if you don't understand the information we give about your condition or treatment.",
                      'Pay your bills in full before discharge and meet all financial obligations arising from your care.',
                      'Keep appointments and notify the hospital or physician when you are unable to do so.',
                      'Leave your personal belongings at home or have family members take all valuables home while you are hospitalized, or use the safety box available in your room for safe custody.',
                      'Be considerate towards the rights of other patients and hospital personnel and avoid any sort of inconvenience to others.',
                      'Actively participate in your care plan and follow the treatment plan established by your physician, including instructions from nurses and other healthcare professionals.',
                      'Take preventive measures in case of infectious diseases.',
                      'Treat doctors, nurses, and hospital staff with respect.',
                      'Realize that priority will be given to emergency cases.',
                      'Preserve and maintain hospital property like medical equipment, furniture, fittings, etc., including medical records.',
                      'Keep us informed if you want to change hospital or service provider.',
                      'Share the responsibility in maintaining the safety of the patient from any harm or injury, as explained by the service providers.',
                    ]).map((item, i) => (
                      <li key={i} className="font-body text-sm text-foreground leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-accent/10 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-foreground leading-relaxed">
                      <strong>{lang === "ar" ? "ملاحظة:" : "Note:"}</strong> {lang === "ar" ? "في الحالات الطبية الطارئة التي تهدد الحياة، يحق للطبيب الاستشاري اتخاذ القرار وإجراء الفحوصات أو الإجراءات أو إعطاء العلاج دون الحاجة إلى موافقة مسبقة من المريض أو ذويه، وذلك ضمن المسؤولية المهنية للطبيب المختص." : "In case of a life-threatening situation, the Consultant will have the full right to decide and proceed with tests, procedures, and/or medications without seeking prior consent of the relatives or the guardian as part of the responsibility bestowed on a qualified medical professional."}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>}

            {/* TRACKERWAVE INFANT SECURITY SYSTEM */}
            {show("trackerwave") && <div id="section-trackerwave" className={sectionClass}>
              <ScrollAnimationWrapper>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">{lang === "ar" ? "نظام أمان الرضّع" : "Infant Security System"}</h2>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                  {lang === "ar" ? "في مستشفى رويال حياة، سلامة كل مولود هي أولويتنا القصوى. نستخدم نظام RTLS، وهو نظام مراقبة متطور يعمل في الوقت الفعلي مصمم لتوفير حماية شاملة على مدار الساعة لكل رضيع في رعايتنا." : "At Royale Hayat Hospital, the safety of every newborn is our highest priority. We utilize the RTLS, a sophisticated real-time monitoring system designed to provide comprehensive, 24/7 protection for every infant in our care."}
                </p>

                <div className="mb-10 rounded-2xl overflow-hidden border border-border/50 bg-muted/30">
                  <div className="aspect-video relative">
                    <video
                      src="https://royal-hayat.s3.eu-central-1.amazonaws.com/infant-secyrity/RHH_TRACKER_WAVE_F_F_1_m9ojmp.mp4"
                      playsInline
                      autoPlay
                      muted
                      loop
                      disablePictureInPicture
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-popover border border-border/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-serif text-lg text-foreground mb-4">{lang === "ar" ? "أمان متقدم للرضّع" : "Advanced Infant Security"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar" ? "يتم تزويد كل رضيع بعلامة إلكترونية خفيفة الوزن وآمنة على البشرة تتكامل بسلاسة مع البنية التحتية الأمنية على مستوى المستشفى:" : "Every infant is equipped with a lightweight, skin-safe electronic tag that integrates seamlessly with our hospital-wide security infrastructure:"}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lock className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-foreground mb-1">{lang === "ar" ? "حماية محيطية نشطة" : "Active Perimeter Protection"}</h4>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          {lang === "ar" ? "يراقب النظام جميع المخارج ونقاط العبور. أي حركة غير مصرح بها نحو المصاعد أو السلالم تؤدي إلى قفل الأبواب فوراً وتنبيهات أمنية عالية الأولوية." : "The system monitors all exits and transit points. Any unauthorized movement toward elevators or stairwells triggers immediate door locks and high-priority security alerts."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-foreground mb-1">{lang === "ar" ? "تقنية استشعار العبث" : "Tamper-Sensing Technology"}</h4>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          {lang === "ar" ? "توفر علاماتنا الذكية إشعاراً فورياً لمحطة التمريض إذا تم فك أو إزالة السوار دون إذن." : "Our smart tags provide instant notification to the nursing station if a band is loosened or removed without authorization."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Search className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-foreground mb-1">{lang === "ar" ? "خدمات تحديد الموقع في الوقت الفعلي" : "Real-Time Location Services"}</h4>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          {lang === "ar" ? "تحافظ الفرق السريرية والأمنية على رؤية مستمرة لموقع كل رضيع من خلال واجهة مراقبة رقمية مركزية." : "Clinical and security teams maintain constant visibility of every infant's location through a centralized digital monitoring interface."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-popover border border-border/50 rounded-2xl p-6">
                  <h3 className="font-serif text-lg text-foreground mb-4">{lang === "ar" ? "مطابقة الأم والرضيع الآلية" : "Automated Mother-Infant Matching"}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === "ar" ? "لضمان سلامة الرابطة بين الأم والطفل بشكل مطلق، يستخدم نظامنا الاقتران الرقمي المشفر:" : "To ensure the absolute integrity of the mother-child bond, our system utilizes encrypted digital pairing:"}
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-foreground mb-1">{lang === "ar" ? "التحقق الدقيق" : "Precision Verification"}</h4>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {lang === "ar" ? "يتم ربط الأمهات والرضّع إلكترونياً لضمان أعلى مستويات الدقة والأمان." : "Mothers and infants are electronically linked to ensure the highest levels of accuracy and security."}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>}

          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />

    </div>
  );
};

export default PatientsVisitors;
