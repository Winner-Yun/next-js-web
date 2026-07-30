"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  EyeIcon,
  Loader2Icon,
} from "lucide-react";
import type { RequestStatus } from "./types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
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
    case "seen":
      return (
        <Badge
          variant="outline"
          className="bg-violet-500/10 text-violet-600 border-violet-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <EyeIcon className="size-3 mr-1" /> Seen
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
