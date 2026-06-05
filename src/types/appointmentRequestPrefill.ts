/** PACI identity fields shown when HIS lookup fails after successful authentication. */
export type PaciIdentityDetails = {
  name: string;
  dateOfBirth: string;
  civilIdNumber: string;
  nationality: string;
  gender: string;
  passportNumber: string;
};

/** Passed via router state after PACI verify + HMS patient not found. */
export type AppointmentRequestPrefillState = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  civilId?: string;
  identityDetails?: PaciIdentityDetails;
  /**
   * Allows routing different fallbacks into the same request form while keeping
   * backend classification consistent.
   */
  requestType?: "doctor unavailability request" | "first time visitor request" | "registered patient booking fallback";
  /** When true, name / DOB / gender from PACI are read-only. */
  readOnlyIdentity?: boolean;
};
