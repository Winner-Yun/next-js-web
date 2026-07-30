import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { TelegramDirectory } from "@/components/dashboard/telegram-page/telegram-directory";

export const metadata: Metadata = {
  title: "Telegram | WorkSmart",
};

export default function TelegramConnectPage() {
  return (
    <AppShell>
      <TelegramDirectory />
    </AppShell>
  );
}
