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
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Holiday } from "./types";

interface HolidayCreateDialogProps {
  isOpen?: boolean;
  addHolidayDate?: string | null;
  editHoliday?: Holiday | null;
  onClose: () => void;
  // Updated to support async operations
  onSave: (name: string, date: string, id?: string) => Promise<void> | void;
}

export function HolidayCreateDialog({
  isOpen,
  addHolidayDate,
  editHoliday,
  onClose,
  onSave,
}: HolidayCreateDialogProps) {
  const [newHolidayName, setNewHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isDialogVisible = isOpen || !!addHolidayDate || !!editHoliday;

  useEffect(() => {
    if (isDialogVisible) {
      setNewHolidayName(editHoliday?.name || "");
      setHolidayDate(editHoliday?.date || addHolidayDate || "");
      setIsSaving(false); // Reset saving state when opened
    }
  }, [isDialogVisible, addHolidayDate, editHoliday]);

  const handleSaveNewHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !holidayDate) return;

    setIsSaving(true);
    try {
      await onSave(newHolidayName, holidayDate, editHoliday?.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isDialogVisible}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-106.25 p-2 overflow-hidden bg-background"
        // Prevent closing by clicking outside or pressing escape while saving
        onInteractOutside={(e) => isSaving && e.preventDefault()}
        onEscapeKeyDown={(e) => isSaving && e.preventDefault()}
      >
        <form onSubmit={handleSaveNewHoliday} className="flex flex-col">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <DialogTitle className="text-base font-bold">
              {editHoliday ? "Edit Holiday" : "Schedule New Holiday"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editHoliday
                ? "Update the configuration for this specific holiday."
                : "Define a public holiday or non-working day for the workspace schedule."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 border-y border-muted/30">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-foreground"
              >
                Holiday Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Independence Day"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                className="text-xs h-9 bg-background/50"
                autoFocus
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="date"
                className="text-xs font-semibold text-foreground"
              >
                Holiday Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className="text-xs h-9 bg-background/50"
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4 transition-all"
              disabled={isSaving || !newHolidayName.trim() || !holidayDate}
            >
              {isSaving ? (
                <>
                  <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : editHoliday ? (
                "Save Changes"
              ) : (
                "Save Holiday"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
