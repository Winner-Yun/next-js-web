"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-home/dashboard-card";
import { CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Optional: Subtle top loader so users know it's actively fetching */}
      <div className="flex items-center gap-3 px-1 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <p className="text-sm font-medium">Loading dashboard...</p>
      </div>

      {/* Main Grid exactly matching the 1px border layout */}
      <div
        className={cn(
          "grid grid-cols-2 gap-px bg-border p-px lg:grid-cols-4",
          "*:w-full *:bg-background",
        )}
      >
        {/* ROW 1: 4 KPI Cards (Total Employees, Present, Late, Leave) */}
        {[...Array(4)].map((_, i) => (
          <DashboardCard
            key={i}
            className="col-span-2 lg:col-span-1 flex flex-col justify-between border-none"
          >
            <CardHeader className="pb-2">
              <div className="h-4 w-28 animate-pulse bg-muted" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 w-16 animate-pulse bg-muted" />
              <div className="h-3 w-40 animate-pulse bg-muted" />
            </CardContent>
          </DashboardCard>
        ))}

        {/* ROW 2 - Left: Daily Attendance (Bar Chart) */}
        <DashboardCard className="col-span-2 lg:col-span-2 gap-0 border-none">
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-36 animate-pulse bg-muted" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-4 w-72 animate-pulse bg-muted" />
          </CardHeader>
          <CardContent>
            {/* Matches the h-60 to h-80 aspect ratio of your charts */}
            <div className="aspect-auto h-60 w-full animate-pulse bg-muted/40 md:h-80" />
          </CardContent>
        </DashboardCard>

        {/* ROW 2 - Right: Attendance Status (Line Chart) */}
        <DashboardCard className="col-span-2 lg:col-span-2 gap-0 border-none">
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-40 animate-pulse bg-muted" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-4 w-80 animate-pulse bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="aspect-auto h-60 w-full animate-pulse bg-muted/40 md:h-80" />
          </CardContent>
        </DashboardCard>

        {/* ROW 3 - Left: Recent Attendance (Table) */}
        <DashboardCard className="col-span-2 lg:col-span-2 gap-0 border-none relative">
          <CardHeader className="border-b gap-2 pb-4">
            <div className="h-5 w-36 animate-pulse bg-muted" />
            <div className="h-4 w-72 animate-pulse bg-muted" />
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex flex-col divide-y divide-border w-full">
              {/* Table Header Mock */}
              <div className="flex justify-between px-6 py-4">
                <div className="h-4 w-16 animate-pulse bg-muted" />
                <div className="h-4 w-20 animate-pulse bg-muted" />
                <div className="h-4 w-16 animate-pulse bg-muted" />
              </div>
              {/* Table Rows Mock */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between px-6 py-4 h-12 items-center"
                >
                  <div className="h-4 w-24 animate-pulse bg-muted" />
                  <div className="h-4 w-20 animate-pulse bg-muted" />
                  <div className="h-4 w-16 animate-pulse bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </DashboardCard>

        {/* ROW 3 - Right: Activity (List) */}
        <DashboardCard className="col-span-2 lg:col-span-2 gap-0 border-none">
          <CardHeader className="border-b gap-2 pb-4">
            <div className="h-5 w-20 animate-pulse bg-muted" />
            <div className="h-4 w-48 animate-pulse bg-muted" />
          </CardHeader>
          <CardContent className="px-0 w-full">
            <ul className="flex flex-col divide-y divide-border w-full">
              {/* List Items Mock */}
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="flex h-16 items-center gap-4 px-6 w-full"
                >
                  <div className="size-5 shrink-0 animate-pulse bg-muted rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse bg-muted" />
                    <div className="h-3 w-28 animate-pulse bg-muted" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </DashboardCard>
      </div>
    </div>
  );
}
