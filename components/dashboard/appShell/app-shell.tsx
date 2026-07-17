"use client";

import { AppHeader } from "@/components/dashboard/appShell/app-header";
import { AppSidebar } from "@/components/dashboard/appShell/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ScanNotificationProvider } from "@/provider/scan-notification-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ScanNotificationProvider>
      <SidebarProvider
        className={cn(
          "h-svh w-full overflow-hidden",
          "[--app-wrapper-max-width:80rem]",
          "[--app-header-height:3rem]",
          "dark:bg-background",
        )}
      >
        <AppSidebar />

        <SidebarInset className="bg-background dark:bg-black flex flex-col h-full overflow-hidden">
          <AppHeader />

          <div
            className={cn(
              "flex flex-1 flex-col p-4 md:p-6 overflow-y-auto",
              "mx-auto w-full max-w-(--app-wrapper-max-width)",
              "bg-background dark:bg-black",
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ScanNotificationProvider>
  );
}
