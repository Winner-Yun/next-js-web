"use client";

import { BarChart3Icon, PieChartIcon } from "lucide-react";
import { KpiSummary } from "./types";

interface AnalyticsChartsProps {
  kpis: KpiSummary;
}

export function AnalyticsCharts({ kpis }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:print-color-adjust-exact">
      {/* Attendance Status Distribution */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <PieChartIcon className="size-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-foreground">
            Daily Attendance Status
          </h3>
        </div>

        <div className="space-y-4 flex-1 justify-center flex flex-col">
          {Object.entries(kpis.attStatusCount).map(([status, count]) => {
            const percentage =
              kpis.totalEmployees > 0 ? (count / kpis.totalEmployees) * 100 : 0;

            const color =
              status === "Present"
                ? "#10b981"
                : status === "Late"
                  ? "#f59e0b"
                  : status === "Absent"
                    ? "#ef4444"
                    : "#3b82f6";

            return (
              <div key={status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{status}</span>

                  <span className="text-muted-foreground font-mono">
                    {count} Staff ({percentage.toFixed(0)}%)
                  </span>
                </div>

                <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-muted/20">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                      printColorAdjust: "exact",
                      WebkitPrintColorAdjust: "exact",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Types Progress Allocation */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <BarChart3Icon className="size-4 text-brand" />

          <h3 className="text-sm font-bold text-foreground">
            Leave Types Allocated (Days)
          </h3>
        </div>

        <div className="space-y-4 flex-1 justify-center flex flex-col">
          {Object.keys(kpis.leaveTypeCount).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No leave data available.
            </p>
          ) : (
            Object.entries(kpis.leaveTypeCount).map(([type, days]) => {
              const max = Math.max(...Object.values(kpis.leaveTypeCount));

              const percentage = max > 0 ? (days / max) * 100 : 0;

              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{type}</span>

                    <span className="text-muted-foreground font-mono">
                      {days} Days
                    </span>
                  </div>

                  <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-muted/20">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: "#6366f1",
                        printColorAdjust: "exact",
                        WebkitPrintColorAdjust: "exact",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
