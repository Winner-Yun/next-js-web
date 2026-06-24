"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseIcon,
  ChevronRightIcon,
  CircleIcon,
  MailIcon,
} from "lucide-react";
import type { Employee } from "./types";

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const isActive = employee.status === "active";

  return (
    <DashboardCard
      className="group relative cursor-pointer overflow-hidden border border-muted/60 bg-card p-5 transition-all duration-300 hover:border-brand/40 hover:bg-muted/5 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between min-h-52.5 rounded-xl"
      onClick={onClick}
    >
      {/* Top Section: Avatar & Badging Status Context */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="size-11 rounded-xl bg-linear-to-br from-muted to-muted/40 flex items-center justify-center text-xs font-bold border border-muted-foreground/10 uppercase text-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
              {employee.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-background border-2 border-background">
              <span
                className={`size-2 rounded-full ${
                  isActive
                    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                    : "bg-muted-foreground/50"
                }`}
              />
            </span>
          </div>

          <div className="min-w-0 space-y-0.5">
            <h3 className="font-semibold text-sm text-foreground tracking-tight group-hover:text-brand transition-colors truncate">
              {employee.name}
            </h3>
            <span className="inline-block font-mono bg-muted/80 text-muted-foreground border border-muted px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider">
              {employee.id}
            </span>
          </div>
        </div>

        <Badge
          variant={isActive ? "default" : "secondary"}
          className={`text-[9px] px-2 py-0.5 shadow-none border font-bold uppercase tracking-wider rounded-md shrink-0 transition-colors ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-muted-foreground/10"
          }`}
        >
          <CircleIcon
            className={`size-1 fill-current mr-1 ${isActive ? "text-emerald-500" : "text-muted-foreground/40"}`}
          />
          {employee.status}
        </Badge>
      </div>

      {/* Center Section: Core Structural Details Metadata */}
      <div className="space-y-2.5 my-4 border-t border-b border-muted/40 py-3">
        <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
          <MailIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-xs truncate font-medium text-foreground/80">
            {employee.email}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
          <BriefcaseIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-xs truncate font-medium text-foreground/80">
            {employee.role}
          </span>
        </div>
      </div>

      {/* Bottom Section: Footer Department context callout */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-muted-foreground text-[11px]">
          Dept:{" "}
          <span className="text-foreground font-semibold ml-0.5">
            {employee.department}
          </span>
        </span>

        <div className="flex size-7 items-center justify-center rounded-lg border border-transparent transition-all duration-300 group-hover:border-muted group-hover:bg-muted/40">
          <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </div>
    </DashboardCard>
  );
}
