"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/provider/workspace-provider";
import { Building2 } from "lucide-react";

// (Optional) Import Skeleton if you want a loading placeholder
// import { Skeleton } from "@/components/ui/skeleton";

const colors = [
  "text-blue-600",
  "text-sky-600",
  "text-cyan-600",
  "text-teal-600",
  "text-emerald-600",
  "text-green-600",
  "text-lime-600",
  "text-yellow-600",
  "text-amber-600",
  "text-orange-600",
  "text-red-600",
  "text-rose-600",
  "text-pink-600",
  "text-fuchsia-600",
  "text-purple-600",
  "text-violet-600",
  "text-indigo-600",
];

function getWorkspaceColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function WorkspaceSwitcher() {
  const { workspace, setWorkspace, workspaces, isLoading } = useWorkspace();

  // 1. Prevent crash while API is loading
  if (isLoading) {
    // You can replace this div with a <Skeleton className="h-10 w-[250px] rounded-xl" />
    return <div className="h-10 w-62.5 animate-pulse rounded-xl bg-muted" />;
  }

  // 2. Hide switcher if no workspaces exist or workspace failed to load
  if (!workspaces || workspaces.length === 0 || !workspace) {
    return null;
  }

  return (
    <Select
      value={workspace.id}
      onValueChange={(value) => {
        const selected = workspaces.find((w) => w.id === value);
        if (selected) {
          setWorkspace(selected);
        }
      }}
    >
      <SelectTrigger className="w-62.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <SelectValue placeholder="Select a workspace" />
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        {workspaces.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            <div className="flex items-center gap-2.5">
              <Building2 className={`h-4 w-4 ${getWorkspaceColor(w.id)}`} />
              {/* 3. Updated to match your API's "workspace_name" key */}
              {w.workspace_name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
