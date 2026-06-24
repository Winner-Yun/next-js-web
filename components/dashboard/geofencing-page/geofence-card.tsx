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
  TargetIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { GeofenceConfirmDialog } from "./geofence-confirm-dialog";
import type { GeofenceZone } from "./types";

interface GeofenceCardProps {
  zone: GeofenceZone;
  onRemove: (id: string) => void;
  onActivate: (id: string) => void;
}

export function GeofenceCard({
  zone,
  onRemove,
  onActivate,
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
        <div className="space-y-1 min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-muted">
            {zone.id}
          </span>
          <h3
            className={`text-sm font-bold tracking-tight truncate pt-1 ${
              isActive ? "text-brand" : "text-foreground"
            }`}
          >
            {zone.zoneName}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-bold tracking-wider px-2 shadow-none ${
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
                {zone.lat.toFixed(3)}, {zone.lng.toFixed(3)}
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
              <span>{zone.radius} Meters</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/30 border-t border-muted flex items-center justify-between gap-2">
        {/* Switch Activation Action */}
        <GeofenceConfirmDialog
          title="Switch Active Policy?"
          description={`You are changing the live tracking criteria to ${zone.zoneName}. This will automatically deactivate any other running location boundary rules.`}
          confirmText="Confirm Switch"
          onConfirm={() => onActivate(zone.id)}
          variant="brand"
        >
          <Button
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            disabled={isActive}
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

        {/* Delete Action with Safety Guard */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={isActive ? "cursor-not-allowed" : ""}>
                <GeofenceConfirmDialog
                  title="Delete Policy Permanently?"
                  description={`Are you sure you want to delete ${zone.zoneName}? This cannot be reversed.`}
                  confirmText="Delete Policy"
                  onConfirm={() => onRemove(zone.id)}
                  variant="destructive"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                    disabled={isActive}
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
      </CardFooter>
    </Card>
  );
}
