"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDaysIcon, ClockIcon, UserIcon } from "lucide-react";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import type { AttendanceRecord } from "./types";

interface AttendanceViewDialogProps {
  selectedLog: AttendanceRecord | null;
  onClose: () => void;
}

export function AttendanceViewDialog({
  selectedLog,
  onClose,
}: AttendanceViewDialogProps) {
  return (
    <Dialog open={!!selectedLog} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25 p-4 overflow-hidden bg-background">
        {selectedLog && (
          <div className="flex flex-col">
            <DialogHeader className="p-5 pb-3 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 bg-brand/10 text-brand border-brand/20 shadow-none"
                >
                  Log Details
                </Badge>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-muted">
                  {selectedLog.id}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <div className="size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shrink-0 border border-brand/20">
                  {selectedLog.employeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="text-base font-bold text-foreground">
                    {selectedLog.employeeName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <UserIcon className="size-3" />
                    {selectedLog.role}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Central Information Fields */}
            <div className="px-5 py-4 space-y-4 border-y border-muted/40 bg-muted/5">
              <div className="flex items-center justify-between pb-3 border-b border-muted/40">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Log Date
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <CalendarDaysIcon className="size-3.5 text-brand" />
                    <span>
                      {new Date(selectedLog.date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Current Status
                  </span>
                  <div className="flex justify-end">
                    <AttendanceStatusBadge status={selectedLog.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Check In Time
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                    <ClockIcon className="size-3.5 text-muted-foreground/60" />
                    <span
                      className={
                        !selectedLog.checkIn ? "text-muted-foreground/50" : ""
                      }
                    >
                      {selectedLog.checkIn || "No check-in recorded"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Check Out Time
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                    <ClockIcon className="size-3.5 text-muted-foreground/60" />
                    <span
                      className={
                        !selectedLog.checkOut ? "text-muted-foreground/50" : ""
                      }
                    >
                      {selectedLog.checkOut || "No check-out recorded"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-muted/40 flex flex-row items-center justify-between">
                <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                  Calculated Duration
                </span>
                <div className="font-mono font-bold text-sm text-foreground">
                  {selectedLog.hoursWorked !== null &&
                  selectedLog.hoursWorked > 0 ? (
                    <span className="bg-brand/10 text-brand px-2.5 py-1 border border-brand/20 rounded-md">
                      {selectedLog.hoursWorked.toFixed(2)} hrs
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40 font-normal">
                      --
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <DialogFooter className="p-4 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9"
                onClick={onClose}
              >
                Close View
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
