export type TaskVisibility = "public" | "private";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  workspace_id: string;
  created_by: string;
  title: string;
  description?: string | null;
  visibility: TaskVisibility;
  assigned_to: string[];
  deadline?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at?: string | null;
}

export interface PaginatedTasks {
  data: Task[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface WorkspaceMember {
  id?: string;
  _id?: string;
  name?: string;
  email: string;
  role?: string;
}
