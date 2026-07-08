/* eslint-disable react-hooks/static-components */

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
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ArrowUpDownIcon,
  SearchIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type SortOption = "name-asc" | "name-desc" | "members-desc";

export function WorkspacesDirectory() {
  // 1. Hook directly into the central Provider
  const { workspaces, isLoading: isWorkspacesLoading } = useWorkspace();

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showShared, setShowShared] = useLocalStorage(
    "showSharedWorkspaces",
    true,
  );

  // Hydration safeguard state
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  // 2. Perform local filtering and sorting on the Provider's global data
  const filteredAndSortedWorkspaces = useMemo(() => {
    let result = [...workspaces];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.workspace_name.toLowerCase().includes(query) ||
          w.description?.toLowerCase().includes(query),
      );
    }

    return result.sort((a, b) => {
      if (sortBy === "name-asc")
        return a.workspace_name.localeCompare(b.workspace_name);
      if (sortBy === "name-desc")
        return b.workspace_name.localeCompare(a.workspace_name);
      if (sortBy === "members-desc")
        return ((b as unknown).memberCount || 0) - ((a as unknown).memberCount || 0);
      return 0;
    });
  }, [workspaces, sortBy, searchQuery]);

  // 3. Split into Owned and Shared based on the normalized role
  const ownedWorkspaces = useMemo(
    () =>
      filteredAndSortedWorkspaces.filter(
        (w) => ((w as unknown).role ?? "owner") === "owner",
      ),
    [filteredAndSortedWorkspaces],
  );

  const memberWorkspaces = useMemo(
    () =>
      filteredAndSortedWorkspaces.filter((w) => (w as unknown).role === "member"),
    [filteredAndSortedWorkspaces],
  );

  const WorkspaceGrid = useCallback(
    ({
      workspaceList,
      isOwnerSection,
    }: {
      workspaceList: typeof workspaces;
      isOwnerSection?: boolean;
    }) => (
      <div
        className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 ${
          showShared || !isOwnerSection
            ? "lg:grid-cols-1 xl:grid-cols-2"
            : "lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {workspaceList.map((w) => (
          <WorkspaceCard
            key={w.id}
            workspaceItem={{
              id: w.id,
              name: w.workspace_name, // Map API payload to card prop
              role: ((w as unknown).role ?? "owner") as "owner" | "member",
              memberCount: (w as unknown).memberCount,
              description: w.description,
            }}
          />
        ))}
      </div>
    ),
    [showShared],
  );

  // Prevent Hydration Mismatch: Render skeleton identically to SSR until mounted
  if (!isMounted) {
    return (
      <div className="space-y-8 p-px animate-in fade-in duration-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground text-xs">
              Manage your isolated dashboard environments.
            </p>
          </div>
        </div>
        <WorkspacesDirectorySkeleton showShared={true} />
      </div>
    );
  }

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
              disabled={isWorkspacesLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Show Shared Toggle */}
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
                  disabled={isWorkspacesLoading}
                />
                <div className="w-7 h-4 bg-muted rounded-full peer peer-checked:bg-brand after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3" />
              </label>
            </div>

            <div className="flex items-center gap-1.5 border rounded-md px-2 h-9 bg-background ">
              <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
                disabled={isWorkspacesLoading}
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

      {isWorkspacesLoading ? (
        <WorkspacesDirectorySkeleton showShared={showShared} />
      ) : (
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
              <WorkspaceGrid workspaceList={ownedWorkspaces} isOwnerSection />
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
                <WorkspaceGrid workspaceList={memberWorkspaces} />
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center border border-dashed rounded-lg bg-muted/20">
                  No matching shared environments found.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WorkspacesDirectorySkeleton({ showShared }: { showShared: boolean }) {
  return (
    <div
      className={`grid gap-8 ${showShared ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
    >
      <div
        className={`space-y-4 ${showShared ? "border-r pr-0 lg:pr-6 border-transparent lg:border-border" : ""}`}
      >
        <div className="flex items-center gap-2 border-b pb-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div
          className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 ${showShared ? "lg:grid-cols-1 xl:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4"}`}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton className="h-40 w-full" key={i} />
          ))}
        </div>
      </div>

      {showShared && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton className="h-40 w-full" key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
  