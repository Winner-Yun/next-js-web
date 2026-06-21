"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import {
  Delta,
  DeltaIcon,
  DeltaValue,
} from "@/components/dashboard/dashboard-home/delta";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspace } from "@/provider/workspace-provider"; // 1. Import workspace hook

// 2. Separate statistics by workspace ID matching your provider
const statsByWorkspace = {
  worksmart: [
    { label: "Total Employees", value: "128", delta: 4.2 },
    { label: "Present Today", value: "116", delta: 2.8 },
    { label: "Late Arrivals", value: "7", delta: -1.5 },
    { label: "Leave Requests", value: "5", delta: 11.1 },
  ],
  school: [
    { label: "Total Students", value: "850", delta: 0.5 },
    { label: "Present Today", value: "812", delta: 1.2 },
    { label: "Late Arrivals", value: "24", delta: -4.8 },
    { label: "Leave Requests", value: "14", delta: 5.0 },
  ],
  company: [
    { label: "Total Staff", value: "45", delta: 12.5 },
    { label: "Present Today", value: "42", delta: 8.3 },
    { label: "Late Arrivals", value: "1", delta: -50.0 },
    { label: "Leave Requests", value: "2", delta: 0.0 },
  ],
} as const;

export function DashboardStats() {
  // 3. Consume workspace details
  const { workspace } = useWorkspace();

  // 4. Pick active stats reactively or fall back to 'worksmart'
  const activeStats =
    statsByWorkspace[workspace.id as keyof typeof statsByWorkspace] ??
    statsByWorkspace.worksmart;

  return (
    <>
      {activeStats.map((s) => (
        <DashboardCard key={s.label}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-normal text-xs tracking-wide">
              {s.label}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-row items-center gap-2">
            <p className="font-semibold text-2xl tabular-nums">{s.value}</p>
          </CardContent>

          <CardFooter className="gap-1 rounded-none bg-background text-xs">
            <Delta value={s.delta}>
              <DeltaIcon />
              <DeltaValue />
            </Delta>

            <span className="text-muted-foreground">
              compared with last week
            </span>
          </CardFooter>
        </DashboardCard>
      ))}
    </>
  );
}
