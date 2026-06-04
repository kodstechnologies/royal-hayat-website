import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import type { VerifiedIdentityDetails } from "../types";
type ReturningPatientModalProps = {
  isAr: boolean;
  t: (key: string) => string;
  onClose: () => void;
  nationalId: string;
  setNationalId: (value: string) => void;
  nationalIdError: string;
  setNationalIdError: (value: string) => void;
  setPatientLookupShowGoBack: (value: boolean) => void;
  setVerifiedPersonName: (value: { english: string; arabic: string } | null) => void;
  setVerifiedIdentityDetails: (value: VerifiedIdentityDetails | null) => void;
  isWaitingForApproval: boolean;
  isConfirmingPatientRecord: boolean;
  isVerifyingNationalId: boolean;
  patientLookupShowGoBack: boolean;
  onGoBackFromModal: () => void;
  onVerify: () => void;
  onCancel: () => void;
};
const ReturningPatientModal = ({
  isAr,
  t,
  onClose,
  nationalId,
  setNationalId,
  nationalIdError,
  setNationalIdError,
  setPatientLookupShowGoBack,
  setVerifiedPersonName,
  setVerifiedIdentityDetails,
  isWaitingForApproval,
  isConfirmingPatientRecord,
  isVerifyingNationalId,
  patientLookupShowGoBack,
  onGoBackFromModal,
  onVerify,
  onCancel,
}: ReturningPatientModalProps) => (
  <div
    className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl rounded-3xl border border-border/70 bg-popover shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 pt-5 pb-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-accent mb-1">
              {isAr ? "مريض مسجل" : "Registered Patient"}
            </p>
            <h3 className="font-serif text-xl text-foreground">
              {isAr ? "التحقق من البطاقة المدنية الكويتية" : "Kuwait Civil ID Verification"}
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {isAr
                ? "يرجى إدخال رقم البطاقة المدنية الكويتية لاسترجاع بياناتكم ومتابعة عملية الحجز"
                : "Please enter your Kuwait Civil ID to retrieve your details and continue booking."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {isAr ? "رقم البطاقة المدنية الكويتية" : "Kuwait Civil ID"}{" "}
            <span className="text-destructive">*</span>
          </label>
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
            className={`w-full px-4 py-3 rounded-xl border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 ${
              nationalIdError ? "border-destructive" : "border-border"
            }`}
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
              onClick={onGoBackFromModal}
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
              type="button"
              onClick={onVerify}
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
              type="button"
              onClick={onCancel}
              className="w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
            >
              {isAr ? "الغاء" : "Cancel"}
            </button>
          </div>
        )}
        {(isWaitingForApproval || isConfirmingPatientRecord) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-secondary/40 text-foreground px-4 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-secondary/60 transition-colors inline-flex items-center justify-center text-center"
            >
              {isAr ? "الغاء" : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  </div>
);
export default ReturningPatientModal;
