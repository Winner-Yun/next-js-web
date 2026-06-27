"use client";

import { CreateWorkspaceDialog } from "@/components/dashboard/workspace-page/create-workspace-dialog";
import { WorkspaceCard } from "@/components/dashboard/workspace-page/workspace-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ArrowUpDownIcon,
  SearchIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type SortOption = "name-asc" | "name-desc" | "members-desc";

export function WorkspacesDirectory() {
  const { workspaces, deleteWorkspace } = useWorkspace();
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: State to control visibility of member workspaces
  const [showShared, setShowShared] = useState(true);

  // Filter and sort in a single memory pipeline
  const filteredAndSortedWorkspaces = useMemo(() => {
    let result = [...workspaces];

    // 1. Apply Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((w) => w.name.toLowerCase().includes(query));
    }

    // 2. Apply Sorting Logic
    return result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "members-desc")
        return (b.memberCount || 0) - (a.memberCount || 0);
      return 0;
    });
  }, [workspaces, sortBy, searchQuery]);

  const ownedWorkspaces = useMemo(
    () => filteredAndSortedWorkspaces.filter((w) => w.role === "owner"),
    [filteredAndSortedWorkspaces],
  );

  const memberWorkspaces = useMemo(
    () => filteredAndSortedWorkspaces.filter((w) => w.role === "member"),
    [filteredAndSortedWorkspaces],
  );

  const handleRemoveWorkspace = (id: string, name: string) => {
    if (deleteWorkspace) {
      deleteWorkspace(id);
      toast.success(`Removed context environment: ${name}`);
    } else {
      toast.error("Deletion method not implemented on context provider level.");
    }
  };

  return (
    <div className="space-y-8 p-px animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground text-xs">
            Manage your isolated dashboard environments.
          </p>
        </div>

        {/* Toolbar Section Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input field element */}
          <div className="relative flex items-center border rounded-md px-2.5 h-9 bg-background focus-within:ring-1 focus-within:ring-brand/40">
            <SearchIcon className="size-3.5 text-muted-foreground shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs focus:outline-none w-full sm:w-48 placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* NEW: Show Shared Toggle */}
            <div className="flex items-center gap-2 border rounded-md px-3 h-9 bg-background">
              <span className="text-xs text-muted-foreground font-medium">
                Shared
              </span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showShared}
                  onChange={() => setShowShared(!showShared)}
                />
                <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            <div className="flex items-center gap-1.5 border rounded-md px-2 h-9 bg-background ">
              <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="bg-transparent! border-0 p-0 h-auto focus:ring-0 w-30 text-xs shadow-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc" className="text-xs">
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem value="name-desc" className="text-xs">
                    Name (Z-A)
                  </SelectItem>
                  <SelectItem value="members-desc" className="text-xs">
                    Most Members
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CreateWorkspaceDialog />
          </div>
        </div>
      </div>

      {/* Adjust Grid dynamically based on showShared state */}
      <div
        className={`grid gap-8 ${showShared ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
      >
        {/* Owned Column Block Layout */}
        <div
          className={`space-y-4 ${showShared ? "border-r pr-0 lg:pr-6 border-transparent lg:border-border" : ""}`}
        >
          <div className="flex items-center gap-2 border-b pb-2">
            <ShieldIcon className="size-4 text-blue-500" />
            <h2 className="text-base font-semibold tracking-tight">
              My Owned Profiles
            </h2>
          </div>
          {ownedWorkspaces.length > 0 ? (
            <div
              className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 ${showShared ? "lg:grid-cols-1 xl:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4"}`}
            >
              {ownedWorkspaces.map((w) => (
                <WorkspaceCard
                  key={w.id}
                  workspaceItem={w}
                  onRemove={handleRemoveWorkspace}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-8 text-center border border-dashed rounded-lg bg-muted/20">
              No matching owned workspaces found.
            </p>
          )}
        </div>

        {/* Collaborating Column Block Layout - Conditionally Rendered */}
        {showShared && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <UsersIcon className="size-4 text-muted-foreground" />
              <h2 className="text-base font-semibold tracking-tight">
                Shared Contexts
              </h2>
            </div>
            {memberWorkspaces.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {memberWorkspaces.map((w) => (
                  <WorkspaceCard
                    key={w.id}
                    workspaceItem={w}
                    onRemove={handleRemoveWorkspace}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center border border-dashed rounded-lg bg-muted/20">
                No matching shared environments found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
