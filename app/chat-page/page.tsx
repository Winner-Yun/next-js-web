// page.tsx
import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { ChatDirectory } from "@/components/dashboard/chat-page/chat-directory";

export const metadata: Metadata = {
  title: "Chat & Messages | WorkSmart",
};

export default function Dashboard() {
  return (
    <AppShell>
      <ChatDirectory />
    </AppShell>
  );
}
