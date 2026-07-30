import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { RequestDirectory } from "@/components/dashboard/request-page/request-directory";

export const metadata: Metadata = {
  title: "Requests | WorkSmart",
};

export default function RequestsPage() {
  return (
    <AppShell>
      <RequestDirectory />
    </AppShell>
  );
}
