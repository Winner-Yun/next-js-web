// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-home/dashboard-content";
import { DashboardSplash } from "@/components/dashboard/dashboard-splash/dashboard-splash";

export const metadata: Metadata = {
  title: "Dashboard | WorkSmart",
};

export default function Dashboard() {
  return (
    
      <DashboardSplash>
        <AppShell>
          <DashboardContent />
        </AppShell>
      </DashboardSplash>

  );
}
