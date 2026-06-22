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
import { AlertTriangleIcon, HelpCircleIcon } from "lucide-react";

interface WorkspaceConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  variant?: "brand" | "destructive";
}

export function WorkspaceConfirmDialog({
  children,
  title,
  description,
  confirmText,
  onConfirm,
  variant = "brand",
}: WorkspaceConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[400px] animate-in fade-in-50 zoom-in-95 duration-200">
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`text-sm font-bold flex items-center gap-2 ${variant === "destructive" ? "text-destructive" : "text-foreground"}`}
          >
            {variant === "destructive" ? (
              <AlertTriangleIcon className="size-4 shrink-0" />
            ) : (
              <HelpCircleIcon className="size-4 text-brand shrink-0" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-normal text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`h-9 text-xs text-white ${
              variant === "destructive"
                ? "bg-destructive! hover:bg-destructive/90"
                : "bg-brand! hover:bg-brand/90"
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
