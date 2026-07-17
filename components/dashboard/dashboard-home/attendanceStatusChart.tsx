"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { formatDate } from "@/components/dashboard/dashboard-home/formater";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useId } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const VISIBLE_DAYS = 7;

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type AttendanceItem = {
  date?: string;
  timestamp?: string | Date;
  status?: string;
  [key: string]: unknown;
};

const chartConfig = {
  present: {
    label: "Present",
    color: "var(--brand)",
  },
  absent: {
    label: "Absent",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function AttendanceStatusChart() {
  const chartUid = useId().replace(/:/g, "");
  const idLineGlow = `attendance-line-glow-${chartUid}`;

  const { attendance, isLoading } = useDashboardData();

  // Build last 7 calendar days skeleton (rolling window ending today)
  const last7Days = (() => {
    const today = new Date();
    return Array.from({ length: VISIBLE_DAYS }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (VISIBLE_DAYS - 1 - i));
      return {
        day: dayLabels[d.getDay()],
        date: d.toISOString().slice(0, 10),
        present: 0,
        absent: 0,
      };
    });
  })();

  // Count present + absent per day from the API response
  const chartRows = last7Days.map((slot) => {
    const countByStatus = (status: string) =>
      Array.isArray(attendance)
        ? attendance.filter((item: unknown) => {
            if (!item || typeof item !== "object") return false;

            const record = item as AttendanceItem;

            let matchesStatus = false;
            if (status === "present") {
              matchesStatus =
                record.status === "present" || record.status === "late";
            } else {
              matchesStatus = record.status === status;
            }

            if (!matchesStatus) return false;

            if (record.date && record.date === slot.date) return true;

            if (record.timestamp) {
              const tsStr = String(record.timestamp);
              const safeTsStr =
                tsStr.endsWith("Z") || tsStr.includes("+")
                  ? tsStr
                  : `${tsStr}Z`;
              const ts = new Date(safeTsStr);

              if (!isNaN(ts.getTime())) {
                return toLocalDateString(ts) === slot.date;
              }
            }
            return false;
          }).length
        : 0;

    return {
      day: slot.day,
      date: slot.date,
      present: countByStatus("present"),
      absent: countByStatus("absent"),
    };
  });

  return (
    <DashboardCard className="gap-0 md:col-span-2">
      <CardHeader>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Attendance status</CardTitle>
          </div>
          <CardDescription>
            Worker attendance present and absent for last {VISIBLE_DAYS} days.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex h-60 w-full flex-col gap-2 md:h-80"
            aria-busy="true"
            aria-live="polite"
            role="status"
          >
            <Skeleton className="h-full w-full rounded-md" />
            <div className="flex justify-between px-2">
              {Array.from({ length: VISIBLE_DAYS }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        ) : (
          <ChartContainer
            className="aspect-auto h-60 w-full p-0 md:h-80"
            config={chartConfig}
          >
            <LineChart
              accessibilityLayer
              data={chartRows}
              margin={{
                left: 12,
                right: 12,
                top: 8,
              }}
            >
              <CartesianGrid className="stroke-border" vertical={false} />

              <XAxis
                axisLine={false}
                dataKey="date"
                interval={0}
                tickFormatter={(value) =>
                  formatDate(String(value), "day-month")
                }
                tickLine={false}
                tickMargin={8}
              />

              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />

              <defs>
                <filter
                  id={idLineGlow}
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur result="blur" stdDeviation="10" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <Line
                dataKey="present"
                dot={false}
                filter={`url(#${idLineGlow})`}
                stroke="currentColor"
                strokeWidth={2}
                type="step"
                className="text-brand"
              />

              <Line
                dataKey="absent"
                dot={false}
                filter={`url(#${idLineGlow})`}
                stroke="currentColor"
                strokeWidth={2}
                type="step"
                className="text-destructive"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </DashboardCard>
  );
}
