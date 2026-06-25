/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import { LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { LeaveCard } from "./leave-card";

import { LeaveEditDialog } from "./leave-edit-dialog";
import { LeaveTable } from "./leave-table";
import { LeaveViewDialog } from "./leave-view-dialog";
import type { LeaveRequest, LeaveType } from "./types";

const escapeXML = (str: string) => {
  if (!str) return "";
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
};

export function LeaveDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );

  // State Dictionary Pattern keyed by Workspace ID
  const [requestsData, setRequestsData] = useState<
    Record<string, LeaveRequest[]>
  >({
    worksmart: [
      {
        id: "LRQ-402",
        employeeName: "Sok Chamroeun",
        role: "Frontend Engineer",
        leaveType: "Annual Leave",
        startDate: "2026-07-01",
        endDate: "2026-07-05",
        totalDays: 5,
        reason:
          "Family relocation tasks requiring structural schedule absence adjustments.",

        status: "Pending",
        createdAt: "2026-06-20T04:00:00.000Z",
      },
      {
        id: "LRQ-409",
        employeeName: "Chan Eliza",
        role: "UI/UX Designer",
        leaveType: "Sick Leave",
        startDate: "2026-06-29",
        endDate: "2026-06-30",
        totalDays: 2,
        reason: "Dental extraction process recovery allocation window.",
        attachmentUrl:
          "https://imgs.search.brave.com/UFN91E77kzkZQuIIPh9XEM0xZmdP8tRIjn-c2UENj4Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I2L0lt/YWdlX2NyZWF0ZWRf/d2l0aF9hX21vYmls/ZV9waG9uZS5wbmcv/MTI4MHB4LUltYWdl/X2NyZWF0ZWRfd2l0/aF9hX21vYmlsZV9w/aG9uZS5wbmc",
        status: "Approved",
        createdAt: "2026-06-24T09:12:00.000Z",
      },
    ],
  });

  // Extract the leave requests for the currently active workspace
  const currentWorkspaceRequests = useMemo(() => {
    return requestsData[workspace.id] || [];
  }, [requestsData, workspace.id]);

  useEffect(() => {
    const savedMode = localStorage.getItem("leaveViewMode");
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (val: string) => {
    const newMode = val as "list" | "grid";
    setViewMode(newMode);
    localStorage.setItem("leaveViewMode", newMode);
  };

  const handleStatusChange = (
    id: string,
    nextStatus: "Approved" | "Rejected",
  ) => {
    setRequestsData((prev) => {
      const current = prev[workspace.id] || [];
      return {
        ...prev,
        [workspace.id]: current.map((r) =>
          r.id === id ? { ...r, status: nextStatus } : r,
        ),
      };
    });
    toast.success(`Request context ${id} flagged as ${nextStatus}.`);
  };

  const handleCreateRequest = (form: {
    employeeName: string;
    role: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newReq: LeaveRequest = {
      id: `LRQ-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: form.employeeName,
      role: form.role,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays: days > 0 ? days : 1,
      reason: form.reason,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setRequestsData((prev) => {
      const current = prev[workspace.id] || [];
      return {
        ...prev,
        [workspace.id]: [newReq, ...current],
      };
    });
    setIsCreateOpen(false);
    toast.success("Leave tracking allocation application cataloged.");
  };

  // --- ADMIN OVERRIDE STATUS HANDLER ---
  const handleEditRequest = (
    id: string,
    nextStatus: "Pending" | "Approved" | "Rejected",
  ) => {
    setRequestsData((prev) => {
      const current = prev[workspace.id] || [];
      return {
        ...prev,
        [workspace.id]: current.map((r) =>
          r.id === id ? { ...r, status: nextStatus } : r,
        ),
      };
    });

    setIsEditOpen(false);
    setSelectedRequest(null);
    toast.success(
      `Leave request ${id} admin status overridden to ${nextStatus}.`,
    );
  };

  const handleEditTrigger = (req: LeaveRequest) => {
    setIsEditOpen(true);
  };

  const filteredRequests = useMemo(() => {
    return currentWorkspaceRequests.filter((r) => {
      const matchKeywords =
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.role.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchKeywords && matchStatus;
    });
  }, [currentWorkspaceRequests, search, statusFilter]);

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leave Directory
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active Context Directory:{" "}
            <span className="font-semibold text-brand">{workspace.name}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-3 rounded-xl border border-muted/60">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search records context tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-9 text-xs shadow-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-background p-1 border border-muted/60 rounded-lg shrink-0">
            {["All", "Pending", "Approved", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${statusFilter === st ? "bg-brand text-white shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/20"}`}
              >
                {st}
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
              <ListIcon className="size-3.5" /> List
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="text-xs h-7 px-3 gap-1.5 data-[state=active]:bg-muted data-[state=active]:shadow-none"
            >
              <LayoutGridIcon className="size-3.5" /> Grid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" ? (
        <LeaveTable
          requests={filteredRequests}
          onRowClick={setSelectedRequest}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRequests.map((r) => (
            <LeaveCard
              key={r.id}
              request={r}
              onClick={() => setSelectedRequest(r)}
            />
          ))}
          {filteredRequests.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
              <SearchIcon className="size-5 text-muted-foreground/70 mb-2" />
              <p className="text-sm font-medium">
                No absence tracking indices matched filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Dialog Stack */}

      <LeaveViewDialog
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
        onEditTrigger={handleEditTrigger}
      />

      <LeaveEditDialog
        isOpen={isEditOpen}
        request={selectedRequest}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditRequest}
      />
    </div>
  );
}
