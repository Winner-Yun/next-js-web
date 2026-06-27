import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { ReportDirectory } from "@/components/dashboard/report-page/report-directory";

export const metadata: Metadata = {
  title: "Reports | WorkSmart",
};

export default function ReportsPage() {
  return (
    <AppShell>
      <ReportDirectory />
    </AppShell>
  );
}
