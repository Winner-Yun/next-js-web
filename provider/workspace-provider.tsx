"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Workspace = {
  id: string;
  name: string;
};

type WorkspaceContextType = {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
};

const workspaces = [
  {
    id: "worksmart",
    name: "WorkSmart",
  },
  {
    id: "school",
    name: "School",
  },
  {
    id: "company",
    name: "Company",
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspaceState] = useState<Workspace>(workspaces[0]);

  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("selected_workspace_id");
    if (savedWorkspaceId) {
      const found = workspaces.find((w) => w.id === savedWorkspaceId);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWorkspaceState(found);
      }
    }
  }, []);

  const setWorkspace = (newWorkspace: Workspace) => {
    setWorkspaceState(newWorkspace);
    localStorage.setItem("selected_workspace_id", newWorkspace.id);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        workspaces,
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
