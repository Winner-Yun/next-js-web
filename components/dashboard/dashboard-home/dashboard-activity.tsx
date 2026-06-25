"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ClockIcon,
  FileTextIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";

const activityByWorkspace = {
  worksmart: [
    {
      title: "John Smith checked in",
      time: "About 5 minutes ago",
      icon: <UserCheckIcon />,
    },
    {
      title: "Sarah Lee arrived late",
      time: "About 20 minutes ago",
      icon: <ClockIcon />,
    },
    {
      title: "Attendance report generated",
      time: "Yesterday",
      icon: <FileTextIcon />,
    },
    {
      title: "Michael Tan marked absent",
      time: "2 days ago",
      icon: <UserXIcon />,
    },
  ],

  school: [
    {
      title: "Sopheak Chan checked in",
      time: "About 2 minutes ago",
      icon: <UserCheckIcon />,
    },
    {
      title: "Sombath Reach arrived late",
      time: "About 15 minutes ago",
      icon: <ClockIcon />,
    },
    {
      title: "Sophy Vann checked in",
      time: "About 30 minutes ago",
      icon: <UserCheckIcon />,
    },
    {
      title: "Bona Ouk marked absent",
      time: "Yesterday",
      icon: <UserXIcon />,
    },
  ],

  company: [
    {
      title: "Alice Dupont checked in",
      time: "10 minutes ago",
      icon: <UserCheckIcon />,
    },
    {
      title: "Bob Miller arrived late",
      time: "45 minutes ago",
      icon: <ClockIcon />,
    },
    {
      title: "Charlie Song checked in",
      time: "1 hour ago",
      icon: <UserCheckIcon />,
    },
  ],
} as const;

interface DashboardActivityProps {
  className?: string;
}

export function DashboardActivity({ className = "" }: DashboardActivityProps) {
  const { workspace } = useWorkspace();

  const activeItems =
    activityByWorkspace[workspace.id as keyof typeof activityByWorkspace] ??
    activityByWorkspace.worksmart;

  return (
    <DashboardCard className={`w-full gap-0 ${className}`}>
      <CardHeader className="border-b">
        <CardTitle>Activity</CardTitle>

        <CardDescription>Latest updates for {workspace.name}.</CardDescription>
      </CardHeader>

      <CardContent className="px-0 w-full">
        <ul className="flex flex-col divide-y divide-border w-full">
          {activeItems.map((item) => (
            <li
              key={item.title}
              className="flex h-16 items-center gap-3 px-6 w-full"
            >
              <span
                aria-hidden="true"
                className="
                  flex 
                  size-10 
                  shrink-0 
                  items-center 
                  justify-center
                  [&_svg]:size-4
                "
              >
                {item.icon}
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <p
                  className="
                    line-clamp-1
                    text-pretty
                    text-foreground
                    text-sm
                    leading-snug
                  "
                >
                  {item.title}
                </p>

                <p className="text-muted-foreground text-xs">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </DashboardCard>
  );
}
