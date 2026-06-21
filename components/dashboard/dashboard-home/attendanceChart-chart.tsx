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
import {
  Delta,
  DeltaIcon,
  DeltaValue,
} from "@/components/dashboard/dashboard-home/delta";
import { useWorkspace } from "@/provider/workspace-provider";

const attendanceByWorkspace = {
  worksmart: [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 95 },
    { day: "Thu", attendance: 90 },
    { day: "Fri", attendance: 86 },
    { day: "Sat", attendance: 78 },
    { day: "Sun", attendance: 94 },
  ],

  school: [
    { day: "Mon", attendance: 97 },
    { day: "Tue", attendance: 95 },
    { day: "Wed", attendance: 96 },
    { day: "Thu", attendance: 94 },
    { day: "Fri", attendance: 98 },
    { day: "Sat", attendance: 92 },
    { day: "Sun", attendance: 95 },
  ],

  company: [
    { day: "Mon", attendance: 84 },
    { day: "Tue", attendance: 82 },
    { day: "Wed", attendance: 87 },
    { day: "Thu", attendance: 80 },
    { day: "Fri", attendance: 85 },
    { day: "Sat", attendance: 79 },
    { day: "Sun", attendance: 88 },
  ],
} as const;

const chartConfig = {
  attendance: {
    label: "Attendance",
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
  const { workspace } = useWorkspace();

  const chartRows =
    attendanceByWorkspace[workspace.id as keyof typeof attendanceByWorkspace] ??
    attendanceByWorkspace.worksmart;

  const firstDay = chartRows[0].attendance;
  const lastDay = chartRows.at(-1)?.attendance ?? firstDay;

  const growthPct = (((lastDay - firstDay) / firstDay) * 100).toFixed(1);

  return (
    <DashboardCard className="gap-0 md:col-span-2">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Daily attendance</CardTitle>

          <Delta value={Number(growthPct)} variant="badge">
            <DeltaIcon variant="trend" />
            <DeltaValue />
          </Delta>
        </div>

        <CardDescription>
          Worker attendance percentage for {workspace.name}, last 7 days.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          className="aspect-auto h-60 w-full md:h-80"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartRows}>
            <XAxis
              axisLine={false}
              dataKey="day"
              interval={0}
              tickLine={false}
              tickMargin={10}
            />

            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />

            <Bar
              dataKey="attendance"
              className="bg-brand text-brand"
              fill="currentColor"
              shape={<CustomGradientBar />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  );
}
