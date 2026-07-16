/* eslint-disable prefer-const */
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
import { AlertTriangleIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { WorkspacePolicyData } from "./types";

interface PolicyFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData: WorkspacePolicyData | null;
  onSave: (data: Omit<WorkspacePolicyData, "id" | "status">) => void;
  isProcessing?: boolean;
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
}

// Convert "08:00 AM" to HTML compatible "08:00"
const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr) return "";
  if (!timeStr.toLowerCase().includes("m")) return timeStr.substring(0, 5); // Fallback for 24h

  const [time, modifier] = timeStr.split(" ");
  if (!time || !modifier) return timeStr;

  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier.toUpperCase() === "PM")
    hours = (parseInt(hours, 10) + 12).toString();

  return `${hours.padStart(2, "0")}:${minutes}`;
};

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

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

// Formats 24-hour time "14:30" to 12-hour time "02:30 PM"
const formatTime12Hour = (timeStr: string): string => {
  if (!timeStr || timeStr === "--:--") return "--:--";
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  if (isNaN(hours)) return "--:--";

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayHours = formattedHours.toString().padStart(2, "0");

  return `${displayHours}:${minutesStr} ${ampm}`;
};

export function PolicyFormDialog({
  isOpen,
  setIsOpen,
  initialData,
  onSave,
  isProcessing,
}: PolicyFormDialogProps) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        work_start_time: convertTo24Hour(initialData.work_start_time),
        work_end_time: convertTo24Hour(initialData.work_end_time),
        check_in_start: convertTo24Hour(initialData.check_in_start),
        check_out_start: convertTo24Hour(initialData.check_out_start),
      });
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

        return newErrors;
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newErrors: FormErrors = {};

    if (
      timeToMinutes(formData.work_start_time) >=
      timeToMinutes(formData.work_end_time)
    ) {
      newErrors.work_time =
        "Work End Time must be strictly after Work Start Time.";
    }

    if (
      timeToMinutes(formData.check_in_start) >=
      timeToMinutes(formData.check_out_start)
    ) {
      newErrors.check_time =
        "Check-Out Start must be strictly after Check-In Start.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isProcessing && setIsOpen(open)}
    >
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden bg-background rounded-xl"
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
      >
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
                disabled={isProcessing}
              />
            </div>

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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
                    className="h-9 text-xs font-mono"
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
                    disabled={isProcessing}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border border-muted/70 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <InfoIcon className="size-3.5 text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Attendance Rule Preview
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs border-l-2 border-muted pl-2.5 ml-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 w-16">
                    {formatTime12Hour(formData.work_start_time)}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - On Time
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-600 w-16">
                    {formatTime12Hour(
                      calculateTimeOffset(
                        formData.work_start_time,
                        formData.late_buffer_minutes,
                      ),
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Late
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-destructive w-16">
                    {formatTime12Hour(
                      calculateTimeOffset(
                        formData.check_out_start,
                        formData.deadline_scan_minutes,
                      ),
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Scan Out Deadline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground/60 w-16">
                    After{" "}
                    {formatTime12Hour(
                      calculateTimeOffset(
                        formData.check_out_start,
                        formData.deadline_scan_minutes,
                      ),
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    - Missed Check-Out
                  </span>
                </div>
              </div>
            </div>

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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
              disabled={isProcessing}
              className="text-xs cursor-pointer h-9 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isProcessing}
              className="text-xs h-9 cursor-pointer font-semibold bg-brand text-white hover:bg-brand/90 px-4"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Processing...
                </span>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Deploy Policy"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
