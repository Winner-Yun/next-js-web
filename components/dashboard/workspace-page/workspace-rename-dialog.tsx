/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkspaceRenameDialogProps {
  children: React.ReactNode;
  workspaceId: string;
  currentName: string;
  currentDescription?: string;
  onRename: (
    id: string,
    newName: string,
    newDescription?: string,
  ) => void | Promise<void>;
}

export function WorkspaceRenameDialog({
  children,
  workspaceId,
  currentName,
  currentDescription,
  onRename,
}: WorkspaceRenameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(currentName);
  const [descriptionValue, setDescriptionValue] = useState(
    currentDescription ?? "",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRenameValue(currentName);
      setDescriptionValue(currentDescription ?? "");
    }
  }, [isOpen, currentName, currentDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameValue.trim()) return;

    setIsLoading(true);
    try {
      await onRename(workspaceId, renameValue.trim(), descriptionValue.trim());
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing via programmatic hooks if submission is running
        if (!open && isLoading) return;
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-100"
        // Block interaction closures during API calls
        onInteractOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Rename Workspace
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              maxLength={30}
              placeholder="Enter new workspace name..."
              className="text-xs h-9 bg-background"
              required
              disabled={isLoading}
            />
            <Input
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              maxLength={100}
              placeholder="Description (optional)"
              className="text-xs h-9 bg-background"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2! sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : null}
              Save Parameters
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
