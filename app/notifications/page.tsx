import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { NotificationDirectory } from "@/components/dashboard/notifications-page/notification-directory";

export const metadata: Metadata = {
  title: "Notifications | WorkSmart",
};

export default function NotificationsPage() {
  return (
    <AppShell>
      <NotificationDirectory />
    </AppShell>
  );
}
