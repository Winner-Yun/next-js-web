export type LeaveType =
  | "Annual Leave"
  | "Sick Leave"
  | "Unpaid Leave"
  | "Maternity Leave"
  | "Compassionate Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employeeName: string;
  role: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  createdAt: string;
}
