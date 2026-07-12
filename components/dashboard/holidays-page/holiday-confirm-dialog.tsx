"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface HolidayConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  // Updated to accept asynchronous functions
  onConfirm: () => Promise<void> | void;
  variant?: "brand" | "destructive";
}

export function HolidayConfirmDialog({
  children,
  title,
  description,
  confirmText,
  onConfirm,
  variant = "brand",
}: HolidayConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing the dialog if a request is currently processing
        if (!isLoading) setIsOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-105 animate-in fade-in-50 zoom-in-95 duration-200"
        // Prevent pressing Escape to close while loading
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
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
          <AlertDialogCancel disabled={isLoading} className="h-9 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`h-9 text-xs text-white min-w-20 ${
              variant === "destructive"
                ? "bg-destructive! hover:bg-destructive/90"
                : "bg-brand! hover:bg-brand/90"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 size-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
