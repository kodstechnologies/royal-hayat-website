import {
  buildFirstTimeVisitorSlotTimes,
  type AmPm,
} from "@/pages/book-appointment/firstTimeVisitorTimeSlots";

export const formatAppointmentDateDisplay = (isoDate: string) =>
  isoDate ? isoDate.split("-").reverse().join("/") : "";

export const formatAppointmentTimeDisplay = (time: string | null | undefined) => {
  if (!time || !time.includes(":")) return time || "";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const getAppointmentSlotPeriod = (
  slotFrom: string | null | undefined,
): "morning" | "afternoon" => {
  if (!slotFrom?.includes(":")) return "morning";
  const hour = parseInt(slotFrom.split(":")[0], 10);
  return hour < 12 ? "morning" : "afternoon";
};

export const buildPreferredSlotFromPicker = (
  hour: string,
  minute: string,
  ampm: string,
): { from: string; to: string } | null => {
  if (!hour || !minute || !ampm) return null;
  return buildFirstTimeVisitorSlotTimes(
    parseInt(hour, 10),
    parseInt(minute, 10),
    ampm as AmPm,
  );
};
