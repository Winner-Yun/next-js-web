"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CompassIcon,
  MapPinIcon,
  TargetIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { GeofenceConfirmDialog } from "./geofence-confirm-dialog";
import { GeofenceMapDialog } from "./geofence-map-dialog";
import type { GeofenceZone } from "./types";

interface GeofenceCardProps {
  zone: GeofenceZone;
  onRemove: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    data: Omit<GeofenceZone, "id" | "workspace_id" | "created_at">,
  ) => Promise<void>;
  isProcessing?: boolean;
}

export function GeofenceCard({
  zone,
  onRemove,
  onActivate,
  onUpdate,
  isProcessing,
}: GeofenceCardProps) {
  const isActive = zone.status === "active";

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-md border flex flex-col ${
        isActive
          ? "border-brand/40 bg-brand/5"
          : "border-muted/80 bg-background/50"
      }`}
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-muted-foreground/50" />
            <h3
              className={`text-sm font-bold tracking-tight truncate pt-1 ${
                isActive ? "text-brand" : "text-foreground"
              }`}
            >
              {zone.name}
            </h3>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-bold tracking-wider px-2 shadow-none shrink-0 ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-muted-foreground/10"
          }`}
        >
          {zone.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3.5 flex-1">
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            isActive ? "text-brand" : "text-muted-foreground"
          }`}
        >
          <UsersIcon className="size-3.5 shrink-0" />
          <span>Applies to All Workspace Members</span>
        </div>

        <div className="pt-2.5 border-t border-muted/60 grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Center Target
            </span>
            <div className="flex items-center gap-1 font-mono font-semibold text-foreground">
              <CompassIcon className="size-3 text-muted-foreground/50" />
              <span>
                {zone.latitude.toFixed(3)}, {zone.longitude.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Radius Limit
            </span>
            <div
              className={`flex items-center gap-1 font-mono font-semibold ${
                isActive ? "text-brand" : "text-foreground"
              }`}
            >
              <TargetIcon
                className={`size-3 ${isActive ? "text-brand/60" : "text-muted-foreground/50"}`}
              />
              <span>{zone.radius_meters} Meters</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/30 border-t border-muted flex items-center justify-between gap-2">
        <GeofenceConfirmDialog
          title="Switch Active Policy?"
          description={`You are changing the live tracking criteria to ${zone.name}. This will automatically apply new rules.`}
          confirmText="Confirm Switch"
          onConfirm={() => onActivate(zone.id)}
          variant="brand"
        >
          <Button
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            disabled={isActive || isProcessing}
            className={`h-8 text-xs flex-1 ${
              isActive
                ? "opacity-50 cursor-default"
                : "hover:bg-brand hover:text-white border-brand/20"
            }`}
          >
            <CheckCircle2Icon className="size-3.5 mr-1.5" />
            {isActive ? "Currently Active" : "Set as Active"}
          </Button>
        </GeofenceConfirmDialog>

        <div className="flex items-center gap-1 shrink-0">
          {/* Edit Button Configuration with Active Guard Disabling */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={
                    isActive || isProcessing ? "cursor-not-allowed" : ""
                  }
                >
                  <GeofenceMapDialog
                    zoneToEdit={zone}
                    onAction={(data) => onUpdate(zone.id, data)}
                    isSubmitting={isProcessing}
                    isDisabled={isActive || isProcessing}
                  />
                </div>
              </TooltipTrigger>
              {isActive && (
                <TooltipContent className="text-xs">
                  <p className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3" /> Cannot modify an
                    active policy
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Delete Button Configuration */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={
                    isActive || isProcessing ? "cursor-not-allowed" : ""
                  }
                >
                  <GeofenceConfirmDialog
                    title="Delete Policy Permanently?"
                    description={`Are you sure you want to delete ${zone.name}? This cannot be reversed.`}
                    confirmText="Delete Policy"
                    onConfirm={() => onRemove(zone.id)}
                    variant="destructive"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                      disabled={isActive || isProcessing}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </GeofenceConfirmDialog>
                </div>
              </TooltipTrigger>
              {isActive && (
                <TooltipContent className="text-xs">
                  <p className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3" /> Cannot delete active
                    geofence
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
