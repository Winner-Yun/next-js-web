// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { DashboardPage } from "@/components/dashboard/dashboard-home/dashboard";
import { WorkspaceProvider } from "@/provider/workspace-provider"; // [IMPORTANT]: Import the provider

export default function Dashboard() {
  return (
    <WorkspaceProvider>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </WorkspaceProvider>
  );
}
