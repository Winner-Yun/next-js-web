"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  CalendarIcon,
  LayoutGridIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { HolidayCalendar } from "./holiday-calendar";
import { HolidayCard } from "./holiday-card";
import { HolidayCreateDialog } from "./holiday-create-dialog";
import type { Holiday } from "./types";

export function HolidayDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("calendar");
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  // Load the persisted view selection on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("holidayViewMode");
    if (savedMode === "grid" || savedMode === "calendar") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewMode(savedMode);
    }
  }, []);

  const [holidaysData, setHolidaysData] = useState<Record<string, Holiday[]>>({
    worksmart: [
      {
        id: "HOL-001",
        workspace_id: "worksmart",
        name: "New Year's Day",
        date: "2026-01-01",
        created_at: "2025-12-01T08:00:00.000Z",
        updated_at: "2025-12-01T08:00:00.000Z",
      },
      {
        id: "HOL-002",
        workspace_id: "worksmart",
        name: "Independence Day",
        date: "2026-11-09",
        created_at: "2026-01-15T10:30:00.000Z",
        updated_at: "2026-01-15T10:30:00.000Z",
      },
    ],
  });

  const currentWorkspaceHolidays = useMemo(() => {
    return holidaysData[workspace.id] || [];
  }, [holidaysData, workspace.id]);

  const processedHolidays = useMemo(() => {
    return currentWorkspaceHolidays.filter(
      (holiday) =>
        holiday.name.toLowerCase().includes(search.toLowerCase()) ||
        holiday.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [currentWorkspaceHolidays, search]);

  const handleAddHoliday = (data: { name: string; date: string }) => {
    const now = new Date().toISOString();
    const newId = `HOL-${Math.random().toString(36).substr(2, 9)}`;

    const newHoliday: Holiday = {
      id: newId,
      workspace_id: workspace.id,
      name: data.name,
      date: data.date,
      created_at: now,
      updated_at: now,
    };

    setHolidaysData((prev) => {
      const existing = prev[workspace.id] || [];
      return {
        ...prev,
        [workspace.id]: [newHoliday, ...existing].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      };
    });

    toast.success(`Holiday "${data.name}" added successfully!`);
  };

  const handleRemoveHoliday = (id: string) => {
    setHolidaysData((prev) => ({
      ...prev,
      [workspace.id]: (prev[workspace.id] || []).filter(
        (holiday) => holiday.id !== id,
      ),
    }));
    toast.success("Holiday permanently deleted.");
  };

  // Persist to local storage when changed
  const handleViewModeChange = (val: string) => {
    const newMode = val as "grid" | "calendar";
    setViewMode(newMode);
    localStorage.setItem("holidayViewMode", newMode);
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Holidays
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active Context Directory:{" "}
            <span className="font-semibold text-brand">{workspace.name}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {viewMode === "grid" && (
            <>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search holidays..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/10 h-10 text-xs"
                />
              </div>
              <Button
                onClick={() => setIsManualAddOpen(true)}
                className="h-10 text-xs bg-brand text-white hover:bg-brand/90 px-4"
              >
                <PlusIcon className="size-4 mr-1.5" />
                Add Holiday
              </Button>
            </>
          )}

          <Tabs
            value={viewMode}
            onValueChange={handleViewModeChange}
            className="h-10"
          >
            <TabsList className="h-10 p-1 bg-muted/30 border border-muted/60">
              <TabsTrigger
                value="calendar"
                className="text-xs h-8 px-3 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <CalendarIcon className="size-3.5" />
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="grid"
                className="text-xs h-8 px-3 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LayoutGridIcon className="size-3.5" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Triggered from the "Add Holiday" button in List Mode */}
          <HolidayCreateDialog
            isOpen={isManualAddOpen}
            onClose={() => setIsManualAddOpen(false)}
            onSave={(name, date) => {
              handleAddHoliday({ name, date });
              setIsManualAddOpen(false);
            }}
          />
        </div>
      </div>

      {viewMode === "calendar" ? (
        <HolidayCalendar
          holidays={currentWorkspaceHolidays}
          onRemove={handleRemoveHoliday}
          onAdd={handleAddHoliday}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedHolidays.map((holiday) => (
            <HolidayCard
              key={holiday.id}
              holiday={holiday}
              onRemove={handleRemoveHoliday}
            />
          ))}

          {processedHolidays.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted/40 p-3 mb-3">
                <CalendarIcon className="size-5 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium">
                No workspace holidays configured
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
