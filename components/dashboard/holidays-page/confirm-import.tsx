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
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";

interface ConfirmImportProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isImporting: boolean;
  year: number;
}

export function ConfirmImportDialog({
  isOpen,
  onClose,
  onConfirm,
  isImporting,
  year,
}: ConfirmImportProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 mb-4">
            <AlertTriangleIcon className="size-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">
            Import Khmer Holidays
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to import all Khmer public holidays for{" "}
            <strong>{year}</strong>? This will automatically add any missing
            dates to your current workspace directory.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row justify-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isImporting}
            className="bg-brand cursor-pointer text-white hover:bg-brand/90"
          >
            {isImporting ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Confirm Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
