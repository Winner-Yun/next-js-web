/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileSpreadsheetIcon,
  LayoutGridIcon,
  ListIcon,
  Loader2Icon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { AttendanceCard } from "./attendance-card";
import { AttendanceTable } from "./attendance-table";
import { AttendanceViewDialog } from "./attendance-view-dialog";
import type { AttendanceRecord, AttendanceStatus } from "./types";

// Date helpers to ensure local timezone formatting (Prevents UTC mismatch issues)
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const getThisMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

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

  if (res.status === 401) {
    toast.error("Session expired. Please log in again.");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to fetch data",
    );
  }

  return res.json();
};

export function AttendanceDirectory() {
  const { workspace } = useWorkspace();

  // Mounting tracker to defer client-side layout states safely
  const [mounted, setMounted] = useState(false);

  // Filtering, Sorting, and View State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null);

  // Server-safe default initializations
  const [filterType, setFilterType] = useState<"exact" | "month" | "all">(
    "exact",
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [page, setPage] = useState(1);
  const limit = 5;

  // Hydrate client-side settings from localStorage after safe mount
  useEffect(() => {
    const savedFilter = localStorage.getItem("attendanceFilterType") as
      | "exact"
      | "month"
      | "all";
    if (savedFilter) setFilterType(savedFilter);

    const savedDate = localStorage.getItem("attendanceSelectedDate");
    setSelectedDate(savedDate || getTodayStr());

    const savedMonth = localStorage.getItem("attendanceSelectedMonth");
    setSelectedMonth(savedMonth || getThisMonthStr());

    const savedMode = localStorage.getItem("attendanceViewMode");
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }

    setMounted(true);
  }, []);

  // Sync Date Filters to LocalStorage when they change (Only after mounting)
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("attendanceFilterType", filterType);
    localStorage.setItem("attendanceSelectedDate", selectedDate);
    localStorage.setItem("attendanceSelectedMonth", selectedMonth);
  }, [filterType, selectedDate, selectedMonth, mounted]);

  // Handle Input Debouncing smoothly for SWR keys
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters, sorting, or dates change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    statusFilter,
    sortBy,
    sortOrder,
    filterType,
    selectedDate,
    selectedMonth,
  ]);

  // Dynamic Query Parameter Construction for SWR
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (debouncedSearch) params.append("search", debouncedSearch);
    if (statusFilter !== "All")
      params.append("status", statusFilter.toLowerCase());

    if (filterType === "exact" && selectedDate) {
      params.append("exact_date", selectedDate);
    } else if (filterType === "month" && selectedMonth) {
      params.append("month_year", selectedMonth);
    }

    return params.toString();
  }, [
    page,
    sortBy,
    sortOrder,
    debouncedSearch,
    statusFilter,
    filterType,
    selectedDate,
    selectedMonth,
  ]);

  const { data, isLoading, isValidating } = useSWR(
    workspace?.id
      ? `/api/workspace/${workspace.id}/attendance?${queryParams}`
      : null,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const totalPages = Math.ceil((data?.total || 0) / limit);

  // Transform raw backend logs into mapped UI data elements
  const logs = useMemo<AttendanceRecord[]>(() => {
    return (data?.data || []).map((item: unknown) => {
      let hoursWorked = 0;
      if (item.check_in && item.check_out) {
        const start = new Date(item.check_in).getTime();
        const end = new Date(item.check_out).getTime();
        hoursWorked = (end - start) / (1000 * 60 * 60);
      }

      const statusMap: Record<string, string> = {
        present: "Present",
        late: "Late",
        absent: "Absent",
      };

      const formatTime = (dateStr: string | null) =>
        dateStr
          ? new Date(dateStr).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null;

      return {
        id: item._id,
        employeeName: item.user?.name || "Unknown",
        role: item.user?.email || "No Email",
        date: item.date,
        checkIn: formatTime(item.check_in),
        checkOut: formatTime(item.check_out),
        hoursWorked: hoursWorked > 0 ? hoursWorked : null,
        status: (statusMap[item.status?.toLowerCase()] ||
          "Absent") as AttendanceStatus,
      };
    });
  }, [data]);

  const handleViewModeChange = (val: string) => {
    const newMode = val as "list" | "grid";
    setViewMode(newMode);
    localStorage.setItem("attendanceViewMode", newMode);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
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
      ...logs.map((log) =>
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

    let timeLabel = "all_time";
    if (filterType === "exact") timeLabel = selectedDate;
    if (filterType === "month") timeLabel = selectedMonth;

    link.download = `attendance_logs_${timeLabel}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV file exported successfully!");
  };

  // Safely compute conditional checks only if mounted to match server output attributes initially
  const todayStr = getTodayStr();
  const isToday = mounted ? selectedDate === todayStr : false;

  const thisMonthStr = getThisMonthStr();
  const isThisMonth = mounted ? selectedMonth === thisMonthStr : false;

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Attendance Directory
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "exact" | "month" | "all")
              }
              disabled={isLoading}
              className="bg-background h-10 text-xs border border-muted/60 rounded-md px-2 shadow-sm outline-none focus:ring-1 focus:ring-brand font-medium text-foreground cursor-pointer disabled:opacity-50"
            >
              <option value="exact">Exact Date</option>
              <option value="month">Month & Year</option>
              <option value="all">All Time</option>
            </select>

            {filterType === "exact" && (
              <>
                <Button
                  variant={isToday ? "outline" : "default"}
                  size="sm"
                  className={`hidden sm:flex h-10 text-xs font-medium px-4 shadow-xs shrink-0 transition-colors ${
                    isToday
                      ? "border-muted/60 "
                      : "bg-brand text-white hover:bg-brand/90 border-transparent "
                  }`}
                  onClick={() => setSelectedDate(todayStr)}
                  disabled={isLoading || isToday}
                >
                  Today
                </Button>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted/10 h-10 text-xs w-full sm:w-40 font-medium disabled:opacity-50"
                />
              </>
            )}

            {filterType === "month" && (
              <>
                <Button
                  variant={isThisMonth ? "default" : "outline"}
                  size="sm"
                  className={`hidden sm:flex h-10 text-xs font-medium px-4 shadow-xs shrink-0 transition-colors ${
                    isThisMonth
                      ? "bg-brand text-white hover:bg-brand/90 border-transparent opacity-70"
                      : "border-muted/60"
                  }`}
                  onClick={() => setSelectedMonth(thisMonthStr)}
                  disabled={isLoading || isThisMonth}
                >
                  This Month
                </Button>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted/10 h-10 text-xs w-full sm:w-40 font-medium disabled:opacity-50"
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isLoading}
              className="h-10 text-xs border-muted/60 bg-background shadow-xs gap-1.5 w-full sm:w-auto"
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
              placeholder="Search employee or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-9 text-xs shadow-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-background p-1 border border-muted/60 rounded-lg shrink-0">
            {["All", "Present", "Late", "Absent"].map((status) => (
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

          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background h-9 text-xs border border-muted/60 rounded-md px-2 shadow-none outline-none focus:ring-1 focus:ring-brand font-medium text-muted-foreground cursor-pointer"
            >
              <option value="date">Date</option>
              <option value="check_in">Check In</option>
              <option value="status">Status</option>
              <option value="created_at">Created At</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 bg-background text-muted-foreground hover:text-foreground border-muted/60"
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              title={`Sort ${sortOrder === "desc" ? "Descending" : "Ascending"}`}
            >
              {isValidating ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : sortOrder === "desc" ? (
                <ArrowDownIcon className="size-4" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
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
              className="text-xs h-7 px-3 gap-1.5 data-[state=active]:bg-muted"
            >
              <ListIcon className="size-3.5" /> List
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="text-xs h-7 px-3 gap-1.5 data-[state=active]:bg-muted"
            >
              <LayoutGridIcon className="size-3.5" /> Grid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        viewMode === "list" ? (
          <div className="overflow-hidden border border-muted/80 shadow-md rounded-xl bg-background">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-muted/60 bg-muted/20">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <th key={i} className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/20">
                  {Array.from({ length: limit }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4 flex gap-3">
                        <Skeleton className="size-8 rounded-full shrink-0" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-muted/80 bg-background/50 p-4 space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : logs.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
          <div className="rounded-full bg-muted/40 p-3 mb-3">
            <SearchIcon className="size-5 text-muted-foreground/70" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No attendance records found
          </p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <AttendanceTable logs={logs} onRowClick={setSelectedLog} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {logs.map((log) => (
                <AttendanceCard
                  key={log.id}
                  log={log}
                  onClick={() => setSelectedLog(log)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4 border-t border-muted/40 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold h-8 w-24"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold h-8 w-24"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AttendanceViewDialog
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
