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
import { BriefcaseIcon, MailIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteEmployeeDialog() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [workspaceRole, setWorkspaceRole] = useState("member");
  const [isOpen, setIsOpen] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role.trim()) return;

    // TODO: Connect to FastAPI route: POST /api/v1/workspaces/invite
    toast.success(`Invitation successfully dispatched to ${email.trim()}`);

    setEmail("");
    setRole("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 h-9 bg-brand text-white hover:bg-brand/90 text-xs font-medium"
        >
          <UserPlusIcon className="size-4" />
          Invite Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base">Invite Team Member</DialogTitle>
            <DialogDescription className="text-xs">
              Send an authorization token invitation link to add an external
              collaborator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            {/* Email Address Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs h-9 bg-background"
                  required
                />
              </div>
            </div>

            {/* Job Role Field */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-medium">
                Job Role / Position
              </Label>
              <div className="relative">
                <BriefcaseIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="role"
                  type="text"
                  placeholder="e.g., Lead Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="pl-9 text-xs h-9 bg-background"
                  required
                />
              </div>
            </div>

            {/* Workspace Access Level Role Field */}
            <div className="space-y-1.5">
              <Label htmlFor="workspaceRole" className="text-xs font-medium">
                Workspace Role Context
              </Label>
              <Select value={workspaceRole} onValueChange={setWorkspaceRole}>
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
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4"
            >
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
