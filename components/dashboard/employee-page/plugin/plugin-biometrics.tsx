/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { ScanFaceIcon } from "lucide-react";

export function PluginBiometrics({ employeeId }: { employeeId: string }) {
  // FastAPI Endpoint Integration Area: GET /api/v1/biometrics/{employee_id}
  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
      <div className="flex items-center gap-2 pb-1.5 border-b">
        <ScanFaceIcon className="size-4 text-brand" />
        <h4 className="font-bold text-xs">Biometrics & Verification Router</h4>
      </div>
      <div className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Liveness State</span>
          <span className="font-medium text-emerald-600">
            Enrolled & Active
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Vector Weight Checksum</span>
          <span className="font-mono text-muted-foreground text-[10px]">
            ArcFace_v2_512d
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-1">
        Re-evaluate Face Descriptor
      </Button>
    </div>
  );
}
