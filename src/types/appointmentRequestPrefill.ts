export type AppointmentRequestPrefillState = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  civilId?: string;
  lookupNote?: string;
  /** When true, name / DOB / gender fields are read-only (from PACI). */
  readOnlyIdentity?: boolean;
};
