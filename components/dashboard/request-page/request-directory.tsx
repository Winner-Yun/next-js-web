"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { MessageSquareWarningIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { RequestCard } from "./request-card";
import { RequestCreateDialog } from "./request-create-dialog";
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [requestToRespond, setRequestToRespond] =
    useState<WorkspaceRequest | null>(null);
  const [requestToDelete, setRequestToDelete] =
    useState<WorkspaceRequest | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const queryParams =
    statusFilter !== "all" ? `?status=${statusFilter}` : "";

  const { data, isLoading, mutate } = useSWR<PaginatedRequests>(
    workspace?.id ? `/api/request/${workspace.id}${queryParams}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const requests: WorkspaceRequest[] = Array.isArray(data)
    ? data
    : data?.data || [];

  const handleCreate = async (payload: {
    title: string;
    description: string;
    images: File[];
  }) => {
    if (!workspace?.id) return;

    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      payload.images.forEach((file, i) => {
        formData.append(`image_${i + 1}`, file);
      });

      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/request/${workspace.id}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to submit request.");
      }

      toast.success("Request submitted.");
      setIsCreateOpen(false);
      setIsReloading(true);
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit request.",
      );
    } finally {
      setIsReloading(false);
    }
  };

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

  const handleDelete = async () => {
    if (!requestToDelete) return;
    try {
      const res = await fetch(`/api/request/${requestToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to delete request.");
      }
      toast.success("Request deleted.");
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete request.",
      );
    } finally {
      setRequestToDelete(null);
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
            Review and respond to requests submitted by the workspace.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          disabled={!workspace?.id}
          className="h-10 cursor-pointer text-xs bg-brand text-white hover:bg-brand/90 shrink-0"
        >
          <PlusIcon className="size-4 mr-1.5" /> New Request
        </Button>
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

      {isLoading || isReloading ? (
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
              onDelete={setRequestToDelete}
            />
          ))}
        </div>
      )}

      <RequestCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
      />

      <RequestRespondDialog
        request={requestToRespond}
        onClose={() => setRequestToRespond(null)}
        onSave={handleRespond}
      />

      {requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-background border border-muted/60 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-lg">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Delete this request?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                &ldquo;{requestToDelete.title}&rdquo; will be permanently
                removed. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer text-xs"
                onClick={() => setRequestToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="cursor-pointer text-xs"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
