"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { HolidayConfirmDialog } from "./holiday-confirm-dialog";
import type { Holiday } from "./types";

interface HolidayCardProps {
  holiday: Holiday;
  // Updated typing to accept async remove functions
  onRemove: (id: string) => Promise<void> | void;
  onEdit: () => void;
}

export function HolidayCard({ holiday, onRemove, onEdit }: HolidayCardProps) {
  const isPublicHoliday = holiday.id.startsWith("public-");

  const formattedDate = new Date(holiday.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md border-muted/60">
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="bg-brand/10 p-2 rounded-lg text-brand shrink-0">
            <CalendarIcon className="size-4" />
          </div>

          {!isPublicHoliday ? (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 cursor-pointer text-muted-foreground hover:text-brand hover:bg-brand/10"
                onClick={onEdit}
              >
                <Edit2Icon className="size-3.5" />
              </Button>
              <HolidayConfirmDialog
                title="Delete Holiday"
                description={`Are you sure you want to permanently delete "${holiday.name}"?`}
                confirmText="Delete"
                onConfirm={() => onRemove(holiday.id)}
                variant="destructive"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </HolidayConfirmDialog>
            </div>
          ) : (
            <span className="text-[10px] font-semibold bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">
              Public API
            </span>
          )}
        </div>

        <h3
          className="font-semibold text-sm line-clamp-2 mb-1"
          title={holiday.name}
        >
          {holiday.name}
        </h3>
        <p className="text-xs text-muted-foreground font-medium">
          {formattedDate}
        </p>
      </div>

      {isPublicHoliday && (
        <div className="bg-muted/20 border-t border-muted/40 px-4 py-2">
          <p className="text-[10px] text-muted-foreground text-center">
            Auto-synced holiday • Cannot be modified
          </p>
        </div>
      )}
    </Card>
  );
}
