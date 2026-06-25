"use client";

import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { LeaveStatusBadge } from "./leave-status-badge";
import type { LeaveRequest } from "./types";

interface LeaveTableProps {
  requests: LeaveRequest[];
  onRowClick: (request: LeaveRequest) => void;
}

export function LeaveTable({ requests, onRowClick }: LeaveTableProps) {
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
                Type
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Duration
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Days
              </th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/20 bg-background text-xs">
            {requests.map((req) => (
              <tr
                key={req.id}
                onClick={() => onRowClick(req)}
                className="hover:bg-muted/5 transition-colors group cursor-pointer"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="size-8.5 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 border border-brand/10">
                    {req.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-foreground block truncate group-hover:text-brand transition-colors">
                      {req.employeeName}
                    </span>
                    <span className="text-muted-foreground text-[11px] block truncate">
                      {req.role} •{" "}
                      <span className="font-mono text-[10px]">{req.id}</span>
                    </span>
                  </div>
                </td>

                <td className="p-4 align-middle font-medium text-foreground">
                  {req.leaveType}
                </td>

                <td className="p-4 text-muted-foreground font-semibold align-middle">
                  {new Date(req.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="font-normal mx-1 text-muted-foreground/50">
                    →
                  </span>
                  {new Date(req.endDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                <td className="p-4 align-middle font-mono font-bold text-foreground">
                  <span className="bg-muted/60 border border-muted px-2 py-0.5 rounded">
                    {req.totalDays} {req.totalDays === 1 ? "day" : "days"}
                  </span>
                </td>

                <td className="p-4 align-middle">
                  <LeaveStatusBadge status={req.status} />
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-muted-foreground"
                >
                  <div className="rounded-full bg-muted/40 p-3 mb-3 inline-flex items-center justify-center">
                    <CalendarIcon className="size-5 text-muted-foreground/70" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No leave requests found
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modify your filters, search terms, or input configurations.
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
