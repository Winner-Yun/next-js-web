import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { HelpGuidePage } from "@/components/dashboard/guild_page/guid_page";

export const metadata: Metadata = {
  title: "Guild | WorkSmart",
};

export default function GuildPage() {
  return (
    <AppShell>
      <HelpGuidePage />
    </AppShell>
  );
}
