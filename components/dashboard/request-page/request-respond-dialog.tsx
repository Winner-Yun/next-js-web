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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { RequestStatus, WorkspaceRequest } from "./types";

interface RequestRespondDialogProps {
  request: WorkspaceRequest | null;
  onClose: () => void;
  onSave: (
    id: string,
    status: RequestStatus,
    response: string,
  ) => Promise<void> | void;
}

export function RequestRespondDialog({
  request,
  onClose,
  onSave,
}: RequestRespondDialogProps) {
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [response, setResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setResponse(request.response || "");
      setIsSaving(false);
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    setIsSaving(true);
    try {
      await onSave(request.id, status, response.trim());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={request !== null}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-125 p-2 overflow-hidden bg-background"
        onInteractOutside={(e) => isSaving && e.preventDefault()}
        onEscapeKeyDown={(e) => isSaving && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <DialogTitle className="text-base font-bold">
              Respond to Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {request?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 border-y border-muted/30">
            {request?.description && (
              <p className="text-xs text-muted-foreground bg-muted/20 border border-muted/60 rounded-lg p-3">
                {request.description}
              </p>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as RequestStatus)}
                disabled={isSaving}
              >
                <SelectTrigger className="h-9 w-full text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="seen">Seen</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="request-response"
                className="text-xs font-semibold text-foreground"
              >
                Response
              </Label>
              <Textarea
                id="request-response"
                placeholder="Write a response for the requester..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="text-xs min-h-20 bg-background/50"
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs cursor-pointer h-9 bg-brand text-white hover:bg-brand/90 px-4 transition-all"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Response"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
