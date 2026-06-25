"use client";

import { Badge } from "@/components/ui/badge";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CoffeeIcon,
  XCircleIcon,
} from "lucide-react";
import type { AttendanceStatus } from "./types";

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  switch (status) {
    case "Present":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <CheckCircle2Icon className="size-3 mr-1" /> Present
        </Badge>
      );
    case "Late":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <AlertTriangleIcon className="size-3 mr-1" /> Late
        </Badge>
      );
    case "Absent":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <XCircleIcon className="size-3 mr-1" /> Absent
        </Badge>
      );
    case "On Leave":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <CoffeeIcon className="size-3 mr-1" /> On Leave
        </Badge>
      );
  }
}
