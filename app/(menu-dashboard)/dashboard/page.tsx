// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { DashboardPage } from "@/components/dashboard/dashboard-home/dashboard";
import { DashboardSplash } from "@/components/dashboard/dashboard-splash/dashboard-splash";

export const metadata: Metadata = {
  title: "Dashboard | WorkSmart",
};

export default function Dashboard() {
  return (
    
      <DashboardSplash>
        <AppShell>
          <DashboardPage />
        </AppShell>
      </DashboardSplash>

  );
}
