"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Loader2Icon,
} from "lucide-react";
import type { TaskPriority, TaskStatus } from "./types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <CheckCircle2Icon className="size-3 mr-1" /> Completed
        </Badge>
      );
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <Loader2Icon className="size-3 mr-1" /> In Progress
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <CircleDashedIcon className="size-3 mr-1" /> Pending
        </Badge>
      );
  }
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case "high":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-semibold text-[10px] uppercase px-2 shadow-none">
          High
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-muted text-muted-foreground border-muted/60 font-semibold text-[10px] uppercase px-2 shadow-none">
          Low
        </Badge>
      );
    case "medium":
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold text-[10px] uppercase px-2 shadow-none">
          Medium
        </Badge>
      );
  }
}
