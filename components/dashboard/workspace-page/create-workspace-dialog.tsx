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
import { useWorkspace } from "@/provider/workspace-provider";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateWorkspaceDialog() {
  const { fetchWorkspaces } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You are not authenticated.");
        return;
      }

      const res = await fetch("/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Failed to create workspace.");
        return;
      }

      toast.success(`Workspace "${name.trim()}" created successfully!`);
      fetchWorkspaces(); // Refresh the list of workspaces
      setName("");
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error("Create workspace error:", error);
      toast.error("Failed to create workspace.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-brand text-white hover:bg-brand/90"
        >
          <PlusIcon className="size-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription className="text-xs">
              Enter a name and optional description for your new workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="e.g., School Branch, Sub-Company"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              required
              autoFocus
              disabled={isLoading}
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand text-white hover:bg-brand/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : (
                <PlusIcon className="size-4 mr-2" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
