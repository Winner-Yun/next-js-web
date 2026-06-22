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
import { useEffect, useState } from "react";

interface WorkspaceRenameDialogProps {
  children: React.ReactNode;
  workspaceId: string;
  currentName: string;
  onRename: (id: string, newName: string) => void;
}

export function WorkspaceRenameDialog({
  children,
  workspaceId,
  currentName,
  onRename,
}: WorkspaceRenameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(currentName);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenameValue(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameValue.trim()) return;

    onRename(workspaceId, renameValue.trim());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Rename Workspace
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update name parameters for ID: &quot;{workspaceId}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              maxLength={30}
              placeholder="Enter new workspace name..."
              className="text-xs h-9 bg-background"
              required
            />
          </div>

          <DialogFooter className="gap-2! sm:gap-0">
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
              className="text-xs h-9 bg-brand text-white hover:bg-brand/90"
            >
              Save Parameters
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
