/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertTriangleIcon,
  ArrowDownUpIcon,
  Loader2Icon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { EmployeeCard } from "@/components/dashboard/employee-page/employee-card";
import { EmployeeDetailsPanel } from "@/components/dashboard/employee-page/employee-details-panel";
import { InviteEmployeeDialog } from "@/components/dashboard/employee-page/invite-employee-dialog";
import { ManageAccessDialog } from "@/components/dashboard/employee-page/manage-access-dialog";
import type { Employee } from "@/components/dashboard/employee-page/types";

const apiFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export function EmployeesDirectory() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [inviteToRevoke, setInviteToRevoke] = useState<Employee | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem("showPendingUsersPreference");
    if (savedPreference !== null) {
      setShowPending(savedPreference === "true");
    }
  }, []);

  const handleTogglePending = (checked: boolean) => {
    setShowPending(checked);
    localStorage.setItem("showPendingUsersPreference", String(checked));
  };

  // Fetch real-time active workspace members
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
    mutate: mutateMembers,
  } = useSWR(
    workspace?.id ? `/api/workspace/${workspace.id}/members` : null,
    apiFetcher,
    { revalidateOnFocus: false },
  );

  // Fetch pending invites only if the toggle is enabled
  const {
    data: invitesData,
    isLoading: invitesLoading,
    mutate: mutateInvites,
  } = useSWR(
    workspace?.id && showPending
      ? `/api/workspace/${workspace.id}/invites?status=pending`
      : null,
    apiFetcher,
    { revalidateOnFocus: false },
  );

  const employeesList: Employee[] = useMemo(() => {
    const activeMembers = membersData?.members || [];

    const rawInvites =
      invitesData?.invites ||
      invitesData?.data ||
      invitesData?.items ||
      invitesData;

    const pendingInvites = Array.isArray(rawInvites) ? rawInvites : [];

    const formattedInvites: Employee[] = showPending
      ? pendingInvites.map((inv: unknown) => ({
          id: inv.id || inv._id,
          name: "Pending User",
          email: inv.email,
          role: inv.role || "Member",
          status: "inactive",
          is_pending: true,
        }))
      : [];

    return [...activeMembers, ...formattedInvites];
  }, [membersData, invitesData, showPending]);

  const processedEmployees = useMemo(() => {
    let result = [...employeesList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.role?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name-asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc")
        return (b.name || "").localeCompare(b.name || "");
      return 0;
    });

    return result;
  }, [employeesList, searchQuery, sortBy]);

  const handleReload = async () => {
    await mutateMembers(undefined, { revalidate: true });
    if (showPending) await mutateInvites(undefined, { revalidate: true });
  };

  const handleRevokeClick = (employee: Employee, e: React.MouseEvent) => {
    e.preventDefault();
    setInviteToRevoke(employee);
  };

  const handleFinalRevoke = async () => {
    if (!inviteToRevoke) return;

    setIsRevoking(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspace/invite/${inviteToRevoke.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Invitation successfully revoked.");
        await mutateInvites();
        setInviteToRevoke(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || "Failed to cancel invitation context.");
      }
    } catch (error) {
      toast.error("An error occurred during revocation handling.");
    } finally {
      setIsRevoking(false);
    }
  };

  const isLoading = membersLoading || (showPending && invitesLoading);
  const error = membersError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
            <Input
              placeholder="Search by name, email, or role..."
              className="pl-9 text-xs h-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-card">
              <div className="flex items-center gap-2">
                <ArrowDownUpIcon className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc" className="text-xs">
                Name (A - Z)
              </SelectItem>
              <SelectItem value="name-desc" className="text-xs">
                Name (Z - A)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor="show-pending"
            className="flex items-center space-x-2 border border-border rounded-lg px-3 h-9 bg-muted/40 cursor-pointer select-none"
          >
            <div className="relative">
              <input
                id="show-pending"
                type="checkbox"
                className="peer sr-only"
                disabled={isRevoking}
                checked={showPending}
                // Hook up the custom handle change function
                onChange={(e) => handleTogglePending(e.target.checked)}
              />
              <div className="h-4 w-8 rounded-full bg-muted-foreground/30 transition-colors peer-checked:bg-brand"></div>
              <div className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-background shadow-xs transition-transform peer-checked:translate-x-4"></div>
            </div>
            <span className="text-xs font-medium text-foreground">
              Show Pending
            </span>
          </label>

          <div className="flex items-center gap-2">
            <ManageAccessDialog onSuccess={handleReload} />
            <InviteEmployeeDialog onInviteSuccess={handleReload} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52.5 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center text-xs text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
          Failed to load workspace members. Please verify session context.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedEmployees.map((emp) => (
            <EmployeeCard
              key={`${emp.is_pending ? "inv-" : "usr-"}${emp.id}`}
              employee={emp}
              onClick={() => {
                if (!emp.is_pending) setSelectedEmployee(emp);
              }}
              onRevokeInvite={(id, e) => handleRevokeClick(emp, e)}
            />
          ))}

          {processedEmployees.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted/40 p-3 mb-3">
                <UsersIcon className="size-5 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No records located
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No employees or pending invites match your criteria.
              </p>
            </div>
          )}
        </div>
      )}

      <Sheet
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedEmployee && (
            <EmployeeDetailsPanel employee={selectedEmployee} />
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={!!inviteToRevoke}
        onOpenChange={(open) => {
          if (isRevoking) return;
          if (!open) setInviteToRevoke(null);
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => {
            if (isRevoking) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isRevoking) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight text-destructive flex items-center gap-2">
              <AlertTriangleIcon className="size-4 shrink-0 animate-pulse" />
              Revoke Pending Access
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal pt-1">
              You are terminating an active system authorization sequence. This
              will instantly expire all tracking logs linked with the email
              address:{" "}
              <span className="font-semibold text-foreground block mt-1 select-all bg-muted border rounded px-1.5 py-0.5 font-mono text-[11px] w-fit">
                {inviteToRevoke?.email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              disabled={isRevoking}
              onClick={() => setInviteToRevoke(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="text-xs h-9 gap-1.5 min-w-32.5 cursor-pointer"
              disabled={isRevoking}
              onClick={handleFinalRevoke}
            >
              {isRevoking ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Revocation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
