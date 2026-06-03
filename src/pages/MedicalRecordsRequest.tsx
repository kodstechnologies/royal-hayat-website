import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  createMedicalRecordRequest,
  type SpecificDocumentType,
} from "@/api/MedicalRecordRequest";
import PhoneInput from "react-phone-input-2";
import type { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type ValidIdentification = "" | "civilId" | "passportORGovtId";
type SpecificAuthorization = "" | "Discharge Summary" | "specific documents";

const DOCUMENT_TYPES: SpecificDocumentType[] = [
  "Lab Results",
  "Imaging Reports",
  "Others",
];

const sanitizeCivilIdInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] !== "2" && digits[0] !== "3") return "";
  return digits.slice(0, 12);
};

const MedicalRecordsRequest = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [fullName, setFullName] = useState("");
  const [validIdentification, setValidIdentification] = useState<ValidIdentification>("");
  const [civilIdNumber, setCivilIdNumber] = useState("");
  const [civilIdAttachment, setCivilIdAttachment] = useState<File | null>(null);
  const [passportAttachment, setPassportAttachment] = useState<File | null>(null);
  const [patientFileNo, setPatientFileNo] = useState("");
  const [dob, setDob] = useState<Date>();

  const [authorizationAgreed, setAuthorizationAgreed] = useState(false);
  const [specificAuthorization, setSpecificAuthorization] =
    useState<SpecificAuthorization>("");
  const [serviceFromDate, setServiceFromDate] = useState<Date>();
  const [serviceToDate, setServiceToDate] = useState<Date>();
  const [specialRequest, setSpecialRequest] = useState("");
  const [documentTypes, setDocumentTypes] = useState<SpecificDocumentType[]>([]);
  const [specificDocumentsOther, setSpecificDocumentsOther] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [mobileCountry, setMobileCountry] = useState<{ countryCode: string; dialCode: string }>({
    countryCode: "kw",
    dialCode: "965",
  });

  const [purposeValue, setPurposeValue] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");

  const [requestedBy, setRequestedBy] = useState("");
  const [eSignature, setESignature] = useState("");
  const [legalRepFullName, setLegalRepFullName] = useState("");
  const [relationshipWithPatient, setRelationshipWithPatient] = useState("");
  const [validProofFile, setValidProofFile] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleMobileChange = (value: string, country: CountryData | {}) => {
    const data = country as CountryData;
    const countryCode = data.countryCode || mobileCountry.countryCode;
    const dialCode = data.dialCode || mobileCountry.dialCode;
    setMobileCountry({ countryCode, dialCode });

    const digits = value.replace(/\D/g, "");
    if (countryCode === "kw") {
      const localDigitsRaw = digits.startsWith(dialCode)
        ? digits.slice(dialCode.length)
        : digits;
      const localDigits = localDigitsRaw.replace(/\D/g, "").slice(0, 8);
      setRecipientPhone(`${dialCode}${localDigits}`);
      return;
    }
    setRecipientPhone(digits);
  };

  const resetForm = () => {
    setFullName("");
    setValidIdentification("");
    setCivilIdNumber("");
    setCivilIdAttachment(null);
    setPassportAttachment(null);
    setPatientFileNo("");
    setDob(undefined);
    setAuthorizationAgreed(false);
    setSpecificAuthorization("");
    setServiceFromDate(undefined);
    setServiceToDate(undefined);
    setSpecialRequest("");
    setDocumentTypes([]);
    setSpecificDocumentsOther("");
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    setPurposeValue("");
    setOtherPurpose("");
    setRequestedBy("");
    setESignature("");
    setLegalRepFullName("");
    setRelationshipWithPatient("");
    setValidProofFile(null);
    setAgreeTerms(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({
        title: isAr ? "الموافقة مطلوبة" : "Agreement Required",
        description: isAr
          ? "يرجى الموافقة على الشروط قبل الإرسال."
          : "Please agree to the terms before submitting.",
        variant: "destructive",
      });
      return;
    }
    if (!validIdentification) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى اختيار نوع الهوية." : "Please select an identification type.",
        variant: "destructive",
      });
      return;
    }
    if (validIdentification === "civilId") {
      const civilId = civilIdNumber.trim();
      if (!civilId || !/^[23]\d{11}$/.test(civilId)) {
        toast({
          title: isAr ? "رقم مدني غير صالح" : "Invalid Civil ID",
          description: isAr
            ? "يجب أن يتكون الرقم المدني من 12 رقمًا ويبدأ بـ 2 أو 3."
            : "Civil ID must be 12 digits and start with 2 or 3.",
          variant: "destructive",
        });
        return;
      }
      if (!civilIdAttachment) {
        toast({
          title: isAr ? "حقل مطلوب" : "Required",
          description: isAr ? "يرجى إرفاق البطاقة المدنية." : "Please attach the civil ID.",
          variant: "destructive",
        });
        return;
      }
    }
    if (validIdentification === "passportORGovtId" && !passportAttachment) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى إرفاق الهوية الحكومية." : "Please attach the government ID.",
        variant: "destructive",
      });
      return;
    }
    if (!dob) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى تحديد تاريخ الميلاد." : "Please select date of birth.",
        variant: "destructive",
      });
      return;
    }
    if (!authorizationAgreed) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr
          ? "يرجى الموافقة على التفويض والإفصاح عن المعلومات."
          : "Please confirm authorization and information to be disclosed.",
        variant: "destructive",
      });
      return;
    }
    if (!specificAuthorization) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr
          ? "يرجى تحديد المعلومات المفوض بالإفصاح عنها."
          : "Please select the information you are authorizing for release.",
        variant: "destructive",
      });
      return;
    }
    if (specificAuthorization === "Discharge Summary" && !serviceFromDate) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr
          ? "يرجى اختيار تاريخ الخدمة لملخص الخروج."
          : "Please select the date of service for the discharge summary.",
        variant: "destructive",
      });
      return;
    }
    if (
      specificAuthorization === "specific documents" &&
      (!serviceFromDate || !serviceToDate)
    ) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr
          ? "يرجى إكمال تواريخ الخدمة (من وإلى)."
          : "Please complete the from and to dates of service.",
        variant: "destructive",
      });
      return;
    }
    if (
      specificAuthorization === "specific documents" &&
      serviceFromDate &&
      serviceToDate &&
      serviceFromDate > serviceToDate
    ) {
      toast({
        title: isAr ? "تواريخ غير صالحة" : "Invalid dates",
        description: isAr
          ? "يجب أن يكون تاريخ النهاية في أو بعد تاريخ البداية."
          : "To date must be on or after the from date.",
        variant: "destructive",
      });
      return;
    }
    if (specificAuthorization === "specific documents") {
      if (documentTypes.length === 0) {
        toast({
          title: isAr ? "حقل مطلوب" : "Required",
          description: isAr ? "يرجى اختيار نوع المستند." : "Please select at least one document type.",
          variant: "destructive",
        });
        return;
      }
      if (documentTypes.includes("Others") && !specificDocumentsOther.trim()) {
        toast({
          title: isAr ? "حقل مطلوب" : "Required",
          description: isAr
            ? "يرجى تحديد المستندات الأخرى."
            : "Please specify other documents.",
          variant: "destructive",
        });
        return;
      }
    }
    if (!purposeValue) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى تحديد الغرض من الإفصاح." : "Please select the purpose of disclosure.",
        variant: "destructive",
      });
      return;
    }
    if (purposeValue === "others" && !otherPurpose.trim()) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى تحديد الغرض." : "Please specify the purpose.",
        variant: "destructive",
      });
      return;
    }
    if (!requestedBy) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى تحديد مقدم الطلب." : "Please select who is requesting.",
        variant: "destructive",
      });
      return;
    }
    if (requestedBy === "patient" && !eSignature.trim()) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr
          ? "يرجى إدخال الاسم الكامل للمريض كتوقيع إلكتروني."
          : "Please enter the patient full name as your electronic signature.",
        variant: "destructive",
      });
      return;
    }
    if (requestedBy === "legal-representative") {
      if (!legalRepFullName.trim() || !relationshipWithPatient.trim() || !validProofFile) {
        toast({
          title: isAr ? "حقل مطلوب" : "Required",
          description: isAr
            ? "يرجى إكمال بيانات الممثل القانوني وإرفاق الإثبات."
            : "Please complete legal representative details and attach valid proof.",
          variant: "destructive",
        });
        return;
      }
    }
    if (!recipientPhone.trim()) {
      toast({
        title: isAr ? "حقل مطلوب" : "Required",
        description: isAr ? "يرجى إدخال رقم هاتف المستلم." : "Please enter recipient contact number.",
        variant: "destructive",
      });
      return;
    }
    if (mobileCountry.countryCode === "kw" && recipientPhone.trim()) {
      const mobileDigits = recipientPhone.replace(/\D/g, "");
      const localDigits = mobileDigits.startsWith(mobileCountry.dialCode)
        ? mobileDigits.slice(mobileCountry.dialCode.length)
        : mobileDigits;
      if (localDigits.length !== 8) {
        toast({
          title: isAr ? "رقم غير صالح" : "Invalid number",
          description: isAr
            ? "رقم الكويت يجب أن يتكون من 8 أرقام"
            : "Kuwait mobile number must be 8 digits",
          variant: "destructive",
        });
        return;
      }
    }

    const purposeMap: Record<string, "Continuing Care" | "Insurance Filing" | "Others"> = {
      "continuing-care": "Continuing Care",
      "insurance-filing": "Insurance Filing",
      others: "Others",
    };

    setSubmitting(true);
    try {
      await createMedicalRecordRequest({
        patientFullName: fullName,
        patientFileNo,
        dateOfBirth: format(dob, "yyyy-MM-dd"),
        validIdentification,
        civilIdNumber: validIdentification === "civilId" ? civilIdNumber.trim() : undefined,
        civilIdAttachment: validIdentification === "civilId" ? civilIdAttachment ?? undefined : undefined,
        passportOrGovernmentIdAttachment:
          validIdentification === "passportORGovtId" ? passportAttachment ?? undefined : undefined,
        specificAuthorization,
        specificFromDate: format(serviceFromDate, "yyyy-MM-dd"),
        specificToDate:
          specificAuthorization === "Discharge Summary"
            ? format(serviceFromDate, "yyyy-MM-dd")
            : format(serviceToDate!, "yyyy-MM-dd"),
        specialRequest:
          specificAuthorization === "specific documents"
            ? specialRequest.trim() || undefined
            : undefined,
        specificDocumentTypes:
          specificAuthorization === "specific documents" ? documentTypes : undefined,
        specificDocumentsOther:
          specificAuthorization === "specific documents" && documentTypes.includes("Others")
            ? specificDocumentsOther.trim()
            : undefined,
        recipientName,
        recipientEmailAddress: recipientEmail,
        recipientContactNumber: recipientPhone,
        purposeOfDisclosure: purposeMap[purposeValue],
        otherPurpose: purposeValue === "others" ? otherPurpose : undefined,
        requestedBy: requestedBy === "patient" ? "Patient" : "Legal Representative",
        patientNameConfirmation: requestedBy === "patient" ? eSignature : undefined,
        legalRepresentativeFullName:
          requestedBy === "legal-representative" ? legalRepFullName.trim() : undefined,
        relationshipWithPatient:
          requestedBy === "legal-representative" ? relationshipWithPatient.trim() : undefined,
        validProof: requestedBy === "legal-representative" ? validProofFile ?? undefined : undefined,
      });

      toast({
        title: isAr ? "تم إرسال النموذج" : "Form Submitted",
        description: isAr
          ? "تم إرسال طلب السجلات الطبية بنجاح. سنتواصل معك قريباً."
          : "Your medical records request has been submitted successfully. We will contact you shortly.",
      });

      resetForm();
    } catch (error) {
      const apiMessage =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message.trim()
          : "";
      toast({
        title: isAr ? "حدث خطأ" : "Submission Failed",
        description:
          apiMessage ||
          (isAr
            ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
            : "Something went wrong. Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const DatePickerField = ({
    label,
    value,
    onChange,
    id,
    required = true,
    showLabel = true,
    placeholder,
    ariaLabel,
  }: {
    label: string;
    value?: Date;
    onChange: (date?: Date) => void;
    id: string;
    required?: boolean;
    showLabel?: boolean;
    placeholder?: string;
    ariaLabel?: string;
  }) => (
    <div className="space-y-2">
      {showLabel && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-label={ariaLabel ?? label}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(value, "PPP")
              : placeholder ?? (isAr ? "اختر التاريخ" : "Select date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  const DischargeSummaryDateFields = () => (
    <div className="space-y-3 pt-4 mt-2 border-t border-border">
      <DatePickerField
        id="discharge-serviceDate"
        label={
          isAr
            ? "ملخص الخروج مع تواريخ الخدمة المحددة:"
            : "Discharge summary with specific dates of service:"
        }
        value={serviceFromDate}
        onChange={(date) => {
          setServiceFromDate(date);
          setServiceToDate(undefined);
        }}
        placeholder={isAr ? "اختر التاريخ" : "Select date"}
        ariaLabel={
          isAr
            ? "تاريخ الخدمة لملخص الخروج"
            : "Date of service for discharge summary"
        }
      />
    </div>
  );

  const SpecificDocumentsServiceDatesFields = ({ idPrefix }: { idPrefix: string }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerField
          id={`${idPrefix}-serviceFromDate`}
          label={isAr ? "من تاريخ" : "From date"}
          value={serviceFromDate}
          onChange={setServiceFromDate}
        />
        <DatePickerField
          id={`${idPrefix}-serviceToDate`}
          label={isAr ? "إلى تاريخ" : "To date"}
          value={serviceToDate}
          onChange={setServiceToDate}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-specialRequest`}>
          {isAr ? "طلب خاص" : "Special Request"}
        </Label>
        <Textarea
          id={`${idPrefix}-specialRequest`}
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          placeholder={
            isAr ? "أدخل الطلب الخاص (اختياري)" : "Enter special request (optional)"
          }
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات المرضى" : "Patient Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">
              {isAr ? "نموذج طلب السجلات الطبية" : "Medical Records Request Form"}
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-xl font-serif text-foreground mb-4">
              {isAr
                ? "تفويض للإفصاح عن المعلومات الصحية للمريض عبر البريد الإلكتروني بناءً على طلب المريض"
                : "Authorization for the Disclosure of Patient Health Information via Email Upon Patient Request"}
            </h2>
            <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20 mb-8">
              <h3 className="font-body text-sm font-bold text-destructive mb-2">
                {isAr ? "إخلاء المسؤولية" : "Disclaimer"}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? "باختياري تلقي المعلومات الصحية للمريض إلكترونياً، أتحمل المسؤولية الكاملة عن أمان عنوان البريد الإلكتروني المقدم والأجهزة المستخدمة لتلقي البيانات وتخزينها."
                  : "By choosing to receive the Patient Health Information electronically, I accept full responsibility for the security of the email address provided and the device(s) used to receive and store the data."}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">
                  {isAr ? "1. معلومات المريض" : "1. Patient Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName">
                      {isAr ? "الاسم الكامل" : "Full Name"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      {isAr ? "نوع الهوية" : "Identification Type"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={validIdentification}
                      onValueChange={(v) => {
                        setValidIdentification(v as ValidIdentification);
                        setCivilIdNumber("");
                        setCivilIdAttachment(null);
                        setPassportAttachment(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isAr ? "اختر نوع الهوية" : "Select identification type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civilId">
                          {isAr ? "البطاقة المدنية" : "Civil ID"}
                        </SelectItem>
                        <SelectItem value="passportORGovtId">
                          {isAr
                            ? "جواز السفر / هوية حكومية سارية"
                            : "Passport / Valid Government ID"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {validIdentification === "civilId" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="civilIdNumber">
                          {isAr ? "رقم البطاقة المدنية" : "Civil ID Number"}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="civilIdNumber"
                          required
                          inputMode="numeric"
                          maxLength={12}
                          value={civilIdNumber}
                          onChange={(e) =>
                            setCivilIdNumber(sanitizeCivilIdInput(e.target.value))
                          }
                          placeholder={
                            isAr
                              ? "يبدأ بـ 2 أو 3 (12 رقمًا)"
                              : "Starts with 2 or 3 (12 digits)"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="civilIdAttachment">
                          {isAr ? "إرفاق البطاقة المدنية" : "Attach the civil ID"}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="civilIdAttachment"
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          required
                          onChange={(e) =>
                            setCivilIdAttachment(e.target.files?.[0] || null)
                          }
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          {isAr ? "الصيغ المقبولة: PNG، JPG، PDF" : "Accepted formats: PNG, JPG, PDF"}
                        </p>
                      </div>
                    </>
                  )}

                  {validIdentification === "passportORGovtId" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="passportAttachment">
                        {isAr ? "إرفاق الهوية الحكومية" : "Attach the Govt. ID"}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="passportAttachment"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        required
                        onChange={(e) =>
                          setPassportAttachment(e.target.files?.[0] || null)
                        }
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "الصيغ المقبولة: PNG، JPG، PDF" : "Accepted formats: PNG, JPG, PDF"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fileNo">
                      {isAr ? "رقم ملف المريض (URN)" : "Patient File No. (URN)"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fileNo"
                      required
                      value={patientFileNo}
                      onChange={(e) => setPatientFileNo(e.target.value)}
                      placeholder={isAr ? "أدخل رقم ملف المريض" : "Enter patient file number"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {isAr ? "تاريخ الميلاد" : "Date of Birth"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dob && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dob
                            ? format(dob, "PPP")
                            : isAr
                              ? "اختر تاريخ الميلاد"
                              : "Select date of birth"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dob}
                          onSelect={setDob}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">
                  {isAr ? "2. التفويض والمعلومات المراد الإفصاح عنها" : "2. Authorization and Information to be Disclosed"}
                </h3>
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/5">
                  <Checkbox
                    id="authorizationAgreed"
                    checked={authorizationAgreed}
                    onCheckedChange={(c) => setAuthorizationAgreed(c === true)}
                  />
                  <Label
                    htmlFor="authorizationAgreed"
                    className="font-normal cursor-pointer text-sm leading-relaxed"
                  >
                    {isAr
                      ? "أفوض الموقع أدناه طوعياً بتفويض مستشفى رويال حياة لإرسال المعلومات الصحية الموضحة أدناه إلى المستلم المدرج في القسم 4، باستخدام بريد إلكتروني مشفر أو غير مشفر."
                      : "I authorize the undersigned to voluntarily authorize Royale Hayat Hospital to send the health information described below to the recipient listed in Section 4, using unencrypted or encrypted email."}
                    <span className="text-destructive"> *</span>
                  </Label>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">
                  {isAr
                    ? "3. يرجى تحديد المعلومات التي تفوض بالإفصاح عنها"
                    : "3. Please select the specific information you are authorizing for release"}
                </h3>

                <div className="space-y-2">
                  <Label>
                    {isAr ? "نوع التفويض" : "Authorization type"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={specificAuthorization}
                    onValueChange={(v) => {
                      const next = v as SpecificAuthorization;
                      setSpecificAuthorization(next);
                      setDocumentTypes([]);
                      setSpecificDocumentsOther("");
                      if (next === "Discharge Summary") {
                        setSpecialRequest("");
                        setServiceToDate(undefined);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isAr ? "اختر نوع التفويض" : "Select authorization type"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Discharge Summary">
                        {isAr ? "ملخص الخروج" : "Discharge Summary"}
                      </SelectItem>
                      <SelectItem value="specific documents">
                        {isAr ? "مستندات محددة" : "specific documents"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {specificAuthorization === "Discharge Summary" && <DischargeSummaryDateFields />}

                {specificAuthorization === "specific documents" && (
                  <>
                    <div className="space-y-4 pt-4 mt-2 border-t border-border">
                      <h4 className="text-base font-serif text-foreground">
                        {isAr ? "المستندات المحددة المطلوبة" : "Specific Documents required"}
                      </h4>
                      <Label>
                        {isAr ? "نوع المستندات" : "Document types"}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={documentTypes[0] ?? ""}
                        onValueChange={(v) =>
                          setDocumentTypes(v ? [v as SpecificDocumentType] : [])
                        }
                        className="space-y-2"
                      >
                        {DOCUMENT_TYPES.map((type) => (
                          <div key={type} className="flex items-center gap-3">
                            <RadioGroupItem value={type} id={`doc-${type}`} />
                            <Label
                              htmlFor={`doc-${type}`}
                              className="font-normal cursor-pointer"
                            >
                              {type === "Lab Results"
                                ? isAr
                                  ? "نتائج المختبر"
                                  : "Lab Results"
                                : type === "Imaging Reports"
                                  ? isAr
                                    ? "تقارير التصوير"
                                    : "Imaging Reports"
                                  : isAr
                                    ? "أخرى"
                                    : "Others"}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      {documentTypes.includes("Others") && (
                        <div className="space-y-2">
                          <Label htmlFor="specificDocumentsOther">
                            {isAr ? "مستندات أخرى" : "Other documents"}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="specificDocumentsOther"
                            required
                            value={specificDocumentsOther}
                            onChange={(e) => setSpecificDocumentsOther(e.target.value)}
                            placeholder={isAr ? "مستندات محددة" : "specific documents"}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 mt-2 border-t border-border">
                      <h4 className="text-base font-serif text-foreground">
                        {isAr ? "تواريخ الخدمة المحددة" : "Specific dates of service"}
                      </h4>
                      <SpecificDocumentsServiceDatesFields idPrefix="specific-docs" />
                    </div>
                  </>
                )}
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">
                  {isAr ? "4. معلومات المستلم والغرض" : "4. Recipient Information and Purpose"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">
                      {isAr ? "اسم المستلم" : "Recipient Name"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="recipientName"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={isAr ? "أدخل اسم المستلم" : "Enter recipient name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">
                      {isAr ? "البريد الإلكتروني للمستلم" : "Recipient's Email Address"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder={isAr ? "أدخل البريد الإلكتروني" : "Enter recipient email"}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      {isAr ? "رقم هاتف المستلم" : "Recipient's Contact Number"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <PhoneInput
                      country="kw"
                      value={recipientPhone}
                      onChange={handleMobileChange}
                      placeholder={isAr ? "أدخل الرقم" : "Enter contact number"}
                      masks={{ kw: "........" }}
                      enableLongNumbers={false}
                      inputClass="!w-full !h-10 !rounded-md !border !border-input !bg-background !px-12 !text-sm"
                      buttonClass="!border-input !bg-background"
                      containerClass="!w-full"
                      dropdownClass="!text-sm"
                      enableSearch
                      countryCodeEditable={false}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>
                    {isAr ? "الغرض من الإفصاح" : "Purpose of Disclosure"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={purposeValue} onValueChange={setPurposeValue} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="continuing-care" id="continuingCare" />
                      <Label htmlFor="continuingCare" className="font-normal cursor-pointer">
                        {isAr ? "استمرار الرعاية" : "Continuing Care"}
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="insurance-filing" id="insuranceFiling" />
                      <Label htmlFor="insuranceFiling" className="font-normal cursor-pointer">
                        {isAr ? "تقديم تأمين" : "Insurance Filing"}
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="others" id="others" />
                      <Label htmlFor="others" className="font-normal cursor-pointer">
                        {isAr ? "أخرى" : "Others"}
                      </Label>
                    </div>
                  </RadioGroup>
                  {purposeValue === "others" && (
                    <Textarea
                      value={otherPurpose}
                      onChange={(e) => setOtherPurpose(e.target.value)}
                      placeholder={isAr ? "يرجى تحديد الغرض..." : "Please specify the purpose..."}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">
                  {isAr ? "5. اتفاقية التوقيع الإلكتروني" : "5. Electronic Signature Agreement"}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "بتحديد المربع أدناه والنقر على \"إرسال\"، أشهد أنني قرأت وفهمت هذا التفويض."
                    : "By checking the box below and clicking \"Submit,\" I certify that I have read and understand this authorization."}
                </p>
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/5">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeTerms}
                    onCheckedChange={(c) => setAgreeTerms(c === true)}
                  />
                  <Label htmlFor="agreeTerms" className="font-normal cursor-pointer text-sm leading-relaxed">
                    {isAr
                      ? "لقد قرأت وفهمت ووافقت على شروط هذا التفويض الإلكتروني."
                      : "I have read, understand, and agree to the terms of this Electronic Authorization."}
                  </Label>
                </div>

                <div className="space-y-4">
                  <Label>
                    {isAr ? "مقدم الطلب:" : "Requested by:"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={requestedBy}
                    onValueChange={setRequestedBy}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="patient" id="reqPatient" />
                      <Label htmlFor="reqPatient" className="font-normal cursor-pointer">
                        {isAr ? "المريض" : "Patient"}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="legal-representative" id="reqLegal" />
                      <Label htmlFor="reqLegal" className="font-normal cursor-pointer">
                        {isAr ? "الممثل القانوني" : "Legal Representative"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {requestedBy === "patient" && (
                  <div className="space-y-2">
                    <Label htmlFor="eSignature">
                      {isAr ? "الاسم الكامل للمريض (التوقيع الإلكتروني)" : "Patient Full Name (E-Signature)"}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="eSignature"
                      required
                      value={eSignature}
                      onChange={(e) => setESignature(e.target.value)}
                      placeholder={
                        isAr
                          ? "اكتب اسمك الكامل كتوقيع إلكتروني"
                          : "Type your full name as electronic signature"
                      }
                    />
                  </div>
                )}

                {requestedBy === "legal-representative" && (
                  <div className="space-y-4 rounded-lg border border-border p-4 bg-secondary/5">
                    <div className="space-y-2">
                      <Label htmlFor="legalRepFullName">
                        {isAr ? "الاسم الكامل للممثل القانوني" : "Legal Representative Full Name"}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="legalRepFullName"
                        required
                        value={legalRepFullName}
                        onChange={(e) => setLegalRepFullName(e.target.value)}
                        placeholder={
                          isAr ? "أدخل الاسم الكامل" : "Enter full name"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationshipWithPatient">
                        {isAr ? "العلاقة بالمريض" : "Relationship to Patient"}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="relationshipWithPatient"
                        required
                        value={relationshipWithPatient}
                        onChange={(e) => setRelationshipWithPatient(e.target.value)}
                        placeholder={
                          isAr ? "مثال: ولي الأمر" : "e.g. Parent, Spouse"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validProof">
                        {isAr
                          ? "هوية حكومية / إثبات صالح"
                          : "Government ID / Valid proof"}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="validProof"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        required
                        onChange={(e) =>
                          setValidProofFile(e.target.files?.[0] || null)
                        }
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "الصيغ المقبولة: PNG، JPG، PDF" : "Accepted formats: PNG, JPG, PDF"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-4">
                <p className="font-body text-xs text-muted-foreground">
                  {isAr
                    ? "الحقول المميزة بنجمة حمراء (*) إلزامية."
                    : "The fields marked with a red asterisk (*) are mandatory to be filled out."}
                </p>
                <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
                  {submitting
                    ? isAr
                      ? "جاري الإرسال..."
                      : "Submitting..."
                    : isAr
                      ? "إرسال"
                      : "Submit"}
                </Button>
              </div>
            </ScrollAnimationWrapper>
          </form>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MedicalRecordsRequest;
