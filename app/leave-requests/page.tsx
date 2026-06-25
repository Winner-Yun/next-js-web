import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { LeaveDirectory } from "@/components/dashboard/leave-request/leave-directory";

export const metadata: Metadata = {
  title: "Leave Requests | WorkSmart",
};

export default function LeaveRequestsPage() {
  return (
    <AppShell>
      <LeaveDirectory />
    </AppShell>
  );
}
