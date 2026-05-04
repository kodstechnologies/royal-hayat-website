import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ListChecks, Stethoscope } from "lucide-react";
import { doctors, type Doctor } from "@/data/doctors";
import { departments, deptDoctorAliases } from "@/data/departments";

const getCleanCalendlySlug = (name: string) => {
  let clean = name.replace(/^Dr\.?\s+/i, '').trim();
  clean = clean.replace(/[^\w\s-]/g, '');
  
  const parts = clean.split(/\s+/);
  if (parts.length <= 2) {
     return `dr-${parts.join('-').toLowerCase()}`;
  }
  
  const first = parts[0];
  let last = parts[parts.length - 1];
  
  const secondToLast = parts[parts.length - 2].toLowerCase();
  if (['al', 'el', 'abou', 'abu', 'abd'].includes(secondToLast)) {
     last = `${secondToLast}-${last}`;
  }
  
  return `dr-${first.toLowerCase()}-${last.toLowerCase()}`;
};

const MedicalRepVisitBooking = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const locale = isAr ? "ar" : "en";

  const steps = isAr ? [
    'انقر على زر "تسجيل".',
    "اختر الطبيب أو القسم المطلوب.",
    'سيفتح التقويم، مما يتيح لك اختيار التاريخ والوقت المفضل. بمجرد الانتهاء، انقر "التالي".',
    'أدخل اسمك الكامل وعنوان بريدك الإلكتروني ورقم هاتفك المحمول. انقر على "الحدث المجدول" للمتابعة.',
    "ستظهر صفحة تأكيد، وسيتم إرسال بريد إلكتروني تأكيدي إلى عنوان بريدك الإلكتروني المسجل.",
  ] : [
    'Click on the "Register" button.',
    "Choose the desired doctor or department.",
    'The calendar will open, allowing you to select your preferred date and time. Once done, click "Next."',
    'Enter your full name, email address, and mobile number. Click on "Scheduled Event" to proceed.',
    "A confirmation page will appear, and a confirmation email will be sent to your registered email address.",
  ];

  const doctorsByDepartment = useMemo(() => {
    return departments
      .map((dept) => {
        const aliases = deptDoctorAliases[dept.name] || [dept.name];
        const deptDoctors = doctors
          .filter((doc) => aliases.some((alias) => doc.department.includes(alias) || doc.specialty.includes(alias)))
          .sort((a, b) =>
            (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, locale)
          );

        return { dept, deptDoctors };
      })
      .filter(({ deptDoctors }) => deptDoctors.length > 0)
      .sort((a, b) =>
        (isAr ? a.dept.nameAr : a.dept.name).localeCompare(isAr ? b.dept.nameAr : b.dept.name, locale)
      );
  }, [isAr, locale]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{isAr ? "المندوبون الطبيون" : "Medical Representatives"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">{isAr ? "حجز زيارة المندوب الطبي" : "Medical Rep. Visit Booking"}</h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl font-serif text-foreground mb-4">{isAr ? "نظام حجز المندوب الطبي الإلكتروني" : "Medical Representative Online System Reservation"}</h2>
            <h3 className="text-lg font-body font-semibold text-foreground mb-6">{isAr ? "مرحباً بكم في نظام الحجز الإلكتروني للمندوبين الطبيين" : "Welcome to our Medical Representative Online Reservation System"}</h3>
            <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-4">
              <p>{isAr
                ? "تم تصميم هذه المنصة حصرياً للمندوبين الطبيين الذين يحتاجون لجدولة زيارة مع الأطباء في مستشفى رويال حياة. يرجى ملاحظة أن هذه المواعيد ليست مخصصة للاستشارات الطبية. من المهم أن تضع في اعتبارك أن صلاحية موعد الزيارة ستعتمد على توفر الطبيب. يرجى التوجه إلى السكرتير أو موظف الاستقبال وتقديم تأكيد الحجز الخاص بك. لضمان عملية سلسة وفعالة، نطلب منك بلطف الالتزام بسياسة المستشفى التي تحظر الوقوف أمام أبواب العيادات. نقدر تعاونكم في هذا الشأن."
                : "This platform has been designed exclusively for medical representatives who need to schedule a visit with doctors at Royale Hayat Hospital. Please note that these appointments are not meant for medical consultations. It's important to keep in mind that an appointment visit will be valid based on the doctor's availability. Kindly approach the secretary or receptionist and present them with your booking confirmation. To ensure a smooth and efficient process, we kindly request that you comply with the hospital policy, which prohibits standing in front of the clinic doors. We greatly appreciate your cooperation in this matter."}</p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl font-serif text-foreground mb-8">{isAr ? "لحجز موعد زيارة، يرجى اتباع الخطوات التالية:" : "To book an appointment visit, please follow these steps:"}</h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-sm font-bold">{i + 1}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Doctors by Department */}
      <section className="pt-10 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <ScrollAnimationWrapper>
            <div className="flex flex-row items-center gap-4 mb-6">
              <h2 className="text-2xl font-serif text-foreground m-0">{isAr ? "روابط عامة" : "General Link"}</h2>
              <Link to="https://calendly.com/rhhmedrep" target="_blank">
                <Button size="lg" className="gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  {isAr ? "احجز الآن" : "Book Now"}
                </Button>
              </Link>
            </div>

            <h2 className="text-2xl font-serif text-foreground mb-6">
              {isAr ? "الأطباء حسب القسم" : "Doctors by Department"}
            </h2>
          </ScrollAnimationWrapper>

          <div className="space-y-12">
            {doctorsByDepartment.map(({ dept, deptDoctors }) => (
              <ScrollAnimationWrapper key={dept.id}>
                <div>
                  <h3 className="text-xl md:text-2xl font-serif text-foreground">
                    {isAr ? dept.nameAr : dept.name}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mt-1 mb-5">
                    {isAr ? dept.descAr : dept.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {deptDoctors.map((doc: Doctor) => (
                      <Link key={doc.id} to={`https://calendly.com/rhhmedrep/${getCleanCalendlySlug(doc.name)}`} target="_blank" className="block">
                        <div className="bg-popover rounded-2xl border border-border/50 group cursor-pointer h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden rounded-t-2xl shrink-0">
                            {doc.image ? (
                              <img src={doc.image} alt={isAr ? doc.nameAr : doc.name} className="w-full h-full object-cover object-top" />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
                                <span className="text-2xl font-serif text-primary-foreground">{doc.initials}</span>
                              </div>
                            )}
                            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center">
                              <Stethoscope className="w-3.5 h-3.5 text-primary-foreground" />
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-grow">
                            <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body mb-1.5">
                              {isAr ? doc.specialtyAr : doc.specialty}
                            </p>
                            <h4 className="text-base font-serif text-foreground mb-1">{isAr ? doc.nameAr : doc.name}</h4>
                            <p className="text-muted-foreground font-body text-xs mb-3">{isAr ? doc.titleAr : doc.title}</p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {(isAr ? doc.languagesAr : doc.languages).map((l) => (
                                <span key={l} className="px-2.5 py-0.5 rounded-full bg-secondary/40 text-[10px] font-body text-foreground">
                                  {l}
                                </span>
                              ))}
                            </div>

                            {doc.hideBooking !== true && (
                              <div className={`flex items-center gap-1.5 mb-4 ${doc.availableOnline !== false ? "text-green-600" : "text-destructive"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
                                <span className="font-body text-[10px]">
                                  {doc.availableOnline !== false
                                    ? (isAr ? "متاح للحجز الإلكتروني" : "Book Online")
                                    : (isAr ? "غير متاح للحجز الإلكتروني" : "Not Available for Online Booking")}
                                </span>
                              </div>
                            )}

                            <div className="mt-auto pt-2">
                              <Button className="w-full gap-2 transition-transform group-hover:scale-[1.02]">
                                <CalendarCheck className="w-4 h-4" />
                                {isAr ? "احجز الآن" : "Book Now"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>



      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default MedicalRepVisitBooking;
