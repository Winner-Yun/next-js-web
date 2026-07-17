/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { PlusIcon, ScrollTextIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { PolicyCard } from "./policy-card";
import { PolicyFormDialog } from "./policy-form-dialog";
import type { WorkspacePolicyData } from "./types";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch policies");
  return res.json();
};

// How long (ms) the mouse needs to stay held down on a card before it
// switches into "reorder" mode. Short clicks (buttons, etc.) never reach
// this threshold, so normal interactions are unaffected.
const LONG_PRESS_MS = 450;

const getOrderStorageKey = (workspaceId: string) =>
  `policy-order:${workspaceId}`;

const readStoredOrder = (workspaceId: string): string[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getOrderStorageKey(workspaceId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeStoredOrder = (workspaceId: string, order: string[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      getOrderStorageKey(workspaceId),
      JSON.stringify(order),
    );
  } catch {
    // Ignore storage failures (e.g. private browsing quota) — ordering just
    // won't persist across reloads in that case.
  }
};

export function PolicyDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] =
    useState<WorkspacePolicyData | null>(null);

  // Card order (by policy id), driven by drag-to-reorder and persisted
  // per-workspace so it survives reloads.
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orderedIdsRef = useRef<string[]>([]);

  const {
    data: policiesData,
    error,
    isLoading,
    mutate,
  } = useSWR<WorkspacePolicyData[]>(
    workspace?.id ? `/api/workspace/${workspace.id}/policies` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  // Keep the ref in sync so the mouseup handler (attached once) always sees
  // the latest order without needing to re-bind on every reorder.
  useEffect(() => {
    orderedIdsRef.current = orderedIds;
  }, [orderedIds]);

  // Whenever fresh data arrives, respect any saved order for ids we still
  // recognize, and tack newly-created policies onto the end.
  useEffect(() => {
    if (!policiesData || !workspace?.id) return;
    const currentIds = policiesData.map((p) => p.id);
    const stored = readStoredOrder(workspace.id);
    const validStored = stored
      ? stored.filter((id) => currentIds.includes(id))
      : [];
    const missing = currentIds.filter((id) => !validStored.includes(id));
    setOrderedIds([...validStored, ...missing]);
  }, [policiesData, workspace?.id]);

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleCardMouseDown = (id: string) => {
    clearPressTimer();
    pressTimerRef.current = setTimeout(() => {
      setDraggingId(id);
      pressTimerRef.current = null;
    }, LONG_PRESS_MS);
  };

  const handleCardMouseEnter = (id: string) => {
    if (!draggingId || draggingId === id) return;
    setOrderedIds((prev) => {
      const fromIndex = prev.indexOf(draggingId);
      const toIndex = prev.indexOf(id);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, draggingId);
      return next;
    });
  };

  const finishDragging = () => {
    clearPressTimer();
    if (draggingId && workspace?.id) {
      writeStoredOrder(workspace.id, orderedIdsRef.current);
    }
    setDraggingId(null);
  };

  // Catch mouseup anywhere (not just on a card) so a drag that ends off a
  // card still saves and exits cleanly.
  useEffect(() => {
    window.addEventListener("mouseup", finishDragging);
    return () => window.removeEventListener("mouseup", finishDragging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingId, workspace?.id]);

  const orderedPolicies = useMemo(() => {
    if (!policiesData) return [];
    const byId = new Map(policiesData.map((p) => [p.id, p]));
    return orderedIds
      .map((id) => byId.get(id))
      .filter((p): p is WorkspacePolicyData => Boolean(p));
  }, [policiesData, orderedIds]);

  // Find the policy that is currently active
  const activePolicy = useMemo(() => {
    if (!policiesData) return null;
    return policiesData.find((pol) => pol.status === "active") || null;
  }, [policiesData]);

  const processedPolicies = useMemo(() => {
    if (!orderedPolicies.length) return [];
    return orderedPolicies.filter(
      (pol) =>
        pol.name.toLowerCase().includes(search.toLowerCase()) ||
        pol.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orderedPolicies, search]);

  const handleSavePolicy = async (
    data: Omit<WorkspacePolicyData, "id" | "status">,
  ) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");
      const isEdit = !!editingPolicy;

      const url = isEdit
        ? `/api/workspace/${workspace.id}/policy/${editingPolicy.id}`
        : `/api/workspace/${workspace.id}/policy`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to deploy policy configuration");

      toast.success(
        isEdit
          ? "Policy updated successfully."
          : `Global policy "${data.name}" activated!`,
      );
      await mutate(undefined, { revalidate: true });
      setIsFormOpen(false);
      setEditingPolicy(null);
    } catch (error: unknown) {
      toast.error(error.message || "Failed to process policy request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePolicy = async (id: string) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspace.id}/policy/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete policy configuration");

      toast.success("Policy permanently deleted.");
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(error.message || "Failed to delete policy.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetActivePolicy = async (id: string) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `/api/workspace/${workspace.id}/policy/${id}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to activate target policy");

      toast.success("Active workspace policy updated.");
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(error.message || "Failed to update active policy.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openCreate = () => {
    setEditingPolicy(null);
    setIsFormOpen(true);
  };

  const hasNoPolicies = policiesData && policiesData.length === 0;

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Policies
          </h1>
          <div className="text-muted-foreground text-xs mt-1 flex items-center gap-1.5">
            Active Workspace Policy:{" "}
            {isLoading || !workspace ? (
              <Skeleton className="h-3 w-24" />
            ) : (
              <span className="font-semibold text-brand">
                {activePolicy ? activePolicy.name : "None Configuration Active"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search by policy name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!workspace}
              className="pl-9 bg-muted/10 h-10 text-xs transition-colors focus-visible:bg-background"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Button
              onClick={openCreate}
              size="sm"
              disabled={isProcessing || isLoading || !workspace}
              className="w-full cursor-pointer sm:w-auto gap-2 h-10 text-xs font-semibold bg-brand text-white hover:bg-brand/90 shadow-sm"
            >
              <PlusIcon className="size-4" />
              Create Policy
            </Button>
            {hasNoPolicies && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-53 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center text-xs text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
          Failed to load operational policies from server. Check your session.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedPolicies.map((policy) => (
            <div
              key={policy.id}
              onMouseDown={() => handleCardMouseDown(policy.id)}
              onMouseEnter={() => handleCardMouseEnter(policy.id)}
              className={`transition-transform duration-150 select-none ${
                draggingId === policy.id
                  ? "cursor-grabbing scale-[1.02] z-10 drop-shadow-lg"
                  : "cursor-grab"
              }`}
            >
              <PolicyCard
                policy={policy}
                onEdit={() => {
                  setEditingPolicy(policy);
                  setIsFormOpen(true);
                }}
                onDelete={handleRemovePolicy}
                onActivate={handleSetActivePolicy}
                isProcessing={isProcessing}
              />
            </div>
          ))}

          {hasNoPolicies ? (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-amber-500/30 bg-amber-500/2 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="rounded-full bg-amber-500/10 p-4 mb-4">
                <ScrollTextIcon className="size-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No workspace policies configured
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-sm leading-relaxed">
                You must set up and deploy at least one workspace policy to
                manage rules, schedules, and timing structures.
              </p>
              <Button
                onClick={openCreate}
                size="sm"
                disabled={isProcessing || isLoading || !workspace}
                className="gap-2 h-10 cursor-pointer text-xs font-semibold bg-brand text-white hover:bg-brand/90 shadow-sm px-5"
              >
                <PlusIcon className="size-4" />
                Create Your First Policy
              </Button>
            </div>
          ) : (
            /* Fallback Empty State: Only shows if search filters returned nothing */
            processedPolicies.length === 0 && (
              <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
                <div className="rounded-full bg-muted/40 p-3 mb-3">
                  <ScrollTextIcon className="size-5 text-muted-foreground/70" />
                </div>
                <p className="text-sm font-medium">
                  No matching workspace policies
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adjust your search terms to find other configured policies.
                </p>
              </div>
            )
          )}
        </div>
      )}

      <PolicyFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingPolicy}
        onSave={handleSavePolicy}
        isProcessing={isProcessing}
      />
    </div>
  );
}
