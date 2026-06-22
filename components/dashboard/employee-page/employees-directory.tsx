"use client";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useWorkspace } from "@/provider/workspace-provider";
import { SearchIcon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { EmployeeCard } from "@/components/dashboard/employee-page/employee-card";
import { EmployeeDetailsPanel } from "@/components/dashboard/employee-page/employee-details-panel";
import { InviteEmployeeDialog } from "@/components/dashboard/employee-page/invite-employee-dialog";
import { ManageAccessDialog } from "@/components/dashboard/employee-page/manage-access-dialog";
import type { Employee } from "@/components/dashboard/employee-page/types";

const mockEmployees: Record<string, Employee[]> = {
  worksmart: [
    {
      id: "EMP-001",
      name: "Alex Mercer",
      role: "Lead Engineer",
      department: "Engineering",
      status: "active",
      email: "alex@worksmart.ai",
    },
    {
      id: "EMP-002",
      name: "Sarah Connor",
      role: "HR Manager",
      department: "Operations",
      status: "active",
      email: "sarah.c@worksmart.ai",
    },
    {
      id: "EMP-003",
      name: "John Doe",
      role: "Intern",
      department: "Engineering",
      status: "inactive",
      email: "john.doe@worksmart.ai",
    },
  ],
};

export function EmployeesDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const employeesList = useMemo(
    () => mockEmployees[workspace.id] || [],
    [workspace.id],
  );

  const filteredEmployees = useMemo(() => {
    return employeesList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [employeesList, search]);

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      {/* Header Layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Active Context Directory:{" "}
            <span className="font-semibold text-brand">{workspace.name}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/10 h-10 text-xs transition-colors focus-visible:bg-background"
            />
          </div>

          {/* Clean Decoupled Dialog Component Button */}
          <ManageAccessDialog />

          <InviteEmployeeDialog />
        </div>
      </div>

      {/* Directory Grid Layout matching Workspace UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredEmployees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onClick={() => setSelectedEmployee(emp)}
          />
        ))}

        {filteredEmployees.length === 0 && (
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
