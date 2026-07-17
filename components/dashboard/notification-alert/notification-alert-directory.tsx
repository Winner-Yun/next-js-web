
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { NotificationCard } from "./notification-card";
import { NotificationEmptyState } from "./notification-empty-state";
import { NotificationHeader } from "./notification-header";
import { fetcher, type AlertRecord } from "./types";

function NotificationSkeletonLoader() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md border border-muted/40 bg-background/30 border-l-2 border-l-muted/60"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Skeleton className="size-3.5 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-40" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Skeleton className="h-3 w-20 hidden md:block" />
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="size-6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationAlertDirectory() {
  const { workspace } = useWorkspace();
  const [isClearing, setIsClearing] = useState(false);

  const [isReloading, setIsReloading] = useState(false);

  const { data, mutate, isLoading, isValidating } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/alerts` : null,
    fetcher,
    { revalidateOnFocus: true },
  );

  const notifications: AlertRecord[] = Array.isArray(data)
    ? data
    : data?.data || [];

  useEffect(() => {
    const handleUpdate = () => mutate();
    window.addEventListener("notifications-updated", handleUpdate);
    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, [mutate]);

  const handleMarkAsRead = async (alertId: string) => {
    if (!workspace?.id) return;
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`/api/workspace/${workspace.id}/alerts/${alertId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });
      await mutate();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // NEW: Handler for deleting an individual alert log
  const handleDeleteSingle = async (alertId: string) => {
    if (!workspace?.id) return;
    setIsReloading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`/api/workspace/${workspace.id}/alerts/${alertId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await mutate(); 
    } catch (error) {
      console.error("Failed to delete notification log", error);
    } finally {
      setIsReloading(false);
    }
  };

  const handleClearAll = async () => {
    if (!workspace?.id || notifications.length === 0) return;
    setIsClearing(true);
    setIsReloading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await Promise.all(
        notifications.map((n) =>
          fetch(`/api/workspace/${workspace.id}/alerts/${n.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );
      await mutate();
    } catch (error) {
      console.error("Failed to clear notifications", error);
    } finally {
      setIsClearing(false);
      setIsReloading(false);
    }
  };

  return (
    <div className="w-full space-y-4 p-px animate-in fade-in duration-300">
      <NotificationHeader
        hasNotifications={notifications.length > 0}
        isClearing={isClearing}
        onClearAll={handleClearAll}
      />

      {!workspace?.id || isLoading || isReloading || isValidating ? (
        <NotificationSkeletonLoader />
      ) : notifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-1.5">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteSingle} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
