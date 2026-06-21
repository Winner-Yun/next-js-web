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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useWorkspace } from "@/provider/workspace-provider";
import { AlertCircleIcon, ArrowRightIcon, CircleCheckIcon } from "lucide-react";
import Link from "next/link";


const healthByWorkspace = {
  worksmart: {
    description: "Worker attendance is running normally.",
    title: "Everything looks good.",
    subText:
      "Attendance rate is stable. No unusual absence detected in this snapshot.",
    icon: <CircleCheckIcon aria-hidden="true" />,
  },
  school: {
    description: "Student logs are clear for today.",
    title: "Class check-ins stable.",
    subText:
      "Morning sessions have completed verification with typical patterns.",
    icon: <CircleCheckIcon aria-hidden="true" />,
  },
  company: {
    description: "Staff sync status alert.",
    title: "Requires review.",
    subText:
      "Higher volume of remote check-ins detected today compared to last week.",
    icon: <AlertCircleIcon aria-hidden="true" className="text-warning" />,
  },
} as const;

export function AttendanceHealth() {

  const { workspace } = useWorkspace();

  const activeHealth =
    healthByWorkspace[workspace.id as keyof typeof healthByWorkspace] ??
    healthByWorkspace.worksmart;

  return (
    <DashboardCard className="gap-0">
      <CardHeader className="border-b">
        <CardTitle className="text-balance text-base">
          Attendance health
        </CardTitle>

        <CardDescription className="text-pretty">
          {activeHealth.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex h-full items-center px-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">{activeHealth.icon}</EmptyMedia>

            <EmptyTitle>{activeHealth.title}</EmptyTitle>

            <EmptyDescription className="text-xs">
              {activeHealth.subText}
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button asChild variant="ghost">
              <Link href="/attendance">
                Review attendance for {workspace.name}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </DashboardCard>
  );
}
