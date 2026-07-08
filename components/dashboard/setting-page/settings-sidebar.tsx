"use client";

import {
  BellIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  UserIcon,
} from "lucide-react";
import type { SettingsTab, SettingsTabId } from "./types";

const TABS: SettingsTab[] = [
  {
    id: "profile",
    label: "My Profile",
    icon: UserIcon,
    description: "Manage your personal information.",
  },

  {
    id: "appearance",
    label: "Appearance",
    icon: PaletteIcon,
    description: "Customize your UI theme.",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: BellIcon,
    description: "Configure your alerts.",
  },
  {
    id: "general",
    label: "General",
    icon: LayoutDashboardIcon,
    description: "Manage general application preferences.",
  },
];

interface SettingsSidebarProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all shrink-0 md:shrink border ${
              isActive
                ? "bg-brand/10 text-brand border-brand/20 shadow-xs"
                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon
              className={`size-4 ${isActive ? "text-brand" : "text-muted-foreground/70"}`}
            />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
