import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Stethoscope, Star, Quote, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadDoctorById, type Doctor } from "@/data/loadDoctors";
import { departments, deptDoctorAliases } from "@/data/departments";
import { getDoctorById, mapApiDoctorRowToDoctor } from "@/api/doctors";
import {
  createDoctorFeedbackByName,
  extractDoctorFeedbackRecord,
  getDoctorFeedbacksByDoctorName,
  type DoctorFeedbackRecord,
} from "@/api/feedback";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { patientTestimonials } from "@/data/patientTestimonials";
import AddFeedbackModal from "@/components/AddFeedbackModal";
import { useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";

const ltrIsolateClass = "inline [unicode-bidi:isolate] [direction:ltr]";

function renderLtrSpan(content: string) {
  return (
    <span dir="ltr" className={ltrIsolateClass}>
      {content}
    </span>
  );
}

function renderMixedLatinParens(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /\([^)]*[A-Za-z][^)]*\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push("\u200F");
    parts.push(renderLtrSpan(match[0]));
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    if (parts.length > 0 && /[\u0600-\u06FF]/.test(tail)) {
      parts.push("\u200F");
    }
    parts.push(tail);
  }

  if (parts.length === 1) return parts[0];

  return (
    <span dir="rtl" className="inline">
      {parts}
    </span>
  );
}

function renderGermanBoardQualification(text: string): ReactNode | null {
  const staatsexamen = text.match(/^(.*?)\(Staatsexamen\)\s+(.*?)\s+(1990)\s*$/);
  if (staatsexamen) {
    return (
      <>
        {staatsexamen[1].trimEnd()}{" "}
        {renderLtrSpan("(Staatsexamen)")}{" "}
        {staatsexamen[2].trimEnd()}{" "}
        {renderLtrSpan(staatsexamen[3])}
      </>
    );
  }

  const facharzt = text.match(/^(.*?)\(Facharzt\)\s+(.*?)\s+(1998)\s*$/);
  if (facharzt) {
    return (
      <>
        {facharzt[1].trimEnd()}{" "}
        {renderLtrSpan("(Facharzt)")}{" "}
        {facharzt[2].trimEnd()}{" "}
        {renderLtrSpan(facharzt[3])}
      </>
    );
  }

  return null;
}

function renderArQualification(text: string): ReactNode {
  const duplex = text.match(/^(شهادة دوبلكس)\s+(?:Sonography\s+2000|2000\s+Sonography)$/);
  if (duplex) {
    return (
      <>
        {duplex[1]}{" "}
        {renderLtrSpan("2000 Sonography")}
      </>
    );
  }
  const mamo = text.match(/^(شهادة)\s+(?:Mamasonography\s+2003|2003\s+Mamasonography)$/);
  if (mamo) {
    return (
      <>
        {mamo[1]}{" "}
        {renderLtrSpan("2003 Mamasonography")}
      </>
    );
  }
  if (/\([A-Za-z]/.test(text)) {
    const germanBoard = renderGermanBoardQualification(text);
    if (germanBoard) return germanBoard;
    return renderMixedLatinParens(text);
  }
  return text;
}

function isExpertiseSubBullet(text: string) {
  const trimmed = text.trim();
  return trimmed.startsWith("–") || trimmed.startsWith("—");
}

function isExpertiseMainBullet(text: string) {
  const trimmed = text.trim();
  return trimmed.startsWith("•") || (trimmed.startsWith("-") && !trimmed.startsWith("–"));
}

function stripExpertiseBullet(text: string) {
  const trimmed = text.trim();
  if (isExpertiseSubBullet(trimmed)) return trimmed.substring(1).trim();
  if (isExpertiseMainBullet(trimmed)) return trimmed.substring(1).trim();
  return trimmed;
}

/** QUALIFICATIONS / EXPERIENCED IN list items should not end with a full stop. */
function stripTrailingFullStop(text: string) {
  const trimmed = text.trimEnd();
  if (trimmed.endsWith(":") || trimmed.endsWith("：")) return text;
  return trimmed.replace(/\.+$/, "");
}

/** Label before ":" is bold; text after ":" stays regular (QUALIFICATIONS & EXPERIENCED IN). */
function renderProfileListLine(text: string, lang: "en" | "ar"): ReactNode {
  const content = stripTrailingFullStop(stripExpertiseBullet(text));

  const colonIndex = content.indexOf(":");
  if (colonIndex === -1 || colonIndex > 80) {
    return lang === "ar" ? renderArQualification(content) : content;
  }

  const label = content.slice(0, colonIndex + 1);
  const rest = content.slice(colonIndex + 1).trimStart();

  return (
    <>
      <span className="font-serif font-bold text-primary">{label}</span>
      {rest ? (
        <>
          {" "}
          <span className="font-normal text-muted-foreground">
            {lang === "ar" ? renderArQualification(rest) : rest}
          </span>
        </>
      ) : null}
    </>
  );
}

type ProfileFeedback = {
  name: string;
  nameAr: string;
  rating: number;
  comment: string;
  commentAr: string;
  date: string;
};

const formatFeedbackDate = (createdAt?: string) => {
  if (!createdAt) return "";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const mapDoctorFeedbackToProfile = (
  record: DoctorFeedbackRecord,
): ProfileFeedback => ({
  name: record.userName || record.arabicUserName || "",
  nameAr: record.arabicUserName || record.userName || "",
  rating: record.stars,
  comment: record.feedback || record.arabicFeedback || "",
  commentAr: record.arabicFeedback || record.feedback || "",
  date: formatFeedbackDate(record.createdAt),
});

const staticProfileFeedback: ProfileFeedback[] = patientTestimonials.map(
  (item) => ({
    name: item.name,
    nameAr: item.nameAr,
    rating: item.stars,
    comment: item.text,
    commentAr: item.textAr,
    date: "",
  }),
);

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingReturnState = (location.state as any) ?? {};
  const fromBooking = Boolean(bookingReturnState?.fromBookAppointment || bookingReturnState?.step != null);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<ProfileFeedback[]>(
    staticProfileFeedback,
  );
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const handleGoBack = () => {
    if (fromBooking) {
      navigate("/book-appointment", { state: bookingReturnState });
    } else if (bookingReturnState?.fromDepartments && bookingReturnState?.returnPath) {
      navigate(bookingReturnState.returnPath, {
        state: {
          restoreDeptOpenIndex: bookingReturnState.restoreDeptOpenIndex,
          restoreSelectedSubByDept: bookingReturnState.restoreSelectedSubByDept,
          restoreScrollY: bookingReturnState.restoreScrollY,
        },
      });
    } else if (bookingReturnState?.fromSpecializedCare && bookingReturnState?.returnPath) {
      navigate(bookingReturnState.returnPath, {
        state: {
          restoreExpandedIndex: bookingReturnState.restoreExpandedIndex,
          restoreSelectedSubByService: bookingReturnState.restoreSelectedSubByService,
          restoreScrollY: bookingReturnState.restoreScrollY,
        },
      });
    } else {
      navigate(-1);
    }
  };
  const [localDoctor, setLocalDoctor] = useState<Doctor | undefined>();
  const [localResolved, setLocalResolved] = useState(false);
  useEffect(() => {
    if (!id) {
      setLocalResolved(true);
      return;
    }
    let cancelled = false;
    void loadDoctorById(id).then((doc) => {
      if (!cancelled) {
        setLocalDoctor(doc);
        setLocalResolved(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);
  const { data: apiDoctor, isLoading: apiLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      if (!id || !/^[0-9a-fA-F]{24}$/i.test(id)) return null;
      try {
        const res = await getDoctorById(id);
        if (res.success && res.data) {
          return mapApiDoctorRowToDoctor(res.data, "", "");
        }
      } catch (err) {
        console.error("Error fetching doctor from API:", err);
      }
      return null;
    },
    enabled: !!id && localResolved && !localDoctor,
  });
  const doctor = localDoctor || apiDoctor;

  useEffect(() => {
    if (!doctor?.name) return;

    let cancelled = false;
    setTestimonials(staticProfileFeedback);
    setFeedbackLoading(true);

    getDoctorFeedbacksByDoctorName(doctor.name)
      .then((feedbacks) => {
        if (cancelled) return;

        const apiFeedbacks = feedbacks
          .filter((fb) => fb.shownOnWebsite !== false)
          .map(mapDoctorFeedbackToProfile)
          .filter((item) => item.comment || item.commentAr);

        setTestimonials([...apiFeedbacks, ...staticProfileFeedback]);
      })
      .catch((error) => {
        console.error("Failed to load doctor feedbacks:", error);
        if (!cancelled) {
          setTestimonials(staticProfileFeedback);
        }
      })
      .finally(() => {
        if (!cancelled) setFeedbackLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [doctor?.name]);

  if (!localResolved || apiLoading) {
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
            {lang === "ar" ? "العودة" : "← Go Back"}
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
    "dr-mirvat-sameer-ghanem",
    "dr-mustafa-alfiki",
  ].includes(doctor.id);
  const inferredDept = departments.find((d) => {
    const aliases = deptDoctorAliases[d.name] || [d.name];
    return aliases.some((a) => doctor.department.includes(a) || doctor.specialty.includes(a));
  });
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
  const shouldAnimateMarquee = testimonials.length > 0;
  return (
    <div id="doctor-profile-page" className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <button onClick={handleGoBack} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "العودة" : "Go Back"}
          </button>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-popover rounded-2xl overflow-hidden border border-border/50 sticky top-24">
                <div className="bg-white h-[420px] flex items-center justify-center relative">
                  {doctor.image ? (
                    <img src={doctor.image} alt={getDoctorDisplayName(doctor, lang)} className="w-full h-full object-contain" />
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
                  <h1 className="text-2xl font-serif font-bold text-foreground mb-1">{getDoctorDisplayName(doctor, lang)}</h1>
                  <p className="text-muted-foreground font-body text-sm mb-5 whitespace-pre-line text-start">{lang === "ar" ? doctor.titleAr : doctor.title}</p>
                  {doctor.hideBooking !== true && !hideRequestAppointmentButton && (
                    <div
                      className={`flex items-center gap-1.5 mb-4 justify-center ${doctor.availableOnline !== false ? "text-green-600" : "text-destructive"}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${doctor.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
                      <span className="font-body text-xs">
                        {doctor.availableOnline !== false
                          ? (lang === "ar" ? "متاح للحجز اونلاين" : "Book Online")
                          : (lang === "ar" ? "غير متاح للحجز اونلاين" : "Not Available for Online Booking")}
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
                        onClick={() => navigate(`/appointment-request?doctor=${doctor.id}`, { state: bookingReturnState })}
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
                      onClick={() => navigate(`/appointment-request?doctor=${doctor.id}`, { state: bookingReturnState })}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors text-center"
                    >
                      {lang === "ar" ? "طلب موعد" : "Request Appointment"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-2 space-y-10">
              {doctor.qualifications && doctor.qualifications.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-popover rounded-2xl border border-border/50 p-5 md:p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-serif text-primary font-bold mb-5">
                    {lang === "ar" ? "المؤهلات:" : "QUALIFICATIONS:"}
                  </h2>
                  <ul
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="space-y-3 list-outside list-disc ps-7 pe-1"
                  >
                    {(lang === "ar" ? doctor.qualificationsAr : doctor.qualifications).map((q, i) => {
                      const items = lang === "ar" ? doctor.qualificationsAr : doctor.qualifications;
                      const trimmed = q.trim();
                      const isManualBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
                      const hasAnyManualBullets = items.some(
                        (item) => item.trim().startsWith("•") || item.trim().startsWith("-")
                      );
                      const isHeader =
                        !isManualBullet &&
                        (trimmed.endsWith(":") ||
                          trimmed.endsWith("：") ||
                          (hasAnyManualBullets && !isManualBullet));
                      return (
                        <li
                          key={i}
                          lang={lang === "ar" ? "ar" : "en"}
                          className={`font-body text-base leading-relaxed text-start ${isHeader
                          ? "list-none -ps-7 font-serif text-lg font-bold text-primary mt-6 mb-2"
                          : "text-muted-foreground"
                          }`}>
                          {renderProfileListLine(
                            isManualBullet ? trimmed.substring(1).trim() : q,
                            lang === "ar" ? "ar" : "en"
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-popover rounded-2xl border border-border/50 p-5 md:p-6 shadow-sm">
                <h2 className="text-xl md:text-2xl font-serif text-primary font-bold mb-5">
                  {lang === "ar" ? "الخبرات:" : "EXPERIENCED IN:"}
                </h2>
                <ul
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="space-y-3 list-outside list-disc ps-7 pe-1"
                >
                  {(lang === "ar" ? doctor.expertiseAr : doctor.expertise).map((exp, i) => {
                    const trimmed = exp.trim();
                    const isSubBullet = isExpertiseSubBullet(trimmed);
                    const isManualBullet = isExpertiseMainBullet(trimmed) || isSubBullet;
                    const items = lang === "ar" ? doctor.expertiseAr : doctor.expertise;
                    const hasAnyManualBullets = items.some(
                      (item) =>
                        isExpertiseMainBullet(item.trim()) ||
                        isExpertiseSubBullet(item.trim())
                    );
                    const isHeader =
                      !isManualBullet &&
                      (trimmed.endsWith(":") ||
                        trimmed.endsWith("：") ||
                        (hasAnyManualBullets && !isManualBullet));
                    const isColonHeader =
                      trimmed.endsWith(":") || trimmed.endsWith("：");
                    return (
                      <li
                        key={i}
                        lang={lang === "ar" ? "ar" : "en"}
                        className={`font-body text-base leading-relaxed text-start ${isHeader
                        ? `-ps-7 list-none font-serif text-lg font-bold text-primary mt-6 mb-2${isColonHeader ? "" : " uppercase tracking-wide"}`
                        : isSubBullet
                          ? "list-none ps-12 text-muted-foreground"
                          : "text-muted-foreground whitespace-pre-line"
                        }`}>
                        {isHeader
                          ? stripTrailingFullStop(exp)
                          : isSubBullet
                            ? (
                              <span className="flex items-start gap-2">
                                <span className="text-primary shrink-0 leading-relaxed">–</span>
                                <span className="flex-1">
                                  {lang === "ar"
                                    ? renderArQualification(
                                        stripTrailingFullStop(stripExpertiseBullet(exp))
                                      )
                                    : stripTrailingFullStop(stripExpertiseBullet(exp))}
                                </span>
                              </span>
                            )
                            : renderProfileListLine(exp, lang === "ar" ? "ar" : "en")}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-6 mb-6">
          <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
            <Quote className="w-5 h-5 text-accent" />
            {lang === "ar" ? "آراء المرضى" : "Patient Feedback"}
          </h2>
        </div>
        <div className="container mx-auto px-6 mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsTestimonialOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-medium tracking-wide text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
          >
            {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
          </motion.button>
        </div>
        <div className="relative overflow-hidden">
          {feedbackLoading ? (
            <div className="absolute right-6 top-0 z-10">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          ) : null}
          {testimonials.length === 0 ? (
            <p className="px-6 text-center font-body text-sm text-muted-foreground">
              {lang === "ar"
                ? "لا توجد آراء للمرضى بعد. كن أول من يشارك تجربته."
                : "No patient feedback yet. Be the first to share your experience."}
            </p>
          ) : (
          <div className={`flex gap-5 w-max hover:[animation-play-state:paused] ${lang === "ar" ? "animate-[feedbackMarqueeRtl_30s_linear_infinite]" : "animate-[feedbackMarquee_30s_linear_infinite]"}`}>
            {[...testimonials, ...testimonials].map((fb, i) => (
              <div
                key={shouldAnimateMarquee ? `${fb.name}-${fb.date}-${i}` : `${fb.name}-${fb.date}`}
                className="w-[220px] min-h-[200px] sm:w-[280px] sm:h-[280px] sm:min-h-0 flex-shrink-0 bg-popover rounded-xl sm:rounded-2xl border border-border/40 p-3.5 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs sm:text-sm font-serif text-primary">{(lang === "ar" ? fb.nameAr : fb.name).charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{lang === "ar" ? fb.nameAr : fb.name}</p>
                      {fb.date ? (
                        <p className="font-body text-[10px] text-muted-foreground">{fb.date}</p>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-body text-[11px] sm:text-xs leading-relaxed italic line-clamp-4 sm:line-clamp-5">
                    "{lang === "ar" ? fb.commentAr : fb.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-0.5 mt-2 sm:mt-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${s < fb.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
      <AddFeedbackModal
        isOpen={isTestimonialOpen}
        onClose={() => setIsTestimonialOpen(false)}
        subtitleEn="Share your experience with the doctor"
        subtitleAr="شارك تجربتك مع الطبيب"
        feedbackPlaceholderEn="Write your feedback about the doctor"
        feedbackPlaceholderAr="اكتب رأيك عن الطبيب"
        onSubmit={async ({ name, feedback, stars }) => {
          if (!doctor?.name) return;

          try {
            const response = await createDoctorFeedbackByName(
              {
                doctorName: doctor.name,
                userName: name,
                arabicUserName: name,
                feedback,
                arabicFeedback: feedback,
                stars,
              },
              { addedBy: "patient" },
            );

            const record = extractDoctorFeedbackRecord(response);
            if (record && record.shownOnWebsite !== false) {
              setTestimonials((prev) => [
                mapDoctorFeedbackToProfile(record),
                ...prev,
              ]);
            }
          } catch (error) {
            const backendMessage =
              axios.isAxiosError(error)
                ? error.response?.data?.message ||
                  error.response?.data?.error ||
                  error.message
                : null;
            toast.error(
              backendMessage ||
                (lang === "ar"
                  ? "تعذر إرسال التقييم. يرجى المحاولة مرة أخرى."
                  : "Failed to submit feedback. Please try again."),
            );
            throw error;
          }
        }}
      />
      <style>{`
        @media (max-width: 767px) {
          #doctor-profile-page .whitespace-pre-line,
          #doctor-profile-page li {
            text-align: start !important;
            text-align-last: start !important;
            text-justify: auto !important;
            word-spacing: normal !important;
            letter-spacing: normal !important;
            -webkit-hyphens: manual !important;
            hyphens: manual !important;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
};
export default DoctorProfile;
