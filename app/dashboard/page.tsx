// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { DashboardPage } from "@/components/dashboard/dashboard-home/dashboard";
import { DashboardSplash } from "@/components/dashboard/dashboard-splash/dashboard-splash";
import { WorkspaceProvider } from "@/provider/workspace-provider";

export const metadata: Metadata = {
  title: "Dashboard | WorkSmart",
};

export default function Dashboard() {
  return (
    <WorkspaceProvider>
      <DashboardSplash>
        <AppShell>
          <DashboardPage />
        </AppShell>
      </DashboardSplash>
    </WorkspaceProvider>
  );
}
