export type Employee = {
  id: string;
  google_id?: string | null;
  name: string;
  email: string;
  avatar?: string | null;
  gender?: string | null;
  provider?: string;
  status: "active" | "inactive";
  role: string;
  is_pending?: boolean;
  joined_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  department?: string; // Kept for layout compatibility
};
  