"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const isSuspended = employee.status === "suspended"; // ADDED: Check for suspended status
  const initials = employee.name ? employee.name[0].toUpperCase() : "?";

  return (
    <DashboardCard
      className="group relative cursor-pointer overflow-hidden border border-muted/60 bg-card p-5 transition-all duration-300 hover:border-brand/40 hover:bg-muted/5 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between min-h-52.5 rounded-xl"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar className="size-11 rounded-xl border border-muted-foreground/10 shadow-sm">
              {employee.avatar ? (
                <AvatarImage
                  src={employee.avatar}
                  alt={employee.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-xl bg-linear-to-br from-muted to-muted/40 font-bold uppercase text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex flex-col">
            <h3 className="truncate font-bold text-sm text-foreground tracking-tight group-hover:text-brand transition-colors">
              {employee.name || "Pending User"}
            </h3>
            <span className="text-[11px] font-medium text-muted-foreground capitalize">
              {employee.role}
            </span>
          </div>
        </div>

        {/* UPDATED: Badge handles "suspended" variant and text string */}
        <Badge
          variant={
            isActive ? "success" : isSuspended ? "destructive" : "secondary"
          }
          className="text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide shrink-0 shadow-xs"
        >
          <CircleIcon
            className={`mr-1 size-1.5 fill-current ${
              isActive
                ? "text-emerald-500"
                : isSuspended
                  ? "text-amber-500"
                  : "text-muted-foreground"
            }`}
          />
          {employee.is_pending
            ? "Pending"
            : isActive
              ? "Active"
              : isSuspended
                ? "Suspended"
                : "Inactive"}
        </Badge>
      </div>

      <div className="space-y-2.5 my-4 border-t border-b border-muted/40 py-3">
        <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
          <MailIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-xs truncate font-medium text-foreground/80">
            {employee.email}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
          <BriefcaseIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-xs truncate font-medium text-foreground/80 capitalize">
            {employee.role || "Member"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-muted-foreground text-[11px]">
          Auth:{" "}
          <span className="text-foreground font-semibold ml-0.5 uppercase">
            {employee.role}
          </span>
        </span>

        <div className="flex size-7 items-center justify-center rounded-lg border border-transparent transition-all duration-300 group-hover:border-muted group-hover:bg-muted/40">
          <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </DashboardCard>
  );
}
