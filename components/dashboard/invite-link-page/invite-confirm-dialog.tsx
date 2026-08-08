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
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface InviteConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<void> | void;
}

export function InviteConfirmDialog({
  children,
  title,
  description,
  confirmText,
  onConfirm,
}: InviteConfirmDialogProps) {
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
        if (!isLoading) setIsOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-105 animate-in fade-in-50 zoom-in-95 duration-200"
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
            <AlertTriangleIcon className="size-4 shrink-0" />
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
            className="h-9 text-xs text-white min-w-20 bg-destructive! hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 size-3.5 animate-spin" />
                Revoking...
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
