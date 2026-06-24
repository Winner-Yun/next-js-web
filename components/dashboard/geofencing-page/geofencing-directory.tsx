"use client";

import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/provider/workspace-provider";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { GeofenceCard } from "./geofence-card";
import { GeofenceMapDialog } from "./geofence-map-dialog";
import type { GeofenceZone } from "./types";

export function GeofencingDirectory() {
  const { workspace } = useWorkspace();
  const [search, setSearch] = useState("");

  const [geofencesData, setGeofencesData] = useState<
    Record<string, GeofenceZone[]>
  >({
    worksmart: [
      {
        id: "POL-001",
        zoneName: "Headquarters Main Campus",
        lat: 37.7749,
        lng: -122.4194,
        radius: 300,
        status: "active",
      },
      {
        id: "POL-002",
        zoneName: "Logistics Hub Alpha",
        lat: 34.0522,
        lng: -118.2437,
        radius: 450,
        status: "inactive",
      }, // Changed to inactive for testing
    ],
  });

  const currentWorkspaceZones = useMemo(() => {
    return geofencesData[workspace.id] || [];
  }, [geofencesData, workspace.id]);

  const processedZones = useMemo(() => {
    return currentWorkspaceZones.filter(
      (zone) =>
        zone.zoneName.toLowerCase().includes(search.toLowerCase()) ||
        zone.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [currentWorkspaceZones, search]);

  // Handle adding a new policy
  const handleAddGeofence = (data: {
    zoneName: string;
    lat: number;
    lng: number;
    radius: number;
  }) => {
    // Generate a random ID instead of using array length to prevent duplicates when deleting
    const newId = `POL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const newZone: GeofenceZone = {
      id: newId,
      zoneName: data.zoneName,
      lat: data.lat,
      lng: data.lng,
      radius: data.radius,
      status: "active", // Force new policies to be active by default
    };

    setGeofencesData((prev) => {
      const existing = prev[workspace.id] || [];
      // Deactivate all existing rules, only the newly created one remains active
      const updatedExisting = existing.map((z) => ({
        ...z,
        status: "inactive" as const,
      }));
      return {
        ...prev,
        [workspace.id]: [newZone, ...updatedExisting],
      };
    });

    toast.success(`Global policy "${data.zoneName}" activated successfully!`);
  };

  // Handle removing a policy
  const handleRemoveGeofence = (id: string) => {
    setGeofencesData((prev) => ({
      ...prev,
      [workspace.id]: (prev[workspace.id] || []).filter(
        (zone) => zone.id !== id,
      ),
    }));
    toast.success("Policy permanently deleted.");
  };

  // Handle switching the active policy
  const handleSetActiveGeofence = (id: string) => {
    setGeofencesData((prev) => ({
      ...prev,
      [workspace.id]: (prev[workspace.id] || []).map((zone) => ({
        ...zone,
        // The one clicked becomes "active", EVERYTHING else becomes "inactive"
        status: zone.id === id ? "active" : "inactive",
      })),
    }));
    toast.success("Active location tracking policy updated.");
  };

  return (
    <div className="w-full space-y-6 p-px animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Geofencing
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
              placeholder="Search by zone name or policy ID..."
              value={search}
              onChange={(e) =>
                setSearch(setSearch === undefined ? "" : e.target.value)
              }
              className="pl-9 bg-muted/10 h-10 text-xs"
            />
          </div>

          <GeofenceMapDialog onAddGeofence={handleAddGeofence} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {processedZones.map((zone) => (
          <GeofenceCard
            key={zone.id}
            zone={zone}
            onRemove={handleRemoveGeofence}
            onActivate={handleSetActiveGeofence}
          />
        ))}

        {processedZones.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted/40 p-3 mb-3">
              <MapPinIcon className="size-5 text-muted-foreground/70" />
            </div>
            <p className="text-sm font-medium">
              No workspace location policies configured
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
