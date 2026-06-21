"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/provider/workspace-provider";

export function WorkspaceSwitcher() {
  const { workspace, setWorkspace, workspaces } = useWorkspace();

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
      <SelectTrigger className="w-62.5">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {workspaces.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            {w.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
