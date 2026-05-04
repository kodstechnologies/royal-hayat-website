import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Stethoscope, Globe, Award, Star, Quote, GraduationCap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { doctors } from "@/data/doctors";
import { departments, deptDoctorAliases } from "@/data/departments";
const patientFeedback = [
  {
    name: "Sara Al-Mutairi", nameAr: "سارة المطيري",
    rating: 5,
    comment: "Exceptional care and professionalism. I felt genuinely listened to and my treatment was thoroughly explained at every step.",
    commentAr: "رعاية استثنائية واحترافية. شعرت بأنه يتم الاستماع إلي حقاً وتم شرح علاجي بدقة في كل خطوة.",
    date: "March 2025"
  },
  {
    name: "Ahmed Al-Rashidi", nameAr: "أحمد الرشيدي",
    rating: 5,
    comment: "One of the best medical experiences I've had. The doctor was incredibly knowledgeable and took the time to answer all my questions.",
    commentAr: "واحدة من أفضل التجارب الطبية التي مررت بها. كان الطبيب على دراية كبيرة وأخذ الوقت للإجابة على جميع أسئلتي.",
    date: "February 2025"
  },
  {
    name: "Fatima Hassan", nameAr: "فاطمة حسن",
    rating: 4,
    comment: "Very professional and caring. The entire team made me feel comfortable and at ease throughout my visit.",
    commentAr: "احترافية ورعاية عالية. جعلني الفريق بأكمله أشعر بالراحة والاطمئنان طوال زيارتي.",
    date: "January 2025"
  },
  {
    name: "Nora Al-Sabah", nameAr: "نورة الصباح",
    rating: 5,
    comment: "World-class treatment in a beautiful facility. The doctor's attention to detail was remarkable.",
    commentAr: "علاج عالمي في منشأة جميلة. كان اهتمام الطبيب بالتفاصيل رائعاً.",
    date: "December 2024"
  },
  {
    name: "Mohammed Al-Enezi", nameAr: "محمد العنزي",
    rating: 5,
    comment: "I traveled from abroad for this doctor and it was absolutely worth it. Truly exceptional medical expertise.",
    commentAr: "سافرت من الخارج لهذا الطبيب وكان الأمر يستحق تماماً. خبرة طبية استثنائية حقاً.",
    date: "November 2024"
  },
  {
    name: "Layla Al-Dhafiri", nameAr: "ليلى الظفيري",
    rating: 4,
    comment: "The follow-up care was just as impressive as the initial consultation. They truly care about long-term outcomes.",
    commentAr: "كانت رعاية المتابعة مثيرة للإعجاب تماماً مثل الاستشارة الأولى. إنهم يهتمون حقاً بالنتائج طويلة المدى.",
    date: "October 2024"
  },
];

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingReturnState = (location.state as any) ?? {};
  const fromBooking = Boolean(bookingReturnState?.fromBookAppointment || bookingReturnState?.step != null);

  const handleGoBack = () => {
    if (fromBooking) {
      navigate("/book-appointment", { state: bookingReturnState });
    } else {
      navigate(-1);
    }
  };

  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-serif text-foreground mb-4">
            {lang === "ar" ? "الطبيب غير موجود" : "Doctor Not Found"}
          </h1>
          <button onClick={handleGoBack} className="text-primary hover:text-accent font-body transition-colors">
            {lang === "ar" ? "← رجوع" : "← Go Back"}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOnlineAvailable = doctor.availableOnline !== false;
  const canBookSlot = bookingReturnState?.canBookSlot ?? isOnlineAvailable;

  const inferredDept = departments.find((d) => {
    const aliases = deptDoctorAliases[d.name] || [d.name];
    return aliases.some((a) => doctor.department.includes(a) || doctor.specialty.includes(a));
  });

  /** Resume booking at patient type step: department + doctor pre-filled, then time slots after details. */
  const goToBookAppointmentPatientInfo = () => {
    navigate("/book-appointment", {
      state: {
        ...bookingReturnState,
        fromBookAppointment: true,
        bookingPath: bookingReturnState?.bookingPath ?? "primary",
        selectedDept: bookingReturnState?.selectedDept ?? inferredDept?.id ?? null,
        selectedDoctor: doctor.id,
        isRequestMode: doctor.availableOnline === false,
        canBookSlot: doctor.availableOnline !== false,
        step: 2,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back link */}
          <button onClick={handleGoBack} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "رجوع" : "Go Back"}
          </button>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Left – Doctor Avatar & Quick Info */}
            <div className="md:col-span-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-popover rounded-2xl overflow-hidden border border-border/50 sticky top-24">
                <div className="bg-white h-[420px] flex items-center justify-center relative">
                  {doctor.image ? (
                    <img src={doctor.image} alt={lang === "ar" ? doctor.nameAr : doctor.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
                      <span className="text-4xl font-serif text-primary-foreground">{doctor.initials}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center">
                    <Stethoscope className="w-4.5 h-4.5 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-2">
                    {lang === "ar" ? doctor.specialtyAr : doctor.specialty}
                  </p>
                  <h1 className="text-2xl font-serif text-foreground mb-1">{lang === "ar" ? doctor.nameAr : doctor.name}</h1>
                  <p className="text-muted-foreground font-body text-sm mb-5">{lang === "ar" ? doctor.titleAr : doctor.title}</p>

                  {/* Availability Badge */}
                  {doctor.hideBooking !== true && (
                    <div className={`flex items-center gap-1.5 mb-4 justify-center ${
                      isOnlineAvailable
                        ? "text-green-600"
                        : fromBooking
                          ? "text-muted-foreground"
                          : "text-red-500"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isOnlineAvailable
                          ? "bg-green-500"
                          : fromBooking
                            ? "bg-muted-foreground"
                            : "bg-red-500"
                      }`} />
                      <span className="font-body text-xs">
                        {isOnlineAvailable
                          ? (lang === "ar" ? "متاح للحجز الإلكتروني" : "Book Online")
                          : fromBooking
                            ? (lang === "ar" ? "طلب موعد" : "Request Appointment")
                            : (lang === "ar" ? "غير متاح للحجز الإلكتروني" : "Not Available for Online Booking")}
                      </span>
                    </div>
                  )}

                  {doctor.hideBooking !== true && (
                    fromBooking ? (
                      canBookSlot ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={goToBookAppointmentPatientInfo}
                          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                        >
                          {lang === "ar" ? "احجز الموعد" : "Continue with the appointment"}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(`/appointment-request?doctor=${doctor.id}`)}
                          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                        >
                          {lang === "ar" ? "طلب موعد" : "Request Appointment"}
                        </motion.button>
                      )
                    ) : isOnlineAvailable ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={goToBookAppointmentPatientInfo}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                      >
                        {t("bookAppointment")}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/appointment-request?doctor=${doctor.id}`)}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                      >
                        {lang === "ar" ? "طلب موعد" : "Request Appointment"}
                      </motion.button>
                    )
                  )}

                  {/* Languages */}
                  <div className="mt-5 pt-4 border-t border-border/40">
                    <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body mb-2">
                      {lang === "ar" ? "اللغات" : "Languages"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {(lang === "ar" ? doctor.languagesAr : doctor.languages).map((l) => (
                        <span key={l} className="px-3 py-1 rounded-full bg-secondary/40 text-xs font-body text-foreground">{l}</span>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* Right – Details */}
            <div className="md:col-span-2 space-y-10">
              {/* Qualifications */}
              {doctor.qualifications && doctor.qualifications.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-popover rounded-2xl border border-border/50 p-5 md:p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-serif text-primary  font-bold mb-5">
                    {lang === "ar" ? "المؤهلات:" : "QUALIFICATIONS:"}
                  </h2>
                  <ul className="space-y-3 list-disc pl-6">
                    {(lang === "ar" ? doctor.qualificationsAr : doctor.qualifications).map((q, i) => (
                      <li key={i} className="font-body text-base text-muted-foreground leading-relaxed">{q}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Experienced In */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-popover rounded-2xl border border-border/50 p-5 md:p-6 shadow-sm">
                <h2 className="text-xl md:text-2xl font-serif text-primary  font-bold mb-5">
                  {lang === "ar" ? "الخبرات:" : "EXPERIENCED IN:"}
                </h2>
                <ul className="space-y-3 list-disc pl-6">
                  {(lang === "ar" ? doctor.expertiseAr : doctor.expertise).map((exp, i) => (
                    <li key={i} className="font-body text-base text-muted-foreground leading-relaxed">{exp}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Feedback - Full Width Marquee */}
      <section className="py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-6 mb-6">
          <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
            <Quote className="w-5 h-5 text-accent" />
            {lang === "ar" ? "آراء المرضى" : "Patient Feedback"}
          </h2>
        </div>
        <div className="relative overflow-hidden">
          <div className={`flex gap-5 w-max hover:[animation-play-state:paused] ${lang === "ar" ? "animate-[feedbackMarqueeRtl_30s_linear_infinite]" : "animate-[feedbackMarquee_30s_linear_infinite]"}`}>
            {[...patientFeedback, ...patientFeedback].map((fb, i) => (
              <div
                key={i}
                className="w-[280px] h-[280px] flex-shrink-0 bg-popover rounded-2xl border border-border/40 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-serif text-primary">{(lang === "ar" ? fb.nameAr : fb.name).charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{lang === "ar" ? fb.nameAr : fb.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{fb.date}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-body text-xs leading-relaxed italic line-clamp-5">
                    "{lang === "ar" ? fb.commentAr : fb.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s < fb.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatButton />
    </div>
  );
};

export default DoctorProfile;
