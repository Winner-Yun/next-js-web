"use client";

import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import type { Holiday } from "./types";

interface CalendarGridProps {
  holidays: Holiday[];
  daysInMonth: number;
  firstDayOfMonth: number;
  todayStr: string;
  addHolidayDate: string | null;
  selectedHoliday: Holiday | null;
  getDateString: (day: number) => string;
  handleDayClick: (dateStr: string, holidayForDay?: Holiday) => void;
  onAdd?: (data: { name: string; date: string }) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  holidays,
  daysInMonth,
  firstDayOfMonth,
  todayStr,
  addHolidayDate,
  selectedHoliday,
  getDateString,
  handleDayClick,
  onAdd,
}: CalendarGridProps) {
  return (
    <Card className="overflow-hidden border-muted/80 shadow-md rounded-xl transition-all duration-300">
      {/* Weekday Row Header */}
      <div className="grid grid-cols-7 border-b border-muted/60 bg-muted/20">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-r border-muted/30 last:border-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 bg-background md:divide-x divide-muted/20">
        {/* Pad leading empty month spaces */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-24 p-2 border-b border-muted/30 bg-muted/5/20 opacity-40"
          />
        ))}

        {/* Actual days loop */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = getDateString(day);
          const holidayForDay = holidays.find((h) => h.date === dateStr);
          const isToday = dateStr === todayStr;

          const isSelectedToAdd = addHolidayDate === dateStr;
          const isSelectedToView = selectedHoliday?.date === dateStr;
          const isCurrentlySelected = isSelectedToAdd || isSelectedToView;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(dateStr, holidayForDay)}
              className={`min-h-24 p-2.5 border-b border-muted/30 relative flex flex-col justify-between transition-all duration-200 group cursor-pointer select-none
                ${holidayForDay ? "hover:bg-brand/5" : "hover:bg-muted/10"}
                ${!holidayForDay && isToday && !isCurrentlySelected ? "bg-brand/5" : ""}
                ${holidayForDay && !isCurrentlySelected ? "bg-brand/2" : ""}
                ${isCurrentlySelected ? "ring-2 ring-inset ring-brand bg-brand/10 z-10 shadow-sm" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold size-6.5 flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                    isToday && !isCurrentlySelected
                      ? "bg-brand text-white shadow-md font-bold"
                      : holidayForDay || isCurrentlySelected
                        ? "text-brand font-bold bg-brand/15"
                        : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/30"
                  }`}
                >
                  {day}
                </span>

                {/* Hover plus actions */}
                {!holidayForDay && onAdd && (
                  <PlusIcon
                    className={`size-4 transition-all transform duration-200 ${
                      isCurrentlySelected
                        ? "text-brand opacity-100 scale-110"
                        : "text-muted-foreground opacity-0 group-hover:opacity-70 group-hover:scale-100"
                    }`}
                  />
                )}
              </div>

              {/* Render Holiday Banner */}
              {holidayForDay && (
                <div className="mt-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div
                    className={`text-[10px] leading-tight font-semibold border rounded-md px-2 py-1.5 line-clamp-2 transition-all ${
                      isCurrentlySelected
                        ? "text-brand bg-brand/20 border-brand/50 shadow-xs"
                        : "text-brand bg-brand/10 border-brand/20 group-hover:border-brand/40 shadow-2xs"
                    }`}
                  >
                    {holidayForDay.name}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
