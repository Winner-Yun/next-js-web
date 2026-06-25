export interface WorkspacePolicyData {
  id: string;
  name: string;

  work_start_time: string;
  work_end_time: string;

  check_in_start: string;
  check_out_start: string;

  late_buffer_minutes: number;
  deadline_scan_minutes: number;

  annual_leave_limit: number;
  sick_leave_limit: number;

  status: "active" | "inactive";
}
