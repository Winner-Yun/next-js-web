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
import { AlertTriangleIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkspaceSetPasswordDialogProps {
  children: React.ReactNode;
  hasPassword: boolean;
  onSave: (password: string) => Promise<void> | void;
}

export function WorkspaceSetPasswordDialog({
  children,
  hasPassword,
  onSave,
}: WorkspaceSetPasswordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      await onSave(password);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isSaving) return;
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-100"
        onInteractOutside={(e) => isSaving && e.preventDefault()}
        onEscapeKeyDown={(e) => isSaving && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {hasPassword ? "Update Workspace Password" : "Set Workspace Password"}
            </DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              {hasPassword
                ? "Set a new password for this workspace. The new password replaces the old one immediately."
                : "Lock this workspace so switching into it requires a password."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-medium">
                {hasPassword ? "New Password" : "Password"}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter a password"
                className="text-xs h-9 bg-background"
                autoFocus
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Re-enter the password"
                className="text-xs h-9 bg-background"
                required
                disabled={isSaving}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            {!hasPassword ? (
              <div className="flex items-start gap-2 rounded-lg border border-muted/60 bg-muted/20 p-2.5">
                <InfoIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] leading-normal text-muted-foreground">
                  You can change this password anytime from this same dialog.
                </p>
              </div>
            ) : null}

            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5">
              <AlertTriangleIcon className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-normal text-amber-700 dark:text-amber-400">
                There is no password recovery. If this password is
                forgotten, the only way to regain access is to delete this
                workspace.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2! sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 cursor-pointer bg-brand text-white hover:bg-brand/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : null}
              {hasPassword ? "Update Password" : "Set Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
