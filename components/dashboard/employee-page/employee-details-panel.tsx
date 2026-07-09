"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LogInIcon,
  LogOutIcon,
  MapPinIcon,
  MapPinnedIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";
import useSWR from "swr";
import type { Employee } from "./types";

// SWR Fetcher for attendance
const attendanceFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch attendance data");
  return res.json();
};

export function EmployeeDetailsPanel({ employee }: { employee: Employee }) {
  const isActive = employee.status === "active";
  const { workspace } = useWorkspace();

  const { data: attendanceData, isLoading } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/attendance` : null,
    attendanceFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    },
  );

  const todayLog = useMemo(() => {
    if (!attendanceData?.data) return null;

    const todayStr = new Date().toISOString().split("T")[0];

    return (
      attendanceData.data.find((item: unknown) => {
        const isSameUser =
          item.user_id === employee.id ||
          item.user?._id === employee.id ||
          item.user?.email?.toLowerCase() === employee.email?.toLowerCase();
        const isToday = item.date === todayStr;

        return isSameUser && isToday;
      }) || null
    );
  }, [attendanceData, employee.id, employee.email]);

  // Use the employee data directly, fallback to log data if needed
  const profileAvatar = employee.avatar || todayLog?.user?.avatar || null;
  const genderContext = employee.gender || todayLog?.user?.gender || null;

  return (
    <div className="space-y-6 pt-4 px-4 animate-in fade-in duration-300">
      <SheetHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar className="size-14 rounded-2xl border shadow-sm shrink-0 bg-linear-to-br from-muted/60 to-muted">
              {profileAvatar && (
                <AvatarImage
                  src={profileAvatar}
                  alt={employee.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-base font-bold text-foreground uppercase">
                {employee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="text-base font-bold truncate flex items-center gap-1.5">
                {employee.name}
              </SheetTitle>
              <SheetDescription className="text-xs truncate flex flex-col gap-0.5">
                <span>{employee.email}</span>
                {genderContext && (
                  <span className="text-[10px] text-muted-foreground/80 capitalize font-medium">
                    Gender: {genderContext}
                  </span>
                )}
              </SheetDescription>
            </div>
          </div>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              employee.status === "suspended"
                ? "capitalize bg-amber-500 text-white"
                : "capitalize bg-accent text-foreground"
            }
          >
            {employee.status}
          </Badge>
        </div>
      </SheetHeader>

      {/* Grid updated to 2 columns since Biometrics is removed */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-10 p-1 rounded-xl">
          <TabsTrigger
            value="attendance"
            className="text-xs font-semibold gap-1.5 rounded-lg transition-all"
          >
            <Clock3Icon className="size-3.5" /> Logs
          </TabsTrigger>
          <TabsTrigger
            value="geofence"
            className="text-xs font-semibold gap-1.5 rounded-lg transition-all"
          >
            <MapPinnedIcon className="size-3.5" /> Fencing
          </TabsTrigger>
        </TabsList>

        <div className="mt-5 rounded-xl border border-muted/40 bg-card/40 p-4 min-h-48 flex flex-col justify-center">
          {isLoading ? (
            <div className="text-center text-xs text-muted-foreground animate-pulse">
              Loading tracking metrics...
            </div>
          ) : (
            <>
              {/* Logs Content Tab */}
              <TabsContent
                value="attendance"
                className="m-0 outline-none space-y-4"
              >
                {todayLog ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Today&apos;s Status
                      </span>
                      <Badge
                        className="uppercase"
                        variant={
                          todayLog.status === "absent"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {todayLog.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 border rounded-lg p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                          <LogInIcon className="size-3 text-emerald-600" />
                          <span>Check In</span>
                        </div>
                        <p className="text-xs font-bold font-mono">
                          {todayLog.check_in
                            ? new Date(todayLog.check_in).toLocaleTimeString()
                            : "--:--:--"}
                        </p>
                      </div>

                      <div className="bg-muted/30 border rounded-lg p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                          <LogOutIcon className="size-3 text-amber-600" />
                          <span>Check Out</span>
                        </div>
                        <p className="text-xs font-bold font-mono">
                          {todayLog.check_out
                            ? new Date(todayLog.check_out).toLocaleTimeString()
                            : "--:--:--"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Face Verification
                        </span>
                        {todayLog.face_verified ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2Icon className="size-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <XCircleIcon className="size-3.5" /> Unverified
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Anti-Spoofing Liveness
                        </span>
                        {todayLog.liveness_verified ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2Icon className="size-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <XCircleIcon className="size-3.5" /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock3Icon className="mx-auto size-6 text-muted-foreground/40 mb-2" />
                    <p className="text-xs font-semibold text-muted-foreground">
                      No logs captured today
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Geofencing Tab */}
              <TabsContent
                value="geofence"
                className="m-0 outline-none space-y-4"
              >
                {todayLog ? (
                  <div className="space-y-3.5">
                    {todayLog.mock_location_detected && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg p-2.5 flex items-center gap-2 font-medium">
                        <AlertTriangleIcon className="size-4 shrink-0" />
                        <span>
                          Warning: Mock Location coordinates detected!
                        </span>
                      </div>
                    )}

                    <div className="bg-muted/30 border rounded-lg p-3 space-y-2.5">
                      <div className="flex items-center gap-2 border-b pb-1.5">
                        <MapPinIcon className="size-3.5 text-brand" />
                        <span className="text-xs font-semibold">
                          Terminal Coordinates
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Latitude
                          </span>
                          <span className="text-foreground font-medium">
                            {todayLog.latitude || "0.0"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Longitude
                          </span>
                          <span className="text-foreground font-medium">
                            {todayLog.longitude || "0.0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPinnedIcon className="mx-auto size-6 text-muted-foreground/40 mb-2" />
                    <p className="text-xs font-semibold text-muted-foreground">
                      No telemetry reads available today
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
