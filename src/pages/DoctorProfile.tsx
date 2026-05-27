import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Stethoscope, Globe, Award, Star, Quote, GraduationCap, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { doctors } from "@/data/doctors";
import { departments, deptDoctorAliases } from "@/data/departments";
import { getDoctorById, mapApiDoctorRowToDoctor } from "@/api/doctors";
import { X } from "lucide-react";
import { useState } from "react";

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
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    comment: "",
    rating: 0,
  });

  const [testimonials, setTestimonials] = useState(patientFeedback);
const handleAddTestimonial = () => {
  if (!testimonialForm.name || !testimonialForm.comment) return;

  const newTestimonial = {
    name: testimonialForm.name,
    nameAr: testimonialForm.name,
    rating: testimonialForm.rating,
    comment: testimonialForm.comment,
    commentAr: testimonialForm.comment,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  setTestimonials((prev) => [newTestimonial, ...prev]);

  setTestimonialForm({
    name: "",
    comment: "",
    rating: 5,
  });

  // show thank you overlay
  setShowThankYou(true);

  // close after animation
  setTimeout(() => {
    setShowThankYou(false);
    setIsTestimonialOpen(false);
  }, 2200);
};


  const handleGoBack = () => {
    if (fromBooking) {
      navigate("/book-appointment", { state: bookingReturnState });
    } else {
      navigate(-1);
    }
  };

  const localDoctor = doctors.find((d) => d.id === id);

  const { data: apiDoctor, isLoading: apiLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      if (!id || !/^[0-9a-fA-F]{24}$/i.test(id)) return null;
      try {
        const res = await getDoctorById(id);
        if (res.success && res.data) {
          // Pass empty strings for dept names as mapApiDoctorRowToDoctor handles populated department objects
          return mapApiDoctorRowToDoctor(res.data, "", "");
        }
      } catch (err) {
        console.error("Error fetching doctor from API:", err);
      }
      return null;
    },
    enabled: !!id && !localDoctor,
  });

  const doctor = localDoctor || apiDoctor;

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="flex items-center justify-center py-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

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

  const isRequestOnlyDoctor = doctor.hideBooking === true || doctor.availableOnline === false;
  const isOnlineAvailable = !isRequestOnlyDoctor;
  const canBookSlot = bookingReturnState?.canBookSlot ?? isOnlineAvailable;
  const hideRequestAppointmentButton = [
    "Dr. Mirvat Sameer Ghanem",
    "Dr. Mustafa Alfiki",
  ].includes(doctor.name);

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
        selectedDept: bookingReturnState?.selectedDept ?? doctor.departmentId ?? null,
        selectedDoctor: doctor.id,
        isRequestMode: isRequestOnlyDoctor,
        canBookSlot: !isRequestOnlyDoctor,
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
                  {!hideRequestAppointmentButton && (
                    <div
                      className={`flex items-center gap-1.5 mb-4 justify-center ${isRequestOnlyDoctor ? "text-muted-foreground" : "text-green-600"
                        }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isRequestOnlyDoctor ? "bg-muted-foreground" : "bg-green-500"}`} />
                      <span className="font-body text-xs">
                        {isRequestOnlyDoctor
                          ? (lang === "ar" ? "طلب موعد" : "Request Appointment")
                          : (lang === "ar" ? "متاح للحجز الإلكتروني" : "Book Online")}
                      </span>
                    </div>
                  )}

                  {fromBooking ? (
                    canBookSlot ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={goToBookAppointmentPatientInfo}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                      >
                        {lang === "ar" ? "احجز الموعد" : "Continue with the appointment"}
                      </motion.button>
                    ) : hideRequestAppointmentButton ? null : (
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
                  ) : hideRequestAppointmentButton ? null : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/appointment-request?doctor=${doctor.id}`)}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                    >
                      {lang === "ar" ? "طلب موعد" : "Request Appointment"}
                    </motion.button>
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
                  <h2 className="text-xl md:text-2xl font-serif text-primary font-bold mb-5">
                    {lang === "ar" ? "المؤهلات:" : "QUALIFICATIONS:"}
                  </h2>
                  <ul className="space-y-3 list-outside ml-6">
                    {(lang === "ar" ? doctor.qualificationsAr : doctor.qualifications).map((q, i) => {
                      const trimmed = q.trim();
                      const isManualBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
                      const isHeader = !isManualBullet && (trimmed.endsWith(":") || trimmed.endsWith("："));

                      return (
                        <li key={i} className={`font-body text-base leading-relaxed ${isHeader
                          ? "list-none -ml-6 font-serif text-lg font-bold text-primary mt-6 mb-2"
                          : "text-muted-foreground list-disc"
                          }`}>
                          {isManualBullet ? trimmed.substring(1).trim() : q}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}

              {/* Experienced In */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-popover rounded-2xl border border-border/50 p-5 md:p-6 shadow-sm">
                <h2 className="text-xl md:text-2xl font-serif text-primary font-bold mb-5">
                  {lang === "ar" ? "الخبرات:" : "EXPERIENCED IN:"}
                </h2>
                <ul className="space-y-3 list-outside ml-6">
                  {(lang === "ar" ? doctor.expertiseAr : doctor.expertise).map((exp, i) => {
                    const trimmed = exp.trim();
                    const isManualBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
                    const hasAnyManualBullets = (lang === "ar" ? doctor.expertiseAr : doctor.expertise).some(item => item.trim().startsWith("•") || item.trim().startsWith("-"));
                    const isHeader = !isManualBullet && (trimmed.endsWith(":") || trimmed.endsWith("：") || (hasAnyManualBullets && !isManualBullet));

                    return (
                      <li key={i} className={`font-body text-base leading-relaxed ${isHeader
                        ? "list-none -ml-6 font-serif text-lg font-bold text-primary mt-6 mb-2 uppercase tracking-wide"
                        : "text-muted-foreground list-disc"
                        }`}>
                        {isManualBullet ? trimmed.substring(1).trim() : exp}
                      </li>
                    );
                  })}
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

        <div className="container mx-auto px-6 mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsTestimonialOpen(true)}
            className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-body tracking-wide hover:bg-primary/90 transition-all"
          >
            {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
          </motion.button>
        </div>

        <div className="relative overflow-hidden">
          <div className={`flex gap-5 w-max hover:[animation-play-state:paused] ${lang === "ar" ? "animate-[feedbackMarqueeRtl_30s_linear_infinite]" : "animate-[feedbackMarquee_30s_linear_infinite]"}`}>
            {[...testimonials, ...testimonials].map((fb, i) => (
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
      {isTestimonialOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
  bg-background/95
  backdrop-blur-xl
  w-full
  max-w-lg
  rounded-3xl
  p-8
  border
  border-border/50
  shadow-[0_20px_60px_rgba(0,0,0,0.25)]
  relative
"          >
            {/* Close Button */}
            <button
              onClick={() => setIsTestimonialOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary fill-primary/20" />
              </div>

              <h2 className="text-3xl font-serif text-primary mb-2">
                {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
              </h2>

              <p className="text-sm text-muted-foreground font-body">
                {lang === "ar"
                  ? "شارك تجربتك مع الطبيب"
                  : "Share your experience with the doctor"}
              </p>
            </div>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm mb-2 font-body">
                {lang === "ar" ? "الاسم" : "Your Name"}
              </label>

              <input
                type="text"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    name: e.target.value,
                  })
                }
                className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:border-primary"
                placeholder={lang === "ar" ? "أدخل الاسم" : "Enter your name"}
              />
            </div>

            {/* Testimonial */}
            <div className="mb-4">
              <label className="block text-sm mb-2 font-body">
                {lang === "ar" ? "التقييم" : "Feedback"}
              </label>

              <textarea
                rows={4}
                value={testimonialForm.comment}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    comment: e.target.value,
                  })
                }
                className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:border-primary resize-none"
                placeholder={
                  lang === "ar"
                    ? "اكتب رأيك عن الطبيب"
                    : "Write your feedback about the doctor"
                }
              />
            </div>

            {/* Stars */}
            <div className="mb-6">
              <label className="block text-sm mb-2 font-body">
                {lang === "ar" ? "التقييم بالنجوم" : "Rating"}
              </label>

              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setTestimonialForm({
                        ...testimonialForm,
                        rating: index + 1,
                      })
                    }
                  >
                    <Star
                      className={`w-6 h-6 transition-all ${index < testimonialForm.rating
                        ? "text-accent fill-accent"
                        : "text-border"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleAddTestimonial}
              className="
    w-full
    bg-primary
    text-primary-foreground
    py-3.5
    rounded-2xl
    font-semibold
    text-sm
    tracking-wide
    flex
    items-center
    justify-center
    gap-2
    shadow-lg
    hover:shadow-xl
    hover:scale-[1.02]
    hover:bg-primary/90
    active:scale-[0.98]
    transition-all
    duration-300
  "
            >
              <Star className="w-4 h-4 fill-current" />

              <span className="text-center">
                {lang === "ar" ? "إرسال التقييم" : "Submit Feedback"}
              </span>
            </button>
            {showThankYou && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  type: "spring",
                  stiffness: 180,
                }}
                className="
      absolute
      inset-0
      z-50
      flex
      items-center
      justify-center
      rounded-3xl
      bg-background/90
      backdrop-blur-md
      px-6
    "
              >
                <div
                  className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-primary/20
        bg-primary/10
        px-6
        py-5
        shadow-2xl
      "
                >
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.15,
                      type: "spring",
                      stiffness: 260,
                    }}
                    className="
          w-12
          h-12
          rounded-full
          bg-primary/15
          border
          border-primary/20
          flex
          items-center
          justify-center
        "
                  >
                    <Star className="w-6 h-6 text-primary fill-primary/20" />
                  </motion.div>

                  {/* Text */}
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary font-semibold text-base"
                    >
                      {lang === "ar"
                        ? "شكراً لك على ملاحظاتك"
                        : "Thank you for your feedback"}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground text-sm mt-1"
                    >
                      {lang === "ar"
                        ? "نحن نقدر وقتك ومشاركتك"
                        : "We truly appreciate your response"}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>
      )}
      <Footer />
    </div>
  );
};

export default DoctorProfile;
