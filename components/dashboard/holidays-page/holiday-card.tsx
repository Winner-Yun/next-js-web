"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CalendarDaysIcon,
  ClockIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { HolidayConfirmDialog } from "./holiday-confirm-dialog";
import type { Holiday } from "./types";

interface HolidayCardProps {
  holiday: Holiday;
  onRemove: (id: string) => void;
}

export function HolidayCard({ holiday, onRemove }: HolidayCardProps) {
  // Simple check to see if the holiday is upcoming or past
  const isUpcoming = new Date(holiday.date) >= new Date();

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border flex flex-col border-muted/80 bg-background/50">
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-muted">
            {holiday.id.slice(0, 8)}
          </span>
          <h3 className="text-sm font-bold tracking-tight truncate pt-1 text-foreground">
            {holiday.name}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-bold tracking-wider px-2 shadow-none ${
            isUpcoming
              ? "bg-brand/10 text-brand border-brand/20"
              : "bg-muted text-muted-foreground border-muted-foreground/10"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Passed"}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3.5 flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <UsersIcon className="size-3.5 shrink-0" />
          <span>Applies to Workspace Schedule</span>
        </div>

        <div className="pt-2.5 border-t border-muted/60 grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Scheduled Date
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <CalendarDaysIcon className="size-3 text-muted-foreground/50" />
              <span>
                {new Date(holiday.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[10px] font-medium">
              Created At
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <ClockIcon className="size-3 text-muted-foreground/50" />
              <span>
                {new Date(holiday.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/30 border-t border-muted flex items-center justify-end gap-2">
        <HolidayConfirmDialog
          title="Delete Holiday Permanently?"
          description={`Are you sure you want to remove ${holiday.name} from the workspace calendar? This cannot be reversed.`}
          confirmText="Delete Holiday"
          onConfirm={() => onRemove(holiday.id)}
          variant="destructive"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
          >
            <Trash2Icon className="size-3.5 mr-1.5" />
            Remove Holiday
          </Button>
        </HolidayConfirmDialog>
      </CardFooter>
    </Card>
  );
}
