"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlusIcon, ShieldAlertIcon } from "lucide-react";
import { useState } from "react";
import { LocationPickerMap, type LocationData } from "./location-picker-map";

interface GeofenceMapDialogProps {
  onAddGeofence: (data: {
    zoneName: string;
    lat: number;
    lng: number;
    radius: number;
  }) => void;
}

export function GeofenceMapDialog({ onAddGeofence }: GeofenceMapDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingStep, setIsConfirmingStep] = useState(false);

  // Form States
  const [zoneName, setZoneName] = useState("");
  const [fenceRadius, setFenceRadius] = useState(250);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    lat: 37.7749,
    lng: -122.4194,
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;
    setIsConfirmingStep(true);
  };

  const handleConfirm = () => {
    onAddGeofence({
      zoneName,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      radius: fenceRadius,
    });

    // Reset state
    setZoneName("");
    setFenceRadius(250);
    setIsConfirmingStep(false);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsConfirmingStep(false);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 h-10 text-xs font-medium bg-brand text-white hover:bg-brand/90 shadow-sm"
        >
          <PlusIcon className="size-4" />
          Deploy Workspace Policy
        </Button>
      </DialogTrigger>

      {/* FIXED: Dynamic resizing classes applied below to fit the step context perfectly */}
      <DialogContent
        className={`p-0 overflow-hidden bg-background transition-all duration-300 ease-in-out ${
          isConfirmingStep
            ? "w-[90vw] sm:max-w-115"
            : "w-[95vw] sm:max-w-150 md.:max-w-[800px] lg:max-w-250"
        }`}
      >
        {!isConfirmingStep ? (
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
            <DialogHeader className="p-5 pb-3 shrink-0">
              <DialogTitle className="text-base font-bold">
                Create Workspace Geofence Policy
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define an authorized geographical zone. This boundary policy
                will apply to <strong>all members</strong> in this workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="zoneName"
                  className="text-xs font-semibold text-foreground"
                >
                  Zone/Office Name
                </Label>
                <Input
                  id="zoneName"
                  placeholder="e.g., Preah Vihear Office"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="text-xs h-9 bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <Label className="font-semibold text-muted-foreground">
                    Enforcement Radius
                  </Label>
                  <span className="font-mono font-bold text-brand bg-brand/10 px-2 py-0.5 rounded text-[11px]">
                    {fenceRadius} Meters
                  </span>
                </div>
                <Slider
                  min={50}
                  max={3000}
                  step={25}
                  value={[fenceRadius]}
                  onValueChange={(val) => setFenceRadius(val[0])}
                  className="py-1"
                />
              </div>

              <div className="relative w-full h-60 sm:h-95 md:h-115 rounded-lg  overflow-hidden shadow-inner">
                <LocationPickerMap
                  radius={fenceRadius}
                  onLocationSelected={(loc) => setSelectedLocation(loc)}
                />
              </div>
            </div>
            <DialogFooter className="pe-6 py-6! pt-3! border-t border-muted bg-muted/20 flex items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4"
              >
                Review Policy
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-3 shrink-0">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ShieldAlertIcon className="size-5.5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-base font-bold">
                  Activate Global Workspace Policy?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Confirming this will instantly apply location compliance rules
                  to every user account attached to this workspace context.
                </DialogDescription>
              </div>
            </div>

            <div className="flex-1 px-6 pb-6">
              {/* FIXED: The summary grid layout now stretches tightly across a narrow container box */}
              <div className="rounded-lg bg-muted/40 border p-4 text-xs text-muted-foreground space-y-3 font-medium shadow-sm">
                <p className="flex justify-between items-center border-b border-muted pb-2">
                  <span className="text-foreground font-semibold">
                    Policy Name:
                  </span>
                  <span className="font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-muted truncate max-w-50">
                    {zoneName}
                  </span>
                </p>
                <p className="flex justify-between items-center border-b border-muted pb-2">
                  <span className="text-foreground font-semibold">Scope:</span>
                  <span className="text-brand font-bold bg-brand/5 px-2 py-0.5 rounded border border-brand/10 text-[11px]">
                    All Workspace Members
                  </span>
                </p>
                <p className="flex justify-between items-center border-b border-muted pb-2">
                  <span className="text-foreground font-semibold">
                    Coordinates:
                  </span>
                  <span className="font-mono text-foreground bg-background px-2 py-0.5 rounded border border-muted">
                    {selectedLocation.lat.toFixed(5)},{" "}
                    {selectedLocation.lng.toFixed(5)}
                  </span>
                </p>
                <p className="flex justify-between items-center pb-0.5">
                  <span className="text-foreground font-semibold">
                    Radius Circle:
                  </span>
                  <span className="font-mono font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                    {fenceRadius} Meters
                  </span>
                </p>
              </div>
            </div>

            <DialogFooter className="pe-6 py-6! pt-0! border-t border-muted bg-muted/20 flex items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9"
                onClick={() => setIsConfirmingStep(false)}
              >
                Modify Settings
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                className="text-xs h-9 bg-brand text-white hover:bg-brand/90 px-4"
              >
                Activate Policy
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
