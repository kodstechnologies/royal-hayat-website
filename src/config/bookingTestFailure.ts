/**
 * QA-only forced booking failure for testing the registered-patient fallback flow.
 * Disabled in production builds unless VITE_BOOKING_TEST_FAILURE=true.
 */
export const BOOKING_TEST_FAILURE_SCENARIO = {
  civilId: "286101702331",
  doctorId: "dr-abubakr-elmardi",
  /** ISO date (matches calendar selection for 04/06/2026 in en-GB display). */
  date: "2026-06-04",
  /** Matches slot_from_time values such as 10:20, 10:20:00 */
  slotTimePrefix: "10:20",
  message:
    "Test booking failure (forced): online booking could not be completed. Please submit your contact details for call center follow-up.",
} as const;

export const isBookingTestFailureEnabled = (): boolean => {
  if (import.meta.env.PROD && import.meta.env.VITE_BOOKING_TEST_FAILURE !== "true") {
    return false;
  }
  return import.meta.env.DEV || import.meta.env.VITE_BOOKING_TEST_FAILURE === "true";
};

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
  if (!isBookingTestFailureEnabled()) return null;

  const civilId = normalizeCivilId(params.civilId);
  if (civilId !== BOOKING_TEST_FAILURE_SCENARIO.civilId) return null;

  if (params.doctorId !== BOOKING_TEST_FAILURE_SCENARIO.doctorId) return null;
  if (params.selectedDate !== BOOKING_TEST_FAILURE_SCENARIO.date) return null;

  const slotTime = normalizeSlotTime(params.selectedSlot);
  if (!slotTime.startsWith(BOOKING_TEST_FAILURE_SCENARIO.slotTimePrefix)) return null;

  return BOOKING_TEST_FAILURE_SCENARIO.message;
}
