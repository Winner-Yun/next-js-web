"use client";

import {
  ActivityIcon,
  BriefcaseIcon,
  ClockIcon,
  UsersIcon,
} from "lucide-react";
import { KpiSummary } from "./types";

interface KpiCardsProps {
  kpis: KpiSummary;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
      <div className="bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex items-center justify-between print:border-gray-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">
            Active Workforce
          </span>
          <span className="text-2xl font-black text-foreground block">
            {kpis.totalEmployees}
          </span>
        </div>
        <div className="p-2.5 rounded-lg text-blue-600  print:text-black">
          <UsersIcon className="size-5" />
        </div>
      </div>

      <div className="bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex items-center justify-between print:border-gray-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">
            Today&apos;s Attendance
          </span>
          <span className="text-2xl font-black text-emerald-600 block">
            {kpis.attendanceRate}%
          </span>
        </div>
        <div className="p-2.5 rounded-lg  text-emerald-600  print:text-black">
          <ActivityIcon className="size-5" />
        </div>
      </div>

      <div className="bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex items-center justify-between print:border-gray-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">
            Total Hours Logged
          </span>
          <span className="text-2xl font-black text-brand block">
            {kpis.totalHours} hrs
          </span>
        </div>
        <div className="p-2.5 rounded-lg  text-brand  print:text-black">
          <ClockIcon className="size-5" />
        </div>
      </div>

      <div className="bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex items-center justify-between print:border-gray-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">
            Pending Leaves
          </span>
          <span className="text-2xl font-black text-amber-500 block">
            {kpis.pendingLeaves}
          </span>
        </div>
        <div className="p-2.5 rounded-lg text-amber-500  print:text-black">
          <BriefcaseIcon className="size-5" />
        </div>
      </div>
    </div>
  );
}
