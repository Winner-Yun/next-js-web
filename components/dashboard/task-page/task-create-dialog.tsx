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
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/provider/workspace-provider";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type {
  Task,
  TaskPriority,
  TaskVisibility,
  WorkspaceMember,
} from "./types";

const membersFetcher = async (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
};

interface TaskCreateDialogProps {
  isOpen: boolean;
  editTask?: Task | null;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    description: string;
    visibility: TaskVisibility;
    assigned_to: string[];
    deadline: string;
    priority: TaskPriority;
  }) => Promise<void> | void;
}

export function TaskCreateDialog({
  isOpen,
  editTask,
  onClose,
  onSave,
}: TaskCreateDialogProps) {
  const { workspace } = useWorkspace();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<TaskVisibility>("public");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [isSaving, setIsSaving] = useState(false);

  const { data: membersData } = useSWR(
    isOpen && workspace?.id
      ? `/api/workspace/${workspace.id}/members`
      : null,
    membersFetcher,
  );

  const members: WorkspaceMember[] = Array.isArray(membersData)
    ? membersData
    : membersData?.members || membersData?.data || [];

  useEffect(() => {
    if (isOpen) {
      setTitle(editTask?.title || "");
      setDescription(editTask?.description || "");
      setVisibility(editTask?.visibility || "public");
      setAssignedTo(editTask?.assigned_to || []);
      setDeadline(editTask?.deadline || "");
      setPriority(editTask?.priority || "medium");
      setIsSaving(false);
    }
  }, [isOpen, editTask]);

  const toggleAssignee = (email: string) => {
    setAssignedTo((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (visibility === "private" && assignedTo.length === 0) return;

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        visibility,
        assigned_to: assignedTo,
        deadline,
        priority,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-125 p-2 overflow-hidden bg-background"
        onInteractOutside={(e) => isSaving && e.preventDefault()}
        onEscapeKeyDown={(e) => isSaving && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <DialogTitle className="text-base font-bold">
              {editTask ? "Edit Task" : "Assign New Task"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editTask
                ? "Update the details for this task."
                : "Create a task for the whole workspace or assign it to specific members."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 border-y border-muted/30 overflow-y-auto">
            <div className="space-y-1.5">
              <Label
                htmlFor="task-title"
                className="text-xs font-semibold text-foreground"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g., Fix the AC unit in Room 204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9 bg-background/50"
                autoFocus
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="task-description"
                className="text-xs font-semibold text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="task-description"
                placeholder="Describe what needs to be done..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs min-h-20 bg-background/50"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Visibility
                </Label>
                <Select
                  value={visibility}
                  onValueChange={(v) => setVisibility(v as TaskVisibility)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="h-9 w-full text-xs bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public (all members)
                    </SelectItem>
                    <SelectItem value="private">
                      Private (assignees only)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="h-9 w-full text-xs bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="task-deadline"
                className="text-xs font-semibold text-foreground"
              >
                Deadline
              </Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="text-xs h-9 bg-background/50"
                disabled={isSaving}
              />
            </div>

            {visibility === "private" && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-xs font-semibold text-foreground">
                  Assignees <span className="text-destructive">*</span>
                </Label>
                <div className="max-h-36 overflow-y-auto border border-muted/60 rounded-lg divide-y divide-muted/40">
                  {members.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground p-3">
                      No members found in this workspace.
                    </p>
                  ) : (
                    members.map((m) => {
                      const key = m.id || m._id || m.email;
                      const checked = assignedTo.includes(m.email);
                      return (
                        <label
                          key={key}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs cursor-pointer hover:bg-muted/30"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAssignee(m.email)}
                            disabled={isSaving}
                            className="size-3.5 accent-brand cursor-pointer"
                          />
                          <span className="font-medium text-foreground">
                            {m.name || m.email}
                          </span>
                          {m.role && (
                            <span className="text-muted-foreground/70">
                              — {m.role}
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs cursor-pointer h-9 bg-brand text-white hover:bg-brand/90 px-4 transition-all"
              disabled={
                isSaving ||
                !title.trim() ||
                (visibility === "private" && assignedTo.length === 0)
              }
            >
              {isSaving ? (
                <>
                  <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : editTask ? (
                "Save Changes"
              ) : (
                "Assign Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
