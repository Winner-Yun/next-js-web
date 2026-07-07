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
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const { workspaces, isLoading } = useWorkspace();
  const hasWorkspace = workspaces && workspaces.length > 0;

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
            disabled={isLoading}
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

                  const isAllowedWhenEmpty =
                    item.title === "Dashboard" ||
                    item.title === "Workspaces" ||
                    item.title === "Settings";
                  const isDisabled =
                    isLoading || (!hasWorkspace && !isAllowedWhenEmpty);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isCurrentActive}
                        tooltip={item.title}
                        disabled={isDisabled}
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
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
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
            isLoading && "pointer-events-none opacity-50",
          )}
        >
          <ThemeSwitcher />
          <Button
            asChild
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
            disabled={isLoading}
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
