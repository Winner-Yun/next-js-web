// components/dashboard/dashboard-home/dashboard.tsx
"use client"; // Add this to allow using hooks

import { AttendanceChart } from "@/components/dashboard/dashboard-home/attendanceChart-chart";
import { AttendanceStatusChart } from "@/components/dashboard/dashboard-home/attendanceStatusChart";
import { DashboardActivity } from "@/components/dashboard/dashboard-home/dashboard-activity";
import { DashboardAttendance } from "@/components/dashboard/dashboard-home/dashboard-attendance";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-home/dashboard-skeleton";
import { DashboardStats } from "@/components/dashboard/dashboard-home/stats";
import { useWorkspace } from "@/provider/workspace-provider";

export function DashboardPage() {
  const { workspace, isLoading } = useWorkspace();

  if (isLoading || !workspace) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <AttendanceChart />
      <AttendanceStatusChart />
      <DashboardAttendance />
      <DashboardActivity className="lg:col-span-2" />
    </div>
  );
}
