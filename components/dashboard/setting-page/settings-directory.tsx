"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { AppearanceSettings } from "./appearance-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SettingsSidebar } from "./settings-sidebar";
import type { SettingsTabId } from "./types";

export function SettingsDirectory() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");
  const [showSharedWorkspaces, setShowSharedWorkspaces] = useLocalStorage(
    "showSharedWorkspaces",
    true,
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "general":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                General Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage general application preferences.
              </p>
            </div>

            <div className="w-full h-px bg-muted/60" />

            <div className="flex items-center justify-between max-w-xl p-4 border border-muted/60 rounded-xl">
              <div className="space-y-0.5 pr-4">
                <label className="text-sm font-semibold text-foreground">
                  Show Shared Workspaces
                </label>
                <p className="text-sm text-muted-foreground">
                  Toggle visibility of workspaces shared with you.
                </p>
              </div>

              {/* Tailwind Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showSharedWorkspaces}
                  onChange={() =>
                    setShowSharedWorkspaces(!showSharedWorkspaces)
                  }
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-muted/60">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <SettingsIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              Manage your account settings and workspace preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        <main className="flex-1 bg-background rounded-xl border border-muted/40 p-6 shadow-sm min-h-100">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
