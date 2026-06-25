"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDaysIcon, ImageIcon } from "lucide-react";
import { WorkspaceData } from "./types";

interface DataExplorerProps {
  activeTab: "attendance" | "leaves";
  onTabChange: (tab: "attendance" | "leaves") => void;
  workspaceData: WorkspaceData;
}

export function DataExplorer({
  activeTab,
  onTabChange,
  workspaceData,
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
          {/* Attendance */}
          <TabsContent value="attendance" className="m-0 border-0 outline-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-muted/80 text-muted-foreground bg-muted/5">
                    <th className="p-3 text-[10px] uppercase">Date / Time</th>
                    <th className="p-3 text-[10px] uppercase">Employee</th>
                    <th className="p-3 text-[10px] uppercase text-right">
                      Hours
                    </th>
                    <th className="p-3 text-[10px] uppercase text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-muted/40">
                  {workspaceData.attendance.map((a) => (
                    <tr key={a.id}>
                      <td className="p-3">
                        <b>{a.date}</b>
                        <span className="block text-[10px] text-muted-foreground">
                          {a.checkIn || "--:--"} - {a.checkOut || "--:--"}
                        </span>
                      </td>

                      <td className="p-3">
                        <b>{a.name}</b>
                        <span className="block text-[10px] text-muted-foreground">
                          {a.role}
                        </span>
                      </td>

                      <td className="p-3 text-right font-mono">
                        {a.hours > 0 ? `${a.hours}h` : "--"}
                      </td>

                      <td className="p-3 text-right">
                        <Badge variant="outline">{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Leaves */}
          {/* Leaves */}
          <TabsContent value="leaves" className="m-0 border-0 outline-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-muted/80 text-muted-foreground bg-muted/5">
                    <th className="p-3 text-[10px] uppercase">No</th>

                    <th className="p-3 text-[10px] uppercase">Employee</th>

                    <th className="p-3 text-[10px] uppercase">Leave Type</th>

                    <th className="p-3 text-[10px] uppercase">Duration</th>

                    <th className="p-3 text-[10px] uppercase">Attachment</th>

                    <th className="p-3 text-[10px] uppercase text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-muted/40">
                  {workspaceData.leaves.map((l, index) => (
                    <tr key={l.id}>
                      {/* Generated number */}
                      <td className="p-3 font-mono font-bold text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="p-3 font-bold">{l.name}</td>

                      <td className="p-3">{l.type}</td>

                      <td className="p-3 font-mono">
                        {l.start} - {l.end}
                        <span className="block font-bold">({l.days} Days)</span>
                      </td>

                      {/* Sick leave proof image */}
                      <td className="p-3">
                        {l.attachment ? (
                          <a
                            href={l.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-brand hover:underline print:text-black"
                          >
                            <ImageIcon className="size-3.5" />

                            <span>View Proof</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No file</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <Badge
                          variant="outline"
                          className={
                            l.status === "Approved"
                              ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                              : l.status === "Pending"
                                ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                                : "text-destructive border-destructive/30 bg-destructive/10"
                          }
                        >
                          {l.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
