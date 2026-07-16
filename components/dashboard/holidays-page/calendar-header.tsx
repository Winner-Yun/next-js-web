"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarHeader({
  currentMonth,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
  onMonthChange,
  onYearChange,
}: CalendarHeaderProps) {
  // Generate a list of years (e.g., 10 years back and 10 years forward)
  const baseYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-muted/80 backdrop-blur-xs shadow-xs">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2 bg-brand/10 rounded-lg text-brand hidden sm:block">
          <CalendarDaysIcon className="size-5" />
        </div>

        {/* Quick Search/Jump Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={currentMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {MONTHS.map((month, idx) => (
              <option key={month} value={idx}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs cursor-pointer font-medium px-4 shadow-xs"
          onClick={onToday}
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-9 cursor-pointer"
            onClick={onPrevMonth}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 cursor-pointer"
            onClick={onNextMonth}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
