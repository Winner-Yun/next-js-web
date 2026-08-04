"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { TaskPriorityBadge, TaskStatusBadge } from "./task-status-badge";
import type { Task } from "./types";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "No deadline";
  try {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="flex flex-col gap-3 p-4 border border-muted/60 rounded-xl bg-background hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7 cursor-pointer"
            onClick={() => onEdit(task)}
          >
            <PencilIcon className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => onDelete(task)}
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1 border-t border-muted/40">
        <span className="flex items-center gap-1">
          <CalendarIcon className="size-3" />
          {formatDate(task.deadline)}
        </span>
        <span className="flex items-center gap-1">
          <UsersIcon className="size-3" />
          {task.visibility === "public"
            ? "Everyone"
            : `${task.assigned_to.length} assignee(s)`}
        </span>
      </div>
    </div>
  );
}
