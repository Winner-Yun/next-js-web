"use client";

import { Button } from "@/components/ui/button";
import { BellIcon, CheckCheckIcon, PlusIcon } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onCreateOpen: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onCreateOpen,
}: NotificationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted/60 pb-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <BellIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active Workspace Balance: {unreadCount} unread logs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={onMarkAllAsRead}
            className="h-10 text-xs border-muted/60 bg-background shadow-xs gap-1.5"
          >
            <CheckCheckIcon className="size-4 text-muted-foreground" /> Mark all
            as read
          </Button>
        )}
        <Button
          onClick={onCreateOpen}
          className="h-10 text-xs bg-brand text-white hover:bg-brand/90 px-4 gap-1.5 shadow-sm"
        >
          <PlusIcon className="size-4" /> Dispatch Notice
        </Button>
      </div>
    </div>
  );
}
