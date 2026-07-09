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
  BriefcaseIcon,
  Loader2Icon,
  MailIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InviteEmployeeDialogProps {
  onInviteSuccess?: () => void;
}

export function InviteEmployeeDialog({
  onInviteSuccess,
}: InviteEmployeeDialogProps) {
  const { workspace } = useWorkspace();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [workspaceRole, setWorkspaceRole] = useState("member");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role.trim() || !workspace?.id) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspace.id}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          role: role.trim(), // internal title position string
          workspace_role: workspaceRole, // target auth tier assignment
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Invitation successfully dispatched to ${email.trim()}`);
        setEmail("");
        setRole("");
        setIsOpen(false);
        if (onInviteSuccess) onInviteSuccess();
      } else {
        toast.error(data.detail || "Failed to dispatch invitation code.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-brand text-white hover:bg-brand/90 text-xs h-9 gap-1.5 shadow-sm"
        >
          <UserPlusIcon className="size-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base tracking-tight font-bold">
            Invite Workspace Member
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide system credentials to dispatch a security access key code
            link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInviteSubmit} className="space-y-4 pt-2">
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="name@company.com"
                  className="pl-9 text-xs h-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-medium">
                Job Title Position
              </Label>
              <div className="relative">
                <BriefcaseIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
                <Input
                  id="role"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., HR Manager, Engineer"
                  className="pl-9 text-xs h-9"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workspaceRole" className="text-xs font-medium">
                Workspace Role Context
              </Label>
              <Select
                value={workspaceRole}
                onValueChange={setWorkspaceRole}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="workspaceRole"
                  className="text-xs h-9 bg-background"
                >
                  <SelectValue placeholder="Select authorization tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner" className="text-xs">
                    Owner Tier (Full Access)
                  </SelectItem>
                  <SelectItem value="member" className="text-xs">
                    Member Tier (Standard View)
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
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2Icon className="size-3.5 animate-spin" />
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
