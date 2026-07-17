
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  Check,
  CheckCircle2Icon,
  ChevronDownIcon,
  Loader2,
  LogOutIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { AlertRecord } from "./types";

type NotificationCardProps = {
  notification: AlertRecord;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const formatLocalTime = (utcString?: string) => {
  if (!utcString) return { time: "Unknown", date: "", full: "Unknown" };

  const [datePart, timePart] = utcString.split(" ");
  let isoString = utcString;

  if (datePart && timePart) {
    const msPart = timePart.split(".")[1]?.substring(0, 3) || "000";
    const mainTime = timePart.split(".")[0];
    isoString = `${datePart}T${mainTime}.${msPart}Z`;
  } else if (!isoString.endsWith("Z")) {
    isoString += "Z";
  }

  const dateObj = new Date(isoString);

  return {
    time: dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: dateObj.toLocaleDateString([], { month: "short", day: "numeric" }),
    full: dateObj.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };
};

const getStatusStyles = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "LATE":
      return {
        borderColor: "border-l-yellow-500/80",
        iconColor: "text-yellow-500",
        bgColor: "hover:bg-yellow-500/[0.04]",
        badge: "bg-yellow-500/10 text-yellow-600",
      };
    case "ABSENT":
      return {
        borderColor: "border-l-red-500/80",
        iconColor: "text-red-500",
        bgColor: "hover:bg-red-500/[0.04]",
        badge: "bg-red-500/10 text-red-600",
      };
    case "PRESENT":
    default:
      return {
        borderColor: "border-l-brand/80",
        iconColor: "text-brand",
        bgColor: "hover:bg-brand/[0.04]",
        badge: "bg-brand/10 text-brand",
      };
  }
};

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusStyle = getStatusStyles(notification.type);
  const localTime = formatLocalTime(notification.created_at);
  const isCheckOut = notification.message?.toLowerCase().includes("out");

  const handleRowClick = async () => {
    setIsExpanded((prev) => !prev);

    if (!notification.is_read && !isUpdating) {
      setIsUpdating(true);
      await onMarkAsRead(notification.id);
      setIsUpdating(false);
    }
  };

  const handleReadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);
    await onMarkAsRead(notification.id);
    setIsUpdating(false);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(notification.id);
    setIsDeleting(false);
  };

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "group relative flex flex-col px-3.5 py-2.5 rounded-md border border-muted/40 bg-background/30 transition-all duration-150 border-l-2 cursor-pointer",
        statusStyle.borderColor,
        statusStyle.bgColor,
        notification.is_read
          ? "opacity-60 bg-muted/2 border-muted/20"
          : "shadow-sm hover:border-muted/80",
      )}
    >
      {/* --- Main Collapsed Row --- */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className={cn("shrink-0", statusStyle.iconColor)}>
            {notification.type === "ABSENT" ? (
              <AlertCircleIcon className="size-3.5" />
            ) : !isCheckOut ? (
              <CheckCircle2Icon className="size-3.5" />
            ) : (
              <LogOutIcon className="size-3.5" />
            )}
          </div>

          <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span
              className={cn(
                "text-xs font-semibold text-foreground truncate",
                notification.is_read && "text-muted-foreground font-medium",
              )}
            >
              {notification.title || "System Alert"}
            </span>
            <span className="hidden sm:inline text-muted-foreground/30 text-[10px]">
              •
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {notification.message}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground/60 select-none mr-1 hidden md:block">
            {localTime.time} • {localTime.date}
          </span>

          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              disabled={isUpdating || isDeleting}
              onClick={handleReadClick}
              className="h-6 w-6 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
              title="Mark as read"
            >
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            disabled={isUpdating || isDeleting}
            onClick={handleDeleteClick}
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            title="Delete log"
          >
            {isDeleting ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Trash2Icon className="size-3" />
            )}
          </Button>

          <ChevronDownIcon
            className={cn(
              "size-3.5 text-muted-foreground/50 transition-transform ml-1",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* --- Expanded Detail View (Log ID Removed) --- */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-muted/20 text-xs flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-[80px_1fr] gap-2">
            <span className="text-muted-foreground font-medium">Status</span>
            <div>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase",
                  statusStyle.badge,
                )}
              >
                {notification.type || "UNKNOWN"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-2">
            <span className="text-muted-foreground font-medium">Message</span>
            <span className="text-foreground leading-relaxed">
              {notification.message || "No details provided."}
            </span>
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-2">
            <span className="text-muted-foreground font-medium">Timestamp</span>
            <span className="text-foreground font-mono">{localTime.full}</span>
          </div>
        </div>
      )}
    </div>
  );
}
