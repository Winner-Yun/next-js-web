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
import { Loader2Icon, MailPlusIcon, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface InviteEmployeeDialogProps {
  onInviteSuccess: () => void;
}

// Updated interface to safely accommodate database variations like _id
interface SuggestedUser {
  id?: string;
  _id?: string;
  name?: string;
  email: string;
}

export function InviteEmployeeDialog({
  onInviteSuccess,
}: InviteEmployeeDialogProps) {
  const { workspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for the autocomplete suggestion system
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced user search effect
  useEffect(() => {
    if (
      !email.trim() ||
      (email.includes("@") && email.split("@")[1]?.includes("."))
    ) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn(
          "Autocomplete skipped: 'accessToken' not found in localStorage.",
        );
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const res = await fetch(
          `/api/auth/users?search=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (res.status === 401) {
          console.error("Backend rejected the token with 401 Unauthorized.");
          setSuggestions([]);
          return;
        }

        if (res.ok) {
          const rawData = await res.json();
          const usersList = Array.isArray(rawData)
            ? rawData
            : rawData.users || rawData.data || [];

          setSuggestions(usersList);
        }
      } catch (error) {
        console.error("Failed fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  // Close suggestions menu if clicking anywhere outside the drop area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (user: SuggestedUser) => {
    setEmail(user.email);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !workspace?.id) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspace.id}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      if (res.ok) {
        toast.success(`Invitation successfully dispatched to ${email}`);
        setEmail("");
        setRole("member");
        setOpen(false);
        onInviteSuccess();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || "Failed to process invitation delivery.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 text-xs gap-1.5 bg-brand hover:bg-brand/90 font-medium"
        >
          <MailPlusIcon className="size-3.5" /> Invite Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight">
              Invite Team Member
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              Grant system portal clearance authorizations to workspace nodes
              via direct registration invites.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <Label htmlFor="invite-email" className="text-xs font-semibold">
                User Email Address
              </Label>
              <div className="relative">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="name@example.com"
                  className="text-xs h-9 bg-card pr-8"
                  required
                  autoComplete="off"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {isLoadingSuggestions && (
                  <div className="absolute right-2.5 top-2.5">
                    <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
                  </div>
                )}
              </div>

              {/* Suggestions Floating Dropdown Panel */}
              {showSuggestions &&
                (suggestions.length > 0 || isLoadingSuggestions) && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-muted/40">
                    {suggestions.map((user, index) => (
                      <button
                        // FIXED: Safe key fallback chain ensures a unique value is always allocated
                        key={user.id || user._id || `${user.email}-${index}`}
                        type="button"
                        className="w-full text-left px-3 py-2 text-xs hover:bg-muted/80 transition-colors flex flex-col gap-0.5"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSuggestion(user);
                        }}
                      >
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <UserIcon className="size-3 text-muted-foreground" />
                          {user.name || "Registered User"}
                        </span>
                        <span className="text-[11px] text-muted-foreground pl-4">
                          {user.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-xs font-semibold">
                Workspace System Role
              </Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={isSubmitting}
              >
                <SelectTrigger id="invite-role" className="text-xs h-9 bg-card">
                  <SelectValue placeholder="Select workspace authorization access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member" className="text-xs">
                    Member (Default base operations access)
                  </SelectItem>
                  <SelectItem value="admin" className="text-xs">
                    Admin (Full administrative operational override privileges)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 min-w-27.5 bg-brand hover:bg-brand/90"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
