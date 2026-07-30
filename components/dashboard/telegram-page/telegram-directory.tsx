"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2Icon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  SendIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserProfile = {
  telegram_chat_id?: string | null;
};

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// The backend doesn't document a fixed field name for the deep link, so
// look for the common candidates and fall back to any t.me URL in the payload.
function extractLink(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const candidates = ["invite_link", "link", "deep_link", "telegram_link", "url"];
  for (const key of candidates) {
    const val = obj[key];
    if (typeof val === "string" && val.length > 0) return val;
  }
  for (const val of Object.values(obj)) {
    if (typeof val === "string" && val.includes("t.me/")) return val;
  }
  return null;
}

export function TelegramDirectory() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectLink, setConnectLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me", {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.ok) {
          const profile = data as UserProfile;
          setIsConnected(Boolean(profile?.telegram_chat_id));
        }
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setConnectLink(null);
    try {
      const res = await fetch("/api/auth/me/telegram/connect", {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(
          data?.detail || "Failed to generate Telegram connect link.",
        );
        return;
      }

      const link = extractLink(data);
      if (!link) {
        toast.error("Telegram connect link was not returned by the server.");
        return;
      }

      setConnectLink(link);
    } catch {
      toast.error("Failed to generate Telegram connect link.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!connectLink) return;
    try {
      await navigator.clipboard.writeText(connectLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 p-px animate-in fade-in duration-300">
      <div className="border-b border-muted/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Telegram
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          Connect your account to Telegram to receive notifications directly
          in a chat. Available to workspace owners only.
        </p>
      </div>

      {isLoadingProfile ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : (
        <div className="border border-muted/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl shrink-0 ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isConnected ? (
                <CheckCircle2Icon className="size-5" />
              ) : (
                <SendIcon className="size-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isConnected
                  ? "Telegram is connected"
                  : "Telegram is not connected"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected
                  ? "You'll receive notifications in your linked Telegram chat."
                  : "Generate a link below and open it in Telegram to connect."}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-muted/60" />

          <Button
            onClick={handleGenerateLink}
            disabled={isGenerating}
            className="h-10 cursor-pointer text-xs bg-brand text-white hover:bg-brand/90"
          >
            <SendIcon className="size-4 mr-1.5" />
            {isGenerating
              ? "Generating..."
              : isConnected
                ? "Generate New Connect Link"
                : "Generate Connect Link"}
          </Button>

          {connectLink && (
            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={connectLink}
                  className="h-10 text-xs font-mono border-muted/60"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="cursor-pointer shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckIcon className="size-4 text-emerald-500" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer shrink-0 h-10 text-xs"
                  asChild
                >
                  <a href={connectLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="size-3.5 mr-1.5" />
                    Open
                  </a>
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ClockIcon className="size-3" />
                This link is valid for 15 minutes. Open it in Telegram and tap
                Start to connect.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
