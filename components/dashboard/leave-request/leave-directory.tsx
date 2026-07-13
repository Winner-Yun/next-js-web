/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ArrowUpDown,
  LayoutGridIcon,
  ListIcon,
  Loader2,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { LeaveCard } from "./leave-card";
import { LeaveEditDialog } from "./leave-edit-dialog";
import { LeaveTable } from "./leave-table";
import { LeaveViewDialog } from "./leave-view-dialog";
import type { LeaveRequest, LeaveStatus, LeaveType } from "./types";

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

export function LeaveDirectory() {
  const { workspace } = useWorkspace();

  // Primary Filters & View Options
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Advanced Back-end Parameters
  const [sortBy, setSortBy] = useState<"created_at" | "start_date" | "status">(
    "created_at",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [exactDate, setExactDate] = useState<string>("");
  const [monthYear, setMonthYear] = useState<string>("");

  // Persisted Advanced visibility state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Modals & Pagination
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const limit = 4;

  // Handle Input Debouncing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Read saved settings from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("leaveViewMode");
    if (savedMode === "grid" || savedMode === "list") setViewMode(savedMode);

    const savedAdvanced = localStorage.getItem("leaveShowAdvanced");
    if (savedAdvanced === "true") setShowAdvanced(true);
  }, []);

  const handleViewModeChange = (val: string) => {
    setViewMode(val as "list" | "grid");
    localStorage.setItem("leaveViewMode", val);
  };

  const handleToggleAdvanced = () => {
    setShowAdvanced((prev) => {
      const nextState = !prev;
      localStorage.setItem("leaveShowAdvanced", String(nextState));
      return nextState;
    });
  };

  // Reset page when filtering keys update
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    statusFilter,
    sortBy,
    sortOrder,
    dateFilter,
    exactDate,
    monthYear,
  ]);

  // Query Parameter Builder
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
    if (dateFilter !== "all") params.append("date_filter", dateFilter);
    if (exactDate) params.append("exact_date", exactDate);
    if (monthYear) params.append("month_year", monthYear);

    return params.toString();
  }, [
    page,
    debouncedSearch,
    statusFilter,
    sortBy,
    sortOrder,
    dateFilter,
    exactDate,
    monthYear,
  ]);

  // Your requested path
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    workspace?.id
      ? `/api/workspace/${workspace.id}/leaves?${queryParams}`
      : null,
    fetcher,
    { revalidateOnFocus: false }, // Removed keepPreviousData: true
  );
  const isProcessing = isLoading || isValidating;

  const requests = useMemo<LeaveRequest[]>(() => {
    if (!data?.data) return [];
    return data.data.map((item: unknown) => {
      const mappedStatus =
        item.status === "approved"
          ? "Approved"
          : item.status === "rejected"
            ? "Rejected"
            : "Pending";
      return {
        id: item._id || item.id,
        employeeName: item.user?.name || "Unknown",
        role: item.user?.email || "No Email",
        leaveType: (item.leave_type || "Annual Leave") as LeaveType,
        startDate: item.start_date,
        endDate: item.end_date,
        totalDays: item.total_days || 1,
        reason: item.reason || "No reason provided",
        attachmentUrl: item.attachment_url,
        status: mappedStatus as LeaveStatus,
        createdAt: item.created_at || new Date().toISOString(),
      };
    });
  }, [data]);

  const handleStatusChange = async (
    id: string,
    nextStatus: "Approved" | "Rejected" | "Pending",
  ) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token)
        headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

      const res = await fetch(`/api/workspace/leave/${id}/approve`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: nextStatus.toLowerCase() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to update leave status.");
      }

      toast.success(`Leave request updated to ${nextStatus}.`);
      mutate();
      setIsEditOpen(false);
      setSelectedRequest(null);
    } catch (error: unknown) {
      toast.error(
        error.message || "An error occurred while updating the status.",
      );
    }
  };

  return (
    <div className="w-full space-y-5 p-px animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leave Directory
          </h1>
        </div>
      </div>

      {/* Filter Toolbar Container */}
      <div className="space-y-3 bg-muted/20 p-3 rounded-xl border border-muted/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input Filter */}
            <div className="relative w-full md:w-60">
              {isProcessing && debouncedSearch !== search ? (
                <Loader2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand animate-spin" />
              ) : (
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              )}
              <Input
                placeholder="Search employee or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background h-9 text-xs shadow-none"
              />
            </div>

            {/* Status Tabs with Loading Feedback directly on the Active Button */}
            <div className="flex items-center gap-1 bg-background p-1 border border-muted/60 rounded-lg h-9">
              {["All", "Pending", "Approved", "Rejected"].map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`flex items-center justify-center gap-1.5 text-xs font-semibold px-3 h-7 rounded-md transition-all ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && isProcessing && (
                      <Loader2 className="animate-spin size-3 shrink-0" />
                    )}
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>

            {/* Advanced Filters Trigger Button */}
            <button
              onClick={handleToggleAdvanced}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-semibold transition-all ${
                showAdvanced
                  ? "bg-muted text-foreground border-muted-foreground/30"
                  : "bg-background text-muted-foreground border-muted/60"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              Advanced
            </button>
          </div>

          {/* View Toggles */}
          <Tabs
            value={viewMode}
            onValueChange={handleViewModeChange}
            className="h-9 shrink-0"
          >
            <TabsList className="h-9 p-1 bg-background border border-muted/60">
              <TabsTrigger value="list" className="text-xs h-7 px-3 gap-1.5">
                <ListIcon className="size-3.5" /> List
              </TabsTrigger>
              <TabsTrigger value="grid" className="text-xs h-7 px-3 gap-1.5">
                <LayoutGridIcon className="size-3.5" /> Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Collapsible Panel */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-muted/40 animate-in slide-in-from-top-2 duration-200">
            {/* Sort Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as unknown)}
                className="w-full h-8.5 text-xs rounded-lg border border-muted/80 bg-background px-2 font-medium"
              >
                <option value="created_at">Created Date</option>
                <option value="start_date">Leave Start Date</option>
                <option value="status">Status Order</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Ordering
              </label>
              <button
                type="button"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center justify-between w-full h-8.5 text-xs rounded-lg border border-muted/80 bg-background px-3 font-medium text-left"
              >
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
                <ArrowUpDown className="size-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Relative Date Range Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Relative Window
              </label>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  if (e.target.value !== "all") {
                    setExactDate("");
                    setMonthYear("");
                  }
                }}
                className="w-full h-8.5 text-xs rounded-lg border border-muted/80 bg-background px-2 font-medium"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="older">Older Records</option>
              </select>
            </div>

            {/* Exact Date Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Exact Date
              </label>
              <input
                type="date"
                value={exactDate}
                onChange={(e) => {
                  setExactDate(e.target.value);
                  if (e.target.value) {
                    setDateFilter("all");
                    setMonthYear("");
                  }
                }}
                className="w-full h-8.5 text-xs rounded-lg border border-muted/80 bg-background px-2 font-medium"
              />
            </div>

            {/* Month-Year Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Target Month
              </label>
              <input
                type="month"
                value={monthYear}
                onChange={(e) => {
                  setMonthYear(e.target.value);
                  if (e.target.value) {
                    setDateFilter("all");
                    setExactDate("");
                  }
                }}
                className="w-full h-8.5 text-xs rounded-lg border border-muted/80 bg-background px-2 font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* Directory Data Window */}
      <div className="relative rounded-xl overflow-hidden">
        {error ? (
          <div className="py-16 text-center text-destructive border border-destructive/20 rounded-xl bg-destructive/5">
            <p className="text-sm font-semibold">
              Failed to load leave requests.
            </p>
            <p className="text-xs opacity-80 mt-1">{error.message}</p>
          </div>
        ) : isLoading && requests.length === 0 ? (
          <SkeletonLoader viewMode={viewMode} />
        ) : viewMode === "list" ? (
          <LeaveTable requests={requests} onRowClick={setSelectedRequest} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {requests.map((r) => (
              <LeaveCard
                key={r.id}
                request={r}
                onClick={() => setSelectedRequest(r)}
              />
            ))}
            {requests.length === 0 && (
              <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
                <SearchIcon className="size-5 text-muted-foreground/70 mb-2" />
                <p className="text-sm font-medium">
                  No records match the active criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Dialog Stack */}
      <LeaveViewDialog
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
        onEditTrigger={(req) => setIsEditOpen(true)}
      />

      <LeaveEditDialog
        isOpen={isEditOpen}
        request={selectedRequest}
        onClose={() => setIsEditOpen(false)}
        onSave={handleStatusChange}
      />
    </div>
  );
}

function SkeletonLoader({ viewMode }: { viewMode: "list" | "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="overflow-hidden border border-muted/80 shadow-md rounded-xl bg-background">
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
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td className="p-4 flex gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-muted/80 bg-background/50 p-4 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
