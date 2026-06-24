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
import {
  CalendarDaysIcon,
  ClockIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { HolidayConfirmDialog } from "./holiday-confirm-dialog";
import type { Holiday } from "./types";

interface HolidayViewDialogProps {
  selectedHoliday: Holiday | null;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function HolidayViewDialog({
  selectedHoliday,
  onClose,
  onRemove,
}: HolidayViewDialogProps) {
  return (
    <Dialog
      open={!!selectedHoliday}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-106.25 p-2 overflow-hidden bg-background">
        {selectedHoliday && (
          <div className="flex flex-col">
            <DialogHeader className="p-5 pb-3 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 bg-brand/10 text-brand border-brand/20 shadow-none"
                >
                  Holiday Details
                </Badge>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-muted">
                  {selectedHoliday.id}
                </span>
              </div>
              <DialogTitle className="text-base font-bold pt-2 text-foreground">
                {selectedHoliday.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configuration context view for selected workspace exceptions.
                This date enforces structural timeline modifications.
              </DialogDescription>
            </DialogHeader>

            {/* Central Information Fields */}
            <div className="px-5 py-4 space-y-4 border-y border-muted/40 bg-muted/5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Observed Date
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <CalendarDaysIcon className="size-3.5 text-brand" />
                    <span>
                      {new Date(selectedHoliday.date).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Applicable Group
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                    <UsersIcon className="size-3.5 text-muted-foreground/80" />
                    <span>All Workspace Members</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-muted/40 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Created Configuration
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-[11px] text-muted-foreground">
                    <ClockIcon className="size-3.5" />
                    <span>
                      {new Date(selectedHoliday.created_at).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
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

              <HolidayConfirmDialog
                title="Delete Holiday Permanently?"
                description={`Are you sure you want to remove ${selectedHoliday.name}? This lifecycle event cannot be reversed.`}
                confirmText="Confirm Delete"
                onConfirm={() => {
                  onRemove(selectedHoliday.id);
                  onClose();
                }}
                variant="destructive"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <Trash2Icon className="size-3.5 mr-1.5" />
                  Remove Holiday
                </Button>
              </HolidayConfirmDialog>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
