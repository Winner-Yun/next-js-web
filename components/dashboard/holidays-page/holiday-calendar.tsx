"use client";

import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";
import { HolidayCreateDialog } from "./holiday-create-dialog";
import { HolidayViewDialog } from "./holiday-view-dialog";
import type { Holiday } from "./types";

interface HolidayCalendarProps {
  holidays: Holiday[];
  onRemove: (id: string) => void;
  onAdd?: (data: { name: string; date: string }) => void;
}

export function HolidayCalendar({
  holidays,
  onRemove,
  onAdd,
}: HolidayCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [addHolidayDate, setAddHolidayDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Engine Math updates
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
  };

  const handleDayClick = (dateStr: string, holidayForDay?: Holiday) => {
    if (holidayForDay) {
      setSelectedHoliday(holidayForDay);
    } else if (onAdd) {
      setAddHolidayDate(dateStr);
    }
  };

  const handleSaveNewHoliday = (name: string, date: string) => {
    if (onAdd) {
      onAdd({ name, date });
    }
    setAddHolidayDate(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <CalendarHeader
        currentMonth={month}
        year={year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      <CalendarGrid
        holidays={holidays}
        daysInMonth={daysInMonth}
        firstDayOfMonth={firstDayOfMonth}
        todayStr={todayStr}
        addHolidayDate={addHolidayDate}
        selectedHoliday={selectedHoliday}
        getDateString={getDateString}
        handleDayClick={handleDayClick}
        onAdd={onAdd}
      />

      <HolidayViewDialog
        selectedHoliday={selectedHoliday}
        onClose={() => setSelectedHoliday(null)}
        onRemove={onRemove}
      />

      <HolidayCreateDialog
        addHolidayDate={addHolidayDate}
        onClose={() => setAddHolidayDate(null)}
        onSave={handleSaveNewHoliday}
      />
    </div>
  );
}
