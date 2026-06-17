import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import type { DoctorWithClinicCode as Doctor } from "@/types/doctor";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { fetchAllDepartmentsPages } from "@/api/department";
import {
  fetchAllBookingDoctors,
  getDoctorsByDepartment,
  mapApiDoctorRowToBookingDoctor,
} from "@/api/doctors";
import { mapApiDepartmentsToDisplay } from "@/utils/mapApiDepartment";
import type { Department } from "@/types/department";
import { MAIN_CATEGORIES } from "@/types/department";
import { createAppointmentRequest } from "@/api/appointmentRequest";
import { createAppointmentBookingRecord } from "../api/appointmentBookingRecord";
import {
  getAvailability,
  getPatient,
} from "@/api/royalhayat";
import {
  getIdentityData,
  startIdentityVerification,
  type IdentityStatusResponse,
} from "@/api/identity";
import { subscribeToIdentityVerification } from "@/api/identitySocket";
import { extractPatientId, getPatientLookupUserMessage } from "@/utils/patientLookupErrors";
import { identityDateToIso, mapPaciSexToGender } from "@/utils/mapPaciGender";
import {
  buildRegisteredPatientBookingPayload,
  type RegisteredPatientHmsDetails,
} from "../utils/appointmentBookingRecord";
import type { AppointmentRequestPrefillState, PaciIdentityDetails } from "@/types/appointmentRequestPrefill";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Slot } from "@/api/royalhayat";
import { filterDoctorsBySearch } from "@/utils/doctorSearch";
import {
  SYMPTOM_CHIP_OPTIONS,
  formatSymptomsForDisplay,
  syncSymptomChipsFromText,
} from "@/data/symptomChipOptions";
const DOCTOR_PATH_EXCLUDED_IDS = new Set<string>(["dr-madiha-khisaf", "dr-wael-ibrahim", "dr-fatima-alazemi"]);
const SKIP_CIVIL_ID_VERIFICATION = false;
const isDoctorRequestOnly = (doc: Pick<Doctor, "hideBooking" | "availableOnline">) =>
  doc.hideBooking === true || doc.availableOnline === false;
type BookingDeptRow = {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  category: string;
  medicalField: string;
  medicalFieldAr: string;
  slug: string;
  specialityCode?: string;
  mainCategory: string;
  icon: any;
};
type VerifiedIdentityDetails = {
  name: string;
  dateOfBirth: string;
  civilIdNumber: string;
  nationality: string;
  gender: string;
  passportNumber: string;
};
const OID = /^[0-9a-fA-F]{24}$/i;
const GEMINI_TRIAGE_MODEL = "gemini-flash-latest";
const GEMINI_TRIAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TRIAGE_MODEL}:generateContent`;
function normalizeSlotDate(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return trimmed;
}

function filterSlotsForDate(slots: Slot[], selectedDate: string): Slot[] {
  if (!selectedDate) return [];
  return slots.filter((slot) => {
    if (!slot.slot_date) return true;
    return normalizeSlotDate(slot.slot_date) === selectedDate;
  });
}

function buildCollectedSymptoms(chips: string[], text: string): string[] {
  const fromText = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  return [...chips, ...fromText].filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function displayDeptToBookingRow(dept: Department): BookingDeptRow | null {
  const id = dept.mongoId ?? "";
  if (!OID.test(id)) return null;
  if (["Clinical Pharmacy", "Royale Hayat Pharmacy"].includes(dept.name)) return null;

  return {
    id,
    name: dept.name,
    nameAr: dept.nameAr,
    desc: dept.desc,
    descAr: dept.descAr,
    category: dept.category || "—",
    medicalField: dept.medicalField ?? "",
    medicalFieldAr: dept.medicalFieldAr ?? "",
    slug: dept.slug,
    specialityCode: dept.clinicCode,
    mainCategory: dept.mainCategory || "Clinical Speciality",
    icon: dept.icon,
  };
}
function normalizeRestoredDeptId(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim();
  if (OID.test(s) || /^\d+$/.test(s)) return s;
  return null;
}
function isHomeHealthDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("home health") || d.slug === "home-health";
}
function isAlSafwaDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("safwa") || n.includes("al-safwa") || d.slug.includes("safwa");
}
function normalizeClinicCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function heuristicDepartmentIdsFromTokens(tokens: string[], departments: BookingDeptRow[]): string[] {
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
  const matched = departments.filter((d) => {
    const dn = d.name.toLowerCase();
    const dc = d.category.toLowerCase();
    return [...hints].some((h) => dn.includes(h) || dc.includes(h));
  });
  return matched.length > 0
    ? matched.map((d) => d.id)
    : departments.slice(0, Math.min(3, departments.length)).map((d) => d.id);
}
function mapAiClinicCodeToDepartmentIds(aiText: string, departments: BookingDeptRow[]): string[] {
  const firstLine = aiText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";
  const candidate = firstLine
    .replace(/^clinic\s*code\s*:\s*/i, "")
    .replace(/^[-*]\s*/, "")
    .replace(/^["'`]|["'`]$/g, "")
    .trim();
  if (!candidate || /^no clinic found$/i.test(candidate)) return [];
  const normalizedCandidate = normalizeClinicCode(candidate);
  if (!normalizedCandidate) return [];
  const exact = departments.find(
    (d) => d.specialityCode && normalizeClinicCode(d.specialityCode) === normalizedCandidate
  );
  return exact ? [exact.id] : [];
}
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
  const [deptSearch, setDeptSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(normalizeRestoredDeptId(locState.selectedDept));
  const [showAllDepts, setShowAllDepts] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(
    typeof locState.selectedDoctor === "string" ? locState.selectedDoctor : null,
  );
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isRequestMode, setIsRequestMode] = useState(locState.isRequestMode ?? false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [specialityCode, setSpecialityCode] = useState<string | null>(null);
  const [providerCode, setProviderCode] = useState<string | null>(null);
  const [serviceCode, setServiceCode] = useState<string>("R01-FMC001-F010");
  const [fetchedSlots, setFetchedSlots] = useState<Slot[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [registeredPatientHmsDetails, setRegisteredPatientHmsDetails] =
    useState<RegisteredPatientHmsDetails | null>(null);
  const paciOperationIdRef = useRef<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingPopupMessage, setBookingPopupMessage] = useState<string | null>(null);
  const [bookingPopupGoHome, setBookingPopupGoHome] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  useEffect(() => {
    if (selectedDoctor) {
      const doc =
        allApiDoctors.find((d) => d.id === selectedDoctor) ||
        deptDoctorList.find((d) => d.id === selectedDoctor);
      if (doc) {
        setIsRequestMode(isDoctorRequestOnly(doc));
        if (doc.providerCode) {
          setProviderCode(doc.providerCode);
        }
        const clinicOverride = doc.clinicCode || doc.departmentClinicCode;
        if (clinicOverride) {
          setSpecialityCode(clinicOverride);
        }
        if (!selectedDept && doc.departmentId) {
          setSelectedDept(doc.departmentId);
        } else if (!selectedDept && doc.department) {
          const dept = departmentsList.find((d) => d.name.toLowerCase() === doc.department?.toLowerCase());
          if (dept) setSelectedDept(dept.id);
        }
      }
    }
  }, [selectedDoctor, allApiDoctors, deptDoctorList, departmentsList, selectedDept]);
  useEffect(() => {
    if (selectedDept) {
      const dept = departmentsList.find((d) => d.id === selectedDept);
      if (dept?.specialityCode) {
        const doc =
          allApiDoctors.find((d) => d.id === selectedDoctor) ||
          deptDoctorList.find((d) => d.id === selectedDoctor);
        const finalCode = doc?.clinicCode || doc?.departmentClinicCode || dept.specialityCode;
        setSpecialityCode(finalCode);
      }
    }
  }, [selectedDept, departmentsList, selectedDoctor, allApiDoctors, deptDoctorList]);
  const slotsFetchReady = Boolean(serviceCode && specialityCode && providerCode);

  useEffect(() => {
    if (!selectedDate) {
      setFetchedSlots([]);
      setIsLoadingSlots(false);
      return;
    }
    if (!slotsFetchReady) {
      setIsLoadingSlots(true);
      return;
    }

    let cancelled = false;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await getAvailability({
          specialitycode: specialityCode!,
          providercode: providerCode!,
          servicecode: serviceCode,
          datefrom: selectedDate,
          dateto: selectedDate,
        });
        if (cancelled) return;
        const rawList = res.success && res.data?.slot_list ? res.data.slot_list : [];
        setFetchedSlots(filterSlotsForDate(rawList, selectedDate));
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch availability:", err);
          setFetchedSlots([]);
        }
      } finally {
        if (!cancelled) setIsLoadingSlots(false);
      }
    };
    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [specialityCode, providerCode, serviceCode, selectedDate, slotsFetchReady]);
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
      const m = start.m + 30;
      end = { h: m >= 60 ? start.h + 1 : start.h, m: m >= 60 ? m - 60 : m };
    }
    return `${fmt(start.h, start.m)}-${fmt(end.h, end.m)}`;
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
  const slotsForSelectedDate = useMemo(
    () => filterSlotsForDate(fetchedSlots, selectedDate),
    [fetchedSlots, selectedDate],
  );

  const slotsByPeriod = useMemo(
    () => ({
      morning: slotsForSelectedDate.filter((s) => {
        if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
        return parseInt(s.slot_from_time.split(":")[0], 10) < 12;
      }),
      afternoon: slotsForSelectedDate.filter((s) => {
        if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
        const h = parseInt(s.slot_from_time.split(":")[0], 10);
        return h >= 12 && h < 17;
      }),
      evening: slotsForSelectedDate.filter((s) => {
        if (!s.slot_from_time || !s.slot_from_time.includes(":")) return false;
        return parseInt(s.slot_from_time.split(":")[0], 10) >= 17;
      }),
    }),
    [slotsForSelectedDate],
  );
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const selectedCalendarDate = useMemo(() => {
    if (!selectedDate) return undefined;
    const [y, m, d] = selectedDate.split("-").map((part) => parseInt(part, 10));
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  }, [selectedDate]);
  const isAppointmentDateDisabled = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < todayStart;
  };
  const handleAppointmentDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${y}-${m}-${d}`);
    setSelectedSlot(null);
    setSelectedSlotId(null);
    setFetchedSlots([]);
    setIsLoadingSlots(true);
  };
  const [patientType, setPatientType] = useState<"returning" | "new" | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCountryCode, setPatientCountryCode] = useState("+965");
  const [patientDob, setPatientDob] = useState("");
  const [patientDobIso, setPatientDobIso] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientErrors, setPatientErrors] = useState<Record<string, string>>({});
  const [showReturningPatientModal, setShowReturningPatientModal] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");
  const [isVerifyingNationalId, setIsVerifyingNationalId] = useState(false);
  const [verifiedPersonName, setVerifiedPersonName] = useState<{ english: string; arabic: string } | null>(null);
  const [verifyOperationId, setVerifyOperationId] = useState<string | null>(null);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isConfirmingPatientRecord, setIsConfirmingPatientRecord] = useState(false);
  const [patientLookupShowGoBack, setPatientLookupShowGoBack] = useState(false);
  const [showHisFailureModal, setShowHisFailureModal] = useState(false);
  const [hisFailureMessage, setHisFailureMessage] = useState("");
  const [hisFailureIdentityDetails, setHisFailureIdentityDetails] = useState<PaciIdentityDetails | null>(null);
  const [hisFailureAllowsRequest, setHisFailureAllowsRequest] = useState(false);
  const verifySocketCleanupRef = useRef<(() => void) | null>(null);
  const verificationDoneRef = useRef(false);
  const hisFailurePrefillRef = useRef<AppointmentRequestPrefillState | null>(null);
  const [verifiedIdentityDetails, setVerifiedIdentityDetails] = useState<VerifiedIdentityDetails | null>(null);
  const [symptomText, setSymptomText] = useState("");
  const [symptomChips, setSymptomChips] = useState<string[]>([]);
  const [savedSymptoms, setSavedSymptoms] = useState<string[]>(
    Array.isArray(locState.savedSymptoms) ? locState.savedSymptoms : [],
  );
  const [symptomAnalyzing, setSymptomAnalyzing] = useState(false);
  const [symptomResults, setSymptomResults] = useState<string[] | null>(null);
  const [booked, setBooked] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const [apiDeptRows, apiDoctors] = await Promise.all([
          fetchAllDepartmentsPages({ isActive: true }),
          fetchAllBookingDoctors(),
        ]);
        if (cancelled) return;

        const bookingDepartments = mapApiDepartmentsToDisplay(apiDeptRows)
          .map(displayDeptToBookingRow)
          .filter((dept): dept is BookingDeptRow => dept !== null);

        setDepartmentsList(bookingDepartments);
        setAllApiDoctors(apiDoctors);
      } catch (err) {
        console.error("Error loading booking catalog:", err);
        if (!cancelled) {
          setCatalogError(isAr ? "تعذر تحميل البيانات." : "Could not load data.");
          setDepartmentsList([]);
          setAllApiDoctors([]);
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAr]);
  useEffect(() => {
    if (!selectedDept || bookingPath !== "primary") {
      setDeptDoctorList([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setDeptDoctorLoading(true);
      try {
        const dept = departmentsList.find((d) => d.id === selectedDept);
        if (!dept) {
          if (!cancelled) setDeptDoctorList([]);
          return;
        }

        const rows = await getDoctorsByDepartment(selectedDept);
        if (cancelled) return;

        const mapped = rows.map((row) =>
          mapApiDoctorRowToBookingDoctor(row, dept.name, dept.nameAr),
        );
        setDeptDoctorList(mapped);
      } catch (err) {
        console.error("Error loading department doctors:", err);
        if (!cancelled) setDeptDoctorList([]);
      } finally {
        if (!cancelled) setDeptDoctorLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDept, bookingPath, departmentsList]);
  useEffect(() => {
    if (locState.step != null) return;
    const pathParam = searchParams.get("path");
    if (pathParam === "primary") { setBookingPath("primary"); setStep(0); }
    else if (pathParam === "doctor") { setBookingPath("doctor"); setStep(1); }
    else if (pathParam === "symptoms") { setBookingPath("symptoms"); setStep(0); }
  }, [searchParams, locState.step]);
  const symptomResultsTopRef = useRef<HTMLDivElement>(null);
  const scrollBookingViewToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    symptomResultsTopRef.current?.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  }, []);
  useEffect(() => {
    if (!booked) return;
    scrollBookingViewToTop();
    const t1 = window.setTimeout(scrollBookingViewToTop, 0);
    const t2 = window.setTimeout(scrollBookingViewToTop, 100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [booked, scrollBookingViewToTop]);
  useEffect(() => {
    scrollBookingViewToTop();
  }, [step, scrollBookingViewToTop]);
  useEffect(() => {
    if (symptomResults === null) return;
    scrollBookingViewToTop();
    const t1 = window.setTimeout(scrollBookingViewToTop, 0);
    const t2 = window.setTimeout(scrollBookingViewToTop, 100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [symptomResults, scrollBookingViewToTop]);
  useEffect(() => {
    if (!locState?.resetBookingFlow) return;
    setBookingPath(null);
    setStep(0);
    setSelectedDept(null);
    setSelectedDoctor(null);
    setDeptSearch("");
    setDoctorSearch("");
    setShowAllDepts(false);
    setShowAllDoctors(false);
    setSymptomChips([]);
    setSymptomText("");
    setSavedSymptoms([]);
    setSymptomResults(null);
    setNationalId("");
    setNationalIdError("");
    setVerifyOperationId(null);
    setIsWaitingForApproval(false);
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setVerifiedIdentityDetails(null);
    setShowReturningPatientModal(false);
  }, [locState?.resetBookingFlow]);
  const filteredDepts = useMemo(() => {
    const query = deptSearch.toLowerCase();
    return departmentsList.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.nameAr.toLowerCase().includes(query) ||
        d.desc.toLowerCase().includes(query) ||
        d.descAr.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.medicalField.toLowerCase().includes(query) ||
        d.medicalFieldAr.toLowerCase().includes(query)
    );
  }, [departmentsList, deptSearch]);
  const displayDepts = useMemo(() => {
    const expanded = deptSearch.trim() || showAllDepts ? filteredDepts : filteredDepts.slice(0, 6);
    if (!selectedDept) return expanded;
    const sel = filteredDepts.find((d) => d.id === selectedDept);
    if (!sel || expanded.some((d) => d.id === selectedDept)) return expanded;
    return [sel, ...expanded.filter((d) => d.id !== selectedDept)];
  }, [deptSearch, showAllDepts, filteredDepts, selectedDept]);
  const groupedDisplayDepts = useMemo(() => {
    const groups: { key: string; label: string; labelAr: string; depts: BookingDeptRow[] }[] =
      MAIN_CATEGORIES.map((cat) => ({
        key: cat.key,
        label: cat.label,
        labelAr: cat.labelAr,
        depts: displayDepts.filter((d) => d.mainCategory === cat.key),
      })).filter((group) => group.depts.length > 0);

    const categorizedIds = new Set(groups.flatMap((group) => group.depts.map((dept) => dept.id)));
    const uncategorized = displayDepts.filter((dept) => !categorizedIds.has(dept.id));
    if (uncategorized.length > 0) {
      groups.push({
        key: "Other",
        label: "Other Departments",
        labelAr: "أقسام أخرى",
        depts: uncategorized,
      });
    }

    return groups;
  }, [displayDepts]);
  const goToStep = (i: number) => {
    if (i > step) return;
    if (i === 1 && step > 1) setShowAllDoctors(true);
    setStep(i);
  };
  const doctors = useMemo(
    () =>
      [...filterDoctorsBySearch(deptDoctorList, doctorSearch)].sort((a, b) =>
        (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, isAr ? "ar" : "en"),
      ),
    [deptDoctorList, doctorSearch, isAr],
  );
  const filteredAllDoctors = useMemo(
    () =>
      [...filterDoctorsBySearch(
        allApiDoctors.filter((d) => !DOCTOR_PATH_EXCLUDED_IDS.has(d.id)),
        doctorSearch,
      )].sort((a, b) =>
        (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name, isAr ? "ar" : "en"),
      ),
    [allApiDoctors, doctorSearch, isAr],
  );
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
  const collectedSymptoms = useMemo(() => {
    const live = buildCollectedSymptoms(symptomChips, symptomText);
    return live.length > 0 ? live : savedSymptoms;
  }, [symptomChips, symptomText, savedSymptoms]);
  const persistSymptomsSnapshot = useCallback((chips: string[], text: string) => {
    const snapshot = buildCollectedSymptoms(chips, text);
    if (snapshot.length > 0) setSavedSymptoms(snapshot);
    return snapshot;
  }, []);
  const buildBookingNavigationState = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const symptoms =
        collectedSymptoms.length > 0
          ? collectedSymptoms
          : buildCollectedSymptoms(symptomChips, symptomText);
      return {
        fromBookAppointment: true,
        step,
        bookingPath: bookingPath ?? "primary",
        selectedDept,
        ...(symptoms.length > 0 ? { savedSymptoms: symptoms } : {}),
        ...overrides,
      };
    },
    [bookingPath, collectedSymptoms, selectedDept, step, symptomChips, symptomText],
  );
  useEffect(() => {
    const restored = (location.state as { savedSymptoms?: unknown })?.savedSymptoms;
    if (!Array.isArray(restored) || restored.length === 0) return;
    const normalized = restored
      .map((item) => String(item).trim())
      .filter(Boolean);
    if (normalized.length > 0) setSavedSymptoms(normalized);
  }, [location.state]);
  const getSelectedSlotPeriod = (): "morning" | "afternoon" => {
    if (!selectedSlot?.includes(":")) return "morning";
    const hour = parseInt(selectedSlot.split(":")[0], 10);
    return hour < 12 ? "morning" : "afternoon";
  };

  const steps = [
    { label: isAr ? "القسم" : "Department", icon: Building2 },
    { label: isAr ? "الطبيب" : "Doctor", icon: User },
    { label: isAr ? "معلومات المريض" : "Patient Info", icon: ClipboardList },
    { label: isAr ? "الوقت" : "Time Slots", icon: Clock },
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
        if (patientType === "returning") return Boolean(patientId);
        return patientType === "new" && patientName.trim() !== "" && /^\d{8}$/.test(patientPhone.trim()) && patientDob !== "" && patientGender !== "";
      case 3: return selectedDate !== "" && selectedSlot !== null;
      default: return true;
    }
  };
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setBookingError(null);
    const formatBookingErrorMessage = (raw: unknown) => {
      const fallback = isAr ? "فشل تأكيد الموعد" : "Failed to confirm appointment";
      const cleaned = String(raw || fallback).replace(/^Error:\s*/i, "").trim();
      return cleaned.replace(/care provider/gi, "doctor");
    };
    try {
      if (patientType === "returning" && patientId) {
        const payload = buildRegisteredPatientBookingPayload({
          patientName,
          patientId,
          patientDobIso: patientDobIso || undefined,
          gender: verifiedIdentityDetails
            ? mapPaciSexToGender(verifiedIdentityDetails.gender)
            : undefined,
          nationalId: nationalId || undefined,
          verifiedIdentityDetails,
          verifiedPersonName,
          hmsDetails: registeredPatientHmsDetails,
          doctor: (isAr ? selectedDoctorObj?.nameAr : selectedDoctorObj?.name) || undefined,
          department:
            (isAr
              ? selectedDeptObj?.nameAr ?? selectedDoctorObj?.specialtyAr
              : selectedDeptObj?.name ?? selectedDoctorObj?.specialty) || undefined,
          date: formattedSelectedDate || selectedDate,
          time: formatTimeString(selectedSlot) || selectedSlot || undefined,
          symptoms: collectedSymptoms.length > 0 ? collectedSymptoms : undefined,
          slotBookingId: selectedSlotId,
          verifyOperationId: paciOperationIdRef.current,
        });
        await createAppointmentBookingRecord(payload);
        setBooked(true);
        return;
      }
      if (patientType === "new") {
        await createAppointmentRequest({
          fullname: patientName.trim(),
          phone: `${patientCountryCode}${patientPhone.trim()}`,
          dob: patientDob,
          gender: patientGender,
          doctor: (isAr ? selectedDoctorObj?.nameAr : selectedDoctorObj?.name) || undefined,
          department:
            (isAr
              ? selectedDeptObj?.nameAr ?? selectedDoctorObj?.specialtyAr
              : selectedDeptObj?.name ?? selectedDoctorObj?.specialty) || undefined,
          date: formattedSelectedDate || selectedDate,
          timeSlot: {
            period: getSelectedSlotPeriod(),
            time: formatTimeString(selectedSlot) || selectedSlot || "",
          },
          symptoms: collectedSymptoms.length > 0 ? collectedSymptoms : undefined,
          requestType:
            isRequestMode || (selectedDoctorObj && isDoctorRequestOnly(selectedDoctorObj))
              ? "doctor unavailability request"
              : "first time visitor request",
        });
        setBooked(true);
        return;
      }
      setBooked(true);
    } catch (err: any) {
      console.error("Booking failed:", err);
      if (err?.message === "REGISTERED_PATIENT_PHONE_MISSING") {
        const phoneMessage = isAr
          ? "تعذر العثور على رقم هاتف مسجل. يرجى التواصل مع الاستقبال."
          : "No registered phone number was found. Please contact reception.";
        setBookingError(phoneMessage);
        setBookingPopupGoHome(false);
        setBookingPopupMessage(phoneMessage);
        return;
      }
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.status ||
        err?.message;
      const finalMessage = formatBookingErrorMessage(apiErrorMessage);
      setBookingError(finalMessage);
      setBookingPopupGoHome(false);
      setBookingPopupMessage(finalMessage);
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
  const closeReturningPatientModal = () => {
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setIsWaitingForApproval(false);
    setIsConfirmingPatientRecord(false);
    setPatientLookupShowGoBack(false);
    setVerifyOperationId(null);
    if (!patientId) {
      setPatientType(null);
      setPatientName("");
      setVerifiedPersonName(null);
      setVerifiedIdentityDetails(null);
    }
    setShowReturningPatientModal(false);
  };
  const openReturningPatientModal = () => {
    setNationalId("");
    setNationalIdError("");
    setVerifiedPersonName(null);
    setVerifyOperationId(null);
    setIsWaitingForApproval(false);
    setIsConfirmingPatientRecord(false);
    setPatientLookupShowGoBack(false);
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setVerifiedIdentityDetails(null);
    setShowReturningPatientModal(true);
  };
  const buildIdentityDetailsFromRaw = useCallback(
    (
      rawData: Record<string, unknown>,
      civilIdForData: string,
      pickedName: string,
    ): PaciIdentityDetails => {
      const rawName = (rawData?.name || {}) as Record<string, unknown>;
      const nameFromRaw = rawData?.name
        ? (isAr
            ? String(rawName.arabic || rawName.ar || rawName.english || rawName.en || "")
            : String(rawName.english || rawName.en || rawName.arabic || rawName.ar || ""))
        : pickedName;
      const nationalityObj = (rawData?.nationality || {}) as Record<string, unknown>;
      const nationalityNameObj = (nationalityObj?.name || {}) as Record<string, unknown>;
      const nationalityName = nationalityObj?.name
        ? (isAr
            ? String(nationalityNameObj.arabic || nationalityNameObj.english || "")
            : String(nationalityNameObj.english || nationalityNameObj.arabic || ""))
        : "";
      const registration = (rawData?.registration || {}) as Record<string, unknown>;

      return {
        name: nameFromRaw || pickedName || "—",
        dateOfBirth: rawData?.dateOfBirth
          ? new Date(String(rawData.dateOfBirth)).toLocaleDateString(isAr ? "ar-KW" : "en-GB")
          : "—",
        civilIdNumber: String(rawData?.civilId || civilIdForData || "—"),
        nationality: nationalityName || String(nationalityObj?.iso3Letter || "—"),
        gender: String(rawData?.sex || "—"),
        passportNumber: String(registration?.passport || "—"),
      };
    },
    [isAr],
  );
  const fetchVerifiedIdentityDetails = useCallback(
    async (civilIdForData: string, pickedName: string): Promise<PaciIdentityDetails | null> => {
      try {
        const identityDataResponse = await getIdentityData(civilIdForData);
        const rawData = (identityDataResponse?.raw || identityDataResponse?.identityData || {}) as Record<
          string,
          unknown
        >;
        return buildIdentityDetailsFromRaw(rawData, civilIdForData, pickedName);
      } catch (err) {
        console.error("Failed to load identity details:", err);
        return null;
      }
    },
    [buildIdentityDetailsFromRaw],
  );
  const buildPaciPrefillFromIdentityApi = useCallback(
    async (
      civilIdForData: string,
      pickedName: string,
      identityDetails?: PaciIdentityDetails | null,
    ): Promise<AppointmentRequestPrefillState> => {
      const resolvedDetails = identityDetails ?? (await fetchVerifiedIdentityDetails(civilIdForData, pickedName));
      const fallback: AppointmentRequestPrefillState = {
        fullName: pickedName,
        civilId: civilIdForData,
        requestType: "appointment request",
        readOnlyIdentity: true,
        identityDetails: resolvedDetails || undefined,
      };
      try {
        const identityDataResponse = await getIdentityData(civilIdForData);
        const rawData = (identityDataResponse?.raw || identityDataResponse?.identityData || {}) as Record<
          string,
          unknown
        >;
        const rawName = (rawData?.name || {}) as Record<string, unknown>;
        const nameFromRaw = rawData?.name
          ? (isAr
              ? String(rawName.arabic || rawName.ar || rawName.english || rawName.en || "")
              : String(rawName.english || rawName.en || rawName.arabic || rawName.ar || ""))
          : pickedName;
        const dobIso = identityDateToIso(rawData?.dateOfBirth);
        const gender = mapPaciSexToGender(String(rawData?.sex || ""));
        const details = resolvedDetails || buildIdentityDetailsFromRaw(rawData, civilIdForData, pickedName);
        return {
          fullName: nameFromRaw || pickedName,
          dateOfBirth: dobIso || undefined,
          gender: gender || undefined,
          civilId: String(rawData?.civilId || civilIdForData),
          requestType: "appointment request",
          readOnlyIdentity: true,
          identityDetails: details,
        };
      } catch (err) {
        console.error("Failed to load PACI identity for appointment request prefill:", err);
        return fallback;
      }
    },
    [buildIdentityDetailsFromRaw, fetchVerifiedIdentityDetails, isAr],
  );
  const loadVerifiedIdentityDetails = useCallback(
    async (civilIdForData: string, pickedName: string) => {
      try {
        const identityDataResponse = await getIdentityData(civilIdForData);
        const rawData = (identityDataResponse?.raw || identityDataResponse?.identityData || {}) as Record<
          string,
          unknown
        >;
        const dobIso = identityDateToIso(rawData?.dateOfBirth);
        if (dobIso) setPatientDobIso(dobIso);
        setVerifiedIdentityDetails(buildIdentityDetailsFromRaw(rawData, civilIdForData, pickedName));
      } catch (err) {
        console.error("Failed to load identity details for display:", err);
      }
    },
    [buildIdentityDetailsFromRaw],
  );
  const renderIdentityDetailsCard = (details: PaciIdentityDetails) => (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 sm:p-5">
      <h4 className="font-body text-[11px] tracking-[0.18em] uppercase text-accent mb-3">
        {isAr ? "تفاصيل الهوية" : "Identity Details"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: isAr ? "الاسم" : "Name", value: details.name },
          { label: isAr ? "تاريخ الميلاد" : "Date of Birth", value: details.dateOfBirth },
          { label: isAr ? "الرقم المدني" : "Civil ID Number", value: details.civilIdNumber },
          { label: isAr ? "الجنسية" : "Nationality", value: details.nationality },
          { label: isAr ? "الجنس" : "Gender", value: details.gender },
          { label: isAr ? "رقم جواز السفر" : "Passport Number", value: details.passportNumber },
        ].map((row) => (
          <div key={row.label} className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{row.label}</p>
            <p className="font-body text-sm text-foreground font-medium mt-0.5">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
  const resetPatientLookupFailure = useCallback(() => {
    verificationDoneRef.current = false;
    setIsWaitingForApproval(false);
    setVerifyOperationId(null);
    setPatientName("");
    setPatientType(null);
    setPatientId(null);
    setRegisteredPatientHmsDetails(null);
    paciOperationIdRef.current = null;
    setPatientDobIso("");
    setVerifiedPersonName(null);
    setVerifiedIdentityDetails(null);
  }, []);
  const dismissHisFailureModal = useCallback(() => {
    setShowHisFailureModal(false);
    setNationalIdError("");
    setHisFailureMessage("");
    setHisFailureIdentityDetails(null);
    setHisFailureAllowsRequest(false);
    setPatientLookupShowGoBack(false);
  }, []);
  const dismissHisFailureAndGoToRequest = useCallback(() => {
    dismissHisFailureModal();
    setNationalIdError("");
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setIsWaitingForApproval(false);
    setIsConfirmingPatientRecord(false);
    setVerifyOperationId(null);
    setShowReturningPatientModal(false);
    resetPatientLookupFailure();
    const doctorQuery = selectedDoctor
      ? `?doctor=${encodeURIComponent(selectedDoctor)}`
      : "";
    const prefill = hisFailurePrefillRef.current;
    hisFailurePrefillRef.current = null;
    const symptoms =
      collectedSymptoms.length > 0
        ? collectedSymptoms
        : buildCollectedSymptoms(symptomChips, symptomText);
    navigate(`/appointment-request${doctorQuery}`, {
      state: {
        appointmentRequestPrefill: {
          ...(prefill ?? {}),
          requestType: prefill?.requestType ?? "appointment request",
          ...(symptoms.length > 0 ? { symptoms } : {}),
        },
        fromBookAppointment: true,
        ...(symptoms.length > 0 ? { savedSymptoms: symptoms } : {}),
      },
    });
  }, [
    collectedSymptoms,
    dismissHisFailureModal,
    navigate,
    resetPatientLookupFailure,
    selectedDoctor,
    symptomChips,
    symptomText,
  ]);
  const finalizeRegisteredPatientAfterPaci = useCallback(
    async (params: {
      civilId: string;
      pickedName: string;
      names: { english: string; arabic: string };
    }): Promise<boolean> => {
      setIsConfirmingPatientRecord(true);
      setPatientLookupShowGoBack(false);
      setNationalIdError("");
      try {
        const pRes = await getPatient({ nationalid: params.civilId });
        const patientId = extractPatientId(pRes?.data?.patient);
        if (!pRes.success || !patientId) {
          throw { response: { data: { meta: { code: "PATIENT_NOT_FOUND" }, message: "Error: Patient not found" } } };
        }
        const patient = pRes?.data?.patient as Record<string, unknown> | undefined;
        setRegisteredPatientHmsDetails({
          mobile_number: String(patient?.mobile_number || ""),
          urn: String(patient?.urn || ""),
          email: String(patient?.email || ""),
          address: String(patient?.address || ""),
          national_id: String(patient?.national_id || params.civilId),
        });
        await loadVerifiedIdentityDetails(params.civilId, params.pickedName);
        setPatientId(patientId);
        setPatientName(params.pickedName);
        setPatientType("returning");
        setVerifiedPersonName(params.names);
        setIsWaitingForApproval(false);
        setVerifyOperationId(null);
        verifySocketCleanupRef.current?.();
        verifySocketCleanupRef.current = null;
        setShowReturningPatientModal(false);
        return true;
      } catch (err) {
        console.error("Hospital patient lookup failed:", err);
        const userMsg = getPatientLookupUserMessage(err, t);
        const allowsRequest =
          userMsg.code === "PATIENT_NOT_FOUND" || userMsg.code === "PATIENT_DUPLICATE_NATIONAL_ID";
        const identityDetails = await fetchVerifiedIdentityDetails(params.civilId, params.pickedName);
        setHisFailureMessage(userMsg.text);
        setHisFailureIdentityDetails(identityDetails);
        setHisFailureAllowsRequest(allowsRequest);
        setPatientLookupShowGoBack(userMsg.showGoBack);
        if (allowsRequest) {
          hisFailurePrefillRef.current = await buildPaciPrefillFromIdentityApi(
            params.civilId,
            params.pickedName,
            identityDetails,
          );
        } else {
          hisFailurePrefillRef.current = null;
        }
        setNationalIdError("");
        setShowReturningPatientModal(false);
        resetPatientLookupFailure();
        setShowHisFailureModal(true);
        return false;
      } finally {
        setIsConfirmingPatientRecord(false);
      }
    },
    [
      buildPaciPrefillFromIdentityApi,
      fetchVerifiedIdentityDetails,
      loadVerifiedIdentityDetails,
      resetPatientLookupFailure,
      t,
    ],
  );
  const goBackFromPatientLookupModal = () => {
    verificationDoneRef.current = false;
    setPatientLookupShowGoBack(false);
    setNationalIdError("");
    setNationalId("");
    setIsWaitingForApproval(false);
    setIsConfirmingPatientRecord(false);
    setVerifyOperationId(null);
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setPatientType(null);
    setPatientName("");
    setPatientId(null);
    setRegisteredPatientHmsDetails(null);
    paciOperationIdRef.current = null;
    setVerifiedPersonName(null);
    setVerifiedIdentityDetails(null);
    setShowReturningPatientModal(false);
  };
  useEffect(() => {
    if (patientType === "returning" && !patientId) {
      setPatientType(null);
      setPatientName("");
      setVerifiedIdentityDetails(null);
      setVerifiedPersonName(null);
    }
  }, [patientType, patientId]);
  const completeVerificationFromStatus = useCallback(
    async (statusData: IdentityStatusResponse) => {
      if (statusData?.status === "pending") return;
      if (statusData?.verified === false) {
        setNationalIdError(
          isAr ? "لم يتم التحقق. يرجى المحاولة مرة أخرى." : "Verification was not approved. Please try again."
        );
        setIsWaitingForApproval(false);
        setVerifyOperationId(null);
        return;
      }
      const names = extractVerifiedName(statusData);
      const hasName = Boolean(names.english || names.arabic);
      if (!hasName) {
        setNationalIdError(
          isAr ? "تمت الموافقة ولكن لا يوجد اسم متاح حالياً." : "Approved but no name is available yet."
        );
        setIsWaitingForApproval(false);
        return;
      }
      const pickedName = isAr ? (names.arabic || names.english) : (names.english || names.arabic);
      const civilId = (statusData?.civilId || nationalId.trim()).trim();
      if (!civilId) {
        setNationalIdError(
          isAr ? "لم يتم استلام الرقم المدني." : "Civil ID was not received from verification."
        );
        setIsWaitingForApproval(false);
        return;
      }
      await finalizeRegisteredPatientAfterPaci({ civilId, pickedName, names });
    },
    [finalizeRegisteredPatientAfterPaci, isAr, nationalId]
  );
  const handleNationalIdVerify = async () => {
    const civilId = nationalId.trim();
    if (!/^\d{12}$/.test(civilId)) {
      setNationalIdError(isAr ? "أدخل رقمًا مدنيًا صحيحًا (12 رقم)" : "Enter a valid Kuwait Civil ID (12 digits)");
      return;
    }
    setIsVerifyingNationalId(true);
    setNationalIdError("");
    setPatientLookupShowGoBack(false);
    setVerifiedPersonName(null);
    setVerifyOperationId(null);
    setIsWaitingForApproval(false);
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setVerifiedIdentityDetails(null);
    try {
      const response = await startIdentityVerification({
        civilId,
        serviceName: { ar: "طلب موعد", en: "Appointment Request" },
        reason: { ar: "تجربة", en: "test" },
      });
      if (response?.success === false) {
        const metaType: string = response?.meta?.type ?? "";
        if (metaType.includes("too-many-requests")) {
          setNationalIdError(
            isAr
              ? "طلبات مصادقة كثيرة جداً لهذا الرقم المدني، يرجى المحاولة لاحقاً."
              : "Too many concurrent authentication requests for this Civil ID. Please try again later."
          );
          return;
        }
        setNationalIdError(
          isAr
            ? "بيانات غير صحيحة، يرجى المحاولة مرة أخرى."
            : "Incorrect information, please try again."
        );
        return;
      }
      if (response?.operationId) {
        paciOperationIdRef.current = response.operationId;
        setVerifyOperationId(response.operationId);
        setIsWaitingForApproval(true);
        return;
      }
      const names = extractVerifiedName(response);
      const hasName = Boolean(names.english || names.arabic);
      if (response?.verified === true && hasName) {
        const pickedName = isAr ? (names.arabic || names.english) : (names.english || names.arabic);
        const registered = await finalizeRegisteredPatientAfterPaci({
          civilId,
          pickedName,
          names,
        });
        if (registered) return;
      }
      setNationalIdError(
        isAr
          ? "تعذر التحقق حالياً. أكمل التحقق في تطبيق هويتي ثم أعد المحاولة."
          : "Could not verify right now. Complete Hawyti authentication and try again."
      );
    } catch (error: unknown) {
      const statusCode = (error as { response?: { status?: number; data?: { message?: string; meta?: { type?: string } } } })
        ?.response?.status;
      const apiType = (error as { response?: { data?: { meta?: { type?: string } } } })?.response?.data?.meta?.type ?? "";
      const isTooMany = statusCode === 400 && typeof apiType === "string" && apiType.includes("too-many-requests");
      if (isTooMany) {
        setNationalIdError(
          isAr
            ? "طلبات مصادقة كثيرة جداً لهذا الرقم المدني، يرجى المحاولة لاحقاً."
            : "Too many concurrent authentication requests for this Civil ID. Please try again later."
        );
        return;
      }
      const isValidation400 = statusCode === 400 && !apiType.includes("too-many-requests");
      if (isValidation400) {
        setNationalIdError(
          isAr
            ? "بيانات غير صحيحة، يرجى المحاولة مرة أخرى."
            : "Incorrect information, please try again."
        );
        return;
      }
      const message = error instanceof Error ? error.message : "";
      setNationalIdError(
        message || (isAr ? "فشل التحقق من الرقم المدني" : "Failed to verify Kuwait Civil ID")
      );
    } finally {
      setIsVerifyingNationalId(false);
    }
  };
  useEffect(() => {
    if (!verifyOperationId || !showReturningPatientModal || !isWaitingForApproval) {
      verificationDoneRef.current = false;
      return;
    }
    verificationDoneRef.current = false;
    verifySocketCleanupRef.current?.();
    const finishIfReady = (statusData: IdentityStatusResponse) => {
      if (verificationDoneRef.current || statusData?.status === "pending") return;
      verificationDoneRef.current = true;
      verifySocketCleanupRef.current?.();
      verifySocketCleanupRef.current = null;
      void (async () => {
        await completeVerificationFromStatus(statusData);
      })();
    };
    const { unsubscribe } = subscribeToIdentityVerification(verifyOperationId, finishIfReady);
    verifySocketCleanupRef.current = unsubscribe;
    return () => {
      unsubscribe();
      verifySocketCleanupRef.current = null;
    };
  }, [verifyOperationId, showReturningPatientModal, isWaitingForApproval, completeVerificationFromStatus]);
  const goToInitialBookingScreen = () => {
    verifySocketCleanupRef.current?.();
    verifySocketCleanupRef.current = null;
    setIsWaitingForApproval(false);
    setIsConfirmingPatientRecord(false);
    setPatientLookupShowGoBack(false);
    setVerifyOperationId(null);
    setShowReturningPatientModal(false);
    setBookingPath("primary");
    setStep(0);
    setPatientType(null);
    setPatientName("");
    setPatientId(null);
    setRegisteredPatientHmsDetails(null);
    paciOperationIdRef.current = null;
    setPatientDobIso("");
    setNationalId("");
    setNationalIdError("");
    setVerifiedPersonName(null);
    setVerifiedIdentityDetails(null);
    setPatientPhone("");
    setPatientDob("");
    setPatientGender("");
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
    if (step === 2) setShowAllDoctors(true);
    setStep((s) => Math.max(s - 1, 0));
  };
  const handleSymptomAnalyze = async () => {
    const snapshot = persistSymptomsSnapshot(symptomChips, symptomText);
    const tokens = snapshot.map((s) => s.toLowerCase());
    if (tokens.length === 0) return;
    setSymptomAnalyzing(true);
    const fallbackIds = heuristicDepartmentIdsFromTokens(tokens, departmentsList);
    const geminiApiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
    try {
      if (!geminiApiKey || departmentsList.length === 0) {
        setSymptomResults(fallbackIds);
        return;
      }
      const mappingLines = departmentsList
        .filter((d) => Boolean(d.specialityCode))
        .map((d) => `${d.specialityCode} - ${d.name}`)
        .join("\n");
      const combinedPrompt = `You are a strict medical triage router.
Analyze the patient's description of their condition. They may provide long, conversational sentences describing their health issues.
Extract the core medical symptoms from their description and determine the most appropriate department.
You MUST output ONLY the exact Clinic Code of that department from the mapping below.
If the description does not clearly match any department on the list, you MUST output exactly "no clinic found".
DO NOT provide any explanations, greetings, or the department name. Output ONLY the code itself.
Mapping:
${mappingLines}
Patient Description: ${[...symptomChips, symptomText].filter(Boolean).join(", ").trim()}
Clinic Code:`;
      const response = await fetch(GEMINI_TRIAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: combinedPrompt }] }],
          generationConfig: { temperature: 0.1 },
        }),
      });
      if (!response.ok) {
        setSymptomResults(fallbackIds);
        return;
      }
      const data = await response.json();
      const aiText = String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
      const matchedIds = mapAiClinicCodeToDepartmentIds(aiText, departmentsList);
      setSymptomResults(matchedIds.length > 0 ? matchedIds : fallbackIds);
    } catch {
      setSymptomResults(fallbackIds);
    } finally {
      setSymptomAnalyzing(false);
    }
  };
  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };
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
              {patientType === "new"
                ? t("appointmentRequested")
                : isRequestMode
                  ? t("requestSubmitted")
                  : t("appointmentConfirmed")}
            </h1>
            <p className="text-primary-foreground/70 font-body text-sm max-w-md mx-auto">
              {patientType === "new"
                ? t("appointmentRequestedMsg")
                : isRequestMode
                  ? t("requestConfirmMsg")
                  : t("bookingConfirmMsg")}
            </p>
          </motion.div>
          <div className="container mx-auto px-6 py-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-popover rounded-2xl border border-border p-8 mb-6 shadow-sm -mt-8">
              <h3 className="font-serif text-lg text-foreground mb-5">{isAr ? "تفاصيل الموعد" : "Appointment Details"}</h3>
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
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{isAr ? "الوقت" : "Time Slot"}</p>
                    <p className="text-foreground font-medium">
                      {selectedDate && selectedSlot ? (
                        `${formattedSelectedDate} • ${formatTimeString(selectedSlot)}`
                      ) : "—"}
                    </p>
                  </div>
                </div>
                {collectedSymptoms.length > 0 && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <Activity className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("symptoms")}</p>
                      <p className="text-foreground font-medium">{formatSymptomsForDisplay(collectedSymptoms, isAr)}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-popover rounded-2xl border border-border p-8 mb-6">
              <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                {t("nextSteps")}
              </h3>
              <ul className="space-y-3 font-body text-sm text-muted-foreground">
                {[t("step1"), t("step2"), t("step3"), t("step4"),].map((item, i) => (
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
      </div>
    );
  }
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
              {lang === "ar" ? "اختر الطريقة الأنسب لحجز موعدك حسب القسم الطبي، أو الطبيب، أو من خلال وصف الأعراض" : "Select the method that works best for you to schedule your appointment — by department, doctor, or symptom description."}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("primary"); setStep(0); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-primary/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Building2 className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "اختيار القسم" : "Select Department"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "ابدأ باختيار القسم، ثم الطبيب" : "Start by choosing a department, then a doctor"}
              </p>
            </motion.button>
            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("doctor"); setStep(1); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-accent/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Stethoscope className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "اعرف طبيبي" : "I Know My Doctor"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "اضغط هنا إذا كنت تعرف طبيبك" : "Click here if you know your doctor"}
              </p>
            </motion.button>
            <motion.button whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} whileTap={{ scale: 0.98 }}
              onClick={() => { setBookingPath("symptoms"); setStep(0); }}
              className="bg-popover rounded-2xl p-5 md:p-8 border border-border text-center transition-all hover:border-primary/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary/40 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Brain className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-foreground mb-1 md:mb-2">{lang === "ar" ? "لست متأكدًا؟" : "Not Sure?"}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {lang === "ar" ? "إذا لم تكن متأكدًا من القسم أو الطبيب المناسب، يمكنك الحجز من خلال اختيار الأعراض" : "Not sure about doctor or department? Check with symptoms"}
              </p>
            </motion.button>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }
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
              {SYMPTOM_CHIP_OPTIONS.map((chip) => (
                <motion.button key={chip.value} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    setSymptomChips((prev) => {
                      const isSelected = prev.includes(chip.value);
                      const next = isSelected ? prev.filter((c) => c !== chip.value) : [...prev, chip.value];
                      setSymptomText((prevText) => {
                        const chipLabel = isAr ? chip.ar : chip.en;
                        const parts = prevText
                          .split(/[,;\n]+/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (isSelected) {
                          return parts
                            .filter(
                              (p) =>
                                p.toLowerCase() !== chip.value.toLowerCase() &&
                                p !== chipLabel,
                            )
                            .join(", ");
                        }
                        if (
                          parts.some(
                            (p) =>
                              p.toLowerCase() === chip.value.toLowerCase() || p === chipLabel,
                          )
                        ) {
                          return parts.join(", ");
                        }
                        return [...parts, chipLabel].join(", ");
                      });
                      return next;
                    })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-body tracking-wide transition-all duration-200 border ${symptomChips.includes(chip.value)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border text-muted-foreground hover:border-accent hover:text-accent"
                    }`}>{isAr ? chip.ar : chip.en}</motion.button>
              ))}
            </div>
            <textarea
              value={symptomText}
              onChange={(e) => {
                const nextText = e.target.value;
                setSymptomText(nextText);
                setSymptomChips((prev) => syncSymptomChipsFromText(nextText, prev));
              }}
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
            <div className="flex flex-nowrap items-center justify-between gap-3 sm:gap-4">
              <button
                onClick={() => { setBookingPath(null); setSymptomChips([]); setSymptomText(""); }}
                className="flex shrink-0 items-center gap-1.5 text-muted-foreground font-body text-xs sm:text-sm hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">{t("previous")}</span>
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSymptomAnalyze}
                disabled={symptomChips.length === 0 && !symptomText.trim() || symptomAnalyzing}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg font-body text-[10px] sm:text-xs tracking-wide sm:tracking-widest uppercase whitespace-nowrap transition-all ${(symptomChips.length > 0 || symptomText.trim()) && !symptomAnalyzing
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                {t("analyzeSymptoms")}
              </motion.button>
            </div>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }
  if (bookingPath === "symptoms" && symptomResults !== null && step === 0) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
        <Header />
        <div
          ref={symptomResultsTopRef}
          className="container mx-auto px-6 py-6 max-w-5xl scroll-mt-[var(--header-height,56px)]"
        >
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
                  onClick={() => {
                    persistSymptomsSnapshot(symptomChips, symptomText);
                    setSelectedDept(dept.id);
                    setBookingPath("primary");
                    setStep(1);
                  }}
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
          <div className="flex items-center justify-start mt-8">
            <button onClick={() => { setSymptomResults(null); }} className="flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("previous")}
            </button>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }
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
                type="button"
                onClick={() => i < step && goToStep(i)}
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
          {step === 0 && (bookingPath === "primary" || bookingPath === "doctor") && (
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
                  <div className="space-y-10">
                    {groupedDisplayDepts.map((group) => (
                      <div key={group.key}>
                        <div className="flex items-center gap-4 mb-5">
                          <div className="h-px flex-1 bg-border/50" />
                          <h3 className="text-xs sm:text-sm font-body font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-accent whitespace-nowrap px-1">
                            {isAr ? group.labelAr : group.label}
                          </h3>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {group.depts.map((dept) => (
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
                              <dept.icon className={`w-5 h-5 flex-shrink-0 ${selectedDept === dept.id ? "" : "text-accent"}`} />
                              <div className="min-w-0">
                                <p className="font-body text-sm font-medium truncate">{isAr ? dept.nameAr : dept.name}</p>
                                {(isAr ? dept.medicalFieldAr : dept.medicalField) ? (
                                  <p
                                    className={`font-body text-xs truncate ${selectedDept === dept.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                                  >
                                    {isAr ? dept.medicalFieldAr : dept.medicalField}
                                  </p>
                                ) : null}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!showAllDepts && !deptSearch.trim() && filteredDepts.length > 6 && (
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
                                state: buildBookingNavigationState({
                                  selectedDept: resolvedDeptId,
                                  selectedDoctor: doc.id,
                                  isRequestMode: isDoctorRequestOnly(doc),
                                  canBookSlot: !isDoctorRequestOnly(doc),
                                }),
                              });
                            }}>
                            <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
                              {doc.image ? <img src={doc.image} alt={getDoctorDisplayName(doc, isAr ? "ar" : "en")} className="w-full h-full object-cover object-top" /> : <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-xl font-serif text-primary">{doc.initials}</span></div>}
                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"><Stethoscope className="w-3.5 h-3.5 text-primary" /></div>
                              {selectedDoctor === doc.id && <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-primary-foreground" /></div>}
                            </div>
                            <div className="p-4 flex flex-col flex-grow bg-popover">
                              <p className="text-accent text-[10px] tracking-[0.15em] uppercase font-body mb-1">
                                {isAr
                                  ? (doc.departmentAr || doc.specialtyAr)
                                  : (doc.department || doc.specialty)}
                              </p>
                              <h4 className="font-serif font-bold text-[1.2rem] text-foreground mb-0.5 leading-snug">{getDoctorDisplayName(doc, isAr ? "ar" : "en")}</h4>
                              <p className="text-muted-foreground font-body text-[11px] mb-2 line-clamp-1">{isAr ? doc.specialtyAr : doc.specialty}</p>
                              {doc.hideBooking !== true && (
                                <div className={`flex items-center gap-1.5 mb-3 ${doc.availableOnline !== false ? "text-green-600" : "text-destructive"}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
                                  <span className="font-body text-[10px]">
                                    {doc.availableOnline !== false
                                      ? (isAr ? "متاح للحجز اونلاين" : "Book Online")
                                      : (isAr ? "غير متاح للحجز اونلاين" : "Not Available for Online Booking")}
                                  </span>
                                </div>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); const resolvedDeptId = selectedDept ?? resolveDeptIdForDoctor(doc); navigate(`/doctors/${doc.id}`, { state: buildBookingNavigationState({ selectedDept: resolvedDeptId, selectedDoctor: doc.id, isRequestMode: isDoctorRequestOnly(doc), canBookSlot: !isDoctorRequestOnly(doc) }) }); }} className="mt-auto inline-flex items-center gap-1 text-primary font-body text-xs hover:text-accent transition-colors">{isAr ? "عرض الملف الشخصي ←" : "View Profile →"}</button>
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
            <motion.div
              key="s2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <div className="max-w-3xl mx-auto min-w-0">
                {!patientType && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => { setNationalId(""); setNationalIdError(""); setVerifiedPersonName(null); setVerifyOperationId(null); setIsWaitingForApproval(false); setPatientLookupShowGoBack(false); setPatientErrors({}); setPatientName(""); setPatientId(null); setVerifiedIdentityDetails(null); openReturningPatientModal(); }} className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><LogIn className="w-7 h-7 text-primary" /></div>
                      <h3 className="font-serif text-lg text-foreground mb-2">{t("registeredPatient")}</h3>
                      <p className="font-body text-xs text-muted-foreground">{isAr ? "اختر موعدك في الخطوة التالية" : "Choose your appointment time next"}</p>
                    </motion.button>
                    <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => setPatientType("new")} className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"><UserPlus className="w-7 h-7 text-accent" /></div>
                      <h3 className="font-serif text-lg text-foreground mb-2">{t("firstTimeVisitor")}</h3>
                      <p className="font-body text-xs text-muted-foreground">{isAr ? "سيتم نقلك إلى نموذج طلب موعد" : "You will be taken to the Appointment Request Form"}</p>
                    </motion.button>
                  </div>
                )}
                {patientType === "new" && (
                  <div className="bg-popover rounded-2xl p-5 sm:p-8 md:p-10 border border-border shadow-sm min-w-0 overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-accent" /></div>
                      <div><h2 className="text-xl font-serif text-foreground">{t("patientDetails")}</h2><p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p></div>
                    </div>
                    <div className="space-y-5 min-w-0">
                      <div><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("fullName")} <span className="text-destructive">*</span></label><input type="text" value={patientName} onChange={(e) => { setPatientName(e.target.value); setPatientErrors(prev => ({ ...prev, name: "" })); }} placeholder={t("enterFullName")} className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.name ? "border-destructive" : "border-border"}`} />{patientErrors.name && <p className="font-body text-xs text-destructive mt-1">{patientErrors.name}</p>}</div>
                      <div className="min-w-0 w-full">
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("phoneNumber")} <span className="text-destructive">*</span></label>
                        <div className="flex w-full min-w-0 gap-2">
                          <select value={patientCountryCode} onChange={(e) => setPatientCountryCode(e.target.value)} className="shrink-0 w-[5.25rem] sm:w-24 px-2 sm:px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"><option value="+965">+965</option><option value="+966">+966</option><option value="+971">+971</option></select>
                          <input type="tel" value={patientPhone} onChange={(e) => { setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 8)); setPatientErrors(prev => ({ ...prev, phone: "" })); }} inputMode="numeric" maxLength={8} pattern="\d{8}" placeholder={t("phonePlaceholder")} className={`min-w-0 flex-1 w-full px-3 sm:px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.phone ? "border-destructive" : "border-border"}`} />
                        </div>{patientErrors.phone && <p className="font-body text-xs text-destructive mt-1">{patientErrors.phone}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="min-w-0">
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span></label>
                          <div className="date-input-wrap"><input type="date" value={patientDob} max={new Date().toISOString().split("T")[0]} onChange={(e) => { setPatientDob(e.target.value); setPatientErrors(prev => ({ ...prev, dob: "" })); }} className={`form-date-input w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.dob ? "border-destructive" : "border-border"}`} /></div>{patientErrors.dob && <p className="font-body text-xs text-destructive mt-1">{patientErrors.dob}</p>}</div>
                        <div className="min-w-0"><label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{t("gender")} <span className="text-destructive">*</span></label><select value={patientGender} onChange={(e) => { setPatientGender(e.target.value); setPatientErrors(prev => ({ ...prev, gender: "" })); }} className={`w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${patientErrors.gender ? "border-destructive" : "border-border"}`}><option value="">{t("selectGender")}</option><option value="male">{t("male")}</option><option value="female">{t("female")}</option></select>{patientErrors.gender && <p className="font-body text-xs text-destructive mt-1">{patientErrors.gender}</p>}</div>
                      </div>
                    </div>
                  </div>
                )}
                {patientType === "returning" && patientId && patientName && verifiedIdentityDetails && (
                  <div className="bg-popover rounded-2xl p-5 sm:p-8 border border-border shadow-sm">
                    {verifiedIdentityDetails && (
                      <div className="mt-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 sm:p-5">
                        <h4 className="font-body text-[11px] tracking-[0.18em] uppercase text-accent mb-3">
                          {isAr ? "تفاصيل الهوية" : "Identity Details"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "الاسم" : "Name"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.name}</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "تاريخ الميلاد" : "Date of Birth"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.dateOfBirth}</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "الرقم المدني" : "Civil ID Number"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.civilIdNumber}</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "الجنسية" : "Nationality"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.nationality}</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "الجنس" : "Gender"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.gender}</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{isAr ? "رقم جواز السفر" : "Passport Number"}</p>
                            <p className="font-body text-sm text-foreground font-medium mt-0.5">{verifiedIdentityDetails.passportNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-5 flex gap-3">
                      <button type="button" disabled={!patientId} onClick={() => { if (!patientId) return; if (!patientName.trim()) { setPatientErrors((prev) => ({ ...prev, name: isAr ? "الاسم الكامل مطلوب" : "Full name is required" })); return; } setPatientErrors((prev) => ({ ...prev, name: "" })); setStep(3); }} className="flex-1 bg-primary text-primary-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center text-center">{isAr ? "متابعة" : "Proceed"}</button>
                      <button type="button" onClick={goToInitialBookingScreen} className="flex-1 bg-secondary/40 text-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center">{isAr ? "إلغاء" : "Cancel"}</button>
                    </div>
                  </div>
                )}
                {patientType && <button onClick={() => { setPatientType(null); setNationalId(""); setNationalIdError(""); setVerifiedPersonName(null); setVerifyOperationId(null); setIsWaitingForApproval(false); setVerifiedIdentityDetails(null); setPatientPhone(""); }} className="mt-4 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">← {t("changeSelection")}</button>}
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-accent" /></div>
                    <div><h2 className="text-xl font-serif text-foreground">{isAr ? "اختيار التاريخ والوقت" : "Select Date & Time"}</h2><p className="text-muted-foreground font-body text-xs">{isAr ? "يرجى اختيار التاريخ والوقت المناسبين للموعد." : "Pick a date and available time slot"}</p></div>
                  </div>
                  {specialityCode && providerCode && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 font-body text-xs uppercase tracking-wider">
                      <div className="flex gap-2 items-center">
                        <span className="text-muted-foreground">{isAr ? "القسم:" : "Speciality:"}</span>
                        <span className="font-semibold text-foreground">{isAr ? selectedDeptObj?.nameAr : selectedDeptObj?.name}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-muted-foreground">{isAr ? "الطبيب:" : "Doctor:"}</span>
                        <span className="font-semibold text-foreground">{selectedDoctorObj ? getDoctorDisplayName(selectedDoctorObj, isAr ? "ar" : "en") : ""}</span>
                      </div>
                    </div>
                  )}
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">{isAr ? "اختر تاريخاً" : "Select a date"}</p>
                  <div className="flex justify-center mb-4">
                    <DatePickerCalendar
                      mode="single"
                      selected={selectedCalendarDate}
                      onSelect={handleAppointmentDateSelect}
                      disabled={isAppointmentDateDisabled}
                      className={cn("rounded-xl border border-border bg-background p-3 pointer-events-auto")}
                    />
                  </div>
                  {selectedDate && (
                    <p className="font-body text-sm text-center text-foreground mb-4">
                      {isAr ? "التاريخ المحدد:" : "Selected date:"}{" "}
                      <span className="font-medium text-primary">
                        {selectedCalendarDate?.toLocaleDateString(lang === "ar" ? "ar-KW" : "en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  )}
                  {selectedDate && isLoadingSlots && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent mb-4" />
                      <p className="font-body text-sm text-muted-foreground">{isAr ? "جارِ جلب المواعيد المتاحة..." : "Fetching available time slots..."}</p>
                    </div>
                  )}
                  {selectedDate && !isLoadingSlots && slotsForSelectedDate.length > 0 && (
                    <div className="space-y-6">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{isAr ? "الفترة المتاحة" : "Available times"}</p>
                      {Object.entries(slotsByPeriod).map(([period, slots]) => slots.length > 0 && (
                        <div key={period}>
                          <h3 className="font-body text-sm font-medium text-foreground mb-3 capitalize">
                            {isAr ? (period === "morning" ? "صباحًا" : period === "afternoon" ? "مساءً" : period) : period}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {slots.map((slot) => (
                              <button
                                key={slot.slot_booking_id || slot.slot_from_time}
                                type="button"
                                onClick={() => {
                                  setSelectedSlot(slot.slot_from_time);
                                  setSelectedSlotId(slot.slot_booking_id);
                                  setStep(4);
                                }}
                                className={`p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-body transition-all text-center whitespace-nowrap ${selectedSlot === slot.slot_from_time ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-background border-border hover:border-accent/40 hover:bg-accent/5 text-foreground"}`}
                              >
                                {formatSlotRange(slot)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedDate && !isLoadingSlots && slotsForSelectedDate.length === 0 && slotsFetchReady && (
                    <div className="text-center py-12 text-muted-foreground font-body text-sm bg-muted/20 rounded-2xl border border-dashed border-border">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      {isAr ? "لا توجد مواعيد متاحة لهذا اليوم" : "No available appointments for this date"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="s4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-popover rounded-2xl p-8 md:p-10 border border-border shadow-sm">
                  <h2 className="font-serif text-xl text-foreground mb-2">
                    {patientType === "new"
                      ? t("reviewSubmit")
                      : isRequestMode
                        ? t("reviewSubmit")
                        : t("reviewConfirm")}
                  </h2>
                  <div className="space-y-5">
                    {[
                      { label: t("department"), value: (isAr ? selectedDeptObj?.nameAr : selectedDeptObj?.name) || selectedDoctorObj?.specialty || "", icon: Building2 },
                      { label: t("doctor"), value: (selectedDoctorObj ? getDoctorDisplayName(selectedDoctorObj, isAr ? "ar" : "en") : "") || "", icon: User },
                      ...(collectedSymptoms.length > 0
                        ? [{ label: t("symptoms"), value: formatSymptomsForDisplay(collectedSymptoms, isAr), icon: Activity }]
                        : []),
                      { label: isAr ? "التاريخ والوقت" : "Date & Time", value: selectedDate && selectedSlot ? `${formattedSelectedDate}  •  ${formatTimeString(selectedSlot)}` : "", icon: Clock },
                      { label: t("patient"), value: patientName.trim() || "—", icon: ClipboardList },
                      ...(patientType === "new"
                        ? [
                            { label: t("phone"), value: `${patientCountryCode} ${patientPhone}`, icon: Stethoscope },
                            {
                              label: isAr ? "تاريخ الميلاد" : "Date of Birth",
                              value:
                                formattedDob ||
                                (patientDobIso ? patientDobIso.split("-").reverse().join("/") : "—"),
                              icon: User,
                            },
                            {
                              label: t("gender"),
                              value: patientGender === "male" ? t("male") : patientGender === "female" ? t("female") : "—",
                              icon: User,
                            },
                          ]
                        : [])
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-4 py-3 border-b border-border last:border-0"><div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"><row.icon className="w-4 h-4 text-accent" /></div><div><p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{row.label}</p><p className="font-body text-sm text-foreground font-medium">{row.value}</p></div></div>
                    ))}
                  </div>
                  {bookingError && <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-destructive" /><p className="font-body text-sm text-destructive">{bookingError}</p></div>}
                  <div className="mt-8 flex flex-col gap-4">
                    <motion.button whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} onClick={handleConfirm} disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                      {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" />{isAr ? "جارِ الإرسال..." : "Submitting..."}</> : <>{patientType === "new" ? t("confirmRequest") : (isAr ? "تأكيد الحجز" : "Confirm Booking")}</>}
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
              {isAr ? "المواصلة لحجز موعد" : t("continue")} <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      {showReturningPatientModal && !SKIP_CIVIL_ID_VERIFICATION && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={closeReturningPatientModal}>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-3xl border border-border/70 bg-popover shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-body text-[10px] tracking-[0.18em] uppercase text-accent mb-1">{isAr ? "مريض مسجل" : "Registered Patient"}</p><h3 className="font-serif text-xl text-foreground">{isAr ? "التحقق من البطاقة المدنية الكويتية" : "Kuwait Civil ID Verification"}</h3><p className="font-body text-xs text-muted-foreground mt-1">{isAr ? "يرجى إدخال رقم البطاقة المدنية الكويتية لاسترجاع بياناتكم ومتابعة عملية الحجز" : "Please enter your Kuwait Civil ID to retrieve your details and continue booking."}</p></div>
                <button onClick={closeReturningPatientModal} className="w-8 h-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors" aria-label={isAr ? "إغلاق" : "Close"}>×</button>
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? "رقم البطاقة المدنية الكويتية" : "Kuwait Civil ID"} <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nationalId}
                  disabled={isWaitingForApproval || isConfirmingPatientRecord}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                    if (digits.length > 0 && digits[0] !== "2" && digits[0] !== "3") return;
                    setNationalId(digits);
                    setNationalIdError("");
                    setPatientLookupShowGoBack(false);
                    setVerifiedPersonName(null);
                    setVerifiedIdentityDetails(null);
                  }}
                  placeholder={isAr ? "أدخل 12 رقمًا" : "Enter 12 digits"}
                  className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 ${nationalIdError ? "border-destructive" : "border-border"}`}
                />
                {nationalIdError && (
                  <div
                    role="alert"
                    className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 flex gap-3 text-start"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-destructive leading-relaxed">{nationalIdError}</p>
                  </div>
                )}
                {patientLookupShowGoBack && !isWaitingForApproval && !isConfirmingPatientRecord && (
                  <button
                    type="button"
                    onClick={goBackFromPatientLookupModal}
                    className="mt-3 w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("patientLookupGoBack")}
                  </button>
                )}
              </div>
              {isVerifyingNationalId ? (
                <div className="mt-6 flex flex-col items-center justify-center py-6 rounded-2xl border border-border/70 bg-muted/20 px-4">
                  <Loader2 className="w-10 h-10 animate-spin text-accent" />
                  <p className="font-body text-sm text-foreground mt-4 text-center">{t("identitySendingRequest")}</p>
                </div>
              ) : isWaitingForApproval || isConfirmingPatientRecord ? (
                <div className="mt-6 flex flex-col items-center justify-center py-8 rounded-2xl border border-accent/20 bg-accent/5 px-4">
                  <Loader2 className="w-10 h-10 animate-spin text-accent" />
                  <p className="font-body text-sm font-medium text-foreground mt-4 text-center">
                    {isConfirmingPatientRecord ? t("identityConfirmingHospitalRecord") : t("identityWaitingTitle")}
                  </p>
                  {!isConfirmingPatientRecord && (
                    <p className="font-body text-xs text-muted-foreground mt-2 text-center max-w-md leading-relaxed">
                      {t("identityWaitingBody")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleNationalIdVerify}
                    disabled={isVerifyingNationalId || !/^[23]\d{11}$/.test(nationalId)}
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-70 inline-flex items-center justify-center text-center"
                  >
                    {isVerifyingNationalId
                      ? isAr
                        ? "جارِ الفحص..."
                        : "Verifying..."
                      : isAr
                        ? "التحقق عبر هويتي"
                        : "Verify with Kuwait Mobile ID"}
                  </button>
                  <button
                    onClick={goToInitialBookingScreen}
                    className="w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
                  >
                    {isAr ? "الغاء" : "Cancel"}
                  </button>
                </div>
              )}
              {(isWaitingForApproval || isConfirmingPatientRecord) && (
                <div className="mt-3">
                  <button
                    onClick={goToInitialBookingScreen}
                    className="w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
                  >
                    {isAr ? "الغاء" : "Cancel"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {showHisFailureModal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="his-failure-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl border border-border/70 bg-popover shadow-2xl p-6 text-start max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 mb-5">
              <AlertCircle className="w-8 h-8 text-accent" />
              <p
                id="his-failure-modal-title"
                className="font-body text-sm text-foreground leading-relaxed"
              >
                {hisFailureAllowsRequest
                  ? t("hisFailureCallCenterMessage")
                  : hisFailureMessage || t("patientLookupFailed")}
              </p>
            </div>
            {hisFailureIdentityDetails && (
              <div className="mb-5">{renderIdentityDetailsCard(hisFailureIdentityDetails)}</div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dismissHisFailureModal();
                  goBackFromPatientLookupModal();
                }}
                className="min-w-28 bg-secondary/40 text-foreground px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors"
              >
                {t("patientLookupGoBack")}
              </button>
              {hisFailureAllowsRequest ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissHisFailureAndGoToRequest();
                  }}
                  className="min-w-28 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  {isAr ? "متابعة" : "Continue"}
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
      {bookingPopupMessage && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={() => setBookingPopupMessage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-border/70 bg-popover shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="font-body text-sm text-foreground">{bookingPopupMessage}</p>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setBookingPopupMessage(null);
                  if (bookingPopupGoHome) {
                    setBookingPopupGoHome(false);
                    navigate("/", { replace: true });
                    return;
                  }
                  navigate("/book-appointment", { state: { resetBookingFlow: true }, replace: true });
                }}
                className="min-w-28 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                {bookingPopupGoHome ? t("backToHome") : isAr ? "موافق" : "OK"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default BookAppointment;
