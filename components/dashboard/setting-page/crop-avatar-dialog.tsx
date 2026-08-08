"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { getCroppedImageBlob } from "@/lib/crop-image";
import { Loader2Icon, SaveIcon, ZoomInIcon } from "lucide-react";
import { useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

interface CropAvatarDialogProps {
  imageSrc: string;
  fileType: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void | Promise<void>;
  isSaving?: boolean;
}

export function CropAvatarDialog({
  imageSrc,
  fileType,
  onCancel,
  onConfirm,
  isSaving = false,
}: CropAvatarDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null,
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImageBlob(
      imageSrc,
      croppedAreaPixels,
      fileType,
    );
    await onConfirm(blob);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isSaving && onCancel()}>
      <DialogContent className="w-105 max-w-[90vw] p-6">
        <DialogHeader>
          <DialogTitle>Crop profile picture</DialogTitle>
          <DialogDescription>
            Drag to reposition and use the slider to zoom. Your picture will
            be saved as a square.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <ZoomInIcon className="size-4 shrink-0 text-muted-foreground" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={([value]) => setZoom(value)}
            disabled={isSaving}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-brand cursor-pointer hover:bg-brand/90 text-white"
            onClick={handleConfirm}
            disabled={isSaving || !croppedAreaPixels}
          >
            {isSaving ? (
              <Loader2Icon className="size-4 mr-2 animate-spin" />
            ) : (
              <SaveIcon className="size-4 mr-2" />
            )}
            Save picture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
