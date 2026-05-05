import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Brain, Sparkles, Stethoscope, Building2, User, CheckCircle2,
  Search, ArrowRight, ArrowLeft, Clock,
  Activity, Heart, Baby, Eye, Bone, Pill, Microscope, Scissors, Smile,
  AlertCircle, FileText, ClipboardList, UserPlus, LogIn, Calendar, Shield, Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChatButton from "@/components/ChatButton";

import type { Doctor } from "@/data/doctors";
import { fetchAllDepartmentsPages } from "@/api/department";
import {
  fetchAllActiveDoctors,
  getDoctorsByDepartment,
  mapApiDoctorRowToDoctor,
} from "@/api/doctors";
import { 
  getAvailability, 
  bookAppointment, 
  getPatient, 
  type Slot 
} from "@/api/royalhayat";
import { getIdentityStatus, startIdentityVerification } from "@/api/identity";
import { postEnquiry } from "@/api/enquiry";

// Helper types and functions for dynamic API data
type BookingDeptRow = {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  slug: string;
  specialityCode?: string;
};

const OID = /^[0-9a-fA-F]{24}$/i;

function departmentSlug(name: string, mongoId: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${mongoId.slice(-6)}`;
}

function apiRowToBookingDept(row: Record<string, unknown>): BookingDeptRow | null {
  const id = String(row._id ?? "");
  if (!OID.test(id)) return null;
  const name = String(row.name ?? "").trim();
  if (!name) return null;
  if (["Clinical Pharmacy", "Royale Hayat Pharmacy"].includes(name)) return null;
  const cat = row.catagory;
  let category = "";
  if (cat && typeof cat === "object" && cat !== null && "name" in cat) {
    category = String((cat as { name?: string }).name ?? "").trim();
  }
  return {
    id,
    name,
    nameAr: name,
    category: category || "—",
    slug: departmentSlug(name, id),
    specialityCode: typeof row.departmentId === "string" ? row.departmentId : undefined,
  };
}

function normalizeRestoredDeptId(v: unknown): string | null {
  return typeof v === "string" && OID.test(v) ? v : null;
}

function isHomeHealthDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("home health") || d.slug === "home-health";
}

function isAlSafwaDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("safwa") || n.includes("al-safwa") || d.slug.includes("safwa");
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  const locState = (location.state as any) ?? {};

  const [step, setStep] = useState<number>(locState.step ?? 0);
  const [bookingPath, setBookingPath] = useState<"primary" | "doctor" | "symptoms" | null>(locState.bookingPath ?? null);

  const [departmentsList, setDepartmentsList] = useState<BookingDeptRow[]>([]);
  const [allApiDoctors, setAllApiDoctors] = useState<Doctor[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const [deptDoctorList, setDeptDoctorList] = useState<Doctor[]>([]);
  const [deptDoctorLoading, setDeptDoctorLoading] = useState(false);

  // Step 0: Department
  const [deptSearch, setDeptSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(normalizeRestoredDeptId(locState.selectedDept));
  const [showAllDepts, setShowAllDepts] = useState(false);

  // Step 1: Doctor
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(
    typeof locState.selectedDoctor === "string" ? locState.selectedDoctor : null,
  );
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isRequestMode, setIsRequestMode] = useState(locState.isRequestMode ?? false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  // Step 2: Time Slots
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Dynamic Availability State
  const [specialityCode, setSpecialityCode] = useState<string | null>(null);
  const [providerCode, setProviderCode] = useState<string | null>(null);
  const [serviceCode, setServiceCode] = useState<string>("S001");
  const [fetchedSlots, setFetchedSlots] = useState<Slot[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Sync specialityCode with selectedDept (uses departmentId from department object)
  useEffect(() => {
    if (selectedDept) {
      const dept = departmentsList.find(d => d.id === selectedDept);
      if (dept?.specialityCode) {
        console.log("Setting specialityCode from departmentId:", dept.specialityCode);
        setSpecialityCode(dept.specialityCode);
      } else if (dept) {
        console.warn("Department found but no departmentId available for:", dept.name);
      }
    }
  }, [selectedDept, departmentsList]);

  // Sync providerCode with selectedDoctor (uses doctorId from doctor object)
  useEffect(() => {
    if (selectedDoctor) {
      const doc = allApiDoctors.find(d => d.id === selectedDoctor) || deptDoctorList.find(d => d.id === selectedDoctor);
      if (doc?.providerCode) {
        console.log("Setting providerCode from doctorId:", doc.providerCode);
        setProviderCode(doc.providerCode);
      } else if (doc) {
        console.warn("Doctor found but no doctorId (providerCode) available for:", doc.name);
      }
    }
  }, [selectedDoctor, allApiDoctors, deptDoctorList]);

  // Fetch availability when all params are ready
  useEffect(() => {
    const fetchSlots = async () => {
      // Ensure we have all necessary codes and a date before calling the API
      if (!serviceCode || !selectedDate || !specialityCode || !providerCode) {
        console.log("Missing params for availability fetch:", { serviceCode, selectedDate, specialityCode, providerCode });
        setFetchedSlots([]);
        return;
      }

      console.log("Fetching availability with:", { specialityCode, providerCode, serviceCode, selectedDate });
      setIsLoadingSlots(true);
      try {
        const res = await getAvailability({
          specialitycode: specialityCode,
          providercode: providerCode,
          servicecode: serviceCode,
          datefrom: selectedDate,
          dateto: selectedDate
        });
        if (res.success && res.data?.slot_list) {
          setFetchedSlots(res.data.slot_list);
        } else {
          setFetchedSlots([]);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
        setFetchedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [specialityCode, providerCode, serviceCode, selectedDate]);

  const timeSlots = fetchedSlots.map(s => s.slot_from_time).filter(Boolean);

  const formatSlotRange = (slot: Slot) => {
    if (!slot.slot_from_time || !slot.slot_from_time.includes(":")) return "";
    
    const parseTime = (t: string) => {
      const [hStr, mStr] = t.split(":");
      return { h: parseInt(hStr), m: parseInt(mStr) };
    };

    const fmt = (hh: number, mm: number) => {
      const suffix = hh < 12 ? "AM" : "PM";
      const hh12 = hh % 12 === 0 ? 12 : hh % 12;
      return `${hh12}:${String(mm).padStart(2, "0")} ${suffix}`;
    };

    const start = parseTime(slot.slot_from_time);
    let end;
    if (slot.slot_to_time && slot.slot_to_time.includes(":")) {
      end = parseTime(slot.slot_to_time);
    } else {
      // Fallback: +30 min
      const m = start.m + 30;
      end = { h: m >= 60 ? start.h + 1 : start.h, m: m >= 60 ? m - 60 : m };
    }

    return `${fmt(start.h, start.m)} – ${fmt(end.h, end.m)}`;
  };

  const formatTimeString = (time: string | null) => {
    if (!time || !time.includes(":")) return time || "";
    const [hStr, mStr] = time.split(":");
    const h = parseInt(hStr);
    const m = parseInt(mStr);
    const suffix = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  const slotsByPeriod = {
    morning: fetchedSlots.filter((s) => {
      if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
      return parseInt(s.slot_from_time.split(":")[0]) < 12;
    }),
    afternoon: fetchedSlots.filter((s) => {
      if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
      const h = parseInt(s.slot_from_time.split(":")[0]);
      return h >= 12 && h < 17;
    }),
    evening: fetchedSlots.filter((s) => {
      if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
      return parseInt(s.slot_from_time.split(":")[0]) >= 17;
    }),
  };

  // Get next 7 days (excluding Fridays = day 5)
  const availableDates = (() => {
    const dates: { value: string; label: string }[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (dates.length < 7) {
      if (d.getDay() !== 5) {
        dates.push({
          value: d.toISOString().split("T")[0],
          label: d.toLocaleDateString(lang === "ar" ? "ar-KW" : "en-GB", { weekday: "short", day: "numeric", month: "short" }),
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  })();

  // Patient Details State
  const [patientType, setPatientType] = useState<"returning" | "new" | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCountryCode, setPatientCountryCode] = useState("+965");
  const [patientDob, setPatientDob] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientErrors, setPatientErrors] = useState<Record<string, string>>({});
  const [showReturningPatientModal, setShowReturningPatientModal] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");
  const [isVerifyingNationalId, setIsVerifyingNationalId] = useState(false);
  const [verifiedPersonName, setVerifiedPersonName] = useState<{ english: string; arabic: string } | null>(null);
  const [verifyOperationId, setVerifyOperationId] = useState<string | null>(null);
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);
  const [verifyStatusMessage, setVerifyStatusMessage] = useState("");

  // Symptom path
  const [symptomText, setSymptomText] = useState("");
  const [symptomChips, setSymptomChips] = useState<string[]>([]);
  const [symptomAnalyzing, setSymptomAnalyzing] = useState(false);
  const [symptomResults, setSymptomResults] = useState<string[] | null>(null);

  const [booked, setBooked] = useState(false);

  // Fetch Departments and Doctors from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const [deptRows, doctorRows] = await Promise.all([
          fetchAllDepartmentsPages({ isActive: true }),
          fetchAllActiveDoctors(),
        ]);
        if (cancelled) return;
        const bookingDepts = (deptRows as unknown as Record<string, unknown>[])
          .map(apiRowToBookingDept)
          .filter((x): x is BookingDeptRow => Boolean(x));
        bookingDepts.sort((a, b) =>
          (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, isAr ? "ar" : "en"),
        );
        setDepartmentsList(bookingDepts);
        setAllApiDoctors(doctorRows.filter((d) => !d.hideBooking));
      } catch {
        if (!cancelled) {
          setCatalogError(isAr ? "تعذر تحميل الأقسام والأطباء. حاول مرة أخرى." : "Could not load departments and doctors. Please try again.");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAr]);

  // Fetch Doctors for selected department
  useEffect(() => {
    if (!selectedDept || bookingPath !== "primary") {
      setDeptDoctorList([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setDeptDoctorLoading(true);
      try {
        const rows = await getDoctorsByDepartment(selectedDept);
        const deptName = departmentsList.find((d) => d.id === selectedDept)?.name ?? "";
        const mapped = rows.map((r) =>
          mapApiDoctorRowToDoctor(r as Record<string, unknown>, deptName, deptName),
        );
        if (!cancelled) setDeptDoctorList(mapped.filter((d) => !d.hideBooking));
      } catch {
        if (!cancelled) setDeptDoctorList([]);
      } finally {
        if (!cancelled) setDeptDoctorLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDept, bookingPath, departmentsList]);

  // Read query param on mount
  useEffect(() => {
    if (locState.step != null) return; 
    const pathParam = searchParams.get("path");
    if (pathParam === "primary") { setBookingPath("primary"); setStep(0); }
    else if (pathParam === "doctor") { setBookingPath("doctor"); setStep(1); }
    else if (pathParam === "symptoms") { setBookingPath("symptoms"); setStep(0); }
  }, [searchParams, locState.step]);

  useEffect(() => {
    if (booked) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [booked]);

  const filteredDepts = departmentsList.filter(
    (d) =>
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(deptSearch.toLowerCase()),
  );

  const doctors = deptDoctorList.sort((a, b) =>
    (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, isAr ? "ar" : "en"),
  );

  const filteredAllDoctors = allApiDoctors
    .filter(
      (d) =>
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()),
    )
    .sort((a, b) => (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, isAr ? "ar" : "en"));

  const selectedDeptObj = departmentsList.find((d) => d.id === selectedDept);
  const selectedDoctorObj =
    bookingPath === "doctor"
      ? allApiDoctors.find((d) => d.id === selectedDoctor)
      : doctors.find((d) => d.id === selectedDoctor);

  const resolveDeptIdForDoctor = (doc: Doctor): string | null =>
    doc.departmentId ?? departmentsList.find((d) => d.name === doc.department)?.id ?? null;

  const formattedDob = patientDob
    ? patientDob.split("-").reverse().join("/")
    : "";
  const formattedSelectedDate = selectedDate
    ? selectedDate.split("-").reverse().join("/")
    : "";

  const steps = [
    { label: isAr ? "القسم" : "Department", icon: Building2 },
    { label: isAr ? "الطبيب" : "Doctor", icon: User },
    { label: isAr ? "بيانات المريض" : "Patient Info", icon: ClipboardList },
    { label: isAr ? "المواعيد" : "Time Slots", icon: Clock },
    { label: isAr ? "تأكيد" : "Confirm", icon: CheckCircle2 },
  ];

  const validatePatientDetails = () => {
    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.name = isAr ? "الاسم الكامل مطلوب" : "Full name is required";
    if (!patientPhone.trim()) errors.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\d{8}$/.test(patientPhone.trim())) errors.phone = isAr ? "أدخل رقم هاتف مكون من 8 أرقام" : "Enter an 8-digit phone number";
    if (!patientDob) errors.dob = isAr ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
    else if (new Date(patientDob) > new Date()) errors.dob = isAr ? "أدخل تاريخ ميلاد صحيحاً" : "Enter a valid date of birth";
    if (!patientGender) errors.gender = isAr ? "الجنس مطلوب" : "Gender is required";
    setPatientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceed = () => {
    if (!bookingPath) return false;
    switch (step) {
      case 0: return selectedDept !== null;
      case 1: return selectedDoctor !== null;
      case 2:
        if (patientType === "returning") return true;
        return patientType === "new" && patientName.trim() !== "" && /^\d{8}$/.test(patientPhone.trim()) && patientDob !== "" && patientGender !== "";
      case 3: return selectedDate !== "" && selectedSlot !== null;
      default: return true;
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setBookingError(null);
    try {
      if (patientType === "returning" && patientId && selectedSlotId) {
        const res = await bookAppointment({
          patientId: patientId,
          slotBookingId: selectedSlotId
        });
        if (res.success) {
          setBooked(true);
          return;
        }
      }

      const enquiryPayload = {
        fullName: patientName,
        email: "guest@royalhayat.com",
        phone: patientPhone || nationalId || "",
        department: selectedDeptObj?.name || selectedDoctorObj?.specialty || "Appointment Request",
        message: `Appointment requested for ${selectedDate} at ${selectedSlot}. Patient Type: ${patientType}. Doctor: ${selectedDoctorObj?.name}.`
      };
      
      const enqRes = await postEnquiry(enquiryPayload);
      if (enqRes.success) {
        setBooked(true);
      } else {
        throw new Error(isAr ? "فشل إرسال الطلب" : "Failed to submit request");
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      setBookingError(err.message || (isAr ? "حدث خطأ أثناء معالجة طلبك" : "An error occurred while processing your request"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 2) {
      if (patientType === "new" && !validatePatientDetails()) return;
      if (!patientType) return;
    }
    if (step === 4) { 
      handleConfirm();
      return; 
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const extractVerifiedName = (source: any) => {
    if (source?.personName) {
      return {
        english: source.personName.english || source.personName.en || "",
        arabic: source.personName.arabic || source.personName.ar || "",
      };
    }
    if (source?.name) {
      return {
        english: source.name.english || source.name.en || "",
        arabic: source.name.arabic || source.name.ar || "",
      };
    }
    const payload = source?.raw?.payload || source?.raw || source?.identityData?.payload || source?.identityData || {};
    if (payload?.name) {
      return {
        english: payload.name.english || payload.name.en || "",
        arabic: payload.name.arabic || payload.name.ar || "",
      };
    }
    return {
      english: payload?.englishName || payload?.nameEn || payload?.name_en || payload?.en_name || "",
      arabic: payload?.arabicName || payload?.nameAr || payload?.name_ar || payload?.ar_name || "",
    };
  };

  const handleNationalIdVerify = async () => {
    const civilId = nationalId.trim();
    if (!/^\d{12}$/.test(civilId)) {
      setNationalIdError(isAr ? "أدخل رقمًا مدنيًا صحيحًا (12 رقم)" : "Enter a valid National ID (12 digits)");
      return;
    }
    setIsVerifyingNationalId(true);
    setNationalIdError("");
    setVerifiedPersonName(null);
    setVerifyOperationId(null);
    setVerifyStatusMessage("");
    try {
      const response = await startIdentityVerification({
        civilId,
        serviceName: { ar: "تجربة", en: "Service Test" },
        reason: { ar: "تجربة", en: "test" }
      });
      
      // USER REQUEST: Always call push notification api/flow. 
      // Even if already verified, we want to show the 'Check Approval' button for demonstration/testing.
      if (response?.operationId) {
        setVerifyOperationId(response.operationId);
        setVerifyStatusMessage(
          isAr
            ? "تمت معالجة التحقق، يرجى انتظار الموافقة ثم اضغط تحقق من الموافقة."
            : "Authentication processed, please wait for approval and click Check Approval."
        );
        return;
      }

      // If no operationId but already verified (backend returned data)
      // we still treat it as successful but the user specifically asked to always call push notification api.
      // For the mock ID, our API now returns an operationId anyway.
      const names = extractVerifiedName(response);
      const hasName = Boolean(names.english || names.arabic);
      if (response?.verified === true && hasName) {
        const pickedName = isAr ? (names.arabic || names.english) : (names.english || names.arabic);
        setPatientName(pickedName);
        setPatientType("returning");
        
        try {
          const pRes = await getPatient({ nationalid: civilId });
          if (pRes.success && pRes.data?.patient?.patient_id) {
            setPatientId(pRes.data.patient.patient_id);
          }
        } catch (err) {
          console.error("Failed to fetch patient data:", err);
        }

        setShowReturningPatientModal(false);
        return;
      }

      setNationalIdError(
        isAr
          ? "تعذر التحقق حالياً. أكمل التحقق في تطبيق هويتي ثم أعد المحاولة."
          : "Could not verify right now. Complete Hawyti authentication and try again."
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      setNationalIdError(
        message || (isAr ? "فشل التحقق من الرقم المدني" : "Failed to verify National ID")
      );
    } finally {
      setIsVerifyingNationalId(false);
    }
  };

  const openReturningPatientModal = () => {
    setNationalId("");
    setNationalIdError("");
    setVerifiedPersonName(null);
    setVerifyOperationId(null);
    setVerifyStatusMessage("");
    setShowReturningPatientModal(true);
  };

  const handleCheckApproval = async () => {
    if (!verifyOperationId) return;
    setIsCheckingApproval(true);
    setNationalIdError("");
    try {
      const statusData = await getIdentityStatus(verifyOperationId);
      
      if (statusData?.status === "pending") {
        setVerifyStatusMessage(
          isAr ? "الحالة ما زالت قيد الانتظار." : "Status is still pending."
        );
        return;
      }
      const names = extractVerifiedName(statusData);
      const hasName = Boolean(names.english || names.arabic);
      if (!hasName) {
        setNationalIdError(isAr ? "تمت الموافقة ولكن لا يوجد اسم متاح حالياً." : "Approved but no name is available yet.");
        return;
      }
      const pickedName = isAr ? (names.arabic || names.english) : (names.english || names.arabic);
      setPatientName(pickedName);
      setPatientType("returning");

      try {
        const pRes = await getPatient({ nationalid: nationalId });
        if (pRes.success && pRes.data?.patient?.patient_id) {
          setPatientId(pRes.data.patient.patient_id);
        }
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
      }

      setShowReturningPatientModal(false);
      setVerifyOperationId(null);
      setVerifyStatusMessage("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      setNationalIdError(
        message || (isAr ? "تعذر جلب حالة الموافقة." : "Failed to fetch approval status.")
      );
    } finally {
      setIsCheckingApproval(false);
    }
  };

  const goToInitialBookingScreen = () => {
    setShowReturningPatientModal(false);
    setBookingPath("primary"); // Go to department selection
    setStep(0);
    setPatientType(null);
    setPatientName("");
    setNationalId("");
    setNationalIdError("");
    setVerifiedPersonName(null);
    setVerifyOperationId(null);
    setVerifyStatusMessage("");
  };

  const handleBack = () => {
    if (step === 0 && bookingPath) {
      setBookingPath(null);
      return;
    }
    if (step === 3 && patientType === "returning") {
      setPatientType(null);
      setPatientName("");
      setPatientErrors({});
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSymptomAnalyze = () => {
    const tokens = [
      ...symptomChips.map((c) => c.toLowerCase()),
      ...symptomText
        .split(/[,;\n]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ];
    if (tokens.length === 0) return;
    setSymptomAnalyzing(true);
    setTimeout(() => {
      const symptomKeywords: Record<string, string[]> = {
        headache: ["neuro", "neurology", "brain", "internal", "medicine"],
        "chest pain": ["cardio", "heart", "internal", "cardiology"],
        fever: ["pediatric", "internal", "medicine", "infection"],
        cough: ["pulmo", "respiratory", "ent", "internal"],
        fatigue: ["internal", "medicine", "endo"],
        dizziness: ["neuro", "ent", "internal"],
        nausea: ["gastro", "internal", "medicine"],
        "back pain": ["ortho", "spine", "physio", "neuro"],
        "joint pain": ["ortho", "rheum", "physio"],
        "shortness of breath": ["pulmo", "cardio", "internal"],
      };
      const hints = new Set<string>();
      for (const t of tokens) {
        const direct = symptomKeywords[t];
        if (direct) direct.forEach((h) => hints.add(h));
        for (const [key, vals] of Object.entries(symptomKeywords)) {
          if (t.includes(key) || key.includes(t)) vals.forEach((h) => hints.add(h));
        }
      }
      const matched = departmentsList.filter((d) => {
        const dn = d.name.toLowerCase();
        const dc = d.category.toLowerCase();
        return [...hints].some((h) => dn.includes(h) || dc.includes(h));
      });
      const ids =
        matched.length > 0
          ? matched.map((d) => d.id)
          : departmentsList.slice(0, Math.min(3, departmentsList.length)).map((d) => d.id);
      setSymptomResults(ids);
      setSymptomAnalyzing(false);
    }, 1200);
  };

  const chipOptions = ["Headache", "Chest Pain", "Fever", "Cough", "Fatigue", "Dizziness", "Nausea", "Back Pain", "Joint Pain", "Shortness of Breath"];

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  // ─── BOOKED SUCCESS SCREEN ─────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
        <Header />
        <div className="pt-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="bg-primary py-16 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-3">
              {isRequestMode ? t("requestSubmitted") : t("appointmentConfirmed")}
            </h1>
            <p className="text-primary-foreground/70 font-body text-sm max-w-md mx-auto">
              {isRequestMode ? t("requestConfirmMsg") : t("bookingConfirmMsg")}
            </p>
          </motion.div>

          <div className="container mx-auto px-6 py-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-popover rounded-2xl border border-border p-8 mb-6 shadow-sm -mt-8">
              <h3 className="font-serif text-lg text-foreground mb-5">{t("appointmentDetails")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-body text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("doctor")}</p>
                    <p className="text-foreground font-medium">{selectedDoctorObj?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("department")}</p>
                    <p className="text-foreground font-medium">{selectedDeptObj?.name || selectedDoctorObj?.specialty}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardList className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("patient")}</p>
                    <p className="text-foreground font-medium">{patientName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{isAr ? "الموعد" : "Time Slot"}</p>
                    <p className="text-foreground font-medium">
                      {selectedDate && selectedSlot ? (
                        `${formattedSelectedDate} • ${formatTimeString(selectedSlot)}`
                      ) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-popover rounded-2xl border border-border p-8 mb-6">
              <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                {t("nextSteps")}
              </h3>
              <ul className="space-y-3 font-body text-sm text-muted-foreground">
                {[t("step1"), t("step2"), t("step3"), t("step4"), t("step5")].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="text-center">
              <button onClick={() => navigate("/")}
                className="bg-primary text-primary-foreground px-10 py-3.5 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                {t("backToHome")}
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
        <ChatButton />
      </div>
    );
  }

  // ─── PATH SELECTION ────────────────────────────────────────────────────────
  if (!bookingPath) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">{t("bookYourAppointment")}</h1>
            <p className="text-muted-foreground font-body text-sm mb-2">
              {lang === "ar" ? "اختر طريقة الحجز المناسبة لك" : "Choose how you'd like to book"}
            </p>
            <p className="text-muted-foreground/80 font-body text-xs max-w-lg mx-auto">
              {lang === "ar" ? "حدد الطريقة التي تناسبك لحجز موعدك — حسب القسم، الطبيب، أو وصف الأعراض." : "Select the method that works best for you to schedule your appointment — by department, doctor, or symptom description."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("primary"); setStep(0); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-primary/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Building2 className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "اختر القسم" : "Select Department"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "ابدأ باختيار القسم ثم الطبيب" : "Start by choosing a department, then a doctor"}
              </p>
            </motion.button>

            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("doctor"); setStep(1); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-accent/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Stethoscope className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "أعرف طبيبي" : "I Know My Doctor"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "انقر هنا إذا كنت تعرف طبيبك" : "Click here if you know your doctor"}
              </p>
            </motion.button>

            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("symptoms"); setStep(0); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-primary/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary/40 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Brain className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "لست متأكداً" : "Not Sure?"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "لست متأكداً من الطبيب أو القسم؟ تحقق من الأعراض" : "Not sure about doctor or department? Check with symptoms"}
              </p>
            </motion.button>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
        <ChatButton />
      </div>
    );
  }

  // ─── SYMPTOM PATH ───────────────
  if (bookingPath === "symptoms" && symptomResults === null) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 mb-4">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">{lang === "ar" ? "فحص الأعراض" : "Symptom Checker"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">{t("tellUsSymptoms")}</h1>
          </motion.div>

          <div className="bg-popover rounded-2xl p-8 border border-border shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              {chipOptions.map((chip) => (
                <motion.button key={chip} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setSymptomChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip])}
                  className={`px-4 py-2 rounded-full text-xs font-body tracking-wide transition-all duration-200 border ${symptomChips.includes(chip)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border text-muted-foreground hover:border-accent hover:text-accent"
                    }`}>{chip}</motion.button>
              ))}
            </div>
            <textarea value={symptomText} onChange={(e) => setSymptomText(e.target.value)}
              placeholder={t("describeInDetail")}
              className="w-full h-24 bg-muted/20 border border-border rounded-xl p-4 font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 mb-4" />

            <div className="bg-destructive/10 rounded-xl p-4 border-2 border-destructive/30 mb-4">
              <p className="font-body text-sm text-foreground leading-relaxed font-medium">
                <AlertCircle className="w-4 h-4 inline mr-2 text-destructive" />
                {lang === "ar"
                  ? "⚠️ تنويه مهم: هذه الأداة تقدم اقتراحات عامة فقط ولا تُعد بديلاً عن الاستشارة الطبية المتخصصة. يرجى مراجعة الطبيب للتشخيص الدقيق والعلاج المناسب."
                  : "⚠️ Important Disclaimer: This tool provides general suggestions only and is NOT a substitute for professional medical advice. Please consult a doctor for accurate diagnosis and appropriate treatment."}
              </p>
            </div>

            <AnimatePresence>
              {symptomAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3 py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-6 h-6 rounded-full border-2 border-accent/20 border-t-accent" />
                  <span className="font-body text-sm text-accent">{t("analyzing")}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <button onClick={() => { setBookingPath(null); setSymptomChips([]); setSymptomText(""); }}
                className="flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("previous")}
              </button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSymptomAnalyze}
                disabled={symptomChips.length === 0 && !symptomText.trim() || symptomAnalyzing}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-all ${(symptomChips.length > 0 || symptomText.trim()) && !symptomAnalyzing
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}>
                <Sparkles className="w-3.5 h-3.5" /> {t("analyzeSymptoms")}
              </motion.button>
            </div>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
        <ChatButton />
      </div>
    );
  }

  // After symptoms analyzed
  if (bookingPath === "symptoms" && symptomResults !== null && step === 0) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-2xl font-serif text-foreground mb-2">{lang === "ar" ? "الأقسام الموصى بها" : "Recommended Departments"}</h2>
            <p className="text-muted-foreground font-body text-xs">{lang === "ar" ? "بناءً على أعراضك، نوصي بالأقسام التالية" : "Based on your symptoms, we recommend these departments"}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {symptomResults.map((id) => {
              const dept = departmentsList.find((d) => d.id === id);
              if (!dept) return null;
              return (
                <motion.button key={dept.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedDept(dept.id); setBookingPath("primary"); setStep(1); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${selectedDept === dept.id ? "bg-primary text-primary-foreground border-primary" : "bg-popover border-border hover:border-accent text-foreground"
                    }`}>
                  <Stethoscope className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm font-medium">{dept.name}</p>
                    <p className="font-body text-xs text-accent"><Sparkles className="w-3 h-3 inline mr-1" />{lang === "ar" ? "توصية ذكية" : "AI Match"}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-muted-foreground font-body text-xs mb-4">{lang === "ar" ? "أو اختر من جميع الأقسام أدناه" : "Or choose from all departments below"}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {departmentsList.filter((d) => !symptomResults.includes(d.id)).map((dept) => (
              <motion.button key={dept.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedDept(dept.id); setBookingPath("primary"); setStep(1); }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-popover hover:border-accent/40 text-foreground text-left">
                <Stethoscope className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium truncate">{dept.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{dept.category}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-start mt-8">
            <button onClick={() => { setSymptomResults(null); }} className="flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("previous")}
            </button>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
        <ChatButton />
      </div>
    );
  }

  // ─── MAIN BOOKING FLOW ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground">{t("bookYourAppointment")}</h1>
        </motion.div>

        <div className="flex items-center justify-center gap-1 mb-8 md:mb-12 flex-wrap">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <motion.button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                whileHover={i < step ? { scale: 1.05 } : {}}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-body tracking-wide transition-all duration-300 ${i === step ? "bg-primary text-primary-foreground shadow-md"
                  : i < step ? "bg-accent/10 text-accent cursor-pointer hover:bg-accent/20"
                    : "bg-muted/40 text-muted-foreground"
                  }`}>
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </motion.button>
              {i < steps.length - 1 && <div className={`w-4 sm:w-6 h-0.5 mx-0.5 rounded ${i < step ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && bookingPath === "primary" && (
            <motion.div key="s0" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-4xl mx-auto">
                {catalogError ? <p className="text-center text-destructive font-body text-sm mb-4">{catalogError}</p> : null}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder={t("searchDepartments")}
                    disabled={catalogLoading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50" />
                </div>
                {catalogLoading ? (
                  <div className="py-16 text-center text-muted-foreground font-body text-sm">
                    {isAr ? "جاري تحميل الأقسام…" : "Loading departments…"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(() => {
                      const displayDepts = deptSearch.trim() || showAllDepts ? filteredDepts : filteredDepts.slice(0, 6);
                      return displayDepts.map((dept) => (
                        <motion.button key={dept.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (isAlSafwaDept(dept)) { navigate("/al-safwa", { state: { fromBookAppointment: true } }); return; }
                            if (isHomeHealthDept(dept)) { navigate("/home-health", { state: { fromBookAppointment: true } }); return; }
                            setSelectedDept(dept.id);
                            setStep(1);
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${selectedDept === dept.id
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-popover border-border hover:border-accent/40 text-foreground"
                            }`}>
                          <Stethoscope className={`w-5 h-5 flex-shrink-0 ${selectedDept === dept.id ? "" : "text-accent"}`} />
                          <div className="min-w-0">
                            <p className="font-body text-sm font-medium truncate">{dept.name}</p>
                            <p className={`font-body text-xs ${selectedDept === dept.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{dept.category}</p>
                          </div>
                        </motion.button>
                      ));
                    })()}
                  </div>
                )}
                {!catalogLoading && !showAllDepts && !deptSearch.trim() && filteredDepts.length > 6 && (
                  <div className="text-center mt-6">
                    <button onClick={() => setShowAllDepts(true)}
                      className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground transition-all">
                      {isAr ? "عرض جميع الأقسام" : `View All (${filteredDepts.length})`}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-4xl mx-auto">
                {catalogError ? <p className="text-center text-destructive font-body text-sm mb-4">{catalogError}</p> : null}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={doctorSearch} onChange={(e) => { setDoctorSearch(e.target.value); setShowAllDoctors(true); }}
                    placeholder={lang === "ar" ? "ابحث عن طبيب..." : "Search for a doctor..."}
                    disabled={catalogLoading || (bookingPath === "primary" && deptDoctorLoading)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50" />
                </div>
                {(() => {
                  const docList = bookingPath === "doctor" ? filteredAllDoctors : doctors;
                  const displayList = showAllDoctors || doctorSearch.trim() ? docList : docList.slice(0, 6);
                  if (catalogLoading || (bookingPath === "primary" && deptDoctorLoading)) {
                    return <div className="py-16 text-center text-muted-foreground font-body text-sm">{isAr ? "جاري تحميل الأطباء…" : "Loading doctors…"}</div>;
                  }
                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {displayList.map((doc) => (
                          <motion.div key={doc.id} whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }}
                            className={`relative rounded-2xl border flex flex-col cursor-pointer transition-all duration-300 overflow-hidden ${selectedDoctor === doc.id ? "border-primary shadow-md" : "border-border/50 hover:border-accent/40"}`}
                            onClick={() => {
                              const resolvedDeptId = selectedDept ?? resolveDeptIdForDoctor(doc);
                              navigate(`/doctors/${doc.id}`, {
                                state: { fromBookAppointment: true, step, bookingPath: bookingPath ?? "primary", selectedDept: resolvedDeptId, selectedDoctor: doc.id, isRequestMode: doc.availableOnline === false, canBookSlot: doc.availableOnline !== false }
                              });
                            }}>
                            <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
                              {doc.image ? <img src={doc.image} alt={isAr ? doc.nameAr : doc.name} className="w-full h-full object-cover object-top" /> : <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-xl font-serif text-primary">{doc.initials}</span></div>}
                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"><Stethoscope className="w-3.5 h-3.5 text-primary" /></div>
                              {selectedDoctor === doc.id && <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-primary-foreground" /></div>}
                            </div>
                            <div className="p-4 flex flex-col flex-grow bg-popover">
                              <p className="text-accent text-[10px] tracking-[0.15em] uppercase font-body mb-1">{isAr ? doc.specialtyAr : doc.specialty}</p>
                              <h4 className="font-serif text-sm text-foreground mb-0.5 leading-snug">{isAr ? doc.nameAr : doc.name}</h4>
                              <p className="text-muted-foreground font-body text-[11px] mb-2 line-clamp-1">{isAr ? doc.titleAr : doc.title}</p>
                              <div className="flex flex-wrap gap-1 mb-2">{(isAr ? doc.languagesAr : doc.languages).map((l) => <span key={l} className="px-2 py-0.5 rounded-full bg-secondary/40 text-[10px] font-body text-foreground">{l}</span>)}</div>
                              {doc.hideBooking !== true && (
                                <div className={`flex items-center gap-1.5 mb-3 ${doc.availableOnline !== false ? "text-green-600" : "text-gray-500"}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-muted-foreground"}`} />
                                  <span className="font-body text-[10px]">{doc.availableOnline !== false ? (isAr ? "متاح للحجز" : "Book Online") : (isAr ? "غير متاح حالياً" : "Request Appointment")}</span>
                                </div>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); const resolvedDeptId = selectedDept ?? resolveDeptIdForDoctor(doc); navigate(`/doctors/${doc.id}`, { state: { fromBookAppointment: true, step, bookingPath: bookingPath ?? "primary", selectedDept: resolvedDeptId, selectedDoctor: doc.id, isRequestMode: doc.availableOnline === false, canBookSlot: doc.availableOnline !== false } }); }} className="mt-auto inline-flex items-center gap-1 text-primary font-body text-xs hover:text-accent transition-colors">{isAr ? "عرض الملف الشخصي ←" : "View Profile →"}</button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {!showAllDoctors && !doctorSearch.trim() && docList.length > 6 && (
                        <div className="text-center mt-6">
                          <button onClick={() => setShowAllDoctors(true)} className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground transition-all">{lang === "ar" ? "عرض جميع الأطباء" : `View All (${docList.length})`}</button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-3xl mx-auto">
                {!patientType && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => { setNationalId(""); setNationalIdError(""); setVerifiedPersonName(null); setVerifyOperationId(null); setVerifyStatusMessage(""); setPatientErrors({}); setPatientName(""); setPatientType("returning"); openReturningPatientModal(); }} className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><LogIn className="w-7 h-7 text-primary" /></div>
                      <h3 className="font-serif text-lg text-foreground mb-2">{t("registeredPatient")}</h3>
                      <p className="font-body text-xs text-muted-foreground">{isAr ? "اختر موعدك في الخطوة التالية" : "Choose your appointment time next"}</p>
                    </motion.button>
                    <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => setPatientType("new")} className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"><UserPlus className="w-7 h-7 text-accent" /></div>
                      <h3 className="font-serif text-lg text-foreground mb-2">{t("firstTimeVisitor")}</h3>
                      <p className="font-body text-xs text-muted-foreground">{isAr ? "سيتم توجيهك إلى نموذج طلب الموعد" : "You will be taken to the Appointment Request Form"}</p>
                    </motion.button>
                  </div>
                )}
                {patientType === "new" && (
                  <div className="bg-popover rounded-2xl p-5 sm:p-8 md:p-10 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-accent" /></div>
                      <div><h2 className="text-xl font-serif text-foreground">{t("patientDetails")}</h2><p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p></div>
                    </div>
                    <div className="space-y-5">
                      <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("fullName")} <span className="text-destructive">*</span></label><input type="text" value={patientName} onChange={(e) => { setPatientName(e.target.value); setPatientErrors(prev => ({ ...prev, name: "" })); }} placeholder={t("enterFullName")} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.name ? "border-destructive" : "border-border"}`} />{patientErrors.name && <p className="font-body text-xs text-destructive mt-1">{patientErrors.name}</p>}</div>
                      <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("phoneNumber")} <span className="text-destructive">*</span></label>
                        <div className="flex gap-2">
                          <select value={patientCountryCode} onChange={(e) => setPatientCountryCode(e.target.value)} className="w-24 px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"><option value="+965">+965</option><option value="+966">+966</option><option value="+971">+971</option></select>
                          <input type="tel" value={patientPhone} onChange={(e) => { setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 8)); setPatientErrors(prev => ({ ...prev, phone: "" })); }} inputMode="numeric" maxLength={8} pattern="\d{8}" placeholder={t("phonePlaceholder")} className={`flex-1 px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.phone ? "border-destructive" : "border-border"}`} />
                        </div>{patientErrors.phone && <p className="font-body text-xs text-destructive mt-1">{patientErrors.phone}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span></label><input type="date" value={patientDob} max={new Date().toISOString().split("T")[0]} onChange={(e) => { setPatientDob(e.target.value); setPatientErrors(prev => ({ ...prev, dob: "" })); }} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.dob ? "border-destructive" : "border-border"}`} />{patientErrors.dob && <p className="font-body text-xs text-destructive mt-1">{patientErrors.dob}</p>}</div>
                        <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("gender")} <span className="text-destructive">*</span></label><select value={patientGender} onChange={(e) => { setPatientGender(e.target.value); setPatientErrors(prev => ({ ...prev, gender: "" })); }} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.gender ? "border-destructive" : "border-border"}`}><option value="">{t("selectGender")}</option><option value="male">{t("male")}</option><option value="female">{t("female")}</option></select>{patientErrors.gender && <p className="font-body text-xs text-destructive mt-1">{patientErrors.gender}</p>}</div>
                      </div>
                    </div>
                  </div>
                )}
                {patientType === "returning" && patientName && (
                  <div className="bg-popover rounded-2xl p-5 sm:p-8 border border-border shadow-sm">
                    <h2 className="text-xl font-serif text-foreground mb-2">{isAr ? "تأكيد بيانات المريض" : "Confirm Patient Details"}</h2>
                    <p className="font-body text-xs text-muted-foreground mb-4">{isAr ? "أدخل اسمك الكامل كما هو مسجل في المستشفى." : "Enter your full name as registered with the hospital."}</p>
                    <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("fullName")} <span className="text-destructive">*</span></label><input type="text" value={patientName} onChange={(e) => { setPatientName(e.target.value); setPatientErrors((prev) => ({ ...prev, name: "" })); }} placeholder={t("enterFullName")} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.name ? "border-destructive" : "border-border"}`} />{patientErrors.name && <p className="font-body text-xs text-destructive mt-1">{patientErrors.name}</p>}</div>
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={() => { if (!patientName.trim()) { setPatientErrors((prev) => ({ ...prev, name: isAr ? "الاسم الكامل مطلوب" : "Full name is required" })); return; } setPatientErrors((prev) => ({ ...prev, name: "" })); setStep(3); }} className="flex-1 bg-primary text-primary-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors inline-flex items-center justify-center text-center">{isAr ? "متابعة" : "Proceed"}</button>
                      <button type="button" onClick={goToInitialBookingScreen} className="flex-1 bg-secondary/40 text-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center">{isAr ? "إلغاء" : "Cancel"}</button>
                    </div>
                  </div>
                )}
                {patientType && <button onClick={() => { setPatientType(null); setNationalId(""); setNationalIdError(""); setVerifiedPersonName(null); setVerifyOperationId(null); setVerifyStatusMessage(""); }} className="mt-4 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">← {t("changeSelection")}</button>}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-accent" /></div>
                    <div><h2 className="text-xl font-serif text-foreground">{isAr ? "اختر الموعد" : "Select Date & Time"}</h2><p className="text-muted-foreground font-body text-xs">{isAr ? "اختر التاريخ والوقت المناسب لك" : "Pick a date and available time slot"}</p></div>
                  </div>
                  {specialityCode && providerCode && (
                    <div className="flex gap-4 mb-4 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-tight">
                      <span>Speciality: {specialityCode}</span>
                      <span>Provider: {providerCode}</span>
                    </div>
                  )}
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">{isAr ? "التاريخ" : "Date"}</p>
                  <div className="flex gap-2 flex-wrap justify-center mb-8">
                    {availableDates.map((d) => (
                      <button key={d.value} onClick={() => { setSelectedDate(d.value); setSelectedSlot(null); }} className={`px-4 py-2.5 rounded-xl border font-body text-xs transition-all ${selectedDate === d.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background border-border text-foreground hover:border-accent/50"}`}>{d.label}</button>
                    ))}
                  </div>

                  {isLoadingSlots && <div className="flex flex-col items-center justify-center py-12"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent mb-4" /><p className="font-body text-sm text-muted-foreground">{isAr ? "جارِ جلب المواعيد المتاحة..." : "Fetching available time slots..."}</p></div>}

                  {!isLoadingSlots && selectedDate && fetchedSlots.length > 0 && (
                    <div className="space-y-6">
                      {Object.entries(slotsByPeriod).map(([period, slots]) => slots.length > 0 && (
                        <div key={period}>
                          <h3 className="font-body text-sm font-medium text-foreground mb-3 capitalize">{period}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {slots.map((slot) => (
                              <button key={slot.slot_booking_id || slot.slot_from_time} onClick={() => { setSelectedSlot(slot.slot_from_time); setSelectedSlotId(slot.slot_booking_id); setStep(4); }} className={`p-4 rounded-xl border text-sm font-body transition-all text-center ${selectedSlot === slot.slot_from_time ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-background border-border hover:border-accent/40 hover:bg-accent/5 text-foreground"}`}>{formatSlotRange(slot)}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingSlots && selectedDate && fetchedSlots.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground font-body text-sm bg-muted/20 rounded-2xl border border-dashed border-border"><AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />{isAr ? "لا توجد مواعيد متاحة لهذا اليوم" : "No available appointments for this date"}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-popover rounded-2xl p-8 md:p-10 border border-border shadow-sm">
                  <h2 className="font-serif text-xl text-foreground mb-2">{isRequestMode ? t("reviewSubmit") : t("reviewConfirm")}</h2>
                  <div className="space-y-5">
                    {[
                      { label: t("department"), value: selectedDeptObj?.name || selectedDoctorObj?.specialty || "", icon: Building2 },
                      { label: t("doctor"), value: selectedDoctorObj?.name || "", icon: User },
                      { label: isAr ? "التاريخ والوقت" : "Date & Time", value: selectedDate && selectedSlot ? `${formattedSelectedDate}  •  ${formatTimeString(selectedSlot)}` : "", icon: Clock },
                      { label: t("patient"), value: patientName.trim() || "—", icon: ClipboardList },
                      ...(patientType === "new" ? [{ label: t("phone"), value: `${patientCountryCode} ${patientPhone}`, icon: Stethoscope }, { label: isAr ? "تاريخ الميلاد" : "Date of Birth", value: formattedDob, icon: User }, { label: t("gender"), value: patientGender === "male" ? t("male") : t("female"), icon: User }] : [])
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-4 py-3 border-b border-border last:border-0"><div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"><row.icon className="w-4 h-4 text-accent" /></div><div><p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{row.label}</p><p className="font-body text-sm text-foreground font-medium">{row.value}</p></div></div>
                    ))}
                  </div>
                  {bookingError && <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-destructive" /><p className="font-body text-sm text-destructive">{bookingError}</p></div>}
                  <div className="mt-8 flex flex-col gap-4">
                    <motion.button whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} onClick={handleConfirm} disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                      {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" />{isAr ? "جارِ الإرسال..." : "Submitting..."}</> : <>{isRequestMode ? t("submitRequest") : t("confirmBooking")}</>}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-3xl mx-auto flex items-center justify-between mt-6 md:mt-8 gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleBack} className="flex items-center gap-1.5 text-muted-foreground font-body text-xs sm:text-sm hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" />{step === 0 ? t("backToHome") : t("previous")}</motion.button>
          {step >= 2 && !(step === 2 && !patientType) && !(step === 2 && patientType === "returning") && step !== 3 && step !== 4 && (
            <motion.button whileHover={canProceed() ? { scale: 1.03 } : {}} whileTap={canProceed() ? { scale: 0.97 } : {}} onClick={handleNext} disabled={!canProceed()} className={`flex items-center gap-1.5 px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-body text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 ${canProceed() ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
              {t("continue")} <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      {showReturningPatientModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowReturningPatientModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-3xl border border-border/70 bg-popover shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-body text-[10px] tracking-[0.18em] uppercase text-accent mb-1">{isAr ? "مريض مسجل" : "Registered Patient"}</p><h3 className="font-serif text-xl text-foreground">{isAr ? "التحقق من الرقم المدني" : "Kuwait Civil ID Verification"}</h3><p className="font-body text-xs text-muted-foreground mt-1">{isAr ? "أدخل الرقم المدني لإحضار الاسم ومتابعة الحجز." : "Please enter your Kuwait Civil ID to retrieve your details and continue booking."}</p></div>
                <button onClick={() => setShowReturningPatientModal(false)} className="w-8 h-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors" aria-label={isAr ? "إغلاق" : "Close"}>×</button>
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "الرقم المدني" : "National ID"} <span className="text-destructive">*</span></label>
                <input type="text" inputMode="numeric" value={nationalId} onChange={(e) => { setNationalId(e.target.value.replace(/\D/g, "").slice(0, 12)); setNationalIdError(""); setVerifiedPersonName(null); }} placeholder={isAr ? "ادخل 12 رقم" : "Enter 12 digits"} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 ${nationalIdError ? "border-destructive" : "border-border"}`} />
                {nationalIdError && <p className="font-body text-xs text-destructive mt-2">{nationalIdError}</p>}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verifyOperationId ? (
                  <button 
                    onClick={handleCheckApproval} 
                    disabled={isCheckingApproval} 
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-70 inline-flex items-center justify-center text-center"
                  >
                    {isCheckingApproval ? (isAr ? "جارِ التحقق..." : "Checking...") : (isAr ? "تحقق من الموافقة" : "Check Approval")}
                  </button>
                ) : (
                  <button 
                    onClick={handleNationalIdVerify} 
                    disabled={isVerifyingNationalId} 
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-70 inline-flex items-center justify-center text-center"
                  >
                    {isVerifyingNationalId ? (isAr ? "جارِ الفحص..." : "Verifying...") : (isAr ? "تحقق من الموافقة" : "Check Approval")}
                  </button>
                )}
                
                <button 
                  onClick={goToInitialBookingScreen} 
                  className="w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
              {verifyStatusMessage && <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"><p className="font-body text-xs text-foreground">{verifyStatusMessage}</p></div>}
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
      <ScrollToTop />
      <ChatButton />
    </div>
  );
};

export default BookAppointment;
