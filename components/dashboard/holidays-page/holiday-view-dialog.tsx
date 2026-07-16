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
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { HolidayConfirmDialog } from "./holiday-confirm-dialog";
import type { Holiday } from "./types";

interface HolidayViewDialogProps {
  selectedHoliday: Holiday | null;
  onClose: () => void;
  // Updated typing to accept async remove functions
  onRemove: (id: string) => Promise<void> | void;
  onEdit: (holiday: Holiday) => void;
}

export function HolidayViewDialog({
  selectedHoliday,
  onClose,
  onRemove,
  onEdit,
}: HolidayViewDialogProps) {
  if (!selectedHoliday) return null;

  const isPublicHoliday = selectedHoliday.id.startsWith("public-");

  return (
    <Dialog
      open={!!selectedHoliday}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background">
        <DialogHeader className="p-5 pb-4 border-b border-muted/30">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <CalendarIcon className="size-5 text-brand" />
            {selectedHoliday.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {isPublicHoliday
              ? "This is an auto-generated public holiday."
              : "Workspace custom holiday."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Date
            </span>
            <span className="text-sm font-medium">
              {new Date(selectedHoliday.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <DialogFooter className="p-5 pt-2! bg-muted/20 flex items-center justify-end gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer h-9"
          >
            Close
          </Button>

          {!isPublicHoliday && (
            <>
              <HolidayConfirmDialog
                title="Delete Holiday"
                description={`Are you sure you want to permanently delete "${selectedHoliday.name}"?`}
                confirmText="Delete"
                onConfirm={async () => {
                  // Await the deletion process completely before triggering onClose
                  await onRemove(selectedHoliday.id);
                  onClose();
                }}
                variant="destructive"
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs cursor-pointer h-9 px-3"
                >
                  <TrashIcon className="size-3.5 mr-1.5" /> Delete
                </Button>
              </HolidayConfirmDialog>

              <Button
                size="sm"
                onClick={() => {
                  onEdit(selectedHoliday);
                  onClose();
                }}
                className="text-xs cursor-pointer h-9 bg-brand text-white hover:bg-brand/90 px-3"
              >
                <EditIcon className="size-3.5 mr-1.5" /> Edit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
