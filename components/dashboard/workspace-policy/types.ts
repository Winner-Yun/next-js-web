export interface WorkspacePolicyData {
  id: string;
  name: string;
  check_in_start: string;
  check_in_end: string;
  late_buffer_minutes: number;
  deadline_scan_minutes: number;
  annual_leave_limit: number;
  sick_leave_limit: number;
  status: "active" | "inactive";
}
