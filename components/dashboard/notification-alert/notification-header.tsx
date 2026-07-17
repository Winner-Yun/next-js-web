"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";

type NotificationHeaderProps = {
  hasNotifications: boolean;
  isClearing: boolean;
  onClearAll: () => void;
};

export function NotificationHeader({
  hasNotifications,
  isClearing,
  onClearAll,
}: NotificationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notification Logs
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time feed of face-recognition scan database changes.
        </p>
      </div>

      {hasNotifications && (
        <Button
          variant="outline"
          size="sm"
          disabled={isClearing}
          onClick={onClearAll}
          className="cursor-pointer text-xs h-9 border-muted/60 bg-background text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isClearing ? (
            <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
          ) : (
            <Trash2Icon className="size-3.5 mr-1.5" />
          )}
          {isClearing ? "Clearing..." : "Clear Feed"}
        </Button>
      )}
    </div>
  );
}
