"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BellIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PaletteIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
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
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error("Failed to call logout API:", error);
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");


    window.location.replace("/");
  };

  return (
    <>
      <div className="flex flex-col h-full md:pb-4">
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-1">
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

          {/* Separator for desktop view */}
          <div className="hidden md:block my-2 w-full h-px bg-muted/60" />

          {/* Logout Trigger Button */}
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all shrink-0 md:shrink border border-transparent text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOutIcon className="size-4" />
            Log out
          </button>
        </nav>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Sign out of WorkSmart?</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign back in
              with your credentials to access your workspace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2! sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Yes, log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
