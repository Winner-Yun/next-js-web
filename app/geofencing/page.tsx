import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { GeofencingDirectory } from "@/components/dashboard/geofencing/geofencing-directory";

export default function GeofencingPage() {
  return (
    <AppShell>
      <GeofencingDirectory />
    </AppShell>
  );
}
