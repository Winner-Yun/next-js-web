"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon, FileTextIcon } from "lucide-react";
import { LeaveStatusBadge } from "./leave-status-badge";
import type { LeaveRequest } from "./types";

interface LeaveCardProps {
  request: LeaveRequest;
  onClick: () => void;
}

export function LeaveCard({ request, onClick }: LeaveCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand/30 border flex flex-col border-muted/80 bg-background/50 cursor-pointer group"
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-3 border-b border-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 border border-brand/10">
            {request.employeeName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-sm font-bold tracking-tight truncate text-foreground group-hover:text-brand transition-colors">
              {request.employeeName}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate font-medium">
              {request.role} • <span className="font-mono">{request.id}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-muted">
            {request.leaveType}
          </span>
          <LeaveStatusBadge status={request.status} />
        </div>

        <div className="pt-3 border-t border-muted/60 grid grid-cols-2 gap-3 text-[11px]">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Start Date
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <CalendarIcon className="size-3 text-muted-foreground/50" />
              <span>
                {new Date(request.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium">
              End Date
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <CalendarIcon className="size-3 text-muted-foreground/50" />
              <span>
                {new Date(request.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-muted/60 space-y-1">
          <span className="text-muted-foreground block text-[10px] font-medium items-center gap-1">
            <FileTextIcon className="size-3" /> Reason
          </span>
          <p className="text-xs text-foreground/80 line-clamp-1 font-normal italic">
            &quot;{request.reason}&quot;
          </p>
        </div>

        <div className="pt-3 border-t border-muted/60 flex items-center justify-between text-[11px]">
          <span className="text-[10px] font-medium text-muted-foreground">
            Total Duration
          </span>
          <span className="bg-brand/10 text-brand font-bold px-2 py-0.5 border border-brand/10 rounded">
            {request.totalDays} {request.totalDays === 1 ? "Day" : "Days"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
