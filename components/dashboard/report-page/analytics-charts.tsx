"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3Icon, PieChartIcon } from "lucide-react";
import { KpiSummary } from "./types";

interface AnalyticsChartsProps {
  kpis: KpiSummary;
  isLoading: boolean;
}

export function AnalyticsCharts({ kpis, isLoading }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance distribution */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <PieChartIcon className="size-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-foreground">Daily Attendance Status</h3>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          ) : (
            Object.entries(kpis.attStatusCount).map(([status, count]) => {
              const percentage = kpis.totalEmployees > 0 ? (count / kpis.totalEmployees) * 100 : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{status}</span>
                    <span className="text-muted-foreground font-mono">{count} Staff ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden border border-muted/10">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Leave distribution */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <BarChart3Icon className="size-4 text-brand" />
          <h3 className="text-sm font-bold text-foreground">Leave Types Allocated (Days)</h3>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          ) : Object.keys(kpis.leaveTypeCount).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6 italic">No active leave metrics processed.</p>
          ) : (
            Object.entries(kpis.leaveTypeCount).map(([type, days]) => {
              const max = Math.max(...Object.values(kpis.leaveTypeCount));
              const percentage = max > 0 ? (days / max) * 100 : 0;
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{type}</span>
                    <span className="text-muted-foreground font-mono">{days} Days</span>
                  </div>
                  <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden border border-muted/10">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
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