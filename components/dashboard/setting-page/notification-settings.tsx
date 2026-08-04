"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loader2Icon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type UserProfile = {
  telegram_chat_id?: string | null;
  telegram_notification?: boolean;
};

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

export function NotificationSettings() {
  const [alertsEnabled, setAlertsEnabled] = useLocalStorage(
    "alertsEnabled",
    true,
  );

  const {
    data: user,
    isLoading: isLoadingUser,
    mutate,
  } = useSWR<UserProfile>("/api/auth/me", profileFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const [isUpdatingTelegram, setIsUpdatingTelegram] = useState(false);

  const isTelegramConnected = Boolean(user?.telegram_chat_id);
  const isTelegramNotificationOn = Boolean(user?.telegram_notification);

  const handleToggleTelegramNotification = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not signed in.");
      return;
    }

    const nextValue = !isTelegramNotificationOn;
    setIsUpdatingTelegram(true);

    try {
      const res = await fetch("/api/notification/me/telegram-notification", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegram_notification: nextValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.detail || "Failed to update Telegram notifications.");
        return;
      }

      await mutate(data, { revalidate: false });
      toast.success(
        nextValue
          ? "Telegram notifications enabled."
          : "Telegram notifications disabled.",
      );
    } catch {
      toast.error("Failed to update Telegram notifications.");
    } finally {
      setIsUpdatingTelegram(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive system alerts and updates.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      <div className="flex items-center justify-between max-w-xl p-4 border border-muted/60 rounded-xl">
        <div className="space-y-0.5 pr-4">
          <label className="text-sm font-semibold text-foreground">
            Alert Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive push alerts for important activity, attendances, and system
            warnings.
          </p>
        </div>

        {/* Tailwind Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={alertsEnabled}
            onChange={() => setAlertsEnabled(!alertsEnabled)}
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>

      {isLoadingUser ? (
        <Skeleton className="h-24 w-full max-w-xl rounded-xl" />
      ) : (
        <div className="flex items-center justify-between max-w-xl p-4 border border-muted/60 rounded-xl gap-4">
          <div className="space-y-0.5 pr-4">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              {isUpdatingTelegram ? (
                <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
              ) : (
                <SendIcon className="size-3.5 text-muted-foreground" />
              )}
              Telegram Bot Alerts
            </label>
            <p className="text-sm text-muted-foreground">
              {isTelegramConnected
                ? "Receive alerts via the Telegram bot in your linked chat."
                : "Connect your Telegram account to enable bot alerts."}
            </p>
            {!isTelegramConnected && (
              <Link
                href="/telegram-connect"
                className="text-xs font-medium text-brand hover:underline inline-block mt-1"
              >
                Connect Telegram &rarr;
              </Link>
            )}
          </div>

          {/* Tailwind Toggle Switch */}
          <label
            className={`relative inline-flex items-center shrink-0 ${
              isTelegramConnected && !isUpdatingTelegram
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isTelegramNotificationOn}
              disabled={!isTelegramConnected || isUpdatingTelegram}
              onChange={handleToggleTelegramNotification}
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
          </label>
        </div>
      )}
    </div>
  );
}
