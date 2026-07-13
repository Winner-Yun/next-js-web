"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ActivityIcon, BriefcaseIcon, ClockIcon, UsersIcon } from "lucide-react";
import { KpiSummary } from "./types";

interface KpiCardsProps {
  kpis: KpiSummary;
  isLoading: boolean;
}

export function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  const cards = [
    { label: "Active Workforce", val: kpis.totalEmployees, icon: UsersIcon, color: "text-blue-600" },
    { label: "Today's Attendance", val: `${kpis.attendanceRate}%`, icon: ActivityIcon, color: "text-emerald-600" },
    { label: "Hours Logged", val: `${kpis.totalHours} hrs`, icon: ClockIcon, color: "text-brand" },
    { label: "Pending Leaves", val: kpis.pendingLeaves, icon: BriefcaseIcon, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => (
        <div key={idx} className="bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5 w-full">
            <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold block">{c.label}</span>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className={`text-2xl font-black block ${c.color}`}>{c.val}</span>
            )}
          </div>
          <div className={`p-2.5 rounded-lg ${c.color} bg-muted/10 shrink-0`}>
            <c.icon className="size-5" />
          </div>
        </div>
      ))}
    </div>
  );
}