"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data"; // Import the hook

export function DashboardStats() {
  // Extract all required data arrays from the hook
  const { members, attendance, leaves, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <>
      
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

  const totalEmployees = members.length;

  // Get today's date in YYYY-MM-DD format (local time)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Filter attendance records to only today's data
  const todayAttendance = attendance.filter((item: { date?: string }) => {
    if (!item.date) return false;
    // Normalize date string (could be ISO with time, take first 10 chars)
    const itemDate = item.date.substring(0, 10);
    return itemDate === todayStr;
  });

  const absentToday = todayAttendance.filter(
    (item: { status?: string }) => item.status === "absent",
  ).length;
  const lateArrivals = todayAttendance.filter(
    (item: { status?: string }) => item.status === "late",
  ).length;

  const leaveRequests = leaves.length;

  const dynamicStats = [
    { label: "Total Employees", value: totalEmployees.toString() },
    { label: "Absent Today", value: absentToday.toString() },
    { label: "Late Arrivals", value: lateArrivals.toString() },
    { label: "Leave Requests", value: leaveRequests.toString() },
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
        </DashboardCard>
      ))}
    </>
  );
}
