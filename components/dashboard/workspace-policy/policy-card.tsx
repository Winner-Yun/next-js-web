"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";
import type { WorkspacePolicyData } from "./types";

interface PolicyCardProps {
  policy: WorkspacePolicyData;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
}

export function PolicyCard({
  policy,
  onEdit,
  onDelete,
  onActivate,
}: PolicyCardProps) {
  const isActive = policy.status === "active";

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-md border flex flex-col ${isActive ? "border-brand/40 bg-brand/5" : "border-muted/80 bg-background"}`}
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 min-w-0 pr-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {policy.id}
          </span>
          <h3 className="text-sm font-bold tracking-tight text-foreground truncate pt-1">
            {policy.name}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-bold tracking-wider px-2 shadow-none shrink-0 ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-muted-foreground/10"
          }`}
        >
          {policy.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3.5 flex-1">
        <div className="pt-2 border-t border-muted/60 grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Shift Timing
            </span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
              <ClockIcon className="size-3 text-muted-foreground/60" />
              <span className="truncate">
                {policy.check_in_start} - {policy.check_in_end}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Leave Cap
            </span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-brand">
              <CalendarDaysIcon className="size-3 text-brand/70" />
              <span>
                {policy.annual_leave_limit} AL / {policy.sick_leave_limit} SL
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 border-t border-muted/40 gap-2 flex-wrap sm:flex-nowrap">
        <Button
          variant={isActive ? "secondary" : "default"}
          size="sm"
          className={`flex-1 h-8 text-xs font-semibold gap-1.5 ${isActive ? "opacity-50 cursor-default hover:bg-secondary" : "bg-brand text-white hover:bg-brand/90"}`}
          onClick={() => !isActive && onActivate(policy.id)}
          disabled={isActive}
        >
          <CheckCircle2Icon className="size-3.5" />
          {isActive ? "Currently Active" : "Set Active"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 text-foreground hover:bg-muted"
          onClick={onEdit}
        >
          <PencilIcon className="size-3.5" />
        </Button>

        {/* --- ADDED GUARD LOGIC HERE --- */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ConfirmDialog
                  title="Delete Policy?"
                  description={`Are you sure you want to drop "${policy.name}" from this workspace?`}
                  onConfirm={() => onDelete(policy.id)}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-muted-foreground/20"
                    disabled={isActive}
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </ConfirmDialog>
              </div>
            </TooltipTrigger>
            {isActive && (
              <TooltipContent className="text-xs">
                <p className="flex items-center gap-1.5">
                  <AlertCircleIcon className="size-3" /> Cannot delete active
                  policy
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
