"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/provider/workspace-provider";
import { PlusIcon, ScrollTextIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PolicyCard } from "./policy-card";
import { PolicyFormDialog } from "./policy-form-dialog";
import type { WorkspacePolicyData } from "./types";

export function PolicyDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] =
    useState<WorkspacePolicyData | null>(null);

  // State Dictionary Pattern keyed by Workspace ID
  const [policiesData, setPoliciesData] = useState<
    Record<string, WorkspacePolicyData[]>
  >({
    worksmart: [
      {
        id: "POL-001",
        name: "Standard HQ Rules",
        check_in_start: "08:00",
        check_in_end: "17:00",
        late_buffer_minutes: 15,
        deadline_scan_minutes: 30,
        annual_leave_limit: 18,
        sick_leave_limit: 6,
        status: "active",
      },
      {
        id: "POL-002",
        name: "Flexible Dev Shift",
        check_in_start: "10:00",
        check_in_end: "19:00",
        late_buffer_minutes: 30,
        deadline_scan_minutes: 60,
        annual_leave_limit: 21,
        sick_leave_limit: 10,
        status: "inactive",
      },
    ],
  });

  const currentWorkspacePolicies = useMemo(() => {
    return policiesData[workspace.id] || [];
  }, [policiesData, workspace.id]);

  const processedPolicies = useMemo(() => {
    return currentWorkspacePolicies.filter(
      (pol) =>
        pol.name.toLowerCase().includes(search.toLowerCase()) ||
        pol.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [currentWorkspacePolicies, search]);

  // Handle Add or Edit Execution
  const handleSavePolicy = (
    data: Omit<WorkspacePolicyData, "id" | "status">,
  ) => {
    setPoliciesData((prev) => {
      const existing = prev[workspace.id] || [];

      if (editingPolicy) {
        // Edit Mode: Update item and preserve its current status
        return {
          ...prev,
          [workspace.id]: existing.map((p) =>
            p.id === editingPolicy.id ? { ...p, ...data } : p,
          ),
        };
      } else {
        // Create Mode: Make the new policy active and deactivate all others
        const newId = `POL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const newPolicy: WorkspacePolicyData = {
          ...data,
          id: newId,
          status: "active",
        };
        const updatedExisting = existing.map((p) => ({
          ...p,
          status: "inactive" as const,
        }));

        return {
          ...prev,
          [workspace.id]: [newPolicy, ...updatedExisting],
        };
      }
    });

    toast.success(
      editingPolicy
        ? "Policy updated successfully."
        : `Global policy "${data.name}" activated!`,
    );
    setIsFormOpen(false);
    setEditingPolicy(null);
  };

  // Handle Permanent Removal
  const handleRemovePolicy = (id: string) => {
    setPoliciesData((prev) => ({
      ...prev,
      [workspace.id]: (prev[workspace.id] || []).filter((p) => p.id !== id),
    }));
    toast.success("Policy permanently deleted.");
  };

  // Handle Making a Policy Active
  const handleSetActivePolicy = (id: string) => {
    setPoliciesData((prev) => ({
      ...prev,
      [workspace.id]: (prev[workspace.id] || []).map((pol) => ({
        ...pol,
        status: pol.id === id ? "active" : "inactive",
      })),
    }));
    toast.success("Active location tracking policy updated.");
  };

  const openCreate = () => {
    setEditingPolicy(null);
    setIsFormOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      {/* Structural Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Policies
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
              placeholder="Search by policy name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/10 h-10 text-xs transition-colors focus-visible:bg-background"
            />
          </div>

          <Button
            onClick={openCreate}
            size="sm"
            className="gap-2 h-10 text-xs font-semibold bg-brand text-white hover:bg-brand/90 shadow-sm"
          >
            <PlusIcon className="size-4" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {processedPolicies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onEdit={() => {
              setEditingPolicy(policy);
              setIsFormOpen(true);
            }}
            onDelete={handleRemovePolicy}
            onActivate={handleSetActivePolicy}
          />
        ))}

        {processedPolicies.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted/40 p-3 mb-3">
              <ScrollTextIcon className="size-5 text-muted-foreground/70" />
            </div>
            <p className="text-sm font-medium">
              No workspace policies configured
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Adjust your search or create a new policy to manage rules.
            </p>
          </div>
        )}
      </div>

      {/* Form Dialog Hook */}
      <PolicyFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingPolicy}
        onSave={handleSavePolicy}
      />
    </div>
  );
}
