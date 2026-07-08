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

type Workspace = {
  id: string;
  workspace_name: string;
  description?: string;
  status?: string;
};

type WorkspaceContextType = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  isLoading: boolean;
  createWorkspace: (name: string) => void;
  renameWorkspace: (id: string, newName: string) => void;
  fetchWorkspaces: () => Promise<void>; // Added to Context
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Extracted into a useCallback so it can be exposed and manually called
  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn("No auth token discovered. Redirecting...");
        setIsLoading(false);
        router.push("/");
        return;
      }

      const res = await fetch(`/api/workspace/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.workspaces && Array.isArray(data.workspaces)) {
        setWorkspaces(data.workspaces);

        const savedWorkspaceId = localStorage.getItem("selected_workspace_id");
        const found = data.workspaces.find(
          (w: Workspace) => w.id === savedWorkspaceId,
        );

        setWorkspaceState(found || data.workspaces[0] || null);
      }
    } catch (error) {
      console.error("Error loading workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
