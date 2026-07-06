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
import { useWorkspace } from "@/provider/workspace-provider"; // Import workspace hook
import { useId } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const VISIBLE_DAYS = 7;

//  Separate data by workspace ID matching your provider
const attendanceDataByWorkspace = {
  worksmart: [
    { date: "2026-04-07", present: 92, absent: 8 },
    { date: "2026-04-08", present: 95, absent: 5 },
    { date: "2026-04-09", present: 88, absent: 12 },
    { date: "2026-04-10", present: 91, absent: 9 },
    { date: "2026-04-11", present: 86, absent: 14 },
    { date: "2026-04-12", present: 94, absent: 6 },
    { date: "2026-04-13", present: 96, absent: 4 },
  ],
  school: [
    { date: "2026-04-07", present: 97, absent: 3 },
    { date: "2026-04-08", present: 95, absent: 5 },
    { date: "2026-04-09", present: 96, absent: 4 },
    { date: "2026-04-10", present: 94, absent: 6 },
    { date: "2026-04-11", present: 98, absent: 2 },
    { date: "2026-04-12", present: 92, absent: 8 },
    { date: "2026-04-13", present: 95, absent: 5 },
  ],
  company: [
    { date: "2026-04-07", present: 84, absent: 16 },
    { date: "2026-04-08", present: 82, absent: 18 },
    { date: "2026-04-09", present: 87, absent: 13 },
    { date: "2026-04-10", present: 80, absent: 20 },
    { date: "2026-04-11", present: 85, absent: 15 },
    { date: "2026-04-12", present: 79, absent: 21 },
    { date: "2026-04-13", present: 88, absent: 12 },
  ],
} as const;

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

  //  Consume workspace details
  const { workspace } = useWorkspace();

  // Pick up selected dataset reactively or fall back to 'worksmart'
  const activeData =
    attendanceDataByWorkspace[
      workspace.id as keyof typeof attendanceDataByWorkspace
    ] ?? attendanceDataByWorkspace.worksmart;

  const chartRows = activeData.slice(-VISIBLE_DAYS);

  return (
    <DashboardCard className="gap-0 md:col-span-2">
      <CardHeader>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Attendance status</CardTitle>
          </div>

          <CardDescription>
            Worker attendance present and absent for {workspace.name}, last{" "}
            {VISIBLE_DAYS} days.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
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
              tickFormatter={(value) => formatDate(String(value), "day-month")}
              tickLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />

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

            {/* PRESENT = BRAND */}
            <Line
              dataKey="present"
              dot={false}
              filter={`url(#${idLineGlow})`}
              stroke="currentColor"
              strokeWidth={2}
              type="step"
              className="text-brand"
            />

            {/* ABSENT = DESTRUCTIVE */}
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
      </CardContent>
    </DashboardCard>
  );
}
