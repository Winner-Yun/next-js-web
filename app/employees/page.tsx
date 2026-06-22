import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { EmployeesDirectory } from "@/components/dashboard/employee-page/employees-directory";

export default function EmployeesPage() {
  return (
    <AppShell>
      <EmployeesDirectory />
    </AppShell>
  );
}
