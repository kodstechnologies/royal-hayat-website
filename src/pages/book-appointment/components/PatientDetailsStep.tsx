import { motion } from "framer-motion";
import { ClipboardList, LogIn, UserPlus } from "lucide-react";
import { pageVariants, type VerifiedIdentityDetails } from "../types";
type PatientDetailsStepProps = {
  isAr: boolean;
  t: (key: string) => string;
  patientType: "returning" | "new" | null;
  patientName: string;
  setPatientName: (value: string) => void;
  patientPhone: string;
  setPatientPhone: (value: string) => void;
  patientCountryCode: string;
  setPatientCountryCode: (value: string) => void;
  patientDob: string;
  setPatientDob: (value: string) => void;
  patientGender: string;
  setPatientGender: (value: string) => void;
  patientErrors: Record<string, string>;
  setPatientErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onOpenReturningModal: () => void;
  onSelectNewPatient: () => void;
  patientId: string | null;
  verifiedIdentityDetails: VerifiedIdentityDetails | null;
  onProceedReturning: () => void;
  onCancelReturning: () => void;
  onChangePatientType: () => void;
  resetReturningModalState: () => void;
};
const PatientDetailsStep = ({
  isAr,
  t,
  patientType,
  patientName,
  setPatientName,
  patientPhone,
  setPatientPhone,
  patientCountryCode,
  setPatientCountryCode,
  patientDob,
  setPatientDob,
  patientGender,
  setPatientGender,
  patientErrors,
  setPatientErrors,
  onOpenReturningModal,
  onSelectNewPatient,
  patientId,
  verifiedIdentityDetails,
  onProceedReturning,
  onCancelReturning,
  onChangePatientType,
  resetReturningModalState,
}: PatientDetailsStepProps) => (
  <motion.div
    key="s2"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.35 }}
  >
    <div className="max-w-3xl mx-auto">
      {!patientType && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetReturningModalState();
              onOpenReturningModal();
            }}
            className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-2">{t("registeredPatient")}</h3>
            <p className="font-body text-xs text-muted-foreground">
              {isAr ? "اختر موعدك في الخطوة التالية" : "Choose your appointment time next"}
            </p>
          </motion.button>
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectNewPatient}
            className="bg-popover rounded-2xl p-8 border border-border text-center transition-all hover:border-primary/40"
          >
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-2">{t("firstTimeVisitor")}</h3>
            <p className="font-body text-xs text-muted-foreground">
              {isAr ? "سيتم نقلك إلى نموذج طلب موعد" : "You will be taken to the Appointment Request Form"}
            </p>
          </motion.button>
        </div>
      )}
      {patientType === "new" && (
        <div className="bg-popover rounded-2xl p-5 sm:p-8 md:p-10 border border-border shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-foreground">{t("patientDetails")}</h2>
              <p className="text-muted-foreground font-body text-xs">{t("provideInfo")}</p>
            </div>
          </div>
          <div className="space-y-5 min-w-0">
            <div>
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("fullName")} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  setPatientErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder={t("enterFullName")}
                className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${
                  patientErrors.name ? "border-destructive" : "border-border"
                }`}
              />
              {patientErrors.name && (
                <p className="font-body text-xs text-destructive mt-1">{patientErrors.name}</p>
              )}
            </div>
            <div className="min-w-0 w-full">
              <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("phoneNumber")} <span className="text-destructive">*</span>
              </label>
              <div className="flex w-full min-w-0 gap-2">
                <select
                  value={patientCountryCode}
                  onChange={(e) => setPatientCountryCode(e.target.value)}
                  className="shrink-0 w-[5.25rem] sm:w-24 px-2 sm:px-3 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="+965">+965</option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                </select>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => {
                    setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 8));
                    setPatientErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  placeholder={t("phonePlaceholder")}
                  className={`min-w-0 flex-1 w-full px-3 sm:px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${
                    patientErrors.phone ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {patientErrors.phone && (
                <p className="font-body text-xs text-destructive mt-1">{patientErrors.phone}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {isAr ? "تاريخ الميلاد" : "Date of Birth"} <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={patientDob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setPatientDob(e.target.value);
                    setPatientErrors((prev) => ({ ...prev, dob: "" }));
                  }}
                  className={`w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${
                    patientErrors.dob ? "border-destructive" : "border-border"
                  }`}
                />
                {patientErrors.dob && (
                  <p className="font-body text-xs text-destructive mt-1">{patientErrors.dob}</p>
                )}
              </div>
              <div className="min-w-0">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {t("gender")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => {
                    setPatientGender(e.target.value);
                    setPatientErrors((prev) => ({ ...prev, gender: "" }));
                  }}
                  className={`w-full min-w-0 max-w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${
                    patientErrors.gender ? "border-destructive" : "border-border"
                  }`}
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
                {patientErrors.gender && (
                  <p className="font-body text-xs text-destructive mt-1">{patientErrors.gender}</p>
                )}
              </div>
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
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "الاسم" : "Name"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.name}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "تاريخ الميلاد" : "Date of Birth"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.dateOfBirth}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "الرقم المدني" : "Civil ID Number"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.civilIdNumber}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "الجنسية" : "Nationality"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.nationality}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "الجنس" : "Gender"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.gender}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-popover/80 px-3 py-2.5">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isAr ? "رقم جواز السفر" : "Passport Number"}
                  </p>
                  <p className="font-body text-sm text-foreground font-medium mt-0.5">
                    {verifiedIdentityDetails.passportNumber}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={!patientId}
              onClick={onProceedReturning}
              className="flex-1 bg-primary text-primary-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center text-center"
            >
              {isAr ? "متابعة" : "Proceed"}
            </button>
            <button
              type="button"
              onClick={onCancelReturning}
              className="flex-1 bg-secondary/40 text-foreground px-3 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      )}
      {patientType && (
        <button
          type="button"
          onClick={onChangePatientType}
          className="mt-4 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t("changeSelection")}
        </button>
      )}
    </div>
  </motion.div>
);
export default PatientDetailsStep;
