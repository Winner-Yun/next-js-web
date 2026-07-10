"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface GeofenceConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<void> | void;
  variant?: "brand" | "destructive";
}

export function GeofenceConfirmDialog({
  children,
  title,
  description,
  confirmText,
  onConfirm,
  variant = "brand",
}: GeofenceConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(val) => {
        // Prevent clicking outside to close while loading
        if (isProcessing) return;
        setIsOpen(val);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-105 animate-in fade-in-50 zoom-in-95 duration-200"
        // Prevent escape key from closing while loading
        onEscapeKeyDown={(e) => {
          if (isProcessing) e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-bold flex items-center gap-2">
            {variant === "destructive" ? (
              <AlertTriangleIcon className="size-4 text-destructive" />
            ) : (
              <CheckCircle2Icon className="size-4 text-brand" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-normal text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing} className="h-9 text-xs">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`h-9 text-xs text-white min-w-27.5 ${
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-brand hover:bg-brand/90"
            }`}
          >
            {isProcessing ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
