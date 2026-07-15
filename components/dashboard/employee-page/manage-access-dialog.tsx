/* eslint-disable react-hooks/exhaustive-deps */
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
  AlertTriangleIcon,
  Loader2Icon,
  MailIcon,
  ShieldCheckIcon,
  UserMinusIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

const membersFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch workspace members");
  return res.json();
};

interface ManageAccessDialogProps {
  onSuccess?: () => void;
}

export function ManageAccessDialog({ onSuccess }: ManageAccessDialogProps) {
  const { workspace } = useWorkspace();

  // State for the workflow
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [managementAction, setManagementAction] = useState("suspend");

  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch workspace members to populate email suggestions
  const { data: membersData } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/members` : null,
    membersFetcher,
    { revalidateOnFocus: false },
  );

  const members: WorkspaceMember[] = membersData?.members || [];

  const filteredSuggestions = useMemo(() => {
    if (!email.trim()) return [];
    return members.filter(
      (m: WorkspaceMember) =>
        m.email?.toLowerCase().includes(email.toLowerCase()) ||
        m.name?.toLowerCase().includes(email.toLowerCase()),
    );
  }, [email, members]);

  const isTargetOwner = useMemo(() => {
    const matchedMember = members.find(
      (m: WorkspaceMember) =>
        m.email?.toLowerCase() === email.trim().toLowerCase(),
    );
    return matchedMember?.role?.toLowerCase() === "owner";
  }, [email, members]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isTargetOwner) return;

    if (!workspace?.id) {
      toast.error(
        "Please ensure an active workspace session context is active.",
      );
      return;
    }

    // Auto-map to user ID if they typed the email manually without clicking the suggestion
    const matchedMember = members.find(
      (m: WorkspaceMember) =>
        m.email?.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!matchedMember && !userId) {
      toast.error("Could not find a workspace member with this email address.");
      return;
    }

    if (matchedMember && matchedMember.role?.toLowerCase() === "owner") {
      toast.error(
        "Administrative protection: You cannot modify the workspace owner.",
      );
      return;
    }

    // Lock in the mapped ID before proceeding
    if (matchedMember) setUserId(matchedMember.id);

    setShowSuggestions(false);
    setIsConfirming(true);
  };

  const handleFinalConfirm = async () => {
    if (!workspace?.id || !userId || isTargetOwner) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");

      let res: Response;

      if (managementAction === "remove") {
        // Route to the DELETE route handlers directly
        res = await fetch(`/api/workspace/${workspace.id}/members/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });
      } else {
        // Map the UI action to the specific backend status strings for PATCH
        let targetStatus = "suspended";
        if (managementAction === "unsuspend") targetStatus = "active";

        res = await fetch(
          `/api/workspace/${workspace.id}/members/${userId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: targetStatus,
              email: email.trim(),
            }),
          },
        );
      }

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          responseData.detail ||
            "Failed to finalize pipeline modification status.",
        );
      }

      // Contextual notifications based on the operation performed
      if (managementAction === "suspend") {
        toast.warning(
          `Suspension status successfully committed for ${email.trim()}`,
        );
      } else if (managementAction === "unsuspend") {
        toast.success(`Access successfully restored for ${email.trim()}`);
      } else {
        toast.success(
          `Permanently removed workspace access for ${email.trim()}`,
        );
      }

      onSuccess?.();

      setEmail("");
      setUserId("");
      setManagementAction("suspend");
      setIsConfirming(false);
      setIsOpen(false);
    } catch (error: unknown) {
      toast.error(
        error.message || "An unexpected network sequence failure occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent dialog from closing if an API submission is currently active
        if (isSubmitting) return;

        setIsOpen(open);
        if (!open) {
          // Reset states when closed
          setIsConfirming(false);
          setIsSubmitting(false);
          setShowSuggestions(false);
          setEmail("");
          setUserId("");
          setManagementAction("suspend");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-9 text-xs font-medium text-destructive hover:bg-destructive/5 hover:text-destructive border-muted/80"
        >
          <UserMinusIcon className="size-4" />
          Manage Access
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-105 overflow-visible"
        onInteractOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        {!isConfirming ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base text-foreground">
                Manage Member Account Access
              </DialogTitle>
              <DialogDescription className="text-xs">
                Search for an employee by email or name to modify their
                workspace access status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5 relative">
                <Label htmlFor="actionEmail" className="text-xs font-medium">
                  Search Employee
                </Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="actionEmail"
                    type="email"
                    placeholder="employee@company.com..."
                    value={email}
                    autoComplete="off"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowSuggestions(true);
                      setUserId("");
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className={`pl-9 text-xs h-9 bg-background ${
                      isTargetOwner
                        ? "border-destructive/60 focus-visible:ring-destructive"
                        : ""
                    }`}
                    required
                  />
                </div>

                {/* Owner Warning Message Banner */}
                {isTargetOwner && (
                  <p className="text-[11px] text-destructive font-semibold mt-1 flex items-center gap-1 animate-in fade-in-50 duration-200">
                    <AlertTriangleIcon className="size-3 shrink-0" />
                    This account belongs to the workspace Owner. Their access
                    tiers cannot be altered.
                  </p>
                )}

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions &&
                  email.trim() &&
                  filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-48 overflow-y-auto">
                      {filteredSuggestions.map((m: WorkspaceMember) => (
                        <div
                          key={m.id}
                          className="flex flex-col px-3 py-2 text-xs hover:bg-muted cursor-pointer transition-colors border-b border-border/50 last:border-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setEmail(m.email);
                            setUserId(m.id);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex justify-between items-center w-full font-medium text-foreground">
                            <span className="truncate">{m.name}</span>
                            {m.role?.toLowerCase() === "owner" && (
                              <span className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Owner
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center w-full mt-0.5">
                            <span className="text-muted-foreground truncate">
                              {m.email}
                            </span>
                            {/* Visual indicator if they are currently suspended */}
                            {m.status === "suspended" && (
                              <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-medium uppercase">
                                Suspended
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                {showSuggestions &&
                  email.trim() &&
                  filteredSuggestions.length === 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 p-3 text-xs text-center text-muted-foreground">
                      No members found matching &quot;{email}&quot;
                    </div>
                  )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="managementAction"
                  className="text-xs font-medium"
                >
                  Select Administrative Action
                </Label>
                <Select
                  value={managementAction}
                  onValueChange={setManagementAction}
                  disabled={isTargetOwner}
                >
                  <SelectTrigger
                    id="managementAction"
                    className="text-xs h-9 bg-background"
                  >
                    <SelectValue placeholder="Select administrative command" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="suspend"
                      className="text-xs text-amber-500 font-medium"
                    >
                      Suspend User (Temporary Hold)
                    </SelectItem>
                    <SelectItem
                      value="unsuspend"
                      className="text-xs text-emerald-600 font-medium"
                    >
                      Unsuspend User (Restore Access)
                    </SelectItem>
                    <SelectItem
                      value="remove"
                      className="text-xs text-destructive font-medium"
                    >
                      Remove Member (Permanent Deletion)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isTargetOwner}
                className={`text-xs h-9 ${
                  managementAction === "remove"
                    ? "bg-destructive text-white hover:bg-destructive/90"
                    : managementAction === "suspend"
                      ? "bg-amber-500 text-white hover:bg-amber-500/90"
                      : managementAction === "unsuspend"
                        ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                        : ""
                }`}
              >
                Continue
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* Step 2: Critical Secondary Ask Verification Dialogue */
          <div className="space-y-4">
            <DialogHeader>
              <div
                className={`mx-auto flex size-12 items-center justify-center rounded-full mb-2 ${
                  managementAction === "unsuspend"
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                }`}
              >
                {managementAction === "unsuspend" ? (
                  <ShieldCheckIcon className="size-6" />
                ) : (
                  <AlertTriangleIcon className="size-6" />
                )}
              </div>
              <DialogTitle className="text-base text-center text-foreground">
                {managementAction === "unsuspend"
                  ? "Restore User Access?"
                  : "Are you absolutely sure?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-center leading-normal">
                {managementAction === "unsuspend"
                  ? `You are about to restore workspace access and privileges for `
                  : `You are executing an immutable pipeline status modification request. This will immediately alter system access tiers for `}
                <span className="font-semibold text-foreground underline">
                  {email}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground space-y-1.5">
              <p>
                •{" "}
                <span className="font-medium text-foreground">
                  Action Type:
                </span>{" "}
                {managementAction === "remove"
                  ? "Permanent Removal"
                  : managementAction === "unsuspend"
                    ? "Restore Access"
                    : "Account Suspension"}
              </p>
              <p>
                •{" "}
                <span className="font-medium text-foreground">
                  Target Entity Email:
                </span>{" "}
                {email}
              </p>
            </div>

            <DialogFooter className="pt-2 flex-row! gap-2!">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9"
                disabled={isSubmitting}
                onClick={() => setIsConfirming(false)}
              >
                Go Back
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleFinalConfirm}
                className={`text-xs h-9 gap-1.5 ${
                  managementAction === "remove"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : managementAction === "unsuspend"
                      ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                      : "bg-amber-600 text-white hover:bg-amber-600/90"
                }`}
              >
                {isSubmitting && (
                  <Loader2Icon className="size-3.5 animate-spin" />
                )}
                Yes, Confirm Action
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
