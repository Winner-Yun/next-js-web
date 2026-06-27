export type NotificationType = "info" | "success" | "warning";
export type NotificationTarget = "global" | "member";

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Defines the object structure grouped by workspace keys
export type WorkspaceData = Record<string, WorkspaceMember[]>;
