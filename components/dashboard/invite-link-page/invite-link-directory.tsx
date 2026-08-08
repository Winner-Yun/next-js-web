"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  CheckIcon,
  CopyIcon,
  LinkIcon,
  Loader2Icon,
  QrCodeIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { InviteConfirmDialog } from "./invite-confirm-dialog";

type InviteRecord = {
  id: string;
  workspace_id: string;
  code: string;
  invite_link: string;
  qr_code_url: string;
  position: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
};

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to fetch invite links.");
  }
  return res.json();
};

// Backend stores/returns timestamps in UTC without a timezone suffix
// (e.g. "2026-07-30T10:00:00"), which JS `Date` would otherwise parse
// as local time. Force UTC interpretation so it converts to the
// viewer's local time correctly.
function toUtcDate(dateStr: string): Date {
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}

function formatDate(dateStr: string) {
  try {
    return toUtcDate(dateStr).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(expiresAt: string) {
  return toUtcDate(expiresAt).getTime() < Date.now();
}

// The link people actually click is our own accept page, not whatever
// raw value the backend returns in `invite_link`.
function buildInviteUrl(code: string) {
  if (typeof window === "undefined") return code;
  return `${window.location.origin}/invite/${code}`;
}

export function InviteLinkDirectory() {
  const { workspace } = useWorkspace();

  const { data, isLoading, mutate } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/invites` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const invites: InviteRecord[] = Array.isArray(data)
    ? data
    : data?.data || data?.invites || [];

  const [position, setPosition] = useState("employee");
  const [role, setRole] = useState("member");
  const [expireValue, setExpireValue] = useState(24);
  const [expireUnit, setExpireUnit] = useState<"hours" | "days">("hours");
  const [isGenerating, setIsGenerating] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [generatedInvite, setGeneratedInvite] = useState<InviteRecord | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/workspace/${workspace.id}/invite`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          position,
          role,
          expire_hours: expireUnit === "days" ? expireValue * 24 : expireValue,
        }),
      });

      const resData = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(resData?.detail || "Failed to generate invite link.");
        return;
      }

      setGeneratedInvite(resData);
      toast.success("Invite link generated.");
      await mutate();
    } catch {
      toast.error("Failed to generate invite link.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async (inviteId: string) => {
    setRevokingId(inviteId);
    try {
      const res = await fetch(`/api/workspace/invite/${inviteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        toast.error(err?.detail || "Failed to revoke invite link.");
        return;
      }

      toast.success("Invite link revoked.");
      await mutate();
    } catch {
      toast.error("Failed to revoke invite link.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="border-b border-muted/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Invite Link
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          Generate a shareable link (with QR code) so people can join this
          workspace directly.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl p-4 border border-muted/60 rounded-xl"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Position
          </label>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="employee"
            className="h-10 text-sm border-muted/60"
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Role
          </label>
          <Select value={role} onValueChange={setRole} disabled={isGenerating}>
            <SelectTrigger className="h-10 w-full text-sm border-muted/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Expires in
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={expireUnit === "days" ? 30 : 720}
              value={expireValue}
              onChange={(e) => setExpireValue(Number(e.target.value) || 1)}
              className="h-10 text-sm border-muted/60"
              disabled={isGenerating}
            />
            <Select
              value={expireUnit}
              onValueChange={(v) => {
                const unit = v as "hours" | "days";
                setExpireValue((prev) =>
                  unit === "days"
                    ? Math.max(1, Math.round(prev / 24))
                    : prev * 24 > 720
                      ? 720
                      : prev * 24,
                );
                setExpireUnit(unit);
              }}
              disabled={isGenerating}
            >
              <SelectTrigger className="h-10 w-28 text-sm border-muted/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <Button
            type="submit"
            disabled={isGenerating || !workspace?.id}
            className="bg-brand cursor-pointer hover:bg-brand/90 text-white"
          >
            {isGenerating ? (
              <Loader2Icon className="size-4 mr-2 animate-spin" />
            ) : (
              <LinkIcon className="size-4 mr-2" />
            )}
            Generate Invite Link
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Active & Past Invites
        </h4>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <div className="border border-dashed border-muted/60 rounded-xl p-6 text-center text-sm text-muted-foreground">
            No invite links yet. Generate one above.
          </div>
        ) : (
          <div className="space-y-2 max-h-125 overflow-y-auto pr-1">
            {invites.map((invite) => {
              const expired = isExpired(invite.expires_at);
              return (
                <div
                  key={invite.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-muted/60 rounded-xl"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {invite.code}
                      </span>
                      <Badge
                        variant={
                          expired || invite.status !== "active"
                            ? "outline"
                            : "default"
                        }
                        className={
                          !expired && invite.status === "active"
                            ? "bg-brand/10 text-brand border-brand/20"
                            : ""
                        }
                      >
                        {expired ? "expired" : invite.status}
                      </Badge>
                      <Badge variant="secondary">{invite.role}</Badge>
                      <Badge variant="secondary">{invite.position}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Created {formatDate(invite.created_at)} · Expires{" "}
                      {formatDate(invite.expires_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setGeneratedInvite(invite)}
                    >
                      <QrCodeIcon className="size-3.5 mr-1.5" />
                      View
                    </Button>
                    <InviteConfirmDialog
                      title="Revoke invite link?"
                      description={`This will immediately invalidate the link for code "${invite.code}". Anyone who hasn't used it yet won't be able to join with it anymore.`}
                      confirmText="Revoke"
                      onConfirm={() => handleRevoke(invite.id)}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        disabled={revokingId === invite.id}
                      >
                        {revokingId === invite.id ? (
                          <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Trash2Icon className="size-3.5 mr-1.5" />
                        )}
                        Revoke
                      </Button>
                    </InviteConfirmDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite details / QR dialog */}
      <Dialog
        open={generatedInvite !== null}
        onOpenChange={(open) => {
          if (!open) setGeneratedInvite(null);
        }}
      >
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Workspace invite link</DialogTitle>
            <DialogDescription>
              Share this link or QR code so people can join{" "}
              {workspace?.workspace_name || "this workspace"}.
            </DialogDescription>
          </DialogHeader>

          {generatedInvite && (
            <div className="space-y-4">
              {generatedInvite.qr_code_url && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedInvite.qr_code_url}
                    alt="Invite QR code"
                    className="size-40 rounded-lg border border-muted/60"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={buildInviteUrl(generatedInvite.code)}
                  className="h-10 text-xs font-mono border-muted/60"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="cursor-pointer shrink-0"
                  onClick={() => handleCopy(buildInviteUrl(generatedInvite.code))}
                >
                  {copied ? (
                    <CheckIcon className="size-4 text-emerald-500" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Expires {formatDate(generatedInvite.expires_at)} · Role:{" "}
                {generatedInvite.role} · Position: {generatedInvite.position}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setGeneratedInvite(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
