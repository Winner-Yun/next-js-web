import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { ReportDirectory } from "@/components/dashboard/report-page/report-directory";

export const metadata: Metadata = {
  title: "Leave Requests | WorkSmart",
};

export default function LeaveRequestsPage() {
  return (
    <AppShell>
      <ReportDirectory />
    </AppShell>
  );
}
