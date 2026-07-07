"use client";

import type * as React from "react";
import { Bar, BarChart, XAxis, type BarProps } from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";

import { Skeleton } from "@/components/ui/skeleton";

import { useDashboardData } from "@/hooks/use-dashboard-data";

type AttendanceItem = {
  day?: string;
  date?: string;
  timestamp?: string | Date;
  attendance?: number;
  status?: string;
  [key: string]: unknown;
};

const chartConfig = {
  attendance: {
    label: "Present",
    color: "var(--brand)",
  },
} satisfies ChartConfig;

function CustomGradientBar(
  props: React.SVGProps<SVGRectElement> &
    Pick<BarProps, "dataKey"> & {
      index?: number;
    },
) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dataKey = "attendance",
    index = 0,
  } = props;
  const gid = `gradient-bar-${String(dataKey)}-${index}`;
  return (
    <>
      <rect
        fill={`url(#${gid})`}
        x={Number(x)}
        y={Number(y)}
        width={Number(width)}
        height={Number(height)}
      />
      <rect
        fill="currentColor"
        x={Number(x)}
        y={Number(y)}
        width={Number(width)}
        height={2}
      />
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.5} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
}

export function AttendanceChart() {
  const { attendance, isLoading } = useDashboardData();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = (() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        day: dayLabels[d.getDay()],
        date: d.toISOString().slice(0, 10),
        attendance: 0,
      };
    });
  })();
  const chartData = last7Days.map((slot) => {
    const presentCount = Array.isArray(attendance)
      ? attendance.filter((item: unknown) => {
          if (
            !item ||
            typeof item !== "object" ||
            (item as AttendanceItem).status !== "absent"
          ) {
            return false;
          }
          const record = item as AttendanceItem;
          // Match by ISO date (e.g. "2026-07-06") or by timestamp
          if (record.date && record.date === slot.date) return true;
          if (record.timestamp) {
            const ts = new Date(record.timestamp);
            if (!isNaN(ts.getTime())) {
              return ts.toISOString().slice(0, 10) === slot.date;
            }
          }
          return false;
        }).length
      : 0;
    return {
      day: slot.day,
      date: slot.date,
      attendance: presentCount,
    };
  });

  return (
    <DashboardCard className="gap-0 md:col-span-2">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Daily attendance</CardTitle>
        </div>
        <CardDescription>
          Worker attendance percentage for the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex h-60 w-full items-end justify-between gap-2 md:h-80"
            aria-busy="true"
            aria-live="polite"
            role="status"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex h-full w-full flex-col items-center justify-end gap-2"
              >
                <Skeleton
                  className="w-full rounded-md"
                  style={{ height: `${30 + ((i * 13) % 60)}%` }}
                />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        ) : (
          <ChartContainer
            className="aspect-auto h-60 w-full md:h-80"
            config={chartConfig}
          >
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                axisLine={false}
                dataKey="day"
                interval={0}
                tickLine={false}
                tickMargin={10}
              />
              <ChartTooltip content={ChartTooltipContent} cursor={false} />
              <Bar
                dataKey="attendance"
                className="bg-brand text-brand"
                fill="currentColor"
                shape={<CustomGradientBar />}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </DashboardCard>
  );
}
