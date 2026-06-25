import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { AttendanceDirectory } from "@/components/dashboard/attendance-log/attendance-directory";

export const metadata: Metadata = {
  title: "Attendance Logs | WorkSmart",
};

export default function AttendanceLogsPage() {
  return (
    <AppShell>
      <AttendanceDirectory />
    </AppShell>
  );
}
