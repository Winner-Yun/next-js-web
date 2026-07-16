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
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmText?: string;
  loadingText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  isLoading,
  confirmText = "Confirm Delete",
  loadingText = "Deleting...",
  isDestructive = true,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-md rounded-xl"
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`text-base font-bold flex items-center gap-2.5 ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                isDestructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-brand/10 text-brand"
              }`}
            >
              <AlertTriangleIcon className="size-4 shrink-0" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-normal mt-1.5">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="h-9 text-xs font-semibold"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={handleConfirm}
            className={`h-9 text-xs cursor-pointer font-semibold text-white ${
              isDestructive
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-brand hover:bg-brand/90"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="size-3.5 animate-spin" />
                {loadingText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
