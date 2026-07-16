"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useWorkspace } from "@/provider/workspace-provider";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type AttendanceRecord = {
  _id?: string;
  id?: string;
  user_id?: string | { $oid?: string };
  check_in?: string | null;
  status?: string;
  date?: string;
};

type MemberRecord = {
  _id?: string;
  id?: string;
  user_id?: string | { $oid?: string };
  name?: string;
  full_name?: string;
  email?: string;
};

const formatTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status?: string) => {
  if (!status) return "-";
  const normalized = status.toLowerCase();
  if (normalized === "present") return "Present";
  if (normalized === "late") return "Late";
  if (normalized === "absent") return "Absent";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const extractId = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const maybe = (value as { $oid?: string }).$oid;
    if (maybe) return maybe;
  }
  return undefined;
};

const getMemberName = (member: MemberRecord): string => {
  return member.name || member.full_name || member.email || "Unknown";
};

export function DashboardAttendance() {
  const { workspace } = useWorkspace();
  const { attendance, members, isLoading } = useDashboardData();

  // Build a lookup map from user_id -> member name
  const memberNameByUserId = new Map<string, string>();
  for (const m of members as MemberRecord[]) {
    const userId = extractId(m.user_id) ?? extractId(m._id) ?? extractId(m.id);
    if (userId) {
      memberNameByUserId.set(userId, getMemberName(m));
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Filter attendance to today's records only, sort by latest, and limit to top 5
  const todayAttendance = (attendance as AttendanceRecord[])
    .filter((item) => {
      if (!item.date) return false;
      return item.date.substring(0, 10) === todayStr;
    })
    .sort((a, b) => {
      // Sort in descending order to get the most recent check-ins first
      const timeA = new Date(a.check_in || 0).getTime();
      const timeB = new Date(b.check_in || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 5); // Limit to the last (most recent) 5 data points

  // Map attendance records to display rows
  const rows = todayAttendance.map((item) => {
    const userId = extractId(item.user_id);
    const workerName =
      (userId ? memberNameByUserId.get(userId) : undefined) ?? "Unknown";
    return {
      id: item._id ?? item.id ?? `${userId ?? "row"}-${item.date ?? todayStr}`,
      worker: workerName,
      time: formatTime(item.check_in),
      status: formatStatus(item.status),
    };
  });

  return (
    <DashboardCard className="relative gap-0 md:col-span-2">
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent attendance</CardTitle>

        <CardDescription>
          Latest check-in log and attendance status for {workspace.name}.
        </CardDescription>
      </CardHeader>

      <CardContent className="mask-b-from-50% mask-b-to-100% px-0">
        <Table>
          <TableCaption className="sr-only">
            Recent worker attendance with name, time, and status for{" "}
            {workspace.name}.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="ps-6">Worker</TableHead>

              <TableHead>Check-in</TableHead>

              <TableHead className="pe-6 text-right tabular-nums">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow className="h-12">
                <TableCell className="ps-6 text-muted-foreground" colSpan={3}>
                  Loading attendance...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && rows.length === 0 && (
              <TableRow className="h-12">
                <TableCell className="ps-6 text-muted-foreground" colSpan={3}>
                  No attendance records for today.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              rows.map((item) => (
                <TableRow className="h-12" key={item.id}>
                  <TableCell className="max-w-40 truncate ps-6 font-medium">
                    {item.worker}
                  </TableCell>

                  <TableCell className="text-muted-foreground tabular-nums">
                    {item.time}
                  </TableCell>

                  <TableCell className="pe-6 text-right tabular-nums">
                    {item.status}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <div className="mask-t-from-30% absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-background">
        <Button asChild className="relative cursor-pointer" variant="ghost">
          <Link href="/attendance-logs">
            View All
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
