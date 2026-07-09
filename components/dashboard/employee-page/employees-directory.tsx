"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { ArrowDownUpIcon, SearchIcon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

import { EmployeeCard } from "@/components/dashboard/employee-page/employee-card";
import { EmployeeDetailsPanel } from "@/components/dashboard/employee-page/employee-details-panel";
import { InviteEmployeeDialog } from "@/components/dashboard/employee-page/invite-employee-dialog";
import { ManageAccessDialog } from "@/components/dashboard/employee-page/manage-access-dialog";
import type { Employee } from "@/components/dashboard/employee-page/types";

const membersFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch workspace members");
  return res.json();
};

export function EmployeesDirectory() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Fetch real-time workspace members using SWR
  const { data, error, isLoading, mutate } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/members` : null,
    membersFetcher,
    { revalidateOnFocus: false },
  );

  const employeesList: Employee[] = useMemo(() => {
    return data?.members || [];
  }, [data]);

  const processedEmployees = useMemo(() => {
    let result = [...employeesList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.role?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name-asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc")
        return (b.name || "").localeCompare(b.name || "");
      return 0;
    });

    return result;
  }, [employeesList, searchQuery, sortBy]);

  const handleReload = async () => {
    await mutate(undefined, { revalidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
            <Input
              placeholder="Search by name, email, or role..."
              className="pl-9 text-xs h-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-card">
              <div className="flex items-center gap-2">
                <ArrowDownUpIcon className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc" className="text-xs">
                Name (A - Z)
              </SelectItem>
              <SelectItem value="name-desc" className="text-xs">
                Name (Z - A)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Linked explicit reload sequencer */}
          <ManageAccessDialog onSuccess={handleReload} />
          <InviteEmployeeDialog onInviteSuccess={handleReload} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52.5 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center text-xs text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
          Failed to load workspace members. Please verify session context.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onClick={() => setSelectedEmployee(emp)}
            />
          ))}

          {processedEmployees.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted/40 p-3 mb-3">
                <UsersIcon className="size-5 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No records located
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No employees match your search query filters.
              </p>
            </div>
          )}
        </div>
      )}

      <Sheet
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedEmployee && (
            <EmployeeDetailsPanel employee={selectedEmployee} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
