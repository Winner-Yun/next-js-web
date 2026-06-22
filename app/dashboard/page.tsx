// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { DashboardPage } from "@/components/dashboard/dashboard-home/dashboard";

export default function Dashboard() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
