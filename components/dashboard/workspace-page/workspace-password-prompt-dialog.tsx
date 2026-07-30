/* eslint-disable react-hooks/set-state-in-effect */
"use client";

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
import { Label } from "@/components/ui/label";
import { AlertTriangleIcon, Loader2Icon, LockIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkspacePasswordPromptDialogProps {
  open: boolean;
  workspaceId: string;
  workspaceName: string;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export function WorkspacePasswordPromptDialog({
  open,
  workspaceId,
  workspaceName,
  onOpenChange,
  onVerified,
}: WorkspacePasswordPromptDialogProps) {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError(null);
      setIsVerifying(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsVerifying(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspaceId}/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Incorrect password. Please try again.");
        return;
      }

      onVerified();
    } catch {
      setError("Failed to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && isVerifying) return;
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="sm:max-w-100"
        onInteractOutside={(e) => isVerifying && e.preventDefault()}
        onEscapeKeyDown={(e) => isVerifying && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <LockIcon className="size-4 text-brand shrink-0" />
              Locked Workspace
            </DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              &ldquo;{workspaceName}&rdquo; is password-protected. Enter the
              password to switch into it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="workspace-password" className="text-xs font-medium">
              Password
            </Label>
            <Input
              id="workspace-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter workspace password"
              className="text-xs h-9 bg-background"
              disabled={isVerifying}
              required
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5">
            <AlertTriangleIcon className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-normal text-amber-700 dark:text-amber-400">
              Forgot the password? There is no reset option — the only way
              back in is to delete this workspace.
            </p>
          </div>

          <DialogFooter className="gap-2! sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 cursor-pointer bg-brand text-white hover:bg-brand/90"
              disabled={isVerifying || !password}
            >
              {isVerifying ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : null}
              Unlock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
