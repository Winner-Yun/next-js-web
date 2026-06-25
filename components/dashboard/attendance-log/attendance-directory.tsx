/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  FileSpreadsheetIcon,
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AttendanceCard } from "./attendance-card";
import { AttendanceTable } from "./attendance-table";
import { AttendanceViewDialog } from "./attendance-view-dialog";
import type { AttendanceRecord } from "./types";

export function AttendanceDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("attendanceViewMode");
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (val: string) => {
    const newMode = val as "list" | "grid";
    setViewMode(newMode);
    localStorage.setItem("attendanceViewMode", newMode);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const [logsData, setLogsData] = useState<Record<string, AttendanceRecord[]>>({
    worksmart: [
      {
        id: "ATT-001",
        employeeName: "Sok Chamroeun",
        role: "Frontend Engineer",
        date: new Date().toISOString().split("T")[0],
        checkIn: "08:24 AM",
        checkOut: "05:30 PM",
        hoursWorked: 8.5,
        status: "Present",
      },
      {
        id: "ATT-002",
        employeeName: "Chan Eliza",
        role: "UI/UX Designer",
        date: new Date().toISOString().split("T")[0],
        checkIn: "09:15 AM",
        checkOut: "05:00 PM",
        hoursWorked: 7.75,
        status: "Late",
      },
      {
        id: "ATT-003",
        employeeName: "Nguon Rotha",
        role: "DevOps Engineer",
        date: new Date().toISOString().split("T")[0],
        checkIn: "08:02 AM",
        checkOut: "06:00 PM",
        hoursWorked: 9.5,
        status: "Present",
      },
      {
        id: "ATT-004",
        employeeName: "Kemp Sophea",
        role: "QA & Testing",
        date: new Date().toISOString().split("T")[0],
        checkIn: null,
        checkOut: null,
        hoursWorked: 0,
        status: "Absent",
      },
    ],
  });

  // Extract the logs for the currently active workspace
  const currentWorkspaceLogs = useMemo(() => {
    return logsData[workspace.id] || [];
  }, [logsData, workspace.id]);

  // Apply filters to the current workspace's logs
  const filteredLogs = useMemo(() => {
    return currentWorkspaceLogs.filter((log) => {
      const matchesSearch =
        log.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        log.role.toLowerCase().includes(search.toLowerCase()) ||
        log.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;
      const matchesDate = log.date === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [currentWorkspaceLogs, search, statusFilter, selectedDate]);

  // --- EXPORT LOGIC ---

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const headers = [
      "Log ID",
      "Employee Name",
      "Role",
      "Date",
      "Check In",
      "Check Out",
      "Total Hours",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.id,
          `"${log.employeeName}"`,
          `"${log.role}"`,
          log.date,
          log.checkIn || "N/A",
          log.checkOut || "N/A",
          log.hoursWorked || 0,
          log.status,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_logs_${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV file exported successfully!");
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Attendance Directory
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active Context Directory:{" "}
            <span className="font-semibold text-brand">{workspace.name}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Enhanced Date Picker with "Today" Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 text-xs font-medium px-4 shadow-xs shrink-0"
              onClick={handleTodayClick}
            >
              Today
            </Button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-muted/10 h-10 text-xs w-full sm:w-40 font-medium"
            />
          </div>

          {/* Working Export Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="h-10 text-xs border-muted/60 bg-background shadow-xs gap-1.5"
            >
              <FileSpreadsheetIcon className="size-3.5 text-brand" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-3 rounded-xl border border-muted/60">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search employee, role, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-9 text-xs shadow-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-background p-1 border border-muted/60 rounded-lg shrink-0">
            {["All", "Present", "Late", "Absent", "On Leave"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                  statusFilter === status
                    ? "bg-brand text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={handleViewModeChange}
          className="h-9 shrink-0"
        >
          <TabsList className="h-9 p-1 bg-background border border-muted/60">
            <TabsTrigger
              value="list"
              className="text-xs h-7 px-3 gap-1.5 data-[state=active]:bg-muted data-[state=active]:shadow-none"
            >
              <ListIcon className="size-3.5" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="text-xs h-7 px-3 gap-1.5 data-[state=active]:bg-muted data-[state=active]:shadow-none"
            >
              <LayoutGridIcon className="size-3.5" />
              Grid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" ? (
        <AttendanceTable logs={filteredLogs} onRowClick={setSelectedLog} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredLogs.map((log) => (
            <AttendanceCard
              key={log.id}
              log={log}
              onClick={() => setSelectedLog(log)}
            />
          ))}

          {filteredLogs.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted/40 p-3 mb-3">
                <SearchIcon className="size-5 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium">No attendance records found</p>
            </div>
          )}
        </div>
      )}

      {/* Render the View Dialog */}
      <AttendanceViewDialog
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
