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
import { AlertTriangleIcon } from "lucide-react";

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold flex items-center gap-2.5 text-destructive">
            <div className="p-1.5 bg-destructive/10 rounded-full">
              <AlertTriangleIcon className="size-4 shrink-0" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-normal mt-1.5">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="h-9 text-xs font-semibold">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-9 text-xs font-semibold text-white bg-destructive hover:bg-destructive/90"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
