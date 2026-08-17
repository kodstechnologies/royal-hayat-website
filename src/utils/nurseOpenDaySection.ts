/** 28 Aug 2026, 3:00 AM IST (UTC+5:30). */
export const NURSE_OPEN_DAY_SECTION_EXPIRY = new Date("2026-08-27T21:30:00.000Z");

/** Returns true until the nurse open day section should be hidden. */
export function isNurseOpenDaySectionVisible(now: Date = new Date()): boolean {
  return now.getTime() < NURSE_OPEN_DAY_SECTION_EXPIRY.getTime();
}

/** Milliseconds until the section expires; 0 if already expired. */
export function getNurseOpenDaySectionRemainingMs(
  now: Date = new Date(),
): number {
  return Math.max(0, NURSE_OPEN_DAY_SECTION_EXPIRY.getTime() - now.getTime());
}
