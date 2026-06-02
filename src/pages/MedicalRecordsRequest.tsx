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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createRequest } from "@/api/MedicalRecordRequest";

const MedicalRecordsRequest = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // ── Controlled form state ──────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [civilId, setCivilId] = useState("");
  const [patientFileNo, setPatientFileNo] = useState("");
  const [dob, setDob] = useState<Date>();
  const [govIdFile, setGovIdFile] = useState<File | null>(null);

  const [dischargeSummaryChecked, setDischargeSummaryChecked] = useState(false);
  const [specificDateChecked, setSpecificDateChecked] = useState(false);
  const [dischargeSummaryDate, setDischargeSummaryDate] = useState<Date>();

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [purposeValue, setPurposeValue] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");

  const [requestedBy, setRequestedBy] = useState("");
  const [eSignature, setESignature] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({ title: isAr ? "الموافقة مطلوبة" : "Agreement Required", description: isAr ? "يرجى الموافقة على الشروط قبل الإرسال." : "Please agree to the terms before submitting.", variant: "destructive" });
      return;
    }
    if (!dischargeSummaryChecked && !specificDateChecked) {
      toast({ title: isAr ? "حقل مطلوب" : "Required", description: isAr ? "يرجى تحديد نوع المعلومات المطلوبة." : "Please select at least one document type.", variant: "destructive" });
      return;
    }
    if (!purposeValue) {
      toast({ title: isAr ? "حقل مطلوب" : "Required", description: isAr ? "يرجى تحديد الغرض من الإفصاح." : "Please select the purpose of disclosure.", variant: "destructive" });
      return;
    }
    if (!requestedBy) {
      toast({ title: isAr ? "حقل مطلوب" : "Required", description: isAr ? "يرجى تحديد مقدم الطلب." : "Please select who is requesting.", variant: "destructive" });
      return;
    }
    if (!govIdFile) {
      toast({ title: isAr ? "حقل مطلوب" : "Required", description: isAr ? "يرجى رفع هوية حكومية سارية." : "Please upload a valid government ID.", variant: "destructive" });
      return;
    }
    if (!dob) {
      toast({ title: isAr ? "حقل مطلوب" : "Required", description: isAr ? "يرجى تحديد تاريخ الميلاد." : "Please select date of birth.", variant: "destructive" });
      return;
    }

    // Map purpose radio value → API enum
    const purposeMap: Record<string, "Continuing Care" | "Insurance Filing" | "Others"> = {
      "continuing-care": "Continuing Care",
      "insurance-filing": "Insurance Filing",
      "others": "Others",
    };

    // Map authorization → API enum
    const specificAuthorization: "Discharge Summary" | "Discharge Summary with a specific date of service" =
      specificDateChecked
        ? "Discharge Summary with a specific date of service"
        : "Discharge Summary";

    setSubmitting(true);
    try {
      await createRequest({
        patientFullName: fullName,
        civilId,
        passportOrGovernmentId: govIdFile,
        patientFileNo,
        dateOfBirth: format(dob, "yyyy-MM-dd"),
        specificAuthorization,
        specificDateOfService: specificDateChecked && dischargeSummaryDate
          ? format(dischargeSummaryDate, "yyyy-MM-dd")
          : undefined,
        recipientName,
        recipientEmailAddress: recipientEmail,
        recipientContactNumber: recipientPhone,
        purposeOfDisclosure: purposeMap[purposeValue],
        otherPurpose: purposeValue === "others" ? otherPurpose : undefined,
        requestedBy: requestedBy === "patient" ? "Patient" : "Legal Representative",
        patientNameConfirmation: requestedBy === "patient" ? eSignature : undefined,
      });

      toast({
        title: isAr ? "تم إرسال النموذج" : "Form Submitted",
        description: isAr
          ? "تم إرسال طلب السجلات الطبية بنجاح. سنتواصل معك قريباً."
          : "Your medical records request has been submitted successfully. We will contact you shortly.",
      });

      // Reset form
      setFullName(""); setCivilId(""); setPatientFileNo(""); setDob(undefined);
      setGovIdFile(null); setDischargeSummaryChecked(false); setSpecificDateChecked(false);
      setDischargeSummaryDate(undefined); setRecipientName(""); setRecipientEmail("");
      setRecipientPhone(""); setPurposeValue(""); setOtherPurpose(""); setRequestedBy("");
      setESignature(""); setAgreeTerms(false);
    } catch {
      toast({
        title: isAr ? "حدث خطأ" : "Submission Failed",
        description: isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{isAr ? "خدمات المرضى" : "Patient Services"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">{isAr ? "نموذج طلب السجلات الطبية" : "Medical Records Request Form"}</h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollAnimationWrapper>
            <h2 className="text-xl font-serif text-foreground mb-4">
              {isAr ? "تفويض للإفصاح عن المعلومات الصحية للمريض عبر البريد الإلكتروني بناءً على طلب المريض" : "Authorization for the Disclosure of Patient Health Information via Email Upon Patient Request"}
            </h2>
            <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20 mb-8">
              <h3 className="font-body text-sm font-bold text-destructive mb-2">{isAr ? "إخلاء المسؤولية" : "Disclaimer"}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? "باختياري تلقي المعلومات الصحية للمريض إلكترونياً، أتحمل المسؤولية الكاملة عن أمان عنوان البريد الإلكتروني المقدم والأجهزة المستخدمة لتلقي البيانات وتخزينها. أفهم وأتحمل جميع المخاطر المتأصلة في هذا النقل الإلكتروني."
                  : "By choosing to receive the Patient Health Information electronically, I accept full responsibility for the security of the email address provided and the device(s) used to receive and store the data. I understand and assume all inherent risks of this electronic transfer, including unauthorized access, accidental forwarding to unintended recipients, and the dangers of unsecured storage once the information is delivered."}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Section 1 */}
            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">{isAr ? "1. معلومات المريض" : "1. Patient Information"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{isAr ? "الاسم الكامل" : "Full Name"} <span className="text-destructive">*</span></Label>
                    <Input id="fullName" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilId">{isAr ? "البطاقة المدنية (رقم البطاقة المدنية)" : "Civil ID (Civil ID Number)"} <span className="text-destructive">*</span></Label>
                    <Input id="civilId" required value={civilId} onChange={e => setCivilId(e.target.value)} placeholder={isAr ? "أدخل رقم البطاقة المدنية" : "Enter Civil ID number"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="govId">{isAr ? "جواز السفر / هوية حكومية سارية" : "Passport / Valid Government ID"} <span className="text-destructive">*</span></Label>
                    <div className="flex items-center gap-3">
                      <Input id="govId" type="file" accept=".png,.jpg,.jpeg,.pdf" required onChange={(e) => setGovIdFile(e.target.files?.[0] || null)} className="text-sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">{isAr ? "الصيغ المقبولة: PNG، JPG، PDF" : "Accepted formats: PNG, JPG, PDF"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileNo">{isAr ? "رقم ملف المريض (URN)" : "Patient File No. (URN)"} <span className="text-destructive">*</span></Label>
                    <Input id="fileNo" required value={patientFileNo} onChange={e => setPatientFileNo(e.target.value)} placeholder={isAr ? "أدخل رقم ملف المريض" : "Enter patient file number"} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dob && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dob ? format(dob, "PPP") : (isAr ? "اختر تاريخ الميلاد" : "Select date of birth")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dob} onSelect={setDob} disabled={(date) => date > new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Section 2 */}
            <ScrollAnimationWrapper>
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">{isAr ? "2. التفويض والمعلومات المراد الإفصاح عنها" : "2. Authorization and Information to be Disclosed"}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "أفوض الموقع أدناه طوعياً بتفويض مستشفى رويال حياة لإرسال المعلومات الصحية الموضحة أدناه إلى المستلم المدرج في القسم 4، باستخدام بريد إلكتروني مشفر أو غير مشفر."
                    : "I authorize the undersigned to voluntarily authorize Royale Hayat Hospital to send the health information described below to the recipient listed in Section 4, using unencrypted or encrypted email."}
                </p>
              </div>
            </ScrollAnimationWrapper>

            {/* Section 3 */}
            <ScrollAnimationWrapper>
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">{isAr ? "3. يرجى تحديد المعلومات التي تفوض بالإفصاح عنها" : "3. Please select the specific information you are authorizing for release"}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox id="dischargeSummary" checked={dischargeSummaryChecked} onCheckedChange={(c) => setDischargeSummaryChecked(c === true)} />
                    <Label htmlFor="dischargeSummary" className="font-normal cursor-pointer">{isAr ? "ملخص الخروج" : "Discharge Summary"}</Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="dischargeSummaryDate" checked={specificDateChecked} onCheckedChange={(c) => setSpecificDateChecked(c === true)} />
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="dischargeSummaryDate" className="font-normal cursor-pointer">{isAr ? "ملخص الخروج بتاريخ خدمة محدد" : "Discharge Summary with a specific date of service"}</Label>
                      {specificDateChecked && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className={cn("w-full sm:w-auto justify-start text-left font-normal", !dischargeSummaryDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dischargeSummaryDate ? format(dischargeSummaryDate, "PPP") : (isAr ? "اختر التاريخ" : "Select date")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={dischargeSummaryDate} onSelect={setDischargeSummaryDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Section 4 */}
            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">{isAr ? "4. معلومات المستلم والغرض" : "4. Recipient Information and Purpose"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">{isAr ? "اسم المستلم" : "Recipient Name"} <span className="text-destructive">*</span></Label>
                    <Input id="recipientName" required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder={isAr ? "أدخل اسم المستلم" : "Enter recipient name"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">{isAr ? "البريد الإلكتروني للمستلم" : "Recipient's Email Address"} <span className="text-destructive">*</span></Label>
                    <Input id="recipientEmail" type="email" required value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder={isAr ? "أدخل البريد الإلكتروني للمستلم" : "Enter recipient email"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientPhone">{isAr ? "رقم هاتف المستلم" : "Recipient's Contact Number"} <span className="text-destructive">*</span></Label>
                    <Input id="recipientPhone" type="tel" required value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder={isAr ? "أدخل رقم الاتصال" : "Enter contact number"} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>{isAr ? "الغرض من الإفصاح" : "Purpose of Disclosure"} <span className="text-destructive">*</span></Label>
                  <p className="text-xs text-muted-foreground">{isAr ? "(مثل: استمرار الرعاية – تقديم تأمين – أخرى)" : "(e.g., Continuing Care – Insurance Filing – other)"}</p>
                  <RadioGroup value={purposeValue} onValueChange={setPurposeValue} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="continuing-care" id="continuingCare" />
                      <Label htmlFor="continuingCare" className="font-normal cursor-pointer">{isAr ? "استمرار الرعاية" : "Continuing Care"}</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="insurance-filing" id="insuranceFiling" />
                      <Label htmlFor="insuranceFiling" className="font-normal cursor-pointer">{isAr ? "تقديم تأمين" : "Insurance Filing"}</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="others" id="others" />
                      <Label htmlFor="others" className="font-normal cursor-pointer">{isAr ? "أخرى" : "Others"}</Label>
                    </div>
                  </RadioGroup>
                  {purposeValue === "others" && (
                    <Textarea value={otherPurpose} onChange={e => setOtherPurpose(e.target.value)} placeholder={isAr ? "يرجى تحديد الغرض..." : "Please specify the purpose..."} className="mt-2" />
                  )}
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Section 5 */}
            <ScrollAnimationWrapper>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-foreground border-b border-border pb-3">{isAr ? "5. اتفاقية التوقيع الإلكتروني" : "5. Electronic Signature Agreement"}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "بتحديد المربع أدناه والنقر على \"إرسال\"، أشهد أنني قرأت وفهمت هذا التفويض، وأفوض بالإفصاح الإلكتروني عن معلوماتي الصحية كما هو موضح أعلاه. توقيعي الإلكتروني يعادل قانونياً التوقيع اليدوي."
                    : "By checking the box below and clicking \"Submit,\" I certify that I have read and understand this authorization, and I authorize the electronic disclosure of my health information as described above. My electronic signature is the legal equivalent of a manual signature."}
                </p>
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/5">
                  <Checkbox id="agreeTerms" checked={agreeTerms} onCheckedChange={(c) => setAgreeTerms(c === true)} />
                  <Label htmlFor="agreeTerms" className="font-normal cursor-pointer text-sm leading-relaxed">
                    {isAr ? "لقد قرأت وفهمت ووافقت على شروط هذا التفويض الإلكتروني." : "I have read, understand, and agree to the terms of this Electronic Authorization."}
                  </Label>
                </div>

                <div className="space-y-4">
                  <Label>{isAr ? "مقدم الطلب:" : "Requested by:"} <span className="text-destructive">*</span></Label>
                  <RadioGroup value={requestedBy} onValueChange={setRequestedBy} className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="patient" id="reqPatient" />
                      <Label htmlFor="reqPatient" className="font-normal cursor-pointer">{isAr ? "المريض" : "Patient"}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="legal-representative" id="reqLegal" />
                      <Label htmlFor="reqLegal" className="font-normal cursor-pointer">{isAr ? "الممثل القانوني" : "Legal Representative"}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {requestedBy === "patient" && (
                  <div className="space-y-2">
                    <Label htmlFor="eSignature">{isAr ? "الاسم الكامل للمريض (التوقيع الإلكتروني)" : "Patient Full Name (E-Signature)"} <span className="text-destructive">*</span></Label>
                    <Input id="eSignature" required value={eSignature} onChange={e => setESignature(e.target.value)} placeholder={isAr ? "اكتب اسمك الكامل كتوقيع إلكتروني" : "Type your full name as electronic signature"} className="font-serif italic" />
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
                  {submitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال" : "Submit")}
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
