export type AmPm = "AM" | "PM";

export const FIRST_TIME_VISITOR_MINUTES = ["00", "30"] as const;

/** Hours available for first-time visitors: 8:00 AM through 9:30 PM. */
export function getFirstTimeVisitorHours(ampm: AmPm): number[] {
  if (ampm === "AM") {
    return [8, 9, 10, 11];
  }
  return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}

export function buildFirstTimeVisitorSlotTimes(
  hour12: number,
  minute: number,
  ampm: AmPm,
): { from: string; to: string } | null {
  if (!getFirstTimeVisitorHours(ampm).includes(hour12)) return null;
  if (minute !== 0 && minute !== 30) return null;

  let h24: number;
  if (ampm === "AM") {
    h24 = hour12 === 12 ? 0 : hour12;
  } else {
    h24 = hour12 === 12 ? 12 : hour12 + 12;
  }

  const startMins = h24 * 60 + minute;
  if (startMins < 8 * 60 || startMins > 21 * 60 + 30) return null;

  const from = `${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const endMins = startMins + 30;
  const to = `${String(Math.floor(endMins / 60)).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;
  return { from, to };
}
