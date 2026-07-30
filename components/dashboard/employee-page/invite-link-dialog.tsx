"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  SendHorizonalIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type GeneratedInvite = {
  invite_link: string;
  qr_code_url?: string;
  expires_at?: string;
  role: string;
  position: string;
};

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface InviteLinkDialogProps {
  onGenerated?: () => void;
}

export function InviteLinkDialog({ onGenerated }: InviteLinkDialogProps) {
  const { workspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("employee");
  const [role, setRole] = useState("member");
  const [expireValue, setExpireValue] = useState(24);
  const [expireUnit, setExpireUnit] = useState<"hours" | "days">("hours");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvite, setGeneratedInvite] =
    useState<GeneratedInvite | null>(null);
  const [copied, setCopied] = useState(false);

  const resetAndClose = () => {
    setOpen(false);
    setGeneratedInvite(null);
    setPosition("employee");
    setRole("member");
    setExpireValue(24);
    setExpireUnit("hours");
    setCopied(false);
  };

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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.detail || "Failed to generate invite link.");
        return;
      }

      setGeneratedInvite(data);
      toast.success("Invite link generated.");
      onGenerated?.();
    } catch {
      toast.error("Failed to generate invite link.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedInvite?.invite_link) return;
    try {
      await navigator.clipboard.writeText(generatedInvite.invite_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isGenerating) {
          if (!v) resetAndClose();
          else setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 text-xs cursor-pointer gap-1.5 bg-brand hover:bg-brand/90 font-medium"
        >
          <SendHorizonalIcon className="size-3.5" /> Invite Link
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => isGenerating && e.preventDefault()}
        onEscapeKeyDown={(e) => isGenerating && e.preventDefault()}
      >
        {!generatedInvite ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-tight">
                Generate Invite Link
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-normal">
                Create a shareable link so a new person can join this
                workspace directly.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="invite-position" className="text-xs font-semibold">
                  Position
                </Label>
                <Input
                  id="invite-position"
                  placeholder="employee"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="text-xs h-9 bg-card"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invite-role" className="text-xs font-semibold">
                  Workspace Role
                </Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="invite-role" className="text-xs h-9 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member" className="text-xs">
                      Member
                    </SelectItem>
                    <SelectItem value="admin" className="text-xs">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invite-expiry" className="text-xs font-semibold">
                  Expires in
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-expiry"
                    type="number"
                    min={1}
                    max={expireUnit === "days" ? 30 : 720}
                    value={expireValue}
                    onChange={(e) =>
                      setExpireValue(Number(e.target.value) || 1)
                    }
                    className="text-xs h-9 bg-card"
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
                    <SelectTrigger className="text-xs h-9 w-24 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours" className="text-xs">
                        Hours
                      </SelectItem>
                      <SelectItem value="days" className="text-xs">
                        Days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9 cursor-pointer"
                disabled={isGenerating}
                onClick={resetAndClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs cursor-pointer h-9 min-w-30 bg-brand hover:bg-brand/90"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Link"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-tight">
                Invite link ready
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-normal">
                Share this link with the person you want to invite as{" "}
                {generatedInvite.role}.
              </DialogDescription>
            </DialogHeader>

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
                value={generatedInvite.invite_link}
                className="h-9 text-xs font-mono bg-card"
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="cursor-pointer bg-brand hover:bg-brand/90"
                onClick={resetAndClose}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
