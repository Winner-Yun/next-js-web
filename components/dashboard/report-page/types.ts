export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type AttendanceStatus = "Present" | "Late" | "Absent" | "On Leave";

export interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: number;
  status: AttendanceStatus;
}

export interface LeaveRecord {
  id: string;
  name: string;
  type: string;
  start: string;
  end: string;
  days: number;
  status: LeaveStatus;
  attachment?: string;
}

export interface WorkspaceData {
  attendance: AttendanceRecord[];
  leaves: LeaveRecord[];
}

export interface KpiSummary {
  totalEmployees: number;
  attendanceRate: number;
  totalHours: number;
  pendingLeaves: number;
  approvedLeaveDays: number;
  attStatusCount: Record<string, number>;
  leaveTypeCount: Record<string, number>;
}
