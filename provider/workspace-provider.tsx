/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Workspace = {
  id: string;
  workspace_name: string;
  description?: string;
  status?: string;
  has_password?: boolean;
  // Not returned by the backend — derived client-side from which filtered
  // /workspace/me call (only_owner vs only_member) a workspace came back in.
  role?: "owner" | "member";
  memberCount?: number;
};

type WorkspaceContextType = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  isLoading: boolean;
  sharedWorkspaces: Workspace[];
  isSharedLoading: boolean;
  fetchSharedWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => void;
  renameWorkspace: (id: string, newName: string) => void;
  fetchWorkspaces: () => Promise<void>; // Added to Context
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharedWorkspaces, setSharedWorkspaces] = useState<Workspace[]>([]);
  const [isSharedLoading, setIsSharedLoading] = useState(false);
  const router = useRouter();

  // Default view: only workspaces this account owns (only_owner=true is the
  // backend's own default). Shared-with-me workspaces are a separate, opt-in
  // fetch — see fetchSharedWorkspaces — not merged in here.
  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsLoading(false);
        router.push("/");
        return;
      }

      const res = await fetch(
        `/api/workspace/me?only_owner=true&only_member=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (data.workspaces && Array.isArray(data.workspaces)) {
        const owned: Workspace[] = data.workspaces.map((w: Workspace) => ({
          ...w,
          role: "owner" as const,
        }));

        setWorkspaces(owned);

        const savedWorkspaceId = localStorage.getItem("selected_workspace_id");
        const found = owned.find((w) => w.id === savedWorkspaceId);

        setWorkspaceState(found || owned[0] || null);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Opt-in fetch for the "Shared Contexts" view — only called when the user
  // actually asks to see workspaces they're a member of, not owner of.
  const fetchSharedWorkspaces = useCallback(async () => {
    try {
      setIsSharedLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `/api/workspace/me?only_owner=false&only_member=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (data.workspaces && Array.isArray(data.workspaces)) {
        setSharedWorkspaces(
          data.workspaces.map((w: Workspace) => ({
            ...w,
            role: "member" as const,
          })),
        );
      }
    } catch (error) {
    } finally {
      setIsSharedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const setWorkspace = (newWorkspace: Workspace) => {
    setWorkspaceState(newWorkspace);
    localStorage.setItem("selected_workspace_id", newWorkspace.id);
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      workspace_name: name,
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  const renameWorkspace = (id: string, newName: string) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, workspace_name: newName } : w)),
    );
    if (workspace?.id === id) {
      setWorkspaceState((prev) =>
        prev ? { ...prev, workspace_name: newName } : null,
      );
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        workspaces,
        isLoading,
        sharedWorkspaces,
        isSharedLoading,
        fetchSharedWorkspaces,
        createWorkspace,
        renameWorkspace,
        fetchWorkspaces, // Exported to provider consumers
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}
