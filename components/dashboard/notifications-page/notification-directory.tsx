"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  HistoryIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";
import useSWR from "swr";
import { DispatcherForm } from "./dispatcher-form";

const apiFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const formatTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export function NotificationDirectory() {
  const { workspace } = useWorkspace();

  // Fetch real notification logs
  const {
    data: notificationsData,
    isLoading,
    mutate,
  } = useSWR(
    workspace?.id ? `/api/notification/${workspace.id}` : null,
    apiFetcher,
  );

  // Parse payload array safely
  const recentLogs = Array.isArray(notificationsData)
    ? notificationsData
    : notificationsData?.data || [];

  // Sort logs by newest first if created_at exists
  const sortedLogs = [...recentLogs].sort((a, b) => {
    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Push Notification Dispatcher
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Broadcast operational updates or trigger real-time tailored alerts
            across the workspace boundary.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        <div className="lg:col-span-2 w-full">
          {/* Pass mutate function so the form can refresh the sidebar list instantly */}
          <DispatcherForm onDispatchSuccess={() => mutate()} />
        </div>

        <div className="lg:col-span-1 bg-background rounded-xl border border-muted/60 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-muted/40">
            <HistoryIcon className="size-4 text-brand shrink-0" />
            <h2 className="text-sm font-bold text-foreground">
              Recent Workspace Dispatches
            </h2>
          </div>

          <div className="space-y-3">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                <Loader2Icon className="size-5 animate-spin" />
                <span className="text-xs">Syncing logs...</span>
              </div>
            )}

            {!isLoading &&
              sortedLogs.map((log: unknown) => (
                <div
                  key={log.id || log._id}
                  className="group relative flex gap-3 p-3 rounded-lg border border-muted/40 bg-muted/5 transition-all hover:bg-muted/10"
                >
                  <div className="mt-0.5 shrink-0">
                    {log.type === "success" && (
                      <CheckCircle2Icon className="size-4 text-emerald-500" />
                    )}
                    {log.type === "warning" && (
                      <AlertCircleIcon className="size-4 text-amber-500" />
                    )}
                    {log.type === "info" && (
                      <InfoIcon className="size-4 text-blue-500" />
                    )}
                  </div>

                  <div className="space-y-1 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        {log.title}
                      </span>
                      <span className="text-[10px] bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground font-medium truncate max-w-25">
                        {log.target === "global"
                          ? "Global Broadcast"
                          : "Specific Member"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-snug truncate">
                      {log.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {formatTime(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}

            {!isLoading && sortedLogs.length === 0 && (
              <div className="text-center py-8 border border-dashed border-muted-foreground/20 rounded-xl bg-muted/5">
                <p className="text-xs text-muted-foreground">
                  No previous dispatch indices recorded under{" "}
                  {workspace?.name || "active context"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
