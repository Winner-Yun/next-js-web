/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  CalendarIcon,
  DownloadCloudIcon,
  LayoutGridIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmImportDialog } from "./confirm-import"; // Ensure this file exists
import { HolidayCalendar } from "./holiday-calendar";
import { HolidayCard } from "./holiday-card";
import { HolidayCreateDialog } from "./holiday-create-dialog";
import type { Holiday } from "./types";

export function HolidayDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("calendar");
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  // Single definitions of state
  const [isImporting, setIsImporting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("holidayViewMode");
    if (savedMode === "grid" || savedMode === "calendar") {
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
      [workspace.id]: (prev[workspace.id] || []).filter((h) => h.id !== id),
    }));
    toast.success("Holiday permanently deleted.");
  };

  const handleImportKhmerHolidays = async () => {
    setIsImporting(true);
    try {
      const targetYear = new Date().getFullYear();
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${targetYear}/KH`,
      );
      if (!response.ok) throw new Error("API failed");

      const apiData = await response.json();
      const now = new Date().toISOString();

      setHolidaysData((prev) => {
        const existingHolidays = prev[workspace.id] || [];
        const existingDates = new Set(existingHolidays.map((h) => h.date));

        let addedCount = 0;
        const newHolidays = apiData
          .filter(
            (apiHoliday: unknown) =>
              !existingDates.has((apiHoliday as unknown).date),
          )
          .map((apiHoliday: unknown) => {
            addedCount++;
            return {
              id: `HOL-${Math.random().toString(36).substr(2, 9)}`,
              workspace_id: workspace.id,
              name: (apiHoliday as unknown).name,
              date: (apiHoliday as unknown).date,
              created_at: now,
              updated_at: now,
            };
          });

        if (addedCount === 0) {
          toast.info(
            `All Khmer holidays for ${targetYear} are already present.`,
          );
          return prev;
        }

        const merged = [...existingHolidays, ...newHolidays].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        toast.success(`Successfully imported ${addedCount} new holidays!`);
        return { ...prev, [workspace.id]: merged };
      });
    } catch {
      toast.error("Failed to import Khmer holidays.");
    } finally {
      setIsImporting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <ConfirmImportDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleImportKhmerHolidays}
        isImporting={isImporting}
        year={new Date().getFullYear()}
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Holidays
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active:{" "}
            <span className="font-semibold text-brand">{workspace.name}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {viewMode === "grid" && (
            <div className="relative w-full sm:w-56 lg:w-64">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search holidays..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/10 h-10 text-xs"
              />
            </div>
          )}

          <Button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isImporting}
            variant="outline"
            className="h-10 text-xs shrink-0"
          >
            <DownloadCloudIcon className="size-4 mr-1.5 text-blue-500" /> Import
            Holidays
          </Button>
          <Button
            onClick={() => setIsManualAddOpen(true)}
            className="h-10 text-xs bg-brand text-white hover:bg-brand/90 shrink-0"
          >
            <PlusIcon className="size-4 mr-1.5" /> Add Holiday
          </Button>

          <Tabs
            value={viewMode}
            onValueChange={(v) => {
              setViewMode(v as "grid" | "calendar");
              localStorage.setItem("holidayViewMode", v);
            }}
            className="h-10 shrink-0"
          >
            <TabsList className="h-10 p-1 bg-muted/30 border border-muted/60">
              <TabsTrigger
                value="calendar"
                className="text-xs h-8 px-3 data-[state=active]:bg-background"
              >
                <CalendarIcon className="size-3.5 mr-1.5" /> Calendar
              </TabsTrigger>
              <TabsTrigger
                value="grid"
                className="text-xs h-8 px-3 data-[state=active]:bg-background"
              >
                <LayoutGridIcon className="size-3.5 mr-1.5" /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <HolidayCreateDialog
            isOpen={isManualAddOpen}
            onClose={() => setIsManualAddOpen(false)}
            onSave={(n, d) => {
              handleAddHoliday({ name: n, date: d });
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
        <>
          {processedHolidays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {processedHolidays.map((h) => (
                <HolidayCard
                  key={h.id}
                  holiday={h}
                  onRemove={handleRemoveHoliday}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/5 text-center">
              <div className="bg-muted p-3 rounded-full mb-3">
                <CalendarIcon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No holidays found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-62.5">
                {search
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Start by adding a new holiday or importing the Khmer holiday calendar."}
              </p>
              {!search && (
                <Button
                  variant="ghost"
                  onClick={() => setIsManualAddOpen(true)}
                  className="mt-4 text-xs h-8 text-brand hover:text-brand/80"
                >
                  Add your first holiday
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
