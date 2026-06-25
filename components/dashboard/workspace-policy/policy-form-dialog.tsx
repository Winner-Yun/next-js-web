/* eslint-disable react-hooks/set-state-in-effect */
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
import { AlertTriangleIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { WorkspacePolicyData } from "./types";

interface PolicyFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData: WorkspacePolicyData | null;
  onSave: (data: Omit<WorkspacePolicyData, "id" | "status">) => void;
}

const defaultValues = {
  name: "",
  work_start_time: "08:00",
  work_end_time: "17:00",
  check_in_start: "07:30",
  check_out_start: "16:30",
  late_buffer_minutes: 15,
  deadline_scan_minutes: 30,
  annual_leave_limit: 18,
  sick_leave_limit: 6,
};

interface FormErrors {
  work_time?: string;
  check_time?: string;
  thresholds?: string;
}

// Utility to convert "HH:mm" to total minutes for easy comparison
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// Utility function to add minutes to a "HH:mm" standard time string
const calculateTimeOffset = (
  baseTime: string,
  offsetMinutes: number,
): string => {
  if (!baseTime || baseTime.indexOf(":") === -1) return "--:--";
  const [hoursStr, minutesStr] = baseTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return "--:--";

  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  const targetHours = Math.floor(totalMinutes / 60) % 24;
  const targetMinutes = totalMinutes % 60;

  return `${targetHours.toString().padStart(2, "0")}:${targetMinutes.toString().padStart(2, "0")}`;
};

export function PolicyFormDialog({
  isOpen,
  setIsOpen,
  initialData,
  onSave,
}: PolicyFormDialogProps) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultValues);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    field: keyof typeof defaultValues,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-clear specific validation errors if values become coherent during editing
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        if (field === "work_start_time" || field === "work_end_time") {
          if (
            timeToMinutes(updated.work_start_time) <
            timeToMinutes(updated.work_end_time)
          ) {
            delete newErrors.work_time;
          }
        }

        if (field === "check_in_start" || field === "check_out_start") {
          if (
            timeToMinutes(updated.check_in_start) <
            timeToMinutes(updated.check_out_start)
          ) {
            delete newErrors.check_time;
          }
        }

        if (
          field === "late_buffer_minutes" ||
          field === "deadline_scan_minutes"
        ) {
          if (
            Number(updated.deadline_scan_minutes) >
            Number(updated.late_buffer_minutes)
          ) {
            delete newErrors.thresholds;
          }
        }

        return newErrors;
      });

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newErrors: FormErrors = {};

    // 1. Work Time Validation
    if (
      timeToMinutes(formData.work_start_time) >=
      timeToMinutes(formData.work_end_time)
    ) {
      newErrors.work_time =
        "Work End Time must be strictly after Work Start Time.";
    }

    // 2. Check Window Validation
    if (
      timeToMinutes(formData.check_in_start) >=
      timeToMinutes(formData.check_out_start)
    ) {
      newErrors.check_time =
        "Check-Out Start must be strictly after Check-In Start.";
    }

    // 3. Buffer/Deadline Validation Guard Logic
    if (
      Number(formData.deadline_scan_minutes) <=
      Number(formData.late_buffer_minutes)
    ) {
      newErrors.thresholds =
        "Scan Deadline Window must be greater than Late Buffer minutes.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background rounded-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-5 pb-4 bg-muted/10 border-b border-muted/40">
            <DialogTitle className="text-base font-bold text-foreground">
              {initialData ? "Modify Target Policy" : "Build New Policy"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set your operational parameters and limits below.{" "}
              {initialData ? "" : "Activating this will suspend others."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Policy Generic Text Header */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Policy Name
              </Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., HQ Standard Rules"
                className="h-9 text-xs focus-visible:border-brand"
              />
            </div>

            {/* Core Work Hours Section */}
            <div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Work Start Time
                  </Label>
                  <Input
                    type="time"
                    required
                    value={formData.work_start_time}
                    onChange={(e) =>
                      handleChange("work_start_time", e.target.value)
                    }
                    className={`h-9 text-xs ${errors.work_time ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Work End Time
                  </Label>
                  <Input
                    type="time"
                    required
                    value={formData.work_end_time}
                    onChange={(e) =>
                      handleChange("work_end_time", e.target.value)
                    }
                    className={`h-9 text-xs ${errors.work_time ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
              </div>
              {errors.work_time && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-destructive mt-1.5 animate-in fade-in">
                  <AlertTriangleIcon className="size-3 shrink-0" />
                  {errors.work_time}
                </p>
              )}
            </div>

            {/* Check Windows Section */}
            <div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Check-In Start
                  </Label>
                  <Input
                    type="time"
                    required
                    value={formData.check_in_start}
                    onChange={(e) =>
                      handleChange("check_in_start", e.target.value)
                    }
                    className={`h-9 text-xs ${errors.check_time ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Check-Out Start
                  </Label>
                  <Input
                    type="time"
                    required
                    value={formData.check_out_start}
                    onChange={(e) =>
                      handleChange("check_out_start", e.target.value)
                    }
                    className={`h-9 text-xs ${errors.check_time ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
              </div>
              {errors.check_time && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-destructive mt-1.5 animate-in fade-in">
                  <AlertTriangleIcon className="size-3 shrink-0" />
                  {errors.check_time}
                </p>
              )}
            </div>

            {/* Validation Threshold Parameters */}
            <div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Late Buffer (Mins)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    required
                    value={formData.late_buffer_minutes}
                    onChange={(e) =>
                      handleChange(
                        "late_buffer_minutes",
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                    className={`h-9 text-xs font-mono ${errors.thresholds ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Deadline Scan (Mins)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    required
                    value={formData.deadline_scan_minutes}
                    onChange={(e) =>
                      handleChange(
                        "deadline_scan_minutes",
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                    className={`h-9 text-xs font-mono ${errors.thresholds ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
              </div>
              {errors.thresholds && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-destructive mt-1.5 animate-in fade-in">
                  <AlertTriangleIcon className="size-3 shrink-0" />
                  {errors.thresholds}
                </p>
              )}
            </div>

            {/* Attendance Rule Preview UI Block */}
            <div className="bg-muted/30 border border-muted/70 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <InfoIcon className="size-3.5 text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Attendance Rule Preview
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs border-l-2 border-muted pl-2.5 ml-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 w-12">
                    {formData.work_start_time || "--:--"}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - On Time
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-600 w-12">
                    {calculateTimeOffset(
                      formData.work_start_time,
                      formData.late_buffer_minutes,
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Late
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-destructive w-12">
                    {calculateTimeOffset(
                      formData.work_start_time,
                      formData.deadline_scan_minutes,
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Attendance Deadline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground/60 w-12">
                    After{" "}
                    {calculateTimeOffset(
                      formData.work_start_time,
                      formData.deadline_scan_minutes,
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Absent
                  </span>
                </div>
              </div>
            </div>

            {/* Leave Capacities Parameters */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Annual Leave Limit
                </Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={formData.annual_leave_limit}
                  onChange={(e) =>
                    handleChange(
                      "annual_leave_limit",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sick Leave Limit
                </Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={formData.sick_leave_limit}
                  onChange={(e) =>
                    handleChange(
                      "sick_leave_limit",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pe-6 py-6! pt-2! border-t border-muted bg-muted/10 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs h-9 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 font-semibold bg-brand text-white hover:bg-brand/90 px-4"
            >
              {initialData ? "Save Changes" : "Deploy Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
