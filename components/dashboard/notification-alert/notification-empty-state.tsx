import { BellIcon } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="py-20 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
      <div className="rounded-full bg-muted/40 p-4 mb-3 text-muted-foreground">
        <BellIcon className="size-6" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        No scans registered
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Logs from the attendance portal will stream here instantly as users
        scan.
      </p>
    </div>
  );
}
