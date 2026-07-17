"use client";

import { cn } from "@/lib/utils";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertCircleIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  LogOutIcon,
  XIcon,
} from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

export interface ScanNotificationData {
  kind?: "scan";
  employeeName: string;
  type: "in" | "out";
  status: "present" | "late" | "absent";
  time: string;
  date: string;
}

export interface LeaveNotificationData {
  kind: "leave";
  employeeName: string;
  leaveType: string;
  reason: string;
  time: string;
  date: string;
}

// Discriminated union so a single "active notification" slot can display
// either a scan event or a new leave request.
type NotificationItem =
  | (ScanNotificationData & { kind: "scan" })
  | LeaveNotificationData;

type ScanLog = {
  _id: string;
  status?: string;
  check_in?: string | null;
  check_out?: string | null;
  updated_at?: string;
  created_at?: string;
  date?: string;
  user?: {
    name?: string;
  };
};

type LeaveLog = {
  _id: string;
  status?: string;
  leave_type?: string;
  reason?: string;
  created_at?: string;
  date?: string;
  user?: {
    name?: string;
  };
};

interface ScanNotificationContextType {
  triggerScanNotification: (data: ScanNotificationData) => void;
  triggerLeaveNotification: (data: Omit<LeaveNotificationData, "kind">) => void;
}

const ScanNotificationContext = createContext<
  ScanNotificationContextType | undefined
>(undefined);

export function useScanNotification() {
  const context = useContext(ScanNotificationContext);
  if (!context) {
    throw new Error(
      "useScanNotification must be used within a ScanNotificationProvider",
    );
  }
  return context;
}

const fetcher = async (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) throw new Error("Failed to fetch notification logs");
  return res.json();
};

export function ScanNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspace } = useWorkspace();
  const [activeNotification, setActiveNotification] =
    useState<NotificationItem | null>(null);
  const [progress, setProgress] = useState(100);

  const workspaceId = workspace?.id;

  // Anything that arrives while a notification is already showing waits
  // here so scan alerts and leave-request alerts don't overwrite each other.
  const notificationQueueRef = useRef<NotificationItem[]>([]);

  const previousLogsRef = useRef<
    Record<string, { status: string; checkOut: string | null }>
  >({});
  const initialLoadRef = useRef(true);

  const previousLeaveIdsRef = useRef<Set<string>>(new Set());
  const initialLeaveLoadRef = useRef(true);

  const { data } = useSWR(
    workspaceId
      ? `/api/workspace/${workspaceId}/attendance?limit=5&sort_by=created_at&sort_order=desc`
      : null,
    fetcher,
    {
      refreshInterval: 4000,
      revalidateOnFocus: true,
    },
  );

  // Poll for newly submitted leave requests so admins get alerted the same
  // way they do for attendance scans.
  const { data: leaveData } = useSWR(
    workspaceId
      ? `/api/workspace/${workspaceId}/leaves?status=pending&limit=5&sort_by=created_at&sort_order=desc`
      : null,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    },
  );

  // Shows the next queued notification, if any; otherwise clears the slot.
  const showNextNotification = useCallback(() => {
    const next = notificationQueueRef.current.shift();
    if (next) {
      setProgress(100);
      setActiveNotification(next);
    } else {
      setActiveNotification(null);
    }
  }, []);

  // Adds a notification to the display slot, or queues it behind whatever
  // is currently showing.
  const enqueueNotification = useCallback((item: NotificationItem) => {
    setActiveNotification((current) => {
      if (current) {
        notificationQueueRef.current.push(item);
        return current;
      }
      setProgress(100);
      return item;
    });
  }, []);

  const triggerScanNotification = useCallback(
    async (data: ScanNotificationData) => {
      // 1. Instantly tell the AppHeader to bump the badge count
      window.dispatchEvent(new Event("notification-optimistic-add"));

      // 2. Wait 500ms so the user sees the badge change before the alert pops up
      setTimeout(() => {
        enqueueNotification({ ...data, kind: "scan" });
      }, 500);

      // 3. Prepare payload and save to DB in the background
      const payload = {
        title: data.employeeName,
        message: `${data.type === "in" ? "Check-in" : "Check-out"} marked as ${data.status}`,
        type: data.status.toUpperCase(),
      };

      if (workspaceId) {
        try {
          const token = localStorage.getItem("accessToken");
          await fetch(`/api/workspace/${workspaceId}/alerts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          // Triggers the standard SWR refresh to lock in the real database data
          window.dispatchEvent(new Event("notifications-updated"));
        } catch (error) {
          console.error("Failed to save alert to database", error);
        }
      }
    },
    [workspaceId, enqueueNotification],
  );

  const triggerLeaveNotification = useCallback(
    async (data: Omit<LeaveNotificationData, "kind">) => {
      // 1. Instantly tell the AppHeader to bump the badge count
      window.dispatchEvent(new Event("notification-optimistic-add"));

      // 2. Small delay so the badge bump is visible before the alert pops up
      setTimeout(() => {
        enqueueNotification({ ...data, kind: "leave" });
      }, 300);

      // 3. Prepare payload and save to DB in the background
      const payload = {
        title: data.employeeName,
        message: data.reason?.trim()
          ? data.reason
          : `New ${data.leaveType} request submitted`,
        type: "LEAVE_REQUEST",
      };

      if (workspaceId) {
        try {
          const token = localStorage.getItem("accessToken");
          await fetch(`/api/workspace/${workspaceId}/alerts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          window.dispatchEvent(new Event("notifications-updated"));
        } catch (error) {
          console.error("Failed to save leave alert to database", error);
        }
      }
    },
    [workspaceId, enqueueNotification],
  );

  // Detect new / changed attendance scans
  useEffect(() => {
    const logs = data?.data || [];
    if (logs.length === 0) return;

    const currentLogsMap: Record<
      string,
      { status: string; checkOut: string | null }
    > = {
      ...previousLogsRef.current,
    };

    const alertsToQueue: ScanNotificationData[] = [];

    [...logs].reverse().forEach((log: ScanLog) => {
      const logId = log._id;
      const scanStatus =
        (log.status?.toLowerCase() as "present" | "late" | "absent") ||
        "present";

      const formatTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        const safeDateStr =
          dateStr.endsWith("Z") || dateStr.includes("+")
            ? dateStr
            : `${dateStr}Z`;

        return new Date(safeDateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const checkInTime = formatTime(log.check_in);
      const checkOutTime = formatTime(log.check_out);
      const systemTime = formatTime(log.created_at);
      const dateStr =
        log.date ||
        new Date().toLocaleDateString([], { month: "short", day: "numeric" });
      const employeeName = log.user?.name || "Unknown User";

      const prevLog = previousLogsRef.current[logId];

      const isNewLog = !prevLog;
      const isStatusChanged = prevLog && prevLog.status !== scanStatus;
      const isCheckOutUpdated =
        prevLog && log.check_out && prevLog.checkOut !== log.check_out;

      if (isNewLog || isStatusChanged || isCheckOutUpdated) {
        const logTimeRaw = log.updated_at || log.created_at;
        const safeLogTimeStr = logTimeRaw
          ? logTimeRaw.endsWith("Z") || logTimeRaw.includes("+")
            ? logTimeRaw
            : `${logTimeRaw}Z`
          : new Date().toISOString();

        const logTime = new Date(safeLogTimeStr).getTime();
        const isRecent = Date.now() - logTime < 15000;

        if (!initialLoadRef.current || isRecent) {
          if (isNewLog || isStatusChanged) {
            if (checkInTime || scanStatus === "absent") {
              alertsToQueue.push({
                employeeName,
                type: "in",
                status: scanStatus,
                time: checkInTime || systemTime || "N/A",
                date: dateStr,
              });
            }
          } else if (isCheckOutUpdated && checkOutTime) {
            alertsToQueue.push({
              employeeName,
              type: "out",
              status: scanStatus,
              time: checkOutTime,
              date: dateStr,
            });
          }
        }
        currentLogsMap[logId] = {
          status: scanStatus,
          checkOut: log.check_out || null,
        };
      }
    });

    previousLogsRef.current = currentLogsMap;
    initialLoadRef.current = false;

    if (alertsToQueue.length > 0) {
      const latestAlert = alertsToQueue[alertsToQueue.length - 1];
      queueMicrotask(() => {
        triggerScanNotification(latestAlert);
      });
    }
  }, [data, triggerScanNotification]);

  // Detect newly submitted leave requests
  useEffect(() => {
    const logs: LeaveLog[] = leaveData?.data || [];
    if (logs.length === 0) return;

    const knownIds = previousLeaveIdsRef.current;
    const newAlerts: Omit<LeaveNotificationData, "kind">[] = [];

    [...logs].reverse().forEach((log) => {
      const logId = log._id;
      if (knownIds.has(logId)) return;

      const createdRaw = log.created_at;
      const safeCreatedStr = createdRaw
        ? createdRaw.endsWith("Z") || createdRaw.includes("+")
          ? createdRaw
          : `${createdRaw}Z`
        : new Date().toISOString();

      const createdTime = new Date(safeCreatedStr).getTime();
      const isRecent = Date.now() - createdTime < 15000;

      // Mark as known regardless, so it's never re-alerted on a later poll.
      knownIds.add(logId);

      if (!initialLeaveLoadRef.current || isRecent) {
        newAlerts.push({
          employeeName: log.user?.name || "Unknown User",
          leaveType: log.leave_type || "Leave",
          reason: log.reason?.trim() || "No reason provided",
          time: new Date(safeCreatedStr).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date:
            log.date ||
            new Date(safeCreatedStr).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            }),
        });
      }
    });

    initialLeaveLoadRef.current = false;

    // Queue every new request (unlike scans, each is a distinct submission
    // an admin needs to see, not just the latest state of one record).
    newAlerts.forEach((alert) => {
      queueMicrotask(() => {
        triggerLeaveNotification(alert);
      });
    });
  }, [leaveData, triggerLeaveNotification]);

  const closeNotification = useCallback(() => {
    showNextNotification();
  }, [showNextNotification]);

  useEffect(() => {
    if (!activeNotification) return;

    const duration = 4000;
    const intervalTime = 40;
    const decrementStep = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev - decrementStep <= 0) {
          clearInterval(timer);
          closeNotification();
          return 0;
        }
        return prev - decrementStep;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeNotification, closeNotification]);

  const getStatusConfig = (status: "present" | "late" | "absent") => {
    switch (status) {
      case "late":
        return {
          borderColor: "border-l-yellow-500/80",
          iconColor: "text-yellow-500",
          barColor: "bg-yellow-500",
          cardBg:
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          label: "Late Entry",
        };
      case "absent":
        return {
          borderColor: "border-l-red-500/80",
          iconColor: "text-red-500",
          barColor: "bg-red-500",
          cardBg:
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          label: "Marked Absent",
        };
      case "present":
      default:
        return {
          borderColor: "border-l-brand/80",
          iconColor: "text-brand",
          barColor: "bg-brand",
          cardBg:
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          label: "On Time",
        };
    }
  };

  // Visuals shared config for the leave-request notification variant.
  const leaveConfig = {
    borderColor: "border-l-blue-500/80",
    iconColor: "text-blue-500",
    barColor: "bg-blue-500",
    cardBg:
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    label: "New Leave Request",
  };

  return (
    <ScanNotificationContext.Provider
      value={{ triggerScanNotification, triggerLeaveNotification }}
    >
      {children}

      <div className="fixed bottom-6 right-6 z-100 w-full max-w-85 pointer-events-none px-4 sm:px-0">
        {activeNotification &&
          (() => {
            const isLeave = activeNotification.kind === "leave";
            const config = isLeave
              ? leaveConfig
              : getStatusConfig(activeNotification.status);

            return (
              <div
                className={cn(
                  "pointer-events-auto relative overflow-hidden rounded-md border shadow-lg flex flex-col transition-all duration-300 border-l-2",
                  "animate-in slide-in-from-bottom-5 fade-in",
                  config.cardBg,
                  config.borderColor,
                )}
              >
                <div className="flex items-center justify-between gap-3 px-3.5 py-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={cn("shrink-0", config.iconColor)}>
                      {isLeave ? (
                        <CalendarClockIcon className="size-4" />
                      ) : activeNotification.status === "absent" ? (
                        <AlertCircleIcon className="size-4" />
                      ) : activeNotification.type === "in" ? (
                        <CheckCircle2Icon className="size-4" />
                      ) : (
                        <LogOutIcon className="size-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {activeNotification.employeeName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        {isLeave ? (
                          <>
                            <span className="truncate">
                              {activeNotification.reason}
                            </span>
                            <span className="text-[10px] shrink-0">•</span>
                            <span className="shrink-0">{config.label}</span>
                          </>
                        ) : (
                          <>
                            {activeNotification.type === "in"
                              ? "Check-In"
                              : "Check-Out"}
                            <span className="text-[10px]">•</span>
                            {config.label}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      onClick={closeNotification}
                      className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1 hover:bg-muted/40 transition-colors"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-muted-foreground/60 select-none mr-1">
                      {activeNotification.time}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-muted/20 h-0.75 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all ease-linear",
                      config.barColor,
                    )}
                    style={{
                      width: `${progress}%`,
                      transitionDuration: "40ms",
                    }}
                  />
                </div>
              </div>
            );
          })()}
      </div>
    </ScanNotificationContext.Provider>
  );
}
