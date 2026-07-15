"use client";

import { AppSearch } from "@/components/dashboard/appShell/app-search";
import { navGroups } from "@/components/dashboard/appShell/app-shared";
import { CustomTrigger } from "@/components/dashboard/appShell/custom-trigger";
import { ThemeSwitcher } from "@/components/dashboard/appShell/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/provider/workspace-provider";
import { SettingsIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import type { GeofenceZone } from "../geofencing/types";

// Standard workspace authenticated fetcher[cite: 5]
const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export function AppSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // States to allow users to dismiss the warning bubbles individually[cite: 5]
  const [isGeofenceAlertDismissed, setIsGeofenceAlertDismissed] =
    useState(false);
  const [isPolicyAlertDismissed, setIsPolicyAlertDismissed] = useState(false);

  const {
    workspaces,
    workspace,
    isLoading: isWorkspaceLoading,
  } = useWorkspace();
  const hasWorkspace = workspaces && workspaces.length > 0;

  const { data: zonesData } = useSWR<GeofenceZone[]>(
    workspace?.id ? `/api/workspace/${workspace.id}/geofences` : null,
    fetcher,
    { revalidateOnFocus: false },
  );


  const { data: policiesData } = useSWR<unknown[]>(
    workspace?.id ? `/api/workspace/${workspace.id}/policies` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const isAtDashboardHome = pathname === "/dashboard";

  // Check Geofence status[cite: 5]
  const hasNoGeofences = zonesData && zonesData.length === 0;
  const showGeofenceAlert =
    isAtDashboardHome && hasNoGeofences && !isGeofenceAlertDismissed;

  // Check Policy status[cite: 5]
  const hasNoPolicies = policiesData && policiesData.length === 0;
  const showPolicyAlert =
    isAtDashboardHome && hasNoPolicies && !isPolicyAlertDismissed;

  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;

    const query = searchQuery.toLowerCase();

    return navGroups
      .map((group) => {
        const filteredItems = group.items.filter((item) =>
          item.title.toLowerCase().includes(query),
        );

        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  return (
    <Sidebar
      className={cn(
        "*:data-[slot=sidebar-inner]:bg-background",
        "transition-[left,right,top,width]",
      )}
      collapsible="offcanvas"
      variant="sidebar"
    >
      <SidebarHeader className="h-(--app-header-height,3rem) flex-row items-center justify-between ">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <Image
              src="/worksmart.png"
              alt="WorkSmart logo"
              width={30}
              height={30}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="font-medium text-brand pt-1">WorkSmart</span>
          </Link>
        </Button>

        <CustomTrigger place="sidebar" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AppSearch
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={isWorkspaceLoading}
          />
        </SidebarGroup>

        {filteredNavGroups.length > 0 ? (
          filteredNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
                {group.label}
              </SidebarGroupLabel>

              <SidebarMenu>
                {group.items.map((item) => {
                  const isCurrentActive = pathname === item.path;

                  // Identify target configuration items[cite: 5]
                  const isGeofencesItem = item.title === "Geofences";
                  const isPoliciesItem = item.title === "Workspaces Policies";

                  const isAllowedWhenEmpty =
                    item.title === "Dashboard" ||
                    item.title === "Workspaces" ||
                    item.title === "Settings";
                  const isDisabled =
                    isWorkspaceLoading ||
                    (!hasWorkspace && !isAllowedWhenEmpty);

                  // Decide if this specific item should show an active warning style[cite: 5]
                  const hasWarning =
                    (isGeofencesItem && hasNoGeofences) ||
                    (isPoliciesItem && hasNoPolicies);

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="relative flex flex-col gap-1"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isCurrentActive}
                        tooltip={item.title}
                        disabled={isDisabled}
                        className={cn(
                          hasWarning &&
                            !isCurrentActive &&
                            "border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10",
                        )}
                      >
                        <Link
                          href={isDisabled ? "#" : item.path || "#"}
                          onClick={(e) => {
                            if (isDisabled) e.preventDefault();
                          }}
                          className={cn(
                            isDisabled &&
                              "pointer-events-none opacity-50 cursor-not-allowed",
                          )}
                        >
                          <div className="relative flex items-center justify-center">
                            {item.icon}
                            {/* Pulsing notification dot next to the icon[cite: 5] */}
                            {hasWarning && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              </span>
                            )}
                          </div>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {/* --- INLINE GEOFENCE WARNING BOX ---[cite: 5] */}
                      {isGeofencesItem && showGeofenceAlert && (
                        <div className="mx-2 mt-1 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm animate-in fade-in duration-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                Setup Required
                              </h4>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                You haven&apos;t set up any tracking zones yet.
                                Click here to configure geofences.
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsGeofenceAlertDismissed(true);
                              }}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent p-0.5 rounded transition-colors shrink-0"
                            >
                              <XIcon className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* --- INLINE WORKSPACE POLICIES WARNING BOX ---[cite: 5] */}
                      {isPoliciesItem && showPolicyAlert && (
                        <div className="mx-2 mt-1 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm animate-in fade-in duration-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                Policies Required
                              </h4>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                No active schedules or structures are set up.
                                Click here to create a policy.
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPolicyAlertDismissed(true);
                              }}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent p-0.5 rounded transition-colors shrink-0"
                            >
                              <XIcon className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))
        ) : (
          <div className="py-6 px-4 text-center text-sm text-muted-foreground">
            No pages found for &quot;{searchQuery}&quot;
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="px-4">
        <div
          className={cn(
            "flex items-center pt-4 pb-2",
            isWorkspaceLoading && "pointer-events-none opacity-50",
          )}
        >
          <ThemeSwitcher />
          <Button
            asChild
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
            disabled={isWorkspaceLoading}
          >
            <Link aria-label="Settings" href="/setting-page">
              <SettingsIcon />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
