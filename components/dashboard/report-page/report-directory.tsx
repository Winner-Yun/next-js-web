"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { AnalyticsCharts } from "./analytics-charts";
import { DataExplorer } from "./data-explorer";
import { KpiCards } from "./kpi-cards";
import { ReportHeader } from "./report-header";
import type {
  AttendanceStatus,
  KpiSummary,
  LeaveStatus,
  WorkspaceData,
} from "./types";

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
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch analytical datasets");
  return res.json();
};

export function ReportDirectory() {
  const { workspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">(
    "attendance",
  );

  const {
    data: attendanceData,
    error: attErr,
    isLoading: attLoading,
  } = useSWR(
    workspace?.id
      ? `/api/workspace/${workspace.id}/attendance?limit=100`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const {
    data: leavesData,
    error: lvErr,
    isLoading: lvLoading,
  } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/leaves?limit=100` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const isLoading = attLoading || lvLoading;

  const workspaceData = useMemo<WorkspaceData>(() => {
    const rawAttendance = attendanceData?.data || [];
    const rawLeaves = leavesData?.data || [];

    const formatTime = (dateStr: string | null) =>
      dateStr
        ? new Date(dateStr).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null;

    return {
      attendance: rawAttendance.map((item: unknown) => ({
        id: item._id || item.id,
        name: item.user?.name || "Unknown Staff",
        role: item.user?.email || "No Data",
        date: item.date,
        checkIn: formatTime(item.check_in),
        checkOut: formatTime(item.check_out),
        hours:
          item.check_in && item.check_out
            ? Number(
                (
                  (new Date(item.check_out).getTime() -
                    new Date(item.check_in).getTime()) /
                  (1000 * 60 * 60)
                ).toFixed(2),
              )
            : 0,
        status: (item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "Absent") as AttendanceStatus,
      })),
      leaves: rawLeaves.map((item: unknown) => ({
        id: item._id || item.id,
        name: item.user?.name || "Unknown Staff",
        type: item.leave_type || "Annual Leave",
        start: item.start_date,
        end: item.end_date,
        days: item.total_days || 1,
        status: (item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "Pending") as LeaveStatus,
        attachment: item.attachment_url,
      })),
    };
  }, [attendanceData, leavesData]);

  const kpis = useMemo<KpiSummary>(() => {
    const totalEmployees = workspaceData.attendance.length;
    const presentCount = workspaceData.attendance.filter(
      (a) => a.status === "Present" || a.status === "Late",
    ).length;
    return {
      totalEmployees,
      attendanceRate:
        totalEmployees > 0
          ? Math.round((presentCount / totalEmployees) * 100)
          : 0,
      totalHours: Number(
        workspaceData.attendance
          .reduce((sum, a) => sum + a.hours, 0)
          .toFixed(1),
      ),
      pendingLeaves: workspaceData.leaves.filter((l) => l.status === "Pending")
        .length,
      approvedLeaveDays: workspaceData.leaves
        .filter((l) => l.status === "Approved")
        .reduce((sum, l) => sum + l.days, 0),
      attStatusCount: workspaceData.attendance.reduce(
        (acc, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        },
        { Present: 0, Late: 0, Absent: 0, "On Leave": 0 } as Record<
          string,
          number
        >,
      ),
      leaveTypeCount: workspaceData.leaves.reduce(
        (acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + curr.days;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }, [workspaceData]);

  const handleExportCSV = () => {
    let content = "";
    if (activeTab === "attendance") {
      content = [
        "ID,Employee,Role,Date,Check In,Check Out,Hours,Status",
        ...workspaceData.attendance.map(
          (a) =>
            `${a.id},"${a.name}","${a.role}",${a.date},${a.checkIn || "N/A"},${a.checkOut || "N/A"},${a.hours},${a.status}`,
        ),
      ].join("\n");
    } else {
      content = [
        "ID,Employee,Type,Start,End,Days,Status",
        ...workspaceData.leaves.map(
          (l) =>
            `${l.id},"${l.name}","${l.type}",${l.start},${l.end},${l.days},${l.status}`,
        ),
      ].join("\n");
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8;" }),
    );
    link.download = `${activeTab}_report.csv`;
    link.click();
  };

  if (attErr || lvErr) {
    return (
      <div className="p-8 text-center border border-destructive/20 bg-destructive/5 text-destructive rounded-xl text-sm font-semibold">
        Failed to dynamically process synchronized backend report metrics logs.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300 text-foreground">
      <ReportHeader activeTab={activeTab} onExport={handleExportCSV} />
      <DataExplorer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        workspaceData={workspaceData}
        isLoading={isLoading}
      />
      <KpiCards kpis={kpis} isLoading={isLoading} />
      <AnalyticsCharts kpis={kpis} isLoading={isLoading} />
    </div>
  );
}
