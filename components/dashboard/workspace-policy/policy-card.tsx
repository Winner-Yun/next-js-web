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
  ClockIcon,
  LogInIcon,
  LogOutIcon,
  PencilIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";
import type { WorkspacePolicyData } from "./types";

interface PolicyCardProps {
  policy: WorkspacePolicyData;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  isProcessing?: boolean;
}

const formatTime12Hour = (timeStr: string): string => {
  if (!timeStr) return "";
  // Check if already in 12-hour format from backend
  if (
    timeStr.toLowerCase().includes("am") ||
    timeStr.toLowerCase().includes("pm")
  )
    return timeStr;

  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayHours = formattedHours.toString().padStart(2, "0");
  return `${displayHours}:${minutesStr} ${ampm}`;
};

export function PolicyCard({
  policy,
  onEdit,
  onDelete,
  onActivate,
  isProcessing,
}: PolicyCardProps) {
  const isActive = policy.status === "active";

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-md border flex flex-col ${
        isActive
          ? "border-brand/40 bg-brand/5"
          : "border-muted/80 bg-background"
      }`}
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 min-w-0 pr-2">
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
        <div className="pt-2 border-t border-muted/60 grid grid-cols-2 gap-x-2 gap-y-3 text-[11px]">
          {/* Work Core Hours */}
          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Work Hours
            </span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
              <ClockIcon className="size-3 text-muted-foreground/60" />
              <span className="truncate text-[10px]">
                {formatTime12Hour(policy.work_start_time)} -{" "}
                {formatTime12Hour(policy.work_end_time)}
              </span>
            </div>
          </div>

          {/* Leave Cap */}
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

          {/* Check-In Start */}
          <div className="space-y-1 border-t border-muted/40 pt-2">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Check-In Opens
            </span>
            <div className="flex items-center gap-1.5 font-mono font-medium text-foreground text-[10px]">
              <LogInIcon className="size-3 text-emerald-600/70" />
              <span>{formatTime12Hour(policy.check_in_start)}</span>
            </div>
          </div>

          {/* Check-Out Start */}
          <div className="space-y-1 border-t border-muted/40 pt-2">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Check-Out Opens
            </span>
            <div className="flex items-center gap-1.5 font-mono font-medium text-foreground text-[10px]">
              <LogOutIcon className="size-3 text-blue-600/70" />
              <span>{formatTime12Hour(policy.check_out_start)}</span>
            </div>
          </div>

          {/* Deadline Window */}
          <div className="space-y-1 col-span-2 border-t border-muted/40 pt-2">
            <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
              Scan Deadline Window
            </span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
              <TimerIcon className="size-3 text-muted-foreground/60" />
              <span>
                {policy.deadline_scan_minutes}m cutoff (Late after{" "}
                {policy.late_buffer_minutes}m)
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 border-t border-muted/40 gap-2 flex-wrap sm:flex-nowrap">
        {!isActive ? (
          <ConfirmDialog
            title="Activate Policy?"
            description={`Are you sure you want to set "${policy.name}" as the active policy? This will deactivate the currently active policy.`}
            onConfirm={() => onActivate(policy.id)}
            isLoading={isProcessing}
            confirmText="Activate Policy"
            loadingText="Activating..."
            isDestructive={false}
          >
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1.5 bg-brand text-white hover:bg-brand/90"
              disabled={isProcessing}
            >
              <svg
                className="size-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Set Active
            </Button>
          </ConfirmDialog>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs font-semibold gap-1.5 opacity-50 cursor-default hover:bg-secondary"
            disabled
          >
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Currently Active
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 text-foreground hover:bg-muted"
          onClick={onEdit}
          disabled={isProcessing}
        >
          <PencilIcon className="size-3.5" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={isActive || isProcessing ? "cursor-not-allowed" : ""}
              >
                <ConfirmDialog
                  title="Delete Policy?"
                  description={`Are you sure you want to drop "${policy.name}" from this workspace?`}
                  onConfirm={() => onDelete(policy.id)}
                  isLoading={isProcessing}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-muted-foreground/20"
                    disabled={isActive || isProcessing}
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
