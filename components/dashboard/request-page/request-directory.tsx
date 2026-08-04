"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { MessageSquareWarningIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { RequestCard } from "./request-card";
import { RequestRespondDialog } from "./request-respond-dialog";
import type {
  PaginatedRequests,
  RequestStatus,
  WorkspaceRequest,
} from "./types";

const STATUS_FILTERS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Seen", value: "seen" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to fetch requests.");
  }
  return res.json();
};

function RequestSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-44 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function RequestDirectory() {
  const { workspace } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all",
  );
  const [requestToRespond, setRequestToRespond] =
    useState<WorkspaceRequest | null>(null);

  const queryParams = statusFilter !== "all" ? `?status=${statusFilter}` : "";

  const { data, isLoading, mutate } = useSWR<PaginatedRequests>(
    workspace?.id ? `/api/request/${workspace.id}${queryParams}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const requests: WorkspaceRequest[] = Array.isArray(data)
    ? data
    : data?.data || [];

  const handleRespond = async (
    id: string,
    status: RequestStatus,
    response: string,
  ) => {
    const toastId = toast.loading("Saving response...");
    try {
      const res = await fetch(`/api/request/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, response: response || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to update request.");
      }
      setRequestToRespond(null);
      await mutate();
      toast.success("Request updated.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update request.",
        { id: toastId },
      );
    }
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Requests
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Review and respond to requests submitted by the workspace&apos;s
            member.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              statusFilter === f.value
                ? "bg-brand/10 text-brand border-brand/20"
                : "border-transparent text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <RequestSkeletonLoader />
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/5 text-center">
          <div className="bg-muted p-3 rounded-full mb-3">
            <MessageSquareWarningIcon className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No requests found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-62.5">
            Requests submitted by workspace members will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onRespond={setRequestToRespond}
            />
          ))}
        </div>
      )}

      <RequestRespondDialog
        request={requestToRespond}
        onClose={() => setRequestToRespond(null)}
        onSave={handleRespond}
      />
    </div>
  );
}
