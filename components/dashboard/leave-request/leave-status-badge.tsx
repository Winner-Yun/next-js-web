"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import type { LeaveStatus } from "./types";

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  switch (status) {
    case "Approved":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <CheckCircle2Icon className="size-3 mr-1" /> Approved
        </Badge>
      );
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <AlertCircleIcon className="size-3 mr-1" /> Pending
        </Badge>
      );
    case "Rejected":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 font-bold text-[10px] tracking-wide uppercase px-2 shadow-none"
        >
          <XCircleIcon className="size-3 mr-1" /> Rejected
        </Badge>
      );
  }
}
