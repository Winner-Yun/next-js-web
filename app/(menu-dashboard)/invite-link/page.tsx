import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { InviteLinkDirectory } from "@/components/dashboard/invite-link-page/invite-link-directory";

export const metadata: Metadata = {
  title: "Invite Link | WorkSmart",
};

export default function InviteLinkPage() {
  return (
    <AppShell>
      <InviteLinkDirectory />
    </AppShell>
  );
}
