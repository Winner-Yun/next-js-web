"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import type { AttendanceRecord } from "./types";

interface AttendanceCardProps {
  log: AttendanceRecord;
  onClick: () => void;
}

export function AttendanceCard({ log, onClick }: AttendanceCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand/30 border flex flex-col border-muted/80 bg-background/50 cursor-pointer group"
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-3 border-b border-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 border border-brand/10">
            {log.employeeName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-sm font-bold tracking-tight truncate text-foreground group-hover:text-brand transition-colors">
              {log.employeeName}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate font-medium">
              {log.role} • <span className="font-mono">{log.id}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Status
          </span>
          <AttendanceStatusBadge status={log.status} />
        </div>

        <div className="pt-3 border-t border-muted/60 grid grid-cols-2 gap-3 text-[11px]">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Check In
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <ClockIcon className="size-3 text-muted-foreground/50" />
              <span
                className={
                  !log.checkIn ? "text-muted-foreground/40 font-normal" : ""
                }
              >
                {log.checkIn || "--:--"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Check Out
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <ClockIcon className="size-3 text-muted-foreground/50" />
              <span
                className={
                  !log.checkOut ? "text-muted-foreground/40 font-normal" : ""
                }
              >
                {log.checkOut || "--:--"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-muted/60 flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground">
            Total Hours
          </span>
          <div className="font-mono font-bold text-xs text-foreground">
            {log.hoursWorked !== null && log.hoursWorked > 0 ? (
              <span className="bg-muted/40 px-2 py-1 border border-muted rounded group-hover:border-brand/30 transition-colors">
                {log.hoursWorked.toFixed(2)} hrs
              </span>
            ) : (
              <span className="text-muted-foreground/40 font-normal">--</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
