/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CustomTrigger } from "@/components/dashboard/appShell/custom-trigger";
import { NavUser } from "@/components/dashboard/appShell/nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/provider/workspace-provider";
import { BellIcon, HelpCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { WorkspaceSwitcher } from "../../ui/workspace-switcher";

// Inline fetcher for SWR caching
const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch notification logs");
  return res.json();
};

export function AppHeader() {
  const { workspace } = useWorkspace();
  const [optimisticCount, setOptimisticCount] = useState(0);

  // Connects to the same cached SWR endpoint as the directory
  const { data, mutate } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/alerts` : null,
    fetcher,
    { revalidateOnFocus: true },
  );

  // Reset the optimistic count back to 0 whenever fresh data arrives from the server
  useEffect(() => {
    setOptimisticCount(0);
  }, [data]);

  // Fallback to array and filter for unread (is_read === false)
  const notifications = Array.isArray(data) ? data : data?.data || [];
  const serverUnreadCount = notifications.filter(
    (n: unknown) => !n.is_read,
  ).length;

  // Combine real server unread count with any pending visual updates
  const unreadCount = serverUnreadCount + optimisticCount;

  useEffect(() => {
    const handleUpdate = () => mutate();

    const handleOptimisticAdd = () => setOptimisticCount((prev) => prev + 1);

    window.addEventListener("notifications-updated", handleUpdate);
    window.addEventListener("notification-optimistic-add", handleOptimisticAdd);

    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
      window.removeEventListener(
        "notification-optimistic-add",
        handleOptimisticAdd,
      );
    };
  }, [mutate]);

  return (
    <header className="sticky top-0 z-50 flex h-(--app-header-height) w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <CustomTrigger place="navbar" />
        <WorkspaceSwitcher />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <Button
          asChild
          aria-label="Notifications"
          size="icon-sm"
          className="cursor-pointer relative"
          variant="outline"
        >
          <Link href="/guild_page">
            <HelpCircleIcon />
          </Link>
        </Button>

        <Button
          asChild
          aria-label="Notifications"
          size="icon-sm"
          className="cursor-pointer relative"
          variant="outline"
        >
          <Link href="/notifications-alert">
            <div className="relative">
              <BellIcon className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-black text-white shadow-sm transition-all">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </Link>
        </Button>

        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  );
}
