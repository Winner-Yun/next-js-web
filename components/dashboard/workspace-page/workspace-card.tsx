"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  Building2Icon,
  CheckCircle2Icon,
  PencilIcon,
  ShieldIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { WorkspaceConfirmDialog } from "./workspace-confirm-dialog";
import { WorkspaceRenameDialog } from "./workspace-rename-dialog";

type WorkspaceCardProps = {
  workspaceItem: {
    id: string;
    name: string;
    role: "owner" | "member";
    memberCount?: number;
  };
  onRemove: (id: string, name: string) => void;
};

export function WorkspaceCard({ workspaceItem, onRemove }: WorkspaceCardProps) {
  const {
    workspace: activeWorkspace,
    setWorkspace,
    renameWorkspace,
  } = useWorkspace();

  const isActive = activeWorkspace.id === workspaceItem.id;
  const isOwner = workspaceItem.role === "owner";

  const handleSwitch = () => {
    if (!isOwner) {
      toast.error("Only workspace owners can switch workspaces.");
      return;
    }
    setWorkspace(workspaceItem);
    toast.success(`Switched context to ${workspaceItem.name}`);
  };

  return (
    <DashboardCard
      className={`relative overflow-hidden border transition-all duration-200 ${
        isActive
          ? "border-brand ring-1 ring-brand/30 bg-brand/5 dark:bg-brand/10 shadow-sm"
          : "hover:border-muted-foreground/30 hover:shadow-sm"
      }`}
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Building2Icon
            className={`size-4 shrink-0 ${isActive ? "text-brand" : "text-muted-foreground"}`}
          />
          <CardTitle className="text-sm font-bold tracking-tight text-foreground truncate">
            {workspaceItem.name}
          </CardTitle>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isOwner ? (
            <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:bg-blue-500/20">
              <ShieldIcon className="size-3" /> Owner
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <UsersIcon className="size-3" /> Member
            </span>
          )}

          {isActive && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-brand animate-in fade-in zoom-in duration-300">
              <CheckCircle2Icon className="size-3.5" /> Active
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="mb-4 flex flex-col gap-1 font-medium">
          <p className="font-mono text-[11px] text-muted-foreground">
            ID: {workspaceItem.id}
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <UsersIcon className="size-3" />
            {workspaceItem.memberCount ?? 0}{" "}
            {workspaceItem.memberCount === 1 ? "member" : "members"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isActive ? "default" : "outline"}
            className="h-8 flex-1 text-xs font-medium transition-all"
            onClick={handleSwitch}
            disabled={isActive || !isOwner}
          >
            {isActive
              ? "Currently Active"
              : isOwner
                ? "Switch Context"
                : "Access Restricted"}
          </Button>

          {isOwner && (
            <>
              {/* Refactored Workspace Rename Modal Trigger */}
              <WorkspaceRenameDialog
                workspaceId={workspaceItem.id}
                currentName={workspaceItem.name}
                onRename={(id, val) => {
                  renameWorkspace(id, val);
                  toast.success("Workspace renamed successfully");
                }}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-foreground shrink-0 border border-muted"
                >
                  <PencilIcon className="size-3.5" />
                </Button>
              </WorkspaceRenameDialog>

              {/* CLEAN IMPLEMENTATION: Custom Shared Confirm Dialog Wrapper */}
              <WorkspaceConfirmDialog
                title="Destroy Workspace Environment?"
                description={`Are you sure you want to completely erase ${workspaceItem.name}? All linked cloud pipelines, environment variables, and records will clear permanently.`}
                confirmText="Confirm Deletion"
                variant="destructive"
                onConfirm={() => onRemove(workspaceItem.id, workspaceItem.name)}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isActive}
                  className="size-8 text-muted-foreground hover:bg-destructive/10! hover:text-destructive shrink-0 border border-muted disabled:opacity-30"
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </WorkspaceConfirmDialog>
            </>
          )}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
