import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ListChecks, Stethoscope } from "lucide-react";
import { loadDoctors, type Doctor } from "@/data/loadDoctors";
import { departments, doctorMatchesDepartment } from "@/data/departments";

const MED_REP_ALLOWED_DOCTOR_IDS = new Set([
  "dr-abubakr-elmardi",
  "dr-essam-sakr",
  "dr-mona-abou-taam",
  "dr-lobna-ibrahim-bassiouni",
  "dr-zeinab-sholkany-m-saad",
  "dr-eman-alsayegh",
  "dr-hanafi-abdelsalam",
  "dr-hamoud-abdullah-alarouj",
  "dr-hussein-faour",
  "heba-ben-salamah",
  "dr-wadha-abdulaziz-al-jaser",
  "dr-ali-ibrahim-aldei",
  "dr-abdullah-albader",
  "dr-salma-ibrahim",
  "dr-hafsah-hussain",
  "dr-hamid-ghaderi",
]);

const MED_REP_FULL_DEPARTMENTS = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
] as const;

/** Calendly event slugs on https://calendly.com/rhhmedrep — keyed by site doctor id. */
const MED_REP_CALENDLY_SLUG_BY_ID: Record<string, string> = {
  "dr-abubakr-elmardi": "dr-abubakr-elmardi",
  "dr-essam-sakr": "dr-essam-sakr",
  "dr-mona-abou-taam": "dr-mona-aboutaam",
  "dr-lobna-ibrahim-bassiouni": "dr-lobna-bassiouni",
  "dr-zeinab-sholkany-m-saad": "dr-zeinab-sholkany",
  "dr-eman-alsayegh": "dr-eman-alsayegh",
  "dr-hanafi-abdelsalam": "dr-hanafi-abdulsalam",
  "dr-hamoud-abdullah-alarouj": "dr-hamoud-alarouj",
  "dr-hussein-faour": "dr-hussein-faour",
  "heba-ben-salamah": "hebah-bensalama",
  "dr-wadha-abdulaziz-al-jaser": "dr-wadha-aljasser",
  "dr-ali-ibrahim-aldei": "dr-alialdei",
  "dr-abdullah-albader": "drabdullah-albader",
  "dr-salma-ibrahim": "dr-salma-ibrahim",
  "dr-hafsah-hussain": "dr-hafsah-hussain",
  "dr-hamid-ghaderi": "dr-hamid-ghaderi",
};

const CALENDLY_MED_REP_BASE = "https://calendly.com/rhhmedrep";

/** Extra individual Calendly bookings shown below a department section. */
const MED_REP_EXTRA_BOOKINGS_AFTER_DEPT: Partial<
  Record<string, { doctorId: string; slug: string; bookLabelEn: string; bookLabelAr: string }[]>
> = {
  "Internal Medicine": [
    {
      doctorId: "dr-ali-ibrahim-aldei",
      slug: "dr-alialdei",
      bookLabelEn: "Dr. Ali Aldei (Internal Medicine & Rheumatologist)",
      bookLabelAr: "د. علي الدعي (الطب الباطني والروماتيزم)",
    },
  ],
};

const isMedRepEligibleDoctor = (doc: Doctor) =>
  (doc.id != null && MED_REP_ALLOWED_DOCTOR_IDS.has(doc.id)) ||
  MED_REP_FULL_DEPARTMENTS.some((dept) => doctorMatchesDepartment(dept, doc));

const getCleanCalendlySlug = (name: string) => {
  let clean = name.replace(/^Dr\.?\s+/i, '').trim();
  clean = clean.replace(/[^\w\s-]/g, '');
  const parts = clean.split(/\s+/);
  const specialCases: Record<string, string> = {
    'Abubakr Elmardi': 'dr-abubakr-elmardi',
    'Abubakar Elmardi': 'dr-abubakr-elmardi',
    'Essam Sakr': 'dr-essam-sakr',
    'Mona Abou Taam': 'dr-mona-aboutaam',
    'Lobna Bassiouni': 'dr-lobna-bassiouni',
    'Lobna Ibrahim Bassiouni': 'dr-lobna-bassiouni',
    'Zeinab Sholkany': 'dr-zeinab-sholkany',
    'Zeinab Sholkany M.saad': 'dr-zeinab-sholkany',
    'Zeinab Sholkany M Saad': 'dr-zeinab-sholkany',
    'Hanafi Abdelsalam': 'dr-hanafi-abdulsalam',
    'Hanafi Mahmoud Abdul Salam': 'dr-hanafi-abdulsalam',
    'Eman Alsayegh': 'dr-eman-alsayegh',
    'Eman Al Sayegh': 'dr-eman-alsayegh',
    'Mayada Al Qadi': 'dr-mayada-al-qadi-ob-gyn-clone',
    'Salma Ibrahim': 'dr-salma-ibrahim',
    'Hafsah Hussain': 'dr-hafsah-hussain',
    'Hussein Faour': 'dr-hussein-faour',
    'Ahmed Al Mulla': 'dr-ahmed-almulla',
    'Sulaiman Almazeedi': 'drsulaiman-almazeedi',
    'Sulaiman AlMazeedi': 'drsulaiman-almazeedi',
    'Humoud Alrasheedi': 'dr-hamoud-alrasheedi',
    'Humoud AlRasheedi': 'dr-hamoud-alrasheedi',
    'Heba Ben Salama': 'hebah-bensalama',
    'Heba Ben Salamah': 'hebah-bensalama',
    'Fatima Khreis': 'fatima-khreis',
    'Fatme Khreis': 'fatima-khreis',
    'Farah Hashem': 'farah-hashem',
    'Farah Hachem': 'farah-hashem',
    'Wadha Al-Jaser': 'dr-wadha-aljasser',
    'Wadha Abdulaziz Al-jaser': 'dr-wadha-aljasser',
    'Wadha Al Jaser': 'dr-wadha-aljasser',
    'Hanafi Abdulsalam': 'dr-hanafi-abdulsalam',
    'Hamoud Alarouj': 'dr-hamoud-alarouj',
    'Abdullah AlBader': 'drabdullah-albader',
    'Abdullah Al Bader': 'drabdullah-albader',
    'Noha Alsaleh': 'dr-noha-alsaleh',
    'Noha Al Saleh': 'dr-noha-alsaleh',
    'Ali Ibrahim Aldei': 'dr-alialdei',
    'Ali Aldei': 'dr-alialdei',
    'Hamid Ghaderi': 'dr-hamid-ghaderi',
  };
  const cleanName = clean.replace(/\s+/g, ' ');
  if (specialCases[cleanName]) {
    return specialCases[cleanName];
  }
  if (parts.length <= 2) {
    return `dr-${parts.join('-').toLowerCase()}`;
  }
  const first = parts[0];
  let last = parts[parts.length - 1];
  const secondToLast = parts[parts.length - 2].toLowerCase();
  if (['al', 'el', 'abou', 'abu', 'abd', 'bin', 'ben'].includes(secondToLast)) {
    last = `${secondToLast}${last.toLowerCase()}`;
  }
  return `dr-${first.toLowerCase()}-${last.toLowerCase()}`;
};

const getMedRepCalendlyUrl = (doc: Doctor): string => {
  if (doc.id && MED_REP_CALENDLY_SLUG_BY_ID[doc.id]) {
    return `${CALENDLY_MED_REP_BASE}/${MED_REP_CALENDLY_SLUG_BY_ID[doc.id]}`;
  }
  return `${CALENDLY_MED_REP_BASE}/${getCleanCalendlySlug(doc.name)}`;
};

type MedRepDoctorCardProps = {
  doc: Doctor;
  isAr: boolean;
  bookLabel: string;
  calendlyUrl: string;
};

const MedRepBookableDoctorCard = ({
  doc,
  isAr,
  bookLabel,
  calendlyUrl,
}: MedRepDoctorCardProps) => (
  <a
    href={calendlyUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
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
        {doc.hideBooking !== true && (
          <div className="flex items-center gap-1.5 mb-4 text-green-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-body text-[10px]">
              {doc.availableOnline !== false
                ? (isAr ? "متاح للحجز اونلاين" : "Book Online")
                : (isAr ? "طلب موعد" : "Appointment Request")}
            </span>
          </div>
        )}
        <div className="mt-auto pt-2">
          <Button className="w-full gap-2 transition-transform group-hover:scale-[1.02]">
            <CalendarCheck className="w-4 h-4" />
            {bookLabel}
          </Button>
        </div>
      </div>
    </div>
  </a>
);

const MedRepDepartmentDoctorCard = ({ doc, isAr }: { doc: Doctor; isAr: boolean }) => (
  <div className="block">
    <div className="bg-popover rounded-2xl border border-border/50 h-full flex flex-col">
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
        {doc.hideBooking !== true && (
          <div className="flex items-center gap-1.5 mb-4 text-green-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-body text-[10px]">
              {doc.availableOnline !== false
                ? (isAr ? "متاح للحجز اونلاين" : "Book Online")
                : (isAr ? "طلب موعد" : "Appointment Request")}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const MedicalRepVisitBooking = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const locale = isAr ? "ar" : "en";
  const [doctorCatalog, setDoctorCatalog] = useState<Doctor[]>([]);
  useEffect(() => {
    let cancelled = false;
    void loadDoctors().then((list) => {
      if (!cancelled) setDoctorCatalog(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);
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
  const eligibleDoctors = useMemo(
    () => doctorCatalog.filter(isMedRepEligibleDoctor),
    [doctorCatalog],
  );
  const doctorsByDepartment = useMemo(() => {
    return departments
      .map((dept) => {
        const deptDoctors = eligibleDoctors
          .filter((doc) => doctorMatchesDepartment(dept.name, doc))
          .sort((a, b) =>
            (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, locale)
          );
        return { dept, deptDoctors };
      })
      .filter(({ deptDoctors }) => deptDoctors.length > 0)
      .sort((a, b) =>
        (isAr ? a.dept.nameAr : a.dept.name).localeCompare(isAr ? b.dept.nameAr : b.dept.name, locale)
      );
  }, [isAr, locale, eligibleDoctors]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{isAr ? "المندوبون الطبيون" : "Medical Representatives"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">{isAr ? "حجز زيارة المندوب الطبي" : "Medical Rep. Visit Booking"}</h1>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl font-serif text-foreground mb-4">{isAr ? "نظام حجز المندوب الطبي الإلكتروني" : "Medical Representative Online System Reservation"}</h2>
            <h3 className="text-lg font-body font-semibold text-foreground mb-6">{isAr ? "مرحباً بكم في نظام الحجز الإلكتروني للمندوبين الطبيين" : "Welcome to our Medical Representative Online Reservation System"}</h3>
            <div className="font-body text-sm text-muted-foreground leading-relaxed text-justify space-y-4">
              <p>{isAr
                ? "تم تصميم هذه المنصة حصرياً للمندوبين الطبيين الذين يحتاجون لجدولة زيارة مع الأطباء في مستشفى رويال حياة. يرجى ملاحظة أن هذه المواعيد ليست مخصصة للاستشارات الطبية. من المهم أن تضع في اعتبارك أن صلاحية موعد الزيارة ستعتمد على توفر الطبيب. يرجى التوجه إلى السكرتير أو موظف الاستقبال وتقديم تأكيد الحجز الخاص بك. لضمان عملية سلسة وفعالة، نطلب منك بلطف الالتزام بسياسة المستشفى التي تحظر الوقوف أمام أبواب العيادات. نقدر تعاونكم في هذا الشأن."
                : "This platform has been designed exclusively for medical representatives who need to schedule a visit with doctors at Royale Hayat Hospital. Please note that these appointments are not meant for medical consultations. It's important to keep in mind that an appointment visit will be valid based on the doctor's availability. Kindly approach the secretary or receptionist and present them with your booking confirmation. To ensure a smooth and efficient process, we kindly request that you comply with the hospital policy, which prohibits standing in front of the clinic doors. We greatly appreciate your cooperation in this matter."}</p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl font-serif text-foreground mb-8">{isAr ? "لحجز موعد زيارة، يرجى اتباع الخطوات التالية:" : "To book an appointment visit, please follow these steps:"}</h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-sm font-bold">{i + 1}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed text-justify pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <section className="pt-10 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <ScrollAnimationWrapper>
            <div className="flex flex-row items-center gap-4 mb-6">
              <h2 className="text-2xl font-serif text-foreground m-0">{isAr ? "روابط عامة" : "General Link"}</h2>
              <a href={CALENDLY_MED_REP_BASE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  {isAr ? "احجز الآن" : "Book Now"}
                </Button>
              </a>
            </div>
            <h2 className="text-2xl font-serif text-foreground mb-6">
              {isAr ? "الأطباء حسب القسم" : "Doctors by Department"}
            </h2>
          </ScrollAnimationWrapper>
          <div className="space-y-12">
            {doctorsByDepartment.map(({ dept, deptDoctors }) => {
              const isPediatrics = dept.name === "Pediatrics";
              const isFamilyMedicine = dept.name === "Family Medicine";
              const isInternalMedicine = dept.name === "Internal Medicine";
              const isDermatology = dept.name === "Dermatology";
              const isDepartmentBooking = isPediatrics || isFamilyMedicine || isInternalMedicine || isDermatology;
              const getDepartmentBookingUrl = () => {
                if (isPediatrics) return "https://calendly.com/rhhmedrep/pediatric-department";
                if (isFamilyMedicine) return "https://calendly.com/rhhmedrep/family-internal-medicine";
                if (isInternalMedicine) return "https://calendly.com/rhhmedrep/family-internal-medicine";
                if (isDermatology) return "https://calendly.com/rhhmedrep/pediatric-department-clone";
                return "";
              };
              return (
                <ScrollAnimationWrapper key={dept.id}>
                  <div>
                    <div className="flex flex-row items-center gap-4 mb-2">
                      <h3 className="text-xl md:text-2xl font-serif text-foreground m-0">
                        {isAr ? dept.nameAr : dept.name}
                      </h3>
                      {isDepartmentBooking && (
                        <a href={getDepartmentBookingUrl()} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="gap-2">
                            <CalendarCheck className="w-5 h-5" />
                            {isAr ? "احجز الآن" : "Book Now"}
                          </Button>
                        </a>
                      )}
                    </div>
                    <p className="text-muted-foreground font-body text-sm text-justify mt-1 mb-5">
                      {isAr ? dept.descAr : dept.desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {deptDoctors.map((doc: Doctor) =>
                        isDepartmentBooking ? (
                          <MedRepDepartmentDoctorCard key={doc.id} doc={doc} isAr={isAr} />
                        ) : (
                          <MedRepBookableDoctorCard
                            key={doc.id}
                            doc={doc}
                            isAr={isAr}
                            bookLabel={isAr ? "احجز الآن" : "Book Now"}
                            calendlyUrl={getMedRepCalendlyUrl(doc)}
                          />
                        ),
                      )}
                    </div>
                    {MED_REP_EXTRA_BOOKINGS_AFTER_DEPT[dept.name]?.map((extra) => {
                      const doc = deptDoctors.find((d) => d.id === extra.doctorId);
                      if (!doc) return null;
                      return (
                        <div
                          key={`${extra.doctorId}-extra`}
                          className="mt-8 pt-8 border-t border-border/50"
                        >
                          <h4 className="text-lg font-serif text-foreground mb-4">
                            {isAr ? extra.bookLabelAr : extra.bookLabelEn}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <MedRepBookableDoctorCard
                              key={`${extra.doctorId}-extra-card`}
                              doc={doc}
                              isAr={isAr}
                              bookLabel={isAr ? "احجز الآن" : "Book Now"}
                              calendlyUrl={`${CALENDLY_MED_REP_BASE}/${extra.slug}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollAnimationWrapper>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default MedicalRepVisitBooking;
