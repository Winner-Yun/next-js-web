// types.ts
export type AttendanceStatus = "Present" | "Late" | "Absent" | "On Leave";

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  role: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number | null;
  status: AttendanceStatus;
}
