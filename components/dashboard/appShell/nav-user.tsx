// components/dashboard/nav-user.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const profileFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

export function NavUser() {
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading,
  } = useSWR("/api/auth/me", profileFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth");
    router.refresh();
  };

  if (isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (error || !user) {
    return (
      <button
        onClick={handleLogout}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        Session expired. Log out
      </button>
    );
  }

  const userInitial = user.name ? user.name[0].toUpperCase() : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-offset-background transition-all hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary">
          <Avatar className="size-8 cursor-pointer">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-sm">{user.name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            <span>Account</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <SettingsIcon className="mr-2 size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOutIcon className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
