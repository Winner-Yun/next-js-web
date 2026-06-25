"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheetIcon, PrinterIcon } from "lucide-react";

interface ReportHeaderProps {
  workspaceName: string;
  activeTab: "attendance" | "leaves";
  onExport: () => void;
}

export function ReportHeader({
  workspaceName,
  activeTab,
  onExport,
}: ReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/60 pb-5 print:border-b-2 print:border-black">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground print:text-black print:text-3xl">
          Workspace Master Report
        </h1>
        <p className="text-muted-foreground text-xs mt-1 print:text-gray-600">
          Comprehensive Analytics for Directory:{" "}
          <span className="font-semibold text-brand print:text-black">
            {workspaceName}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 self-stretch sm:self-auto print:hidden">
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="h-10 text-xs border-muted/60 bg-background shadow-xs gap-1.5"
        >
          <PrinterIcon className="size-3.5 text-muted-foreground" /> Print
          Report
        </Button>
        <Button
          onClick={onExport}
          className="h-10 text-xs bg-brand text-white hover:bg-brand/90 px-4 shadow-sm gap-1.5"
        >
          <FileSpreadsheetIcon className="size-3.5" /> Export{" "}
          {activeTab === "attendance" ? "Attendance" : "Leaves"}
        </Button>
      </div>
    </div>
  );
}
