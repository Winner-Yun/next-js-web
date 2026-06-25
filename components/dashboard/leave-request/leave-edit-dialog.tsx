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
import { Label } from "@/components/ui/label";
import { ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { LeaveRequest, LeaveStatus } from "./types";

interface LeaveEditDialogProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
  onSave: (id: string, nextStatus: LeaveStatus) => void; // Only passing status back now
}

const STATUS_OPTIONS: LeaveStatus[] = ["Pending", "Approved", "Rejected"];

export function LeaveEditDialog({
  isOpen,
  request,
  onClose,
  onSave,
}: LeaveEditDialogProps) {
  const [status, setStatus] = useState<LeaveStatus>("Pending");

  useEffect(() => {
    if (isOpen && request) {
      setStatus(request.status);
    }
  }, [isOpen, request]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    onSave(request.id, status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-96 p-2 overflow-hidden bg-background">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <div className="flex items-center gap-2 text-brand">
              <ShieldCheckIcon className="size-4.5 text-amber-500" />
              <DialogTitle className="text-base font-bold">
                Admin Status Override
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Authorized admin control panel for request{" "}
              <span className="font-mono font-bold text-foreground">
                {request?.id}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {/* Context Display (Read Only) */}
          <div className="px-5 py-4 space-y-4 border-y border-muted/30 bg-muted/5">
            <div className="text-xs space-y-1.5 bg-background p-3 rounded-lg border border-muted/60">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee:</span>
                <span className="font-bold text-foreground">
                  {request?.employeeName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">
                  {request?.leaveType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-mono text-foreground font-semibold">
                  {request?.startDate} to {request?.endDate} (
                  {request?.totalDays} days)
                </span>
              </div>
            </div>

            {/* Only Editable Field: LeaveStatus */}
            <div className="space-y-2">
              <Label
                htmlFor="adminStatusSelect"
                className="text-xs font-bold text-foreground block"
              >
                Modify Application Status *
              </Label>
              <select
                id="adminStatusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeaveStatus)}
                className="w-full h-10 rounded-md border-2 border-brand/30 bg-background px-3 py-1 text-xs font-semibold shadow-xs transition-colors focus-visible:outline-hidden cursor-pointer focus-visible:border-brand"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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
            >
              Apply Override
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
