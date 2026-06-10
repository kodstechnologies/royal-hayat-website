import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-input-2";
import type { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MedicalRecordDatePicker from "@/components/MedicalRecordDatePicker";
import {
  createEventBooking,
  type CreateEventBookingPayload,
} from "@/api/event";

const CURRENT_YEAR = new Date().getFullYear();
const EVENT_DATE_FROM_YEAR = CURRENT_YEAR - 10;
const EVENT_DATE_TO_YEAR = CURRENT_YEAR + 2;

type EventBookingForm = {
  hall: string;
  eventType: string;
  otherEventType: string;
  numberOfDays: string;
  name: string;
  mobile: string;
  email: string;
  mrn: string;
};
type EventBookingModalProps = {
  isOpen: boolean;
  isAr: boolean;
  onClose: () => void;
};
const initialForm: EventBookingForm = {
  hall: "",
  eventType: "",
  otherEventType: "",
  numberOfDays: "",
  name: "",
  mobile: "",
  email: "",
  mrn: "",
};
const formatMobileNumber = (mobile: string) => {
  const digits = mobile.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};
type EventBookingErrors = Partial<Record<keyof EventBookingForm | "dueDate" | "proposedDate", string>>;

const EventBookingModal = ({ isOpen, isAr, onClose }: EventBookingModalProps) => {
  const [form, setForm] = useState<EventBookingForm>(initialForm);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [proposedDate, setProposedDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<EventBookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileCountry, setMobileCountry] = useState<{ countryCode: string; dialCode: string }>({
    countryCode: "kw",
    dialCode: "965",
  });
  const hallOptions = [
    { value: "gardenia", labelEn: "Gardenia Banquet Hall", labelAr: "قاعة جاردينيا للاحتفالات" },
    { value: "aljouri", labelEn: "Al Jouri Banquet Hall", labelAr: "قاعة الجوري للاحتفالات" },
    { value: "in-room-event-services", labelEn: "In room event services", labelAr: "خدمات فعاليات داخل الغرفة" },
  ];
  const validate = () => {
    const nextErrors: EventBookingErrors = {};
    if (!form.hall) nextErrors.hall = isAr ? "القاعة مطلوبة" : "Choose your hall is required";
    if (!dueDate) nextErrors.dueDate = isAr ? "التاريخ المتوقع مطلوب" : "Due date is required";
    if (!form.eventType) nextErrors.eventType = isAr ? "نوع المناسبة مطلوب" : "Type of event is required";
    if (form.eventType === "other" && !form.otherEventType.trim()) {
      nextErrors.otherEventType = isAr ? "يرجى تحديد نوع المناسبة" : "Other event type is required";
    }
    if (!proposedDate) nextErrors.proposedDate = isAr ? "تاريخ المناسبة مطلوب" : "Proposed date is required";
    if (!form.numberOfDays || Number(form.numberOfDays) <= 0) {
      nextErrors.numberOfDays = isAr ? "عدد الأيام مطلوب" : "Number of days is required";
    }
    if (!form.name.trim()) nextErrors.name = isAr ? "الاسم مطلوب" : "Name is required";
    if (!form.mobile.trim()) nextErrors.mobile = isAr ? "رقم الهاتف مطلوب" : "Mobile is required";
    if (mobileCountry.countryCode === "kw" && form.mobile.trim()) {
      const mobileDigits = form.mobile.replace(/\D/g, "");
      const localDigits = mobileDigits.startsWith(mobileCountry.dialCode)
        ? mobileDigits.slice(mobileCountry.dialCode.length)
        : mobileDigits;
      if (localDigits.length !== 8) {
        nextErrors.mobile = isAr
          ? "رقم الكويت يجب أن يتكون من 8 أرقام"
          : "Kuwait mobile number must be 8 digits";
      }
    }
    if (!form.email.trim()) {
      nextErrors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = isAr ? "البريد الإلكتروني غير صالح" : "Enter a valid email";
    }
    return nextErrors;
  };
  const updateField = (field: keyof EventBookingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const handleMobileChange = (value: string, country: CountryData | {}) => {
    const data = country as CountryData;
    const countryCode = data.countryCode || mobileCountry.countryCode;
    const dialCode = data.dialCode || mobileCountry.dialCode;
    setMobileCountry({ countryCode, dialCode });
    const digits = value.replace(/\D/g, "");
    if (countryCode === "kw") {
      const localDigitsRaw = digits.startsWith(dialCode) ? digits.slice(dialCode.length) : digits;
      const localDigits = localDigitsRaw.replace(/\D/g, "");
      const limitedLocalDigits = localDigits.slice(0, 8);
      updateField("mobile", `${dialCode}${limitedLocalDigits}`);
      return;
    }
    updateField("mobile", digits);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const payload: CreateEventBookingPayload = {
      hall: form.hall as CreateEventBookingPayload["hall"],
      dueDateOfExpectingMother: format(dueDate!, "yyyy-MM-dd"),
      eventType: form.eventType as CreateEventBookingPayload["eventType"],
      proposedDate: format(proposedDate!, "yyyy-MM-dd"),
      numberOfDays: Number(form.numberOfDays),
      name: form.name.trim(),
      mobileNumber: formatMobileNumber(form.mobile),
      email: form.email.trim(),
    };
    if (form.eventType === "other") {
      payload.otherEventType = form.otherEventType.trim();
    }
    const mrn = form.mrn.trim();
    if (mrn) payload.mrn = mrn;
    setIsSubmitting(true);
    try {
      const response = await createEventBooking(payload);
      toast({
        title: isAr ? "تم إرسال الطلب" : "Request Submitted",
        description:
          response?.message ||
          (isAr
            ? "تم إرسال نموذج حجز الفعالية بنجاح. سيتواصل معك فريقنا قريباً."
            : "Your event booking form was submitted successfully. Our team will contact you soon."),
      });
      setForm(initialForm);
      setDueDate(undefined);
      setProposedDate(undefined);
      setErrors({});
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: isAr ? "تعذر إرسال الطلب" : "Submission Failed",
        description:
          err?.response?.data?.message ||
          (isAr
            ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى."
            : "Something went wrong while submitting your request. Please try again."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
    <style>{`
      .event-booking-phone-input .react-tel-input .flag-dropdown {
        height: 2.5rem;
        background: hsl(var(--background));
        border-color: hsl(var(--border));
      }
      .event-booking-phone-input .react-tel-input .selected-flag {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: 100% !important;
        height: 100% !important;
        padding: 0 0.5rem !important;
      }
      .event-booking-phone-input .react-tel-input .selected-flag .flag,
      .event-booking-phone-input .react-tel-input .selected-flag .arrow {
        position: static !important;
        inset: auto !important;
        left: auto !important;
        right: auto !important;
        top: auto !important;
        margin: 0 !important;
        transform: none !important;
        flex: 0 0 auto !important;
      }
      .event-booking-phone-input[dir="ltr"] .react-tel-input .flag-dropdown {
        left: 0;
        right: auto;
        width: 3.75rem;
        border-radius: 0.5rem 0 0 0.5rem;
      }
      .event-booking-phone-input[dir="ltr"] .react-tel-input .selected-flag {
        justify-content: flex-start !important;
        gap: 0.4rem !important;
      }
      .event-booking-phone-input[dir="ltr"] .react-tel-input .form-control {
        padding-left: 4rem !important;
        padding-right: 0.75rem !important;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .flag-dropdown {
        left: auto !important;
        right: 0 !important;
        width: 3.25rem !important;
        border-radius: 0 0.5rem 0.5rem 0;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .selected-flag {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 0.3rem !important;
        padding: 0 0.3rem !important;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .selected-flag::before {
        content: "";
        order: 1;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid #6b7280;
        flex-shrink: 0;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .selected-flag .arrow {
        display: none !important;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .selected-flag .flag {
        order: 2;
        flex-shrink: 0;
      }
      .event-booking-phone-input[dir="rtl"] .react-tel-input .form-control {
        padding-right: 3.5rem !important;
        padding-left: 0.75rem !important;
        text-align: right;
      }
    `}</style>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-popover border border-border rounded-2xl shadow-2xl p-5 md:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl text-foreground">Event Booking</h3>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-muted/40 hover:bg-muted/70 flex items-center justify-center text-foreground"
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "اختيار القاعة *" : "Choose your Hall *"}</label>
                <select
                  value={form.hall}
                  onChange={(e) => updateField("hall", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                >
                  <option value="">{isAr ? "اختر القاعة" : "Select hall"}</option>
                  {hallOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{isAr ? opt.labelAr : opt.labelEn}</option>
                  ))}
                </select>
                {errors.hall && <p className="mt-1 text-xs text-destructive">{errors.hall}</p>}
              </div>
              <div>
                <MedicalRecordDatePicker
                  id="dueDate"
                  label={isAr ? "التاريخ المتوقع للولادة" : "Due Date of Expecting Mother"}
                  value={dueDate}
                  onChange={(date) => {
                    setDueDate(date);
                    setErrors((prev) => ({ ...prev, dueDate: undefined }));
                  }}
                  isAr={isAr}
                  inModal
                  compact
                  placeholder={isAr ? "اختر التاريخ المتوقع للولادة" : "Select due date of expecting mother"}
                  ariaLabel={isAr ? "التاريخ المتوقع للولادة" : "Due date of expecting mother"}
                  fromYear={EVENT_DATE_FROM_YEAR}
                  toYear={EVENT_DATE_TO_YEAR}
                />
                {errors.dueDate && <p className="mt-1 text-xs text-destructive">{errors.dueDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "نوع المناسبة *" : "Type of Event *"}</label>
                <select
                  value={form.eventType}
                  onChange={(e) => updateField("eventType", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                >
                  <option value="">{isAr ? "اختر النوع" : "Select event type"}</option>
                  <option value="birth">{isAr ? "احتفال المواليد" : "Birth celebrations"}</option>
                  <option value="workshop">{isAr ? "ورشة عمل" : "Workshop"}</option>
                  <option value="social">{isAr ? "فعالية اجتماعية" : "Social event"}</option>
                  <option value="other">{isAr ? "أخرى" : "Other"}</option>
                </select>
                {errors.eventType && <p className="mt-1 text-xs text-destructive">{errors.eventType}</p>}
              </div>
              {form.eventType === "other" && (
                <div>
                  <label className="block text-sm font-body text-foreground mb-1">{isAr ? "حدد نوع المناسبة *" : "Other Event Type *"}</label>
                  <input
                    type="text"
                    value={form.otherEventType}
                    onChange={(e) => updateField("otherEventType", e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                    placeholder={isAr ? "اكتب نوع المناسبة" : "Enter event type"}
                  />
                  {errors.otherEventType && <p className="mt-1 text-xs text-destructive">{errors.otherEventType}</p>}
                </div>
              )}
              <div>
                <MedicalRecordDatePicker
                  id="proposedDate"
                  label={isAr ? "التاريخ المقترح للمناسبة" : "Proposed Date of Event"}
                  value={proposedDate}
                  onChange={(date) => {
                    setProposedDate(date);
                    setErrors((prev) => ({ ...prev, proposedDate: undefined }));
                  }}
                  isAr={isAr}
                  inModal
                  compact
                  placeholder={isAr ? "اختر التاريخ المقترح للمناسبة" : "Select proposed date of event"}
                  ariaLabel={isAr ? "التاريخ المقترح للمناسبة" : "Proposed date of event"}
                  fromYear={EVENT_DATE_FROM_YEAR}
                  toYear={EVENT_DATE_TO_YEAR}
                />
                {errors.proposedDate && <p className="mt-1 text-xs text-destructive">{errors.proposedDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "عدد الأيام *" : "No of Days *"}</label>
                <input
                  type="number"
                  min="1"
                  value={form.numberOfDays}
                  onChange={(e) => updateField("numberOfDays", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                />
                {errors.numberOfDays && <p className="mt-1 text-xs text-destructive">{errors.numberOfDays}</p>}
              </div>
              <div>
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "الاسم *" : "Name *"}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "رقم الجوال *" : "Mobile *"}</label>
                <div className="event-booking-phone-input" dir={isAr ? "rtl" : "ltr"}>
                  <PhoneInput
                    country="kw"
                    value={form.mobile}
                    onChange={handleMobileChange}
                    placeholder={isAr ? "أدخل الرقم" : "Enter mobile number"}
                    masks={{ kw: "........" }}
                    enableLongNumbers={false}
                    inputClass="!w-full !h-10 !rounded-lg !border !border-border !bg-background !text-sm !font-body !text-foreground"
                    buttonClass="!h-10 !border-border !bg-background"
                    containerClass="!w-full"
                    dropdownClass="!text-sm"
                    enableSearch
                    countryCodeEditable={false}
                  />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-destructive">{errors.mobile}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "البريد الإلكتروني *" : "Email *"}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-body text-foreground mb-1">{isAr ? "الرقم الطبي (إن وجد)" : "MRN - if applicable"}</label>
                <input
                  type="text"
                  value={form.mrn}
                  onChange={(e) => updateField("mrn", e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-body"
                />
              </div>
              <div className="md:col-span-2 pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-10 rounded-full bg-primary text-primary-foreground font-body text-sm tracking-[0.18em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? (isAr ? "جاري الإرسال..." : "Sending...") : isAr ? "إرسال" : "Send"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default EventBookingModal;
