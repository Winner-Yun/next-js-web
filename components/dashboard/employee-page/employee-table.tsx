"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleIcon, UsersIcon } from "lucide-react";
import type { Employee } from "./types";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (employee: Employee) => void;
  isSelf?: (employee: Employee) => boolean;
}

export function EmployeeTable({
  employees,
  onRowClick,
  isSelf,
}: EmployeeTableProps) {
  return (
    <div className="border border-muted/60 rounded-xl bg-background overflow-hidden">
      <div className="max-h-[65vh] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-background/95 backdrop-blur-xs z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            <tr className="text-muted-foreground bg-muted/20 border-b border-muted/60">
              <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                Employee
              </th>
              <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                Role
              </th>
              <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                Joined
              </th>
              <th className="p-3 text-[10px] uppercase font-bold tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-muted/40">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-0">
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    <div className="rounded-full bg-muted/40 p-3 mb-3">
                      <UsersIcon className="size-5 text-muted-foreground/70" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No records located
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No employees match your criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isActive = emp.status === "active";
                const isSuspended = (emp.status as string) === "suspended";
                const isOwner = emp.role?.toLowerCase() === "owner";
                const isYou = isSelf?.(emp) ?? false;
                const displayName = isYou ? "You" : emp.name || "Unnamed";
                const initials = isYou
                  ? "Y"
                  : emp.name
                    ? emp.name[0].toUpperCase()
                    : "?";

                return (
                  <tr
                    key={emp.id}
                    onClick={() => onRowClick(emp)}
                    className={`transition-colors ${
                      isOwner
                        ? "cursor-default"
                        : "hover:bg-muted/5 cursor-pointer"
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="size-8 rounded-lg border border-muted-foreground/10 shrink-0">
                          {emp.avatar ? (
                            <AvatarImage
                              src={emp.avatar}
                              alt={emp.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="rounded-lg bg-linear-to-br from-muted to-muted/40 font-bold uppercase text-foreground text-[10px]">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground font-medium capitalize">
                      {emp.role || "Member"}
                    </td>
                    <td className="p-3 font-mono text-foreground">
                      {formatDate(emp.joined_at || emp.created_at)}
                    </td>
                    <td className="p-3 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide shadow-xs ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : isSuspended
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : ""
                        }`}
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
                        {isActive
                          ? "Active"
                          : isSuspended
                            ? "Suspended"
                            : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
