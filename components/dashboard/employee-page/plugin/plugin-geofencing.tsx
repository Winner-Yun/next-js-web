/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Badge } from "@/components/ui/badge";
import { MapPinIcon } from "lucide-react";

export function PluginGeofencing({ employeeId }: { employeeId: string }) {
  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <div className="flex items-center gap-2 pb-2 border-b">
        <MapPinIcon className="size-4 text-brand" />
        <h4 className="font-semibold text-sm">Assigned Locations</h4>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="outline" className="bg-background">
          Headquarters
        </Badge>
        <Badge variant="outline" className="bg-background">
          Branch A
        </Badge>
      </div>
    </div>
  );
}
