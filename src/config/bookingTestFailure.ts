/**
 * QA forced booking failure for the registered-patient fallback flow.
 * Toggle BOOKING_TEST_FAILURE_ENABLED in code. Scenario details below.
 */
export const BOOKING_TEST_FAILURE_ENABLED = true;

export const BOOKING_TEST_FAILURE_SCENARIO = {
  civilId: "286101702331",
  doctorId: "dr-abubakr-elmardi",
  /** ISO date (04/06/2026 in en-GB display). */
  date: "2026-06-04",
  /** Matches slot_from_time "09:30" (9:30 AM–10:00 AM morning slot). */
  slotTimePrefix: "09:30",
  message:
    "Online booking could not be completed. Please add your phone number and date of birth so our call center can confirm your appointment.",
} as const;

const normalizeCivilId = (value: string) => value.replace(/\D/g, "").trim();

const normalizeSlotTime = (slot: string | null | undefined): string => {
  if (!slot) return "";
  const match = slot.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return slot.trim().toLowerCase();
  return `${parseInt(match[1], 10)}:${match[2]}`;
};

export type BookingTestFailureParams = {
  civilId: string;
  doctorId: string | null;
  selectedDate: string;
  selectedSlot: string | null;
};

/** Returns a failure message when the QA scenario matches; otherwise null. */
export function getBookingTestFailureMessage(params: BookingTestFailureParams): string | null {
  if (!BOOKING_TEST_FAILURE_ENABLED) return null;

  const civilId = normalizeCivilId(params.civilId);
  if (civilId !== BOOKING_TEST_FAILURE_SCENARIO.civilId) return null;

  if (params.doctorId !== BOOKING_TEST_FAILURE_SCENARIO.doctorId) return null;
  if (params.selectedDate !== BOOKING_TEST_FAILURE_SCENARIO.date) return null;

  const slotTime = normalizeSlotTime(params.selectedSlot);
  if (!slotTime.startsWith(BOOKING_TEST_FAILURE_SCENARIO.slotTimePrefix)) return null;

  return BOOKING_TEST_FAILURE_SCENARIO.message;
}
