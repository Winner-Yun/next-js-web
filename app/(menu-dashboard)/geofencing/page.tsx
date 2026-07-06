import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { GeofencingDirectory } from "@/components/dashboard/geofencing-page/geofencing-directory";

export const metadata: Metadata = {
  title: "Geofences | WorkSmart",
};

export default function GeofencingPage() {
  return (
    <AppShell>
      <GeofencingDirectory />
    </AppShell>
  );
}
