"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { ListTodoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { TaskCard } from "./task-card";
import { TaskCreateDialog } from "./task-create-dialog";
import type {
  PaginatedTasks,
  Task,
  TaskPriority,
  TaskStatus,
  TaskVisibility,
} from "./types";

const STATUS_FILTERS: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
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
    throw new Error(err?.detail || "Failed to fetch tasks.");
  }
  return res.json();
};

function TaskSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-44 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function TaskDirectory() {
  const { workspace } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const queryParams =
    statusFilter !== "all" ? `?status=${statusFilter}` : "";

  const { data, isLoading, mutate } = useSWR<PaginatedTasks>(
    workspace?.id
      ? `/api/workspace/${workspace.id}/tasks${queryParams}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const tasks: Task[] = Array.isArray(data) ? data : data?.data || [];

  const handleSave = async (payload: {
    title: string;
    description: string;
    visibility: TaskVisibility;
    assigned_to: string[];
    deadline: string;
    priority: TaskPriority;
  }) => {
    if (!workspace?.id) return;

    try {
      const body = {
        title: payload.title,
        description: payload.description || null,
        visibility: payload.visibility,
        assigned_to:
          payload.visibility === "private" ? payload.assigned_to : null,
        deadline: payload.deadline || null,
        priority: payload.priority,
      };

      if (taskToEdit) {
        const res = await fetch(`/api/workspace/task/${taskToEdit.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.detail || "Failed to update task.");
        }
        toast.success("Task updated.");
      } else {
        const res = await fetch(`/api/workspace/${workspace.id}/tasks`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.detail || "Failed to create task.");
        }
        toast.success("Task assigned.");
      }

      setIsCreateOpen(false);
      setTaskToEdit(null);
      setIsReloading(true);
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save task.",
      );
    } finally {
      setIsReloading(false);
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      const res = await fetch(`/api/workspace/task/${taskToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to delete task.");
      }
      toast.success("Task deleted.");
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task.",
      );
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assign Task
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Create and track tasks across the workspace.
          </p>
        </div>

        <Button
          onClick={() => {
            setTaskToEdit(null);
            setIsCreateOpen(true);
          }}
          disabled={!workspace?.id}
          className="h-10 cursor-pointer text-xs bg-brand text-white hover:bg-brand/90 shrink-0"
        >
          <PlusIcon className="size-4 mr-1.5" /> Assign Task
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
        <TaskSkeletonLoader />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/5 text-center">
          <div className="bg-muted p-3 rounded-full mb-3">
            <ListTodoIcon className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No tasks found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-62.5">
            Start by assigning a new task to the workspace or a specific
            member.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => {
                setTaskToEdit(t);
                setIsCreateOpen(true);
              }}
              onDelete={(t) => setTaskToDelete(t)}
            />
          ))}
        </div>
      )}

      <TaskCreateDialog
        isOpen={isCreateOpen}
        editTask={taskToEdit}
        onClose={() => {
          setIsCreateOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSave}
      />

      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-background border border-muted/60 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-lg">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Delete this task?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                &ldquo;{taskToDelete.title}&rdquo; will be permanently removed.
                This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer text-xs"
                onClick={() => setTaskToDelete(null)}
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
