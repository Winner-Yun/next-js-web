// hooks/use-dashboard-data.ts
"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import { useEffect, useState } from "react";

export function useDashboardData() {
  const { workspace } = useWorkspace();
  const [members, setMembers] = useState<unknown[]>([]);
  const [attendance, setAttendance] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!workspace?.id) return;

      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch through local Next.js Route Proxies to bypass browser CORS errors
        const [membersRes, attendanceRes] = await Promise.all([
          fetch(`/api/workspace/${workspace.id}/members`, { headers }),
          fetch(`/api/workspace/attendance/${workspace.id}`, { headers }),
        ]);

        const membersData = await membersRes.json();
        const attendanceData = await attendanceRes.json();

        // Ensure we handle arrays correctly even if API returns unexpected formats
        setMembers(
          Array.isArray(membersData) ? membersData : membersData.members || [],
        );
        setAttendance(
          Array.isArray(attendanceData)
            ? attendanceData
            : attendanceData.attendance || [],
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [workspace?.id]); // Re-run if workspace changes

  return { members, attendance, isLoading };
}
