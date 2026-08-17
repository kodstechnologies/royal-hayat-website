import { useEffect, useState } from "react";
import {
  getNurseOpenDaySectionRemainingMs,
  isNurseOpenDaySectionVisible,
} from "@/utils/nurseOpenDaySection";

/** Keeps the nurse open day section visible until 28 Aug 2026, 3:00 AM IST. */
export function useNurseOpenDaySectionVisible(): boolean {
  const [visible, setVisible] = useState(isNurseOpenDaySectionVisible);

  useEffect(() => {
    if (!isNurseOpenDaySectionVisible()) {
      setVisible(false);
      return;
    }

    const remainingMs = getNurseOpenDaySectionRemainingMs();
    const timer = window.setTimeout(() => setVisible(false), remainingMs);

    return () => window.clearTimeout(timer);
  }, []);

  return visible;
}
