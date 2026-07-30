"use client";

import { Button } from "@/components/ui/button";
import { MessageSquareReplyIcon, Trash2Icon } from "lucide-react";
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
  onDelete: (request: WorkspaceRequest) => void;
}

export function RequestCard({
  request,
  onRespond,
  onDelete,
}: RequestCardProps) {
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Attachment ${i + 1}`}
              className="size-14 rounded-lg object-cover border border-muted/60"
            />
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
        <div className="flex items-center gap-1.5">
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
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => onDelete(request)}
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
