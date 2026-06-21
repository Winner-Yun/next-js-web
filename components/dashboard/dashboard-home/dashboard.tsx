import { AttendanceHealth } from "@/components/dashboard/dashboard-home/attendance-health";
import { AttendanceStatusChart } from "@/components/dashboard/dashboard-home/attendanceStatusChart";
import { DashboardActivity } from "@/components/dashboard/dashboard-home/dashboard-activity";
import { DashboardAttendance } from "@/components/dashboard/dashboard-home/dashboard-attendance";
import { AttendanceChart } from "@/components/dashboard/dashboard-home/attendanceChart-chart";
import { DashboardStats } from "@/components/dashboard/dashboard-home/stats";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <AttendanceChart />
      <AttendanceStatusChart />
      <DashboardAttendance />
      <AttendanceHealth />
      <DashboardActivity />
    </div>
  );
}
