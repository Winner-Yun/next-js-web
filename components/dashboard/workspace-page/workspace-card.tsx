/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertCircleIcon,
  Building2Icon,
  Loader2Icon,
  PencilIcon,
  ShieldIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WorkspaceConfirmDialog } from "./workspace-confirm-dialog";
import { WorkspaceRenameDialog } from "./workspace-rename-dialog";

type WorkspaceCardProps = {
  workspaceItem: {
    id: string;
    name: string;
    role: "owner" | "member";
    memberCount?: number;
    description?: string;
  };
};

export function WorkspaceCard({ workspaceItem }: WorkspaceCardProps) {
  const {
    workspace: activeWorkspace,
    setWorkspace,
    fetchWorkspaces,
  } = useWorkspace();

  const [isDeleting, setIsDeleting] = useState(false);

  const isActive = activeWorkspace?.id === workspaceItem.id;
  const isOwner = workspaceItem.role === "owner";

  const handleSwitch = () => {
    if (!isOwner) {
      toast.error("Only workspace owners can switch workspaces.");
      return;
    }
    setWorkspace({
      id: workspaceItem.id,
      workspace_name: workspaceItem.name,
      description: workspaceItem.description,
    });
    toast.success(`Switched context to ${workspaceItem.name}`);
  };

  const handleRename = async (
    id: string,
    newName: string,
    newDescription?: string,
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${id}/update-workspace`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_name: newName,
          description: newDescription,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Workspace updated successfully");
      await fetchWorkspaces();
    } catch (error) {
      toast.error("Failed to rename workspace.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (isActive) {
      toast.error("You cannot delete the currently active workspace.");
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${id}/delete-workspace`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success(`Removed: ${name}`);
      await fetchWorkspaces();
    } catch (error) {
      toast.error("Failed to delete workspace.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardCard
      className={`relative flex flex-col h-full border transition-all ${
        isActive
          ? "border-brand ring-1 ring-brand/30 bg-brand/5"
          : "hover:border-muted-foreground/30"
      }`}
    >
      <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Building2Icon className="size-4 shrink-0 text-muted-foreground" />
          <CardTitle className="text-sm font-bold truncate">
            {workspaceItem.name}
          </CardTitle>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isOwner ? (
            <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-500">
              <ShieldIcon className="size-3" /> Owner
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
              <UsersIcon className="size-3" /> Member
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex flex-col flex-1">
        {/* Description Section */}
        <div className="flex-1 mb-4">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {workspaceItem.description || "No description provided."}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground font-medium">
            <UsersIcon className="size-3" />
            {workspaceItem.memberCount || 1} members
          </div>
        </div>

        {/* Action Buttons with Tooltip Guard Layers */}
        <div className="flex gap-2 mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex-1 ${isActive || !isOwner ? "cursor-not-allowed" : ""}`}
                >
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="h-8 cursor-pointer w-full text-xs"
                    onClick={handleSwitch}
                    disabled={isActive || !isOwner}
                  >
                    {isActive ? "Active" : "Switch Context"}
                  </Button>
                </div>
              </TooltipTrigger>
              {(isActive || !isOwner) && (
                <TooltipContent className="text-xs">
                  <p className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3" />
                    {isActive
                      ? "This is your currently active workspace context"
                      : "Only workspace owners can switch context flags"}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {isOwner && (
            <>
              <div>
                <WorkspaceRenameDialog
                  workspaceId={workspaceItem.id}
                  currentName={workspaceItem.name}
                  currentDescription={workspaceItem.description}
                  onRename={handleRename}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 cursor-pointer border bg-muted"
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                </WorkspaceRenameDialog>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={
                        isActive || isDeleting ? "cursor-not-allowed" : ""
                      }
                    >
                      <WorkspaceConfirmDialog
                        title="Delete Workspace"
                        description={`Permanently remove ${workspaceItem.name}?`}
                        confirmText="Delete"
                        variant="destructive"
                        onConfirm={() =>
                          handleDelete(workspaceItem.id, workspaceItem.name)
                        }
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 border cursor-pointer hover:text-destructive"
                          disabled={isActive || isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2Icon className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2Icon className="size-3.5" />
                          )}
                        </Button>
                      </WorkspaceConfirmDialog>
                    </div>
                  </TooltipTrigger>
                  {(isActive || isDeleting) && (
                    <TooltipContent className="text-xs">
                      <p className="flex items-center gap-1.5">
                        <AlertCircleIcon className="size-3" />
                        {isDeleting
                          ? "Processing background deletion removal..."
                          : "Cannot delete your currently active workspace context"}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
