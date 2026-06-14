import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon, ChevronDown, X } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const calendarClassNames = {
  months: "flex w-full flex-col",
  month: "w-full space-y-1",
  caption: "hidden",
  nav: "hidden",
  table: "w-full border-collapse",
  head_row: "flex w-full border-b border-border/60 pb-1",
  head_cell:
    "w-8 text-[0.6rem] font-semibold uppercase tracking-wide text-muted-foreground",
  row: "mt-0.5 flex w-full",
  cell: "relative h-8 w-8 p-0 text-center text-xs focus-within:relative focus-within:z-20",
  day: cn(
    buttonVariants({ variant: "ghost" }),
    "h-8 w-8 rounded-md p-0 text-xs font-normal aria-selected:opacity-100",
  ),
  day_selected:
    "rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "rounded-md border border-primary/40 bg-primary/5 font-semibold text-primary",
  day_outside:
    "text-muted-foreground/35 aria-selected:bg-primary/80 aria-selected:text-primary-foreground",
  day_disabled: "text-muted-foreground/25 opacity-40",
  day_hidden: "invisible",
};

export type MedicalRecordDatePickerProps = {
  id: string;
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  isAr: boolean;
  required?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  fromYear?: number;
  toYear?: number;
  disabledDates?: (date: Date) => boolean;
  minDate?: Date;
  defaultMonth?: Date;
  /** Use inside dialogs/modals so the calendar renders above overlay layers. */
  inModal?: boolean;
  /** Match standard form field height and label spacing in dense grids. */
  compact?: boolean;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getToday = () => new Date();

const resolveViewMonth = (value?: Date, defaultMonth?: Date) =>
  value ?? defaultMonth ?? getToday();

const MedicalRecordDatePicker = ({
  id,
  label,
  value,
  onChange,
  isAr,
  required = true,
  placeholder,
  ariaLabel,
  fromYear = 1990,
  toYear = new Date().getFullYear(),
  disabledDates,
  minDate,
  defaultMonth,
  inModal = false,
  compact = false,
}: MedicalRecordDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const locale = isAr ? ar : enUS;

  const isDateDisabled = (date: Date) => {
    if (minDate && startOfDay(date) < startOfDay(minDate)) {
      return true;
    }
    return disabledDates?.(date) ?? false;
  };

  const [viewMonth, setViewMonth] = useState(() => resolveViewMonth(value, defaultMonth));

  useEffect(() => {
    if (open) {
      setViewMonth(resolveViewMonth(value, defaultMonth));
    }
  }, [open, value, defaultMonth]);

  const years = useMemo(
    () =>
      Array.from({ length: toYear - fromYear + 1 }, (_, index) => toYear - index),
    [fromYear, toYear],
  );

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: String(index),
        label: format(new Date(2024, index, 1), "MMMM", { locale }),
      })),
    [locale],
  );

  const resolvedPlaceholder = placeholder ?? (isAr ? "اختر التاريخ" : "Select date");

  const selectClassName = cn(
    "h-8 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-2.5 text-xs shadow-sm",
    "transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
  );

  return (
    <div className={compact ? undefined : "space-y-2"}>
      <Label
        htmlFor={id}
        className={
          compact
            ? "mb-1 block text-sm font-body font-normal text-foreground"
            : undefined
        }
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-label={ariaLabel ?? label}
            className={cn(
              "group flex w-full items-center rounded-lg border bg-background text-sm transition-all",
              compact
                ? "h-10 justify-between gap-2 border-border px-3 font-body hover:bg-muted/20"
                : "h-11 gap-3 border-input px-3 shadow-sm hover:border-primary/40 hover:bg-muted/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !value && "text-muted-foreground",
              isAr && "text-right",
            )}
          >
            {!compact && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <CalendarIcon className="h-4 w-4" />
              </span>
            )}
            <span className={cn("flex-1 truncate font-body", isAr ? "text-right" : "text-left")}>
              {value
                ? format(value, isAr ? "d MMMM yyyy" : "PPP", { locale })
                : resolvedPlaceholder}
            </span>
            <ChevronDown
              className={cn(
                "shrink-0 text-muted-foreground transition-transform duration-200",
                compact ? "h-3.5 w-3.5" : "h-4 w-4",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className={cn(
            "w-[min(100vw-2rem,18.5rem)] overflow-hidden rounded-xl border border-border p-0 shadow-2xl",
            inModal && "z-[110]",
          )}
        >
          <div className="space-y-2 p-3">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-1">
                <Label
                  htmlFor={`${id}-month`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {isAr ? "الشهر" : "Month"}
                </Label>
                <select
                  id={`${id}-month`}
                  aria-label={isAr ? "الشهر" : "Month"}
                  value={String(viewMonth.getMonth())}
                  onChange={(e) =>
                    setViewMonth(
                      new Date(viewMonth.getFullYear(), Number(e.target.value), 1),
                    )
                  }
                  className={selectClassName}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`${id}-year`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {isAr ? "السنة" : "Year"}
                </Label>
                <select
                  id={`${id}-year`}
                  aria-label={isAr ? "السنة" : "Year"}
                  value={String(viewMonth.getFullYear())}
                  onChange={(e) =>
                    setViewMonth(
                      new Date(Number(e.target.value), viewMonth.getMonth(), 1),
                    )
                  }
                  className={selectClassName}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border/80 bg-muted/10 p-1.5">
              <Calendar
                mode="single"
                month={viewMonth}
                onMonthChange={setViewMonth}
                selected={value}
                locale={locale}
                fromDate={new Date(fromYear, 0, 1)}
                toDate={new Date(toYear, 11, 31)}
                onSelect={(date) => {
                  onChange(date);
                  if (date) {
                    setViewMonth(date);
                    setOpen(false);
                  }
                }}
                disabled={isDateDisabled}
                showOutsideDays
                classNames={calendarClassNames}
                className="pointer-events-auto w-full p-0"
              />
            </div>
          </div>

          {value && (
            <div className="flex justify-end border-t border-border bg-muted/25 px-2.5 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <X className="h-3.5 w-3.5" />
                {isAr ? "مسح التاريخ" : "Clear date"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MedicalRecordDatePicker;
