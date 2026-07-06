import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { SettingsDirectory } from "@/components/dashboard/setting-page/settings-directory";

export const metadata: Metadata = {
  title: "Settings | WorkSmart",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsDirectory />
    </AppShell>
  );
}
