export type RequestStatus = "pending" | "seen" | "in_progress" | "completed";

export interface WorkspaceRequest {
  id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  description: string;
  attachments: string[];
  status: RequestStatus;
  response?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface PaginatedRequests {
  data: WorkspaceRequest[];
  total?: number;
  page?: number;
  limit?: number;
}
