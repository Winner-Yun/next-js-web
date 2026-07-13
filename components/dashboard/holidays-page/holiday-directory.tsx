/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  CalendarIcon,
  LayoutGridIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr"; // Added SWR

import { HolidayCalendar } from "./holiday-calendar";
import { HolidayCard } from "./holiday-card";
import { HolidayCreateDialog } from "./holiday-create-dialog";
import type { Holiday, HolidayConfig, PaginatedHolidays } from "./types";

// Standard SWR fetcher for authenticated endpoints
const fetcher = async (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch workspace data");
  return res.json();
};

// Specialized fetcher for the public API holidays
const publicHolidaysFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch public holidays");
  const data = await res.json();
  return data.map((h: unknown) => ({
    id: `public-${h.date}`,
    workspace_id: "public",
    name: h.name,
    date: h.date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

export function HolidayDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("calendar");

  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [holidayToEdit, setHolidayToEdit] = useState<Holiday | null>(null);
  const [addHolidayDate, setAddHolidayDate] = useState<string | null>(null);

  const [isConfigConfirmOpen, setIsConfigConfirmOpen] = useState(false);
  const [pendingConfig, setPendingConfig] =
    useState<Partial<HolidayConfig> | null>(null);
  const [isConfigSaving, setIsConfigSaving] = useState(false);

  // === REPLACED USESTATE WITH USESWR CACHING ===

  // 1. Fetch Config
  const { data: config, mutate: mutateConfig } = useSWR<HolidayConfig>(
    workspace?.id ? `/api/workspace/${workspace.id}/holiday-config` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  // 2. Fetch Workspace Holidays
  const {
    data: holidaysData,
    mutate: mutateHolidays,
    isLoading: isHolidaysLoading,
  } = useSWR<PaginatedHolidays>(
    workspace?.id ? `/api/workspace/${workspace.id}/holidays` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  // 3. Conditionally Fetch Public Holidays (Only runs if the config allows it)
  const currentYear = new Date().getFullYear();
  const { data: publicHolidaysData } = useSWR<Holiday[]>(
    config?.include_public_holidays
      ? `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/KH`
      : null,
    publicHolidaysFetcher,
    { revalidateOnFocus: false, dedupingInterval: 86400000 }, // Cache API response for a day
  );

  const holidays = holidaysData?.data || [];
  const publicHolidays = publicHolidaysData || [];
  const isLoading = isHolidaysLoading && !holidaysData;

  useEffect(() => {
    const savedMode = localStorage.getItem("holidayViewMode");
    if (savedMode === "grid" || savedMode === "calendar") {
      setViewMode(savedMode);
    }
  }, []);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const confirmConfigUpdate = async () => {
    if (!workspace?.id || !config || !pendingConfig) return;

    setIsConfigSaving(true);
    const newConfig = { ...config, ...pendingConfig };

    try {
      const res = await fetch(`/api/workspace/${workspace.id}/holiday-config`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          include_public_holidays: newConfig.include_public_holidays,
          include_weekend: newConfig.include_weekend,
        }),
      });
      if (!res.ok) throw new Error();

      // Instantly update the SWR cache UI on success
      await mutateConfig(newConfig, { revalidate: true });
      toast.success("Holiday configuration updated successfully.");
    } catch {
      toast.error("Failed to update holiday configuration.");
    } finally {
      setIsConfigSaving(false);
      setIsConfigConfirmOpen(false);
      setPendingConfig(null);
    }
  };

  const allHolidays = useMemo(() => {
    const workspaceDates = new Set(holidays.map((h) => h.date));
    const activePublicHolidays = publicHolidays.filter(
      (p) => !workspaceDates.has(p.date),
    );
    return [...holidays, ...activePublicHolidays];
  }, [holidays, publicHolidays]);

  const processedHolidays = useMemo(() => {
    return allHolidays.filter(
      (holiday) =>
        holiday.name.toLowerCase().includes(search.toLowerCase()) ||
        holiday.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allHolidays, search]);

  const handleSaveHoliday = async (name: string, date: string, id?: string) => {
    if (!workspace?.id) return;

    if (id?.startsWith("public-")) {
      toast.error("Cannot modify auto-generated public holidays.");
      return;
    }
    if (!id && publicHolidays.some((p) => p.date === date)) {
      toast.error("A public holiday already exists on this date.");
      return;
    }

    try {
      if (id) {
        const res = await fetch(`/api/workspace/holiday/${id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ name, date }),
        });
        if (!res.ok) throw new Error("Failed to update holiday");
        toast.success(`Holiday "${name}" updated successfully!`);
      } else {
        const res = await fetch(`/api/workspace/${workspace.id}/holidays`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ name, date }),
        });
        if (!res.ok) throw new Error("Failed to create holiday");
        toast.success(`Holiday "${name}" added successfully!`);
      }

      setIsManualAddOpen(false);
      setHolidayToEdit(null);
      setAddHolidayDate(null);

      // Revalidate cache instead of manual fetch call
      await mutateHolidays(undefined, { revalidate: true });
    } catch (error) {
      toast.error("Failed to save holiday.");
    }
  };

  const handleRemoveHoliday = async (id: string) => {
    if (id.startsWith("public-")) {
      toast.error(
        "Cannot delete auto-generated public holidays. Turn off the feature instead.",
      );
      return;
    }

    try {
      const res = await fetch(`/api/workspace/holiday/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete holiday");

      toast.success("Holiday permanently deleted.");
      // Revalidate cache instead of manual fetch call
      await mutateHolidays(undefined, { revalidate: true });
    } catch (error) {
      toast.error("Failed to remove holiday.");
    }
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <Dialog
        open={isConfigConfirmOpen}
        onOpenChange={(open) => {
          if (!isConfigSaving) {
            setIsConfigConfirmOpen(open);
            if (!open) setPendingConfig(null);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => isConfigSaving && e.preventDefault()}
          onEscapeKeyDown={(e) => isConfigSaving && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Confirm Settings Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the workspace holiday
              configuration?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfigConfirmOpen(false);
                setPendingConfig(null);
              }}
              disabled={isConfigSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmConfigUpdate}
              disabled={isConfigSaving}
              className="bg-brand text-white hover:bg-brand/90"
            >
              {isConfigSaving ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Holidays
          </h1>
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
            onClick={() => {
              setHolidayToEdit(null);
              setAddHolidayDate(null);
              setIsManualAddOpen(true);
            }}
            disabled={isLoading || !workspace?.id}
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
            addHolidayDate={addHolidayDate}
            editHoliday={holidayToEdit}
            onClose={() => {
              setIsManualAddOpen(false);
              setHolidayToEdit(null);
              setAddHolidayDate(null);
            }}
            onSave={handleSaveHoliday}
          />
        </div>
      </div>

      {config && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-muted/20 border border-muted/60 rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={config.include_public_holidays}
              onClick={() => {
                setPendingConfig({
                  include_public_holidays: !config.include_public_holidays,
                });
                setIsConfigConfirmOpen(true);
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${config.include_public_holidays ? "bg-brand" : "bg-muted-foreground/30"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${config.include_public_holidays ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
            <Label
              className="text-xs font-semibold cursor-pointer"
              onClick={() => {
                setPendingConfig({
                  include_public_holidays: !config.include_public_holidays,
                });
                setIsConfigConfirmOpen(true);
              }}
            >
              Auto-Display Public Holidays
            </Label>
          </div>
          <div className="hidden sm:block w-px h-6 bg-muted/60"></div>
          <div className="flex items-center gap-3">
            <Label
              htmlFor="include_weekend"
              className="text-xs font-semibold whitespace-nowrap"
            >
              Include Weekends:
            </Label>
            <select
              id="include_weekend"
              value={config.include_weekend}
              onChange={(e) => {
                setPendingConfig({ include_weekend: e.target.value });
                setIsConfigConfirmOpen(true);
              }}
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="Saturday and Sunday">Saturday and Sunday</option>
              <option value="Sunday only">Sunday only</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        viewMode === "calendar" ? (
          <div className="space-y-5 animate-pulse mt-4">
            <div className="h-16 bg-muted/40 rounded-xl w-full border border-muted/60"></div>
            <div className="h-125 bg-muted/40 rounded-xl w-full border border-muted/60"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-30 bg-muted/40 rounded-xl border border-muted/60"
              ></div>
            ))}
          </div>
        )
      ) : viewMode === "calendar" ? (
        <HolidayCalendar
          holidays={allHolidays}
          includeWeekend={config?.include_weekend}
          onRemove={handleRemoveHoliday}
          onEdit={(holiday) => setHolidayToEdit(holiday)}
          onAdd={(data) => setAddHolidayDate(data.date)}
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
                  onEdit={() => setHolidayToEdit(h)}
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
                  : "Start by adding a new holiday or turning on Public Holidays."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
