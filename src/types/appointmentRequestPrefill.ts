/** Passed via router state after PACI verify + HMS patient not found. */
export type AppointmentRequestPrefillState = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  civilId?: string;
  /** When true, name / DOB / gender from PACI are read-only. */
  readOnlyIdentity?: boolean;
};
