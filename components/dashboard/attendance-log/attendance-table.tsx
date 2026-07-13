"use client";

import { Card } from "@/components/ui/card";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import type { AttendanceRecord } from "./types";

interface AttendanceTableProps {
  logs: AttendanceRecord[];
  onRowClick: (log: AttendanceRecord) => void;
}

export function AttendanceTable({ logs, onRowClick }: AttendanceTableProps) {
  return (
    <Card className="overflow-hidden border-muted/80 shadow-md rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-muted/60 bg-muted/20">
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Employee
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Check In
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Check Out
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">
                Work Hours
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/20 bg-background text-xs">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => onRowClick(log)}
                className="hover:bg-muted/5 transition-colors group cursor-pointer"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="size-8.5 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 border border-brand/10">
                    {log.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-foreground block truncate group-hover:text-brand transition-colors">
                      {log.employeeName}
                    </span>
                    <span className="text-muted-foreground text-[11px] block truncate">
                      {log.role} •{" "}
                      <span className="font-mono text-[10px]">{log.date}</span>
                    </span>
                  </div>
                </td>

                <td className="p-4 align-middle">
                  <AttendanceStatusBadge status={log.status} />
                </td>

                <td className="p-4 text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5 text-muted-foreground/60" />
                    <span
                      className={
                        log.checkIn ? "text-foreground font-semibold" : ""
                      }
                    >
                      {log.checkIn || "--:--"}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5 text-muted-foreground/60" />
                    <span
                      className={
                        log.checkOut ? "text-foreground font-semibold" : ""
                      }
                    >
                      {log.checkOut || "--:--"}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-right font-mono font-bold text-foreground">
                  {log.hoursWorked !== null && log.hoursWorked > 0 ? (
                    <span className="bg-muted/40 px-2 py-1 border border-muted rounded group-hover:border-brand/30 transition-colors">
                      {log.hoursWorked.toFixed(2)} hrs
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40 font-normal">
                      --
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-muted-foreground"
                >
                  <div className="rounded-full bg-muted/40 p-3 mb-3 inline-flex items-center justify-center">
                    <CalendarIcon className="size-5 text-muted-foreground/70" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No attendance logs found
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Try updating your search parameter, filter criteria, or
                    target lookup date.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
