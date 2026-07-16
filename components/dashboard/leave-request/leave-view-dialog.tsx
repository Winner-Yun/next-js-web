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
  CheckIcon,
  Edit2Icon,
  FileTextIcon,
  Loader2,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { LeaveStatusBadge } from "./leave-status-badge";
import type { LeaveRequest } from "./types";

interface LeaveViewDialogProps {
  selectedRequest: LeaveRequest | null;
  onClose: () => void;
  onStatusChange: (
    id: string,
    nextStatus: "Approved" | "Rejected",
  ) => Promise<void>;
  onEditTrigger: (request: LeaveRequest) => void;
}

export function LeaveViewDialog({
  selectedRequest,
  onClose,
  onStatusChange,
  onEditTrigger,
}: LeaveViewDialogProps) {
  // Track which action is currently processing
  const [loadingAction, setLoadingAction] = useState<
    "Approved" | "Rejected" | null
  >(null);

  const isProcessing = loadingAction !== null;

  const handleAction = async (status: "Approved" | "Rejected") => {
    if (!selectedRequest) return;
    setLoadingAction(status);
    try {
      await onStatusChange(selectedRequest.id, status);
      // The parent component handles setting the selected request to null on success,
      // which will naturally unmount/close this dialog.
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Dialog
      open={!!selectedRequest}
      // Prevent standard open/close events while processing
      onOpenChange={(open) => !open && !isProcessing && onClose()}
    >
      <DialogContent
        className="sm:max-w-106.25 p-4 overflow-hidden bg-background"
        // Prevent closing by clicking outside or pressing Escape while loading
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
      >
        {selectedRequest && (
          <div className="flex flex-col">
            <DialogHeader className="p-5 pb-3 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 bg-brand/10 text-brand border-brand/20 shadow-none"
                >
                  Application Matrix
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold pt-3 text-foreground">
                {selectedRequest.employeeName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedRequest.role} • Submitted on{" "}
                {new Date(selectedRequest.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-4 space-y-4 border-y border-muted/40 bg-muted/5">
              <div className="grid grid-cols-2 gap-4 border-b border-muted/40 pb-3">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Leave Classification
                  </span>
                  <span className="text-xs font-bold text-foreground block pt-1">
                    {selectedRequest.leaveType}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Approval Metric
                  </span>
                  <div className="flex justify-end pt-1">
                    <LeaveStatusBadge status={selectedRequest.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Starting Range
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <CalendarDaysIcon className="size-3.5 text-brand" />
                    <span>
                      {new Date(selectedRequest.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                    Concluding Range
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <CalendarDaysIcon className="size-3.5 text-brand" />
                    <span>
                      {new Date(selectedRequest.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-muted/40 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                  <FileTextIcon className="size-3.5 text-muted-foreground/60" />
                  Declared Reason
                </span>

                <p className="text-xs leading-relaxed text-foreground bg-background p-2.5 rounded-lg border border-muted/60 italic font-normal">
                  &quot;{selectedRequest.reason}&quot;
                </p>
              </div>

              <div className="pt-2 border-t border-muted/40 flex justify-between items-center">
                <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                  Duration Allotment
                </span>
                <span className="font-mono text-xs font-bold text-foreground bg-muted/80 px-2 py-0.5 border rounded">
                  {selectedRequest.totalDays}{" "}
                  {selectedRequest.totalDays === 1 ? "Day" : "Days"}
                </span>
              </div>
            </div>

            <DialogFooter className="p-4 bg-muted/20 flex items-center justify-between gap-2 shrink-0">
              {selectedRequest.attachmentUrl && (
                <div className=" p-3 bg-muted/30 rounded-md border border-muted">
                  <a
                    href={selectedRequest.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-xs text-brand hover:underline flex items-center gap-1 ${
                      isProcessing ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Click to view attachment
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs cursor-pointer h-9"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Close
                </Button>
                {/* Condition added here: Only show Edit when status is NOT Pending */}
                {selectedRequest.status !== "Pending" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs cursor-pointer h-9 gap-1 hover:text-foreground"
                    onClick={() => onEditTrigger(selectedRequest)}
                    disabled={isProcessing}
                  >
                    <Edit2Icon className="size-3" /> Edit
                  </Button>
                )}
              </div>

              {selectedRequest.status === "Pending" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs h-9 cursor-pointer border-destructive/40 text-destructive hover:bg-destructive/10 gap-1"
                    onClick={() => handleAction("Rejected")}
                    disabled={isProcessing}
                  >
                    {loadingAction === "Rejected" ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <XIcon className="size-3.5" />
                    )}
                    Reject
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="text-xs h-9 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500 gap-1"
                    onClick={() => handleAction("Approved")}
                    disabled={isProcessing}
                  >
                    {loadingAction === "Approved" ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckIcon className="size-3.5" />
                    )}
                    Approve
                  </Button>
                </div>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
