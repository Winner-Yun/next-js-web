/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { GeofenceCard } from "./geofence-card";
import { GeofenceMapDialog } from "./geofence-map-dialog";
import type { GeofenceZone } from "./types";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch geofences");
  return res.json();
};

// How long (ms) the mouse needs to stay held down on a card before it
// switches into "reorder" mode. Short clicks (buttons, etc.) never reach
// this threshold, so normal interactions are unaffected.
const LONG_PRESS_MS = 450;

const getOrderStorageKey = (workspaceId: string) =>
  `geofence-order:${workspaceId}`;

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

export function GeofencingDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  // Card order (by zone id), driven by drag-to-reorder and persisted
  // per-workspace so it survives reloads.
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orderedIdsRef = useRef<string[]>([]);

  const {
    data: zonesData,
    error,
    isLoading,
    mutate,
  } = useSWR<GeofenceZone[]>(
    workspace?.id ? `/api/workspace/${workspace.id}/geofences` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  // Keep the ref in sync so the mouseup handler (attached once) always sees
  // the latest order without needing to re-bind on every reorder.
  useEffect(() => {
    orderedIdsRef.current = orderedIds;
  }, [orderedIds]);

  // Whenever fresh data arrives, respect any saved order for ids we still
  // recognize, and tack newly-created zones onto the end.
  useEffect(() => {
    if (!zonesData || !workspace?.id) return;
    const currentIds = zonesData.map((z) => z.id);
    const stored = readStoredOrder(workspace.id);
    const validStored = stored
      ? stored.filter((id) => currentIds.includes(id))
      : [];
    const missing = currentIds.filter((id) => !validStored.includes(id));
    setOrderedIds([...validStored, ...missing]);
  }, [zonesData, workspace?.id]);

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

  const orderedZones = useMemo(() => {
    if (!zonesData) return [];
    const byId = new Map(zonesData.map((z) => [z.id, z]));
    return orderedIds
      .map((id) => byId.get(id))
      .filter((z): z is GeofenceZone => Boolean(z));
  }, [zonesData, orderedIds]);

  const processedZones = useMemo(() => {
    if (!orderedZones.length) return [];
    return orderedZones.filter(
      (zone) =>
        zone.name.toLowerCase().includes(search.toLowerCase()) ||
        zone.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orderedZones, search]);

  const activePolicyName = useMemo(() => {
    return (
      zonesData?.find((z) => z.status === "active")?.name || "None Configured"
    );
  }, [zonesData]);

  // --- ALERTS CHECK ---
  useEffect(() => {
    if (zonesData && !hasShownAlert) {
      const requiresUpdate = zonesData.some(
        (zone) =>
          (zone.latitude === 0 && zone.longitude === 0) ||
          !zone.updated_at ||
          zone.created_at === zone.updated_at,
      );

      if (requiresUpdate) {
        toast.warning("Location Update Required", {
          description:
            "Some geofence zones require updates to their location data. Please click the edit icon on the highlighted policies to set proper coordinates.",
          duration: 8000,
        });
        setHasShownAlert(true); // Prevents infinite toast firing on re-renders
      }
    }
  }, [zonesData, hasShownAlert]);

  // --- ACTIONS ---

  const handleAddGeofence = async (
    payload: Omit<GeofenceZone, "id" | "workspace_id" | "created_at">,
  ) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspace.id}/geofence`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to deploy workspace geofence");

      toast.success(`Global policy "${payload.name}" created successfully!`);
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process geofence request.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateGeofence = async (
    id: string,
    payload: Omit<GeofenceZone, "id" | "workspace_id" | "created_at">,
  ) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/workspace/${workspace.id}/geofence/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail || "Failed to update workspace configuration",
        );
      }

      toast.success(`Policy "${payload.name}" updated successfully!`);
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update policy.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveGeofence = async (id: string) => {
    if (!workspace?.id) return;
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/${workspace.id}/geofence/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail ||
            errData?.message ||
            "Failed to delete policy configuration",
        );
      }

      toast.success("Policy permanently deleted.");
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete policy.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetActiveGeofence = async (id: string) => {
    if (!workspace?.id || !zonesData) return;
    const targetZone = zonesData.find((z) => z.id === id);
    if (!targetZone) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `/api/workspace/${workspace.id}/geofence/${id}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok)
        throw new Error("Failed to activate target location tracking policy");

      toast.success(
        `Active location tracking applied to "${targetZone.name}".`,
      );
      await mutate(undefined, { revalidate: true });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update tracking policy.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const hasNoGeofences = zonesData && zonesData.length === 0;

  // --- RENDER ---

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Geofencing
          </h1>
          <div className="text-muted-foreground text-xs mt-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span>Active Policy:</span>
              {isLoading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                <span className="font-semibold text-brand">
                  {activePolicyName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search by zone name or policy ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/10 h-10 text-xs"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <GeofenceMapDialog
              onAction={handleAddGeofence}
              isSubmitting={isProcessing}
            />
            {hasNoGeofences && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
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
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center text-xs text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
          Failed to load configuration limits from server. Check your session.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedZones.map((zone) => (
            <div
              key={zone.id}
              onMouseDown={() => handleCardMouseDown(zone.id)}
              onMouseEnter={() => handleCardMouseEnter(zone.id)}
              className={`transition-transform duration-150 select-none ${
                draggingId === zone.id
                  ? "cursor-grabbing scale-[1.02] z-10 drop-shadow-lg"
                  : "cursor-grab"
              }`}
            >
              <GeofenceCard
                zone={zone}
                onRemove={handleRemoveGeofence}
                onActivate={handleSetActiveGeofence}
                onUpdate={handleUpdateGeofence}
                isProcessing={isProcessing}
              />
            </div>
          ))}

          {hasNoGeofences ? (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-amber-500/30 bg-amber-500/2 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="rounded-full bg-amber-500/10 p-4 mb-4">
                <MapPinIcon className="size-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No tracking zones configured
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-sm leading-relaxed">
                You must set up and deploy at least one geofence zone to monitor
                workspace presence and automate hours.
              </p>
              <GeofenceMapDialog
                onAction={handleAddGeofence}
                isSubmitting={isProcessing}
              />
            </div>
          ) : (
            processedZones.length === 0 && (
              <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
                <div className="rounded-full bg-muted/40 p-3 mb-3">
                  <MapPinIcon className="size-5 text-muted-foreground/70" />
                </div>
                <p className="text-sm font-medium">
                  No matching geofence zones
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adjust your search terms to find other configured tracking
                  zones.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
