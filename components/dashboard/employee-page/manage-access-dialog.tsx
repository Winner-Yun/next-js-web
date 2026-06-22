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
import { AlertTriangleIcon, MailIcon, UserMinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ManageAccessDialog() {
  const [email, setEmail] = useState("");
  const [managementAction, setManagementAction] = useState("suspend");
  const [isOpen, setIsOpen] = useState(false);

  // Verification security check state
  const [isConfirming, setIsConfirming] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Progress to security double-check step
    setIsConfirming(true);
  };

  const handleFinalConfirm = () => {
    // TODO: Connect to your FastAPI endpoints:
    // e.g., POST /api/v1/workspaces/suspend or DELETE /api/v1/workspaces/members
    if (managementAction === "suspend") {
      toast.warning(`Suspension execution dispatched for ${email.trim()}`);
    } else {
      toast.error(`Permanent removal purged for ${email.trim()}`);
    }

    // Reset workflow states
    setEmail("");
    setIsConfirming(false);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsConfirming(false); // Reset check step if dialog is closed
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

      <DialogContent className="sm:max-w-[420px]">
        {!isConfirming ? (
          /* Step 1: Input target collection data */
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base text-foreground">
                Restrict / Remove Account
              </DialogTitle>
              <DialogDescription className="text-xs">
                Input a target employee email address to change access status
                parameters.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="actionEmail" className="text-xs font-medium">
                  Target User Email Address
                </Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="actionEmail"
                    type="email"
                    placeholder="employee@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs h-9 bg-background"
                    required
                  />
                </div>
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
                >
                  <SelectTrigger
                    id="managementAction"
                    className="text-xs h-9 bg-background"
                  >
                    <SelectValue placeholder="Select administrative command" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suspend" className="text-xs">
                      Suspend User (Temporary Hold)
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
                className={`text-xs h-9 ${managementAction === "remove" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
              >
                Continue
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* Step 2: Critical Secondary Ask Verification Dialogue */
          <div className="space-y-4">
            <DialogHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 mb-2">
                <AlertTriangleIcon className="size-6" />
              </div>
              <DialogTitle className="text-base text-center text-foreground">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-xs text-center leading-normal">
                You are executing an immutable pipeline status modification.
                This will immediately restrict access for{" "}
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
                  : "Account Suspension"}
              </p>
              <p>
                •{" "}
                <span className="font-medium text-foreground">
                  Target Entity:
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
                onClick={() => setIsConfirming(false)}
              >
                Go Back
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleFinalConfirm}
                className={`text-xs h-9 ${
                  managementAction === "remove"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "bg-amber-600 text-white hover:bg-amber-600/90"
                }`}
              >
                Yes, Confirm Action
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
