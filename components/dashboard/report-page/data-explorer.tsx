"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDaysIcon, ImageIcon } from "lucide-react";
import { WorkspaceData } from "./types";

interface DataExplorerProps {
  activeTab: "attendance" | "leaves";
  onTabChange: (tab: "attendance" | "leaves") => void;
  workspaceData: WorkspaceData;
  isLoading: boolean;
}

export function DataExplorer({
  activeTab,
  onTabChange,
  workspaceData,
  isLoading,
}: DataExplorerProps) {
  return (
    <div className="bg-background border border-muted/60 rounded-xl shadow-xs print:border-gray-300 overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as "attendance" | "leaves")}
        className="w-full"
      >
        <div className="p-4 border-b border-muted/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4 text-brand print:text-black" />
            <h3 className="text-sm font-bold text-foreground">
              Raw Data Explorer
            </h3>
          </div>

          <TabsList className="h-9 bg-background border border-muted/40">
            <TabsTrigger value="attendance" className="text-xs h-7 px-4">
              Attendance Log
            </TabsTrigger>
            <TabsTrigger value="leaves" className="text-xs h-7 px-4">
              Leave Log
            </TabsTrigger>
          </TabsList>
        </div>

        <div>
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="m-0 border-0 outline-none">
            <div className="max-h-100 overflow-y-auto relative scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-background/95 backdrop-blur-xs z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="text-muted-foreground bg-muted/20 border-b border-muted/60">
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Date / Time
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Employee
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider text-right">
                      Hours
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-muted/40">
                  {isLoading ? (
                    <TableSkeleton columns={4} />
                  ) : workspaceData.attendance.length === 0 ? (
                    <EmptyRow
                      colSpan={4}
                      message="No attendance records synchronized."
                    />
                  ) : (
                    workspaceData.attendance.map((a) => (
                      <tr
                        key={a.id}
                        className="hover:bg-muted/5 transition-colors"
                      >
                        <td className="p-3">
                          <b className="text-foreground">{a.date}</b>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            {a.checkIn || "--:--"} - {a.checkOut || "--:--"}
                          </span>
                        </td>
                        <td className="p-3">
                          <b className="text-foreground">{a.name}</b>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            {a.role}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-medium text-foreground">
                          {a.hours > 0 ? `${a.hours}h` : "--"}
                        </td>
                        <td className="p-3 text-right">
                          <Badge
                            variant="outline"
                            className={`font-bold text-[10px] ${
                              a.status === "Present"
                                ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                                : a.status === "Late"
                                  ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                                  : a.status === "Absent"
                                    ? "text-red-600 border-red-500/30 bg-red-500/10"
                                    : "text-blue-600 border-blue-500/30 bg-blue-500/10"
                            }`}
                          >
                            {a.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves" className="m-0 border-0 outline-none">
            <div className="max-h-100 overflow-y-auto relative scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-background/95 backdrop-blur-xs z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="text-muted-foreground bg-muted/20 border-b border-muted/60">
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider w-12">
                      No
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Employee
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Leave Type
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Duration
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider">
                      Attachment
                    </th>
                    <th className="p-3 text-[10px] uppercase font-bold tracking-wider text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-muted/40">
                  {isLoading ? (
                    <TableSkeleton columns={6} />
                  ) : workspaceData.leaves.length === 0 ? (
                    <EmptyRow
                      colSpan={6}
                      message="No leave applications compiled."
                    />
                  ) : (
                    workspaceData.leaves.map((l, index) => (
                      <tr
                        key={l.id}
                        className="hover:bg-muted/5 transition-colors"
                      >
                        <td className="p-3 font-mono text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="p-3 font-bold text-foreground">
                          {l.name}
                        </td>
                        <td className="p-3 text-muted-foreground font-medium">
                          {l.type}
                        </td>
                        <td className="p-3 font-mono text-foreground">
                          {l.start}{" "}
                          <span className="text-muted-foreground/50 mx-1">
                            →
                          </span>{" "}
                          {l.end}
                          <span className="block text-[10px] text-muted-foreground font-sans mt-0.5">
                            ({l.days} {l.days === 1 ? "Day" : "Days"})
                          </span>
                        </td>
                        <td className="p-3">
                          {l.attachment ? (
                            <a
                              href={l.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-brand hover:underline font-medium"
                            >
                              <ImageIcon className="size-3.5" />
                              <span>View Proof</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground/60 italic">
                              No attachment
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Badge
                            variant="outline"
                            className={`font-bold text-[10px] ${
                              l.status === "Approved"
                                ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                                : l.status === "Pending"
                                  ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                                  : "text-red-600 border-red-500/30 bg-red-500/10"
                            }`}
                          >
                            {l.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, rIndex) => (
        <tr key={rIndex}>
          {Array.from({ length: columns }).map((_, cIndex) => (
            <td key={cIndex} className="p-4">
              <Skeleton
                className={`h-4 ${cIndex === columns - 1 ? "ml-auto w-16" : "w-24"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="p-8 text-center text-muted-foreground font-medium italic"
      >
        {message}
      </td>
    </tr>
  );
}
