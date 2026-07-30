import type { Metadata } from "next";

import { AppShell } from "@/components/dashboard/appShell/app-shell";
import { TaskDirectory } from "@/components/dashboard/task-page/task-directory";

export const metadata: Metadata = {
  title: "Assign Task | WorkSmart",
};

export default function TasksPage() {
  return (
    <AppShell>
      <TaskDirectory />
    </AppShell>
  );
}
