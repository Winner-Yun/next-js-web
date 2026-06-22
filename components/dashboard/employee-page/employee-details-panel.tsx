"use client";

import { Badge } from "@/components/ui/badge";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock3Icon, MapPinnedIcon, ScanFaceIcon } from "lucide-react";
import type { Employee } from "./types";

import { PluginAttendance } from "@/components/dashboard/employee-page/plugin/plugin-attendance";
import { PluginBiometrics } from "@/components/dashboard/employee-page/plugin/plugin-biometrics";
import { PluginGeofencing } from "@/components/dashboard/employee-page/plugin/plugin-geofencing";

export function EmployeeDetailsPanel({ employee }: { employee: Employee }) {
  const isActive = employee.status === "active";

  return (
    <div className="space-y-6 pt-4 px-4 animate-in fade-in duration-300">
      <SheetHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-muted/60 to-muted border border-muted flex items-center justify-center text-base font-bold text-foreground shadow-sm">
              {employee.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-xl tracking-tight font-bold text-foreground">
                {employee.name}
              </SheetTitle>
              <SheetDescription className="font-mono text-xs mt-1 text-muted-foreground truncate">
                <span className="bg-muted px-1.5 py-0.5 rounded font-semibold text-foreground/80 mr-1.5">
                  {employee.id}
                </span>
                {employee.email}
              </SheetDescription>
            </div>
          </div>

          <Badge
            variant={isActive ? "default" : "secondary"}
            className={`border-0 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md shrink-0 ${
              isActive
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                : ""
            }`}
          >
            {employee.status.toUpperCase()}
          </Badge>
        </div>
      </SheetHeader>

      {/* Overview Context Panel Grid */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-muted/60 bg-muted/10 p-4 text-xs">
        <div className="space-y-1">
          <p className="text-muted-foreground/80 font-medium">
            Department Context
          </p>
          <p className="font-bold text-foreground text-sm">
            {employee.department}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground/80 font-medium">
            Functional Role
          </p>
          <p className="font-bold text-foreground text-sm">{employee.role}</p>
        </div>
      </div>

      {/* System Plug Matrix Engine Tabs Container */}
      <Tabs defaultValue="biometrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-10 p-1 rounded-xl">
          <TabsTrigger
            value="biometrics"
            className="text-xs font-semibold gap-1.5 rounded-lg transition-all"
          >
            <ScanFaceIcon className="size-3.5" /> Face AI
          </TabsTrigger>
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

        <div className="mt-5 rounded-xl border border-muted/40 bg-card/40 p-1">
          <TabsContent value="biometrics" className="m-0 outline-none">
            <PluginBiometrics employeeId={employee.id} />
          </TabsContent>
          <TabsContent value="attendance" className="m-0 outline-none">
            <PluginAttendance employeeId={employee.id} />
          </TabsContent>
          <TabsContent value="geofence" className="m-0 outline-none">
            <PluginGeofencing employeeId={employee.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
