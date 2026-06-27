"use client";

import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { AppearanceSettings } from "./appearance-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SettingsSidebar } from "./settings-sidebar";
import type { SettingsTabId } from "./types";
import { WorkspaceSettings } from "./workspace-settings";

export function SettingsDirectory() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile"); //[cite: 3]

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />; //[cite: 3]
      case "appearance":
        return <AppearanceSettings />; //[cite: 3]
      case "workspace":
        return <WorkspaceSettings />;
      case "notifications":
        return <NotificationSettings />;
      default:
        return <ProfileSettings />; //[cite: 3]
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
