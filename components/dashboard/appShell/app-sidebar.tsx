"use client";

import { AppSearch } from "@/components/dashboard/appShell/app-search";
import { navGroups } from "@/components/dashboard/appShell/app-shared";
import { CustomTrigger } from "@/components/dashboard/appShell/custom-trigger";
import { LatestChange } from "@/components/dashboard/appShell/latest-change";
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
import { SettingsIcon } from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
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
          <a href="#link">
            <Image
              src="/worksmart.png"
              alt="WorkSmart logo"
              width={30}
              height={30}
            />
            <span className="font-medium text-brand pt-1">WorkSmart</span>
          </a>
        </Button>

        <CustomTrigger place="sidebar" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AppSearch />
        </SidebarGroup>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <a href={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4">
        <LatestChange />
        <div className="flex items-center pt-4 pb-2">
          <ThemeSwitcher />
          <Button
            asChild
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
          >
            <a aria-label="Settings" href="#">
              <SettingsIcon />
            </a>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
