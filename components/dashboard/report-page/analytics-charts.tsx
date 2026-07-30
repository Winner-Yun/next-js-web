"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3Icon, PieChartIcon } from "lucide-react";
import { KpiSummary } from "./types";

interface AnalyticsChartsProps {
  kpis: KpiSummary;
  isLoading: boolean;
}

// Attendance status is a genuine state (good/warning/critical), so it always
// wears the same reserved status colors — never a generic single-hue bar.
const STATUS_STYLES: Record<
  string,
  { dot: string; fill: string; track: string }
> = {
  Present: {
    dot: "bg-emerald-500",
    fill: "bg-emerald-500",
    track: "bg-emerald-500/15",
  },
  Late: {
    dot: "bg-amber-500",
    fill: "bg-amber-500",
    track: "bg-amber-500/15",
  },
  Absent: {
    dot: "bg-red-500",
    fill: "bg-red-500",
    track: "bg-red-500/15",
  },
  "On Leave": {
    dot: "bg-blue-500",
    fill: "bg-blue-500",
    track: "bg-blue-500/15",
  },
};
const DEFAULT_STATUS_STYLE = {
  dot: "bg-muted-foreground",
  fill: "bg-muted-foreground",
  track: "bg-muted/50",
};

// Leave type is nominal (Annual, Sick, Casual…) — identity only, no inherent
// order — so each type gets a fixed slot from a categorical hue sequence.
const CATEGORICAL_STYLES = [
  { dot: "bg-blue-500", fill: "bg-blue-500", track: "bg-blue-500/15" },
  { dot: "bg-orange-500", fill: "bg-orange-500", track: "bg-orange-500/15" },
  {
    dot: "bg-emerald-500",
    fill: "bg-emerald-500",
    track: "bg-emerald-500/15",
  },
  { dot: "bg-amber-500", fill: "bg-amber-500", track: "bg-amber-500/15" },
  { dot: "bg-pink-500", fill: "bg-pink-500", track: "bg-pink-500/15" },
  { dot: "bg-violet-500", fill: "bg-violet-500", track: "bg-violet-500/15" },
];

function Meter({
  label,
  valueLabel,
  percentage,
  dot,
  fill,
  track,
}: {
  label: string;
  valueLabel: string;
  percentage: number;
  dot: string;
  fill: string;
  track: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-2 text-foreground">
          <span className={`size-2 rounded-full shrink-0 ${dot}`} />
          {label}
        </span>
        <span className="text-muted-foreground font-mono">{valueLabel}</span>
      </div>
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${track}`}
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${fill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function AnalyticsCharts({ kpis, isLoading }: AnalyticsChartsProps) {
  const leaveEntries = Object.entries(kpis.leaveTypeCount).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const maxLeaveDays = Math.max(0, ...leaveEntries.map(([, days]) => days));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance distribution */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <PieChartIcon className="size-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-foreground">
            Daily Attendance Status
          </h3>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          ) : Object.keys(kpis.attStatusCount).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6 italic">
              No attendance data available yet.
            </p>
          ) : (
            Object.entries(kpis.attStatusCount).map(([status, count]) => {
              const percentage =
                kpis.totalEmployees > 0
                  ? (count / kpis.totalEmployees) * 100
                  : 0;
              const style = STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;
              return (
                <Meter
                  key={status}
                  label={status}
                  valueLabel={`${count} staff (${percentage.toFixed(0)}%)`}
                  percentage={percentage}
                  {...style}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Leave distribution */}
      <div className="bg-background border border-muted/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-muted/40 pb-3 mb-4">
          <BarChart3Icon className="size-4 text-brand" />
          <h3 className="text-sm font-bold text-foreground">
            Leave Types Allocated (Days)
          </h3>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          ) : leaveEntries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6 italic">
              No leave data available yet.
            </p>
          ) : (
            leaveEntries.map(([type, days], idx) => {
              const percentage =
                maxLeaveDays > 0 ? (days / maxLeaveDays) * 100 : 0;
              const style =
                CATEGORICAL_STYLES[idx % CATEGORICAL_STYLES.length];
              return (
                <Meter
                  key={type}
                  label={type}
                  valueLabel={`${days} ${days === 1 ? "day" : "days"}`}
                  percentage={percentage}
                  {...style}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
