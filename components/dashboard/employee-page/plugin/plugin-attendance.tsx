"use client";
import { CalendarX2Icon, Clock3Icon } from "lucide-react";

export function PluginAttendance({ employeeId }: { employeeId: string }) {
  return (
    <div className="space-y-4 rounded-xl p-4 transition-all">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-muted/50">
        <div className="rounded-lg bg-brand/10 p-1.5 text-brand">
          <Clock3Icon className="size-4" />
        </div>
        <h4 className="font-bold text-xs tracking-tight text-foreground">
          Realtime Attendance Ledger
        </h4>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/5 py-10 text-center">
        <CalendarX2Icon className="mb-2.5 size-7 text-muted-foreground/40" />
        <p className="text-xs font-semibold text-muted-foreground">
          No logs captured today
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5 max-w-[240px]">
          No active check-ins detected via terminal configurations.
        </p>
      </div>
    </div>
  );
}
