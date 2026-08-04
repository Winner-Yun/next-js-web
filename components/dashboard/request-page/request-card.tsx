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
import { ExternalLinkIcon, MessageSquareReplyIcon } from "lucide-react";
import { useState } from "react";
import { RequestStatusBadge } from "./request-status-badge";
import type { WorkspaceRequest } from "./types";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface RequestCardProps {
  request: WorkspaceRequest;
  onRespond: (request: WorkspaceRequest) => void;
}

export function RequestCard({ request, onRespond }: RequestCardProps) {
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);
  const openImageUrl =
    openImageIndex !== null ? request.attachments[openImageIndex] : null;

  return (
    <div className="flex flex-col gap-3 p-4 border border-muted/60 rounded-xl bg-background hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {request.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {request.description}
          </p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      {request.attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {request.attachments.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpenImageIndex(i)}
              className="cursor-pointer rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Attachment ${i + 1}`}
                className="size-14 rounded-lg object-cover border border-muted/60 hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      )}

      {request.response && (
        <div className="text-xs bg-muted/20 border border-muted/60 rounded-lg p-2.5">
          <span className="font-semibold text-foreground">Response: </span>
          <span className="text-muted-foreground">{request.response}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-muted/40">
        <span className="text-[11px] text-muted-foreground">
          {formatDate(request.created_at)}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-xs cursor-pointer"
          onClick={() => onRespond(request)}
        >
          <MessageSquareReplyIcon className="size-3.5 mr-1.5" />
          Respond
        </Button>
      </div>

      <Dialog
        open={openImageIndex !== null}
        onOpenChange={(open) => !open && setOpenImageIndex(null)}
      >
        <DialogContent className="sm:max-w-3xl p-2 bg-background">
          <DialogHeader className="px-3 pt-2">
            <DialogTitle className="text-sm font-bold">
              Attachment
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {request.title}
            </DialogDescription>
          </DialogHeader>

          {openImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={openImageUrl}
              alt="Attachment full view"
              className="w-full max-h-[75vh] object-contain rounded-md"
            />
          )}

          <DialogFooter className="px-3 pb-2 flex-row justify-end gap-2!">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
            >
              <a
                href={openImageUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon className="size-3.5 mr-1.5" />
                Open Original
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
