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
import { useEffect, useState } from "react";

interface HolidayCreateDialogProps {
  isOpen?: boolean;
  addHolidayDate?: string | null;
  onClose: () => void;
  onSave: (name: string, date: string) => void;
}

export function HolidayCreateDialog({
  isOpen,
  addHolidayDate,
  onClose,
  onSave,
}: HolidayCreateDialogProps) {
  const [newHolidayName, setNewHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");

  const isDialogVisible = isOpen || !!addHolidayDate;

  // Clean form input state when window toggle updates
  useEffect(() => {
    if (isDialogVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewHolidayName("");
      setHolidayDate(addHolidayDate || "");
    }
  }, [isDialogVisible, addHolidayDate]);

  const handleSaveNewHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !holidayDate) return;

    onSave(newHolidayName, holidayDate);
  };

  return (
    <Dialog open={isDialogVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25 p-2 overflow-hidden bg-background">
        <form onSubmit={handleSaveNewHoliday} className="flex flex-col">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <DialogTitle className="text-base font-bold">
              Schedule New Holiday
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a public holiday or non-working day for the workspace
              schedule.
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4"
              disabled={!newHolidayName.trim() || !holidayDate}
            >
              Save Holiday
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
