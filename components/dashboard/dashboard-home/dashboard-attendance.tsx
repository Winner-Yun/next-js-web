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
import { useWorkspace } from "@/provider/workspace-provider";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const attendanceByWorkspace = {
  worksmart: [
    { id: "ws-01", worker: "John Smith", time: "08:02 AM", status: "Present" },
    { id: "ws-02", worker: "Sarah Lee", time: "08:15 AM", status: "Late" },
    { id: "ws-03", worker: "David Kim", time: "07:55 AM", status: "Present" },
    { id: "ws-04", worker: "Michael Tan", time: "-", status: "Absent" },
  ],
  school: [
    {
      id: "sch-01",
      worker: "Sopheak Chan",
      time: "06:45 AM",
      status: "Present",
    },
    { id: "sch-02", worker: "Sombath Reach", time: "07:12 AM", status: "Late" },
    { id: "sch-03", worker: "Sophy Vann", time: "06:58 AM", status: "Present" },
    { id: "sch-04", worker: "Bona Ouk", time: "-", status: "Absent" },
  ],
  company: [
    {
      id: "co-01",
      worker: "Alice Dupont",
      time: "08:55 AM",
      status: "Present",
    },
    { id: "co-02", worker: "Bob Miller", time: "09:05 AM", status: "Late" },
    {
      id: "co-03",
      worker: "Charlie Song",
      time: "08:42 AM",
      status: "Present",
    },
  ],
} as const;

export function DashboardAttendance() {
  const { workspace } = useWorkspace();

  const activeAttendance =
    attendanceByWorkspace[workspace.id as keyof typeof attendanceByWorkspace] ??
    attendanceByWorkspace.worksmart;

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
            {activeAttendance.map((item) => (
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
        <Button asChild className="relative" variant="ghost">
          <Link href="/attendance">
            View All
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
