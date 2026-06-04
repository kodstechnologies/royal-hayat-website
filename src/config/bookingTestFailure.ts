/**
 * QA forced booking failure for the registered-patient fallback flow.
 * Toggle BOOKING_TEST_FAILURE_ENABLED in code. Scenario details below.
 *
 * HMS patient-not-found + PACI mock: see identityMock.ts / identity.mock.json (286101702332).
 */
export { QA_PACI_ONLY_HIS_NOT_FOUND_CIVIL_ID } from "@/config/identityMock";
export const BOOKING_TEST_FAILURE_ENABLED = true;

/** slot_from_time values for morning blocks that should trigger fallback (10 Jun 2026). */
export const BOOKING_TEST_FAILURE_SLOT_TIMES = [
  "10:00", // 10:00 AM–10:20 AM
  "10:20", // 10:20 AM–10:40 AM
  "10:40", // 10:40 AM–11:00 AM
  "11:00", // 11:00 AM–11:20 AM
  "11:20", // 11:20 AM–11:40 AM
  "11:40", // 11:40 AM–12:00 PM
] as const;

export const BOOKING_TEST_FAILURE_SCENARIO = {
  civilId: "286101702331",
  doctorId: "dr-abubakr-elmardi",
  /** ISO date (10/06/2026 in en-GB display). */
  date: "2026-06-10",
  slotTimePrefixes: BOOKING_TEST_FAILURE_SLOT_TIMES,
  message:
    "Online booking could not be completed. Please add your phone number and date of birth so our call center can confirm your appointment.",
} as const;

const normalizeCivilId = (value: string) => value.replace(/\D/g, "").trim();

export const normalizeSlotTime = (slot: string | null | undefined): string => {
  if (!slot) return "";
  const match = slot.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return slot.trim().toLowerCase();
  return `${parseInt(match[1], 10)}:${match[2]}`;
};

export const slotMatchesTestFailureTimes = (
  slot: string | null | undefined,
  prefixes: readonly string[] = BOOKING_TEST_FAILURE_SCENARIO.slotTimePrefixes,
): boolean => {
  const normalized = normalizeSlotTime(slot);
  if (!normalized) return false;
  return prefixes.some((prefix) => normalized === prefix);
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

  if (!slotMatchesTestFailureTimes(params.selectedSlot)) return null;

  return BOOKING_TEST_FAILURE_SCENARIO.message;
}
