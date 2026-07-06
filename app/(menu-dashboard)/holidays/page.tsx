import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { HolidayDirectory } from "@/components/dashboard/holidays-page/holiday-directory";

export const metadata: Metadata = {
  title: "Workspace Holidays | WorkSmart",
};

export default function HolidaysPage() {
  return (
    <AppShell>
      <HolidayDirectory />
    </AppShell>
  );
}
