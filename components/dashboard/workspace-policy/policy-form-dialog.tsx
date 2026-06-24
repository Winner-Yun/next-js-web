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
import type { WorkspacePolicyData } from "./types";

interface PolicyFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData: WorkspacePolicyData | null;
  onSave: (data: Omit<WorkspacePolicyData, "id" | "status">) => void;
}

const defaultValues = {
  name: "",
  check_in_start: "08:00",
  check_in_end: "17:00",
  late_buffer_minutes: 15,
  deadline_scan_minutes: 30,
  annual_leave_limit: 18,
  sick_leave_limit: 6,
};

export function PolicyFormDialog({
  isOpen,
  setIsOpen,
  initialData,
  onSave,
}: PolicyFormDialogProps) {
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, isOpen]);

  const handleChange = (
    field: keyof typeof defaultValues,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden bg-background rounded-xl">
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

          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Policy Name
              </Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., HQ Standard Rules"
                className="h-10 text-sm focus-visible:border-brand"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Check-In Start
                </Label>
                <Input
                  type="time"
                  required
                  value={formData.check_in_start}
                  onChange={(e) =>
                    handleChange("check_in_start", e.target.value)
                  }
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Check-In End
                </Label>
                <Input
                  type="time"
                  required
                  value={formData.check_in_end}
                  onChange={(e) => handleChange("check_in_end", e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-10 text-sm font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-10 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-10 text-sm font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-10 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pe-6 py-6! pt-0! border-t border-muted bg-muted/10 gap-2! sm:gap-0">
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
