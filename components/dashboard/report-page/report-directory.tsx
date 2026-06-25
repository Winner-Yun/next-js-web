"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import { useMemo, useState } from "react";
import { AnalyticsCharts } from "./analytics-charts";
import { DataExplorer } from "./data-explorer";
import { KpiCards } from "./kpi-cards";
import { WORKSPACE_REPORT_DB } from "./mock-data";
import { ReportHeader } from "./report-header";
import type { KpiSummary } from "./types";

export function ReportDirectory() {
  const { workspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">(
    "attendance",
  );

  // Dynamic contextual dictionary resolution
  const workspaceData = useMemo(() => {
    return WORKSPACE_REPORT_DB[workspace.id] || { attendance: [], leaves: [] };
  }, [workspace.id]);

  // Comprehensive Metrics Aggregation Engine
  const kpis = useMemo<KpiSummary>(() => {
    const totalEmployees = workspaceData.attendance.length;
    const presentOrLate = workspaceData.attendance.filter(
      (a) => a.status === "Present" || a.status === "Late",
    ).length;
    const attendanceRate =
      totalEmployees > 0
        ? Math.round((presentOrLate / totalEmployees) * 100)
        : 0;
    const totalHours = workspaceData.attendance.reduce(
      (sum, a) => sum + (a.hours || 0),
      0,
    );

    const attStatusCount = workspaceData.attendance.reduce(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const pendingLeaves = workspaceData.leaves.filter(
      (l) => l.status === "Pending",
    ).length;
    const approvedLeaveDays = workspaceData.leaves
      .filter((l) => l.status === "Approved")
      .reduce((sum, l) => sum + l.days, 0);

    const leaveTypeCount = workspaceData.leaves.reduce(
      (acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.days;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalEmployees,
      attendanceRate,
      totalHours,
      pendingLeaves,
      approvedLeaveDays,
      attStatusCount,
      leaveTypeCount,
    };
  }, [workspaceData]);

  // Dynamic file downloads execution handler
  const handleExportCSV = () => {
    let content = "";
    let filename = "";

    if (activeTab === "attendance") {
      const headers = [
        "ID",
        "Employee",
        "Role",
        "Date",
        "Check In",
        "Check Out",
        "Hours",
        "Status",
      ];
      content = [
        headers.join(","),
        ...workspaceData.attendance.map((a) =>
          [
            a.id,
            `"${a.name}"`,
            `"${a.role}"`,
            a.date,
            a.checkIn || "N/A",
            a.checkOut || "N/A",
            a.hours,
            a.status,
          ].join(","),
        ),
      ].join("\n");
      filename = `attendance_report_${workspace.id}.csv`;
    } else {
      const headers = [
        "ID",
        "Employee",
        "Classification",
        "Start",
        "End",
        "Days",
        "Status",
        "Attachment",
      ];
      content = [
        headers.join(","),
        ...workspaceData.leaves.map((l) =>
          [
            l.id,
            `"${l.name}"`,
            `"${l.type}"`,
            l.start,
            l.end,
            l.days,
            l.status,
            l.attachment ? `"${l.attachment}"` : "N/A",
          ].join(","),
        ),
      ].join("\n");
      filename = `leave_report_${workspace.id}.csv`;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8;" }),
    );
    link.download = filename;
    link.click();
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300 print:p-8 print:bg-white text-foreground">
      <ReportHeader
        workspaceName={workspace.name}
        activeTab={activeTab}
        onExport={handleExportCSV}
      />
      <DataExplorer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        workspaceData={workspaceData}
      />
      <KpiCards kpis={kpis} />
      <AnalyticsCharts kpis={kpis} />
    </div>
  );
}
