"use client";

import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";
import { HolidayViewDialog } from "./holiday-view-dialog";
import type { Holiday } from "./types";

interface HolidayCalendarProps {
  holidays: Holiday[];
  includeWeekend?: string;
  // Updated typing to accept async remove functions
  onRemove: (id: string) => Promise<void> | void;
  onEdit: (holiday: Holiday) => void;
  onAdd?: (data: { name: string; date: string }) => void;
}

export function HolidayCalendar({
  holidays,
  includeWeekend,
  onRemove,
  onEdit,
  onAdd,
}: HolidayCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addHolidayDate, setAddHolidayDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleDayClick = (dateStr: string, holidayForDay?: Holiday) => {
    if (holidayForDay) {
      setSelectedHoliday(holidayForDay);
    } else if (onAdd) {
      onAdd({ name: "", date: dateStr });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <CalendarHeader
        currentMonth={month}
        year={year}
        onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
        onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
        onToday={() => setCurrentDate(new Date())}
        onMonthChange={(m) => setCurrentDate(new Date(year, m, 1))}
        onYearChange={(y) => setCurrentDate(new Date(y, month, 1))}
      />

      <CalendarGrid
        holidays={holidays}
        includeWeekend={includeWeekend}
        daysInMonth={daysInMonth}
        firstDayOfMonth={firstDayOfMonth}
        todayStr={todayStr}
        addHolidayDate={addHolidayDate}
        selectedHoliday={selectedHoliday}
        getDateString={(day) =>
          `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        }
        handleDayClick={handleDayClick}
        onAdd={onAdd}
      />

      <HolidayViewDialog
        selectedHoliday={selectedHoliday}
        onClose={() => setSelectedHoliday(null)}
        onRemove={onRemove}
        onEdit={(holiday) => {
          setSelectedHoliday(null);
          onEdit(holiday);
        }}
      />
    </div>
  );
}
