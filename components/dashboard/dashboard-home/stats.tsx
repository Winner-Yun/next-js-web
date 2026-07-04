// components/dashboard/dashboard-home/stats.tsx
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
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data"; // Import the hook

export function DashboardStats() {
  const { members, attendance, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <>
        {/* Render some skeletons while loading */}
        {[1, 2, 3, 4].map((i) => (
          <DashboardCard key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </DashboardCard>
        ))}
      </>
    );
  }

  // This is an example of how you calculate stats from your API arrays
  const totalEmployees = members.length;
  const presentToday = attendance.filter((a) => a.status === "Present").length;
  const lateArrivals = attendance.filter((a) => a.status === "Late").length;
  const leaveRequests = attendance.filter((a) => a.status === "Leave").length; // Adjust based on your API

  const dynamicStats = [
    { label: "Total Employees", value: totalEmployees.toString(), delta: 0 },
    { label: "Present Today", value: presentToday.toString(), delta: 0 },
    { label: "Late Arrivals", value: lateArrivals.toString(), delta: 0 },
    { label: "Leave Requests", value: leaveRequests.toString(), delta: 0 },
  ];

  return (
    <>
      {dynamicStats.map((s) => (
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
