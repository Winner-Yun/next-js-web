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
  const { workspace, setWorkspace, workspaces } = useWorkspace();

  const ownerWorkspaces = workspaces.filter((w) => w.role === "owner");

  if (ownerWorkspaces.length === 0) {
    return null;
  }

  return (
    <Select
      value={workspace.id}
      onValueChange={(value) => {
        const selected = ownerWorkspaces.find((w) => w.id === value);

        if (selected) {
          setWorkspace(selected);
        }
      }}
    >
      <SelectTrigger className="w-62.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <SelectValue />
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        {ownerWorkspaces.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            <div className="flex items-center gap-2.5">
              <Building2 className={`h-4 w-4 ${getWorkspaceColor(w.id)}`} />
              {w.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
