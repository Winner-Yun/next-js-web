import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { PolicyDirectory } from "@/components/dashboard/workspace-policy/policy-directory";

export const metadata: Metadata = {
  title: "Workspace Policies | WorkSmart",
};

export default async function WorkspacePolicyPage() {
  return (
    <AppShell>
      {/* Explicitly passing the workspace workspaceId down to scope all operations */}
      <PolicyDirectory />
    </AppShell>
  );
}
