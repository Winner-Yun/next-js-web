"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

export function NotificationSettings() {
  const [alertsEnabled, setAlertsEnabled] = useLocalStorage(
    "alertsEnabled",
    true,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive system alerts and updates.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      <div className="flex items-center justify-between max-w-xl p-4 border border-muted/60 rounded-xl">
        <div className="space-y-0.5 pr-4">
          <label className="text-sm font-semibold text-foreground">
            Alert Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive push alerts for important activity, attendances, and system
            warnings.
          </p>
        </div>

        {/* Tailwind Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={alertsEnabled}
            onChange={() => setAlertsEnabled(!alertsEnabled)}
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>
    </div>
  );
}
