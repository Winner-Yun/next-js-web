"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  ClockIcon,
  FileTextIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";

type AttendanceRecord = {
  _id?: string;
  id?: string;
  user_id?: string | { $oid?: string };
  check_in?: string | null;
  check_out?: string | null;
  status?: string;
  date?: string;
  updated_at?: string | null;
};

type MemberRecord = {
  _id?: string;
  id?: string;
  user_id?: string | { $oid?: string };
  name?: string;
  full_name?: string;
  email?: string;
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

const formatRelativeTime = (
  value: string | null | undefined,
  now: Date = new Date(),
): string => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return `About ${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `About ${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString();
};

const getActivityTimestamp = (record: AttendanceRecord): string | null => {
  return record.check_in ?? record.updated_at ?? null;
};

const buildTitle = (name: string, status?: string): string => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "late") return `${name} arrived late`;
  if (normalized === "absent") return `${name} marked absent`;
  if (normalized === "present") return `${name} checked in`;
  if (normalized === "left" || normalized === "checked_out")
    return `${name} checked out`;
  return `${name} activity updated`;
};

const getActivityIcon = (status?: string) => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "late") return <ClockIcon />;
  if (normalized === "absent") return <UserXIcon />;
  return <UserCheckIcon />;
};

interface DashboardActivityProps {
  className?: string;
}

export function DashboardActivity({ className = "" }: DashboardActivityProps) {
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

  // Build activity items from attendance, sorted by most recent check_in
  const activeItems = (attendance as AttendanceRecord[])
    .map((item) => {
      const userId = extractId(item.user_id);
      const workerName =
        (userId ? memberNameByUserId.get(userId) : undefined) ?? "Someone";
      const timestamp = getActivityTimestamp(item);
      return {
        id: item._id ?? item.id ?? `${userId ?? "row"}-${item.date ?? ""}`,
        title: buildTitle(workerName, item.status),
        time: formatRelativeTime(timestamp),
        icon: getActivityIcon(item.status),
        // raw timestamp used purely for sorting (newest first)
        sortKey: timestamp ? new Date(timestamp).getTime() : 0,
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 6)
    .map(({ sortKey, ...rest }) => {
      void sortKey;
      return rest;
    });

  return (
    <DashboardCard className={`w-full gap-0 ${className}`}>
      <CardHeader className="border-b">
        <CardTitle>Activity</CardTitle>

        <CardDescription>Latest updates for {workspace.name}.</CardDescription>
      </CardHeader>

      <CardContent className="px-0 w-full">
        <ul className="flex flex-col divide-y divide-border w-full">
          {isLoading && (
            <li className="flex h-16 items-center gap-3 px-6 w-full">
              <p className="text-muted-foreground text-sm">
                Loading activity...
              </p>
            </li>
          )}

          {!isLoading && activeItems.length === 0 && (
            <li className="flex h-16 items-center gap-3 px-6 w-full">
              <span
                aria-hidden="true"
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  [&_svg]:size-4
                  text-muted-foreground
                "
              >
                <FileTextIcon />
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-1 text-pretty text-foreground text-sm leading-snug">
                  No recent activity
                </p>

                <p className="text-muted-foreground text-xs">
                  Check-in events will appear here.
                </p>
              </div>
            </li>
          )}

          {!isLoading &&
            activeItems.map((item) => (
              <li
                key={item.id}
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
