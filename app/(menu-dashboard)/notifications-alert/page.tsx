import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { NotificationAlertDirectory } from "@/components/dashboard/notification-alert/notification-alert-directory";

export const metadata: Metadata = {
  title: "Notifications | WorkSmart",
};

export default function NotificationsPage() {
  return (
    <AppShell>
      <NotificationAlertDirectory />
    </AppShell>
  );
}
