"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  HistoryIcon,
  InfoIcon,
} from "lucide-react";
import { DispatcherForm } from "./dispatcher-form";

export function NotificationDirectory() {
  const { workspace } = useWorkspace();

  // Mock historic context data to populate the right audit track panel
  const recentLogs = [
    {
      id: "NTF-902",
      title: "Operational Alert",
      message: "This is a new notification",
      type: "success",
      time: "2 hours ago",
      target: "Global Broadcast",
    },
    {
      id: "NTF-841",
      title: "Emergency Architecture",
      message: "Please review the updated architecture guidelines.",
      type: "warning",
      time: "Yesterday at 4:15 PM",
      target: "Global Broadcast",
    },
    {
      id: "NTF-703",
      title: "Quarterly Performance Metrics",
      message: "Please review the quarterly performance metrics.",
      type: "info",
      time: "3 days ago",
      target: "Specific Member",
    },
  ];

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      {/* Page Header */}
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

      {/* Two-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Left Side: Main Form Action Input Controls */}
        <div className="lg:col-span-2 w-full">
          <DispatcherForm />
        </div>

        {/* Right Side: historic audit tracking list resolving space anomalies */}
        <div className="lg:col-span-1 bg-background rounded-xl border border-muted/60 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-muted/40">
            <HistoryIcon className="size-4 text-brand shrink-0" />
            <h2 className="text-sm font-bold text-foreground">
              Recent Workspace Dispatches
            </h2>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="group relative flex gap-3 p-3 rounded-lg border border-muted/40 bg-muted/5 transition-all hover:bg-muted/10"
              >
                {/* Micro Type Status Badges */}
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
                    <span className="text-[10px] bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                      {log.target}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug truncate">
                    {log.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    {log.time}
                  </p>
                </div>
              </div>
            ))}

            {recentLogs.length === 0 && (
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
