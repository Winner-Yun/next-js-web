// hooks/use-dashboard-data.ts
"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export function useDashboardData() {
  const { workspace } = useWorkspace();
  const workspaceId = workspace?.id;

  const { data: members, isLoading: membersLoading } = useSWR(
    workspaceId ? `/api/workspace/${workspaceId}/members` : null,
    fetcher,
  );

  const { data: attendance, isLoading: attendanceLoading } = useSWR(
    workspaceId ? `/api/workspace/${workspaceId}/attendance` : null,
    fetcher,
  );

  const { data: leaves, isLoading: leavesLoading } = useSWR(
    workspaceId ? `/api/workspace/${workspaceId}/leaves?status=pending` : null,
    fetcher,
  );

  return {
    members: Array.isArray(members) ? members : members?.members || [],
    attendance: Array.isArray(attendance) ? attendance : attendance?.data || [],
    leaves: Array.isArray(leaves) ? leaves : leaves?.data || [],
    isLoading: membersLoading || attendanceLoading || leavesLoading,
  };
}
