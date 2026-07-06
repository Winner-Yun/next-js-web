import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { WorkspacesDirectory } from "@/components/dashboard/workspace-page/workspace-directory";

export const metadata: Metadata = {
  title: "Workspaces | WorkSmart",
};

export default function WorkspacesPage() {
  return (
    <AppShell>
      <WorkspacesDirectory />
    </AppShell>
  );
}
