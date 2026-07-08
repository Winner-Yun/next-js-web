"use client";

import { DashboardPage } from "@/components/dashboard/dashboard-home/dashboard";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-home/dashboard-skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { ArrowRight, FolderX, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export function DashboardContent() {
  const { workspaces, isLoading } = useWorkspace();
  const router = useRouter();

  if (isLoading) return <DashboardSkeleton />;

  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-var(--app-header-height))] w-full items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex max-w-md flex-col items-center text-center"
        >
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-b from-muted/60 to-muted "
            >
              <FolderX className="h-12 w-12 text-primary/70" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            No Workspace Found
          </h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground">
            You aren&apos;t a member of any workspace yet. Create your first
            workspace to start managing attendance, employees, and reports.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/workspaces")}
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Create Workspace</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <DashboardPage />;
}
