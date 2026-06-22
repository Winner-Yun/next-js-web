"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Workspace = {
  id: string;
  name: string;
  role: "owner" | "member";
  memberCount?: number;
};

type WorkspaceContextType = {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  createWorkspace: (name: string) => void;
  renameWorkspace: (id: string, newName: string) => void;
};

const initialWorkspaces: Workspace[] = [
  {
    id: "worksmart",
    name: "WorkSmart",
    role: "owner",
    memberCount: 12,
  },
  {
    id: "school",
    name: "School",
    role: "member",
    memberCount: 45,
  },
  {
    id: "company",
    name: "Company",
    role: "owner",
    memberCount: 8,
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [workspace, setWorkspaceState] = useState<Workspace>(
    initialWorkspaces[0],
  );

  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("selected_workspace_id");
    if (savedWorkspaceId) {
      const found = workspaces.find((w) => w.id === savedWorkspaceId);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWorkspaceState(found);
      }
    }
  }, [workspaces]);

  const setWorkspace = (newWorkspace: Workspace) => {
    setWorkspaceState(newWorkspace);
    localStorage.setItem("selected_workspace_id", newWorkspace.id);
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name,
      role: "owner",
      memberCount: 1,
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  const renameWorkspace = (id: string, newName: string) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, name: newName } : w)),
    );
    if (workspace.id === id) {
      setWorkspaceState((prev) => ({ ...prev, name: newName }));
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        workspaces,
        createWorkspace,
        renameWorkspace,
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
