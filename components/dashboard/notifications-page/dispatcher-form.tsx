/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/provider/workspace-provider";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  FileTextIcon,
  GlobeIcon,
  InfoIcon,
  Loader2Icon,
  PlusIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WORKSPACE_MEMBERS } from "./mock-data";
import type { NotificationTarget, NotificationType } from "./types";

export function DispatcherForm() {
  const { workspace } = useWorkspace();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [target, setTarget] = useState<NotificationTarget>("global");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isPushing, setIsPushing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3); // Visual countdown helper

  const members = WORKSPACE_MEMBERS[workspace?.id] || [];

  // Reset member selection on workspace boundary change
  useEffect(() => {
    setSelectedMemberId("");
  }, [workspace?.id]);

  const handleCreateAnother = () => {
    setTitle("");
    setMessage("");
    setSelectedMemberId("");
    setType("info");
    setTarget("global");
    setIsSuccess(false);
    setCountdown(3);
  };

  // AUTOMATIC REDIRECT LOGIC
  useEffect(() => {
    if (!isSuccess) return;

    // Countdown interval for UI feedback
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    // Form fallback timeout sequence
    const timeout = setTimeout(() => {
      handleCreateAnother();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (target === "member" && !selectedMemberId) {
      toast.error("Please select a valid workspace member recipient.");
      return;
    }

    setIsPushing(true);

    const payload = {
      title,
      message,
      type,
      target,
      workspaceId: workspace?.id,
      targetMemberId: target === "member" ? selectedMemberId : undefined,
    };

    console.log("Pushing Notification Payload:", payload);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Notification operational broadcast successful.");
    setIsSuccess(true);
    setIsPushing(false);
  };

  // --- SUCCESS VIEW COMPONENT STATE (WITH AUTO RESET) ---
  if (isSuccess) {
    const selectedMemberName = members.find(
      (m) => m.id === selectedMemberId,
    )?.name;

    return (
      <div className="bg-background rounded-xl border border-muted/60 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-115 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Success Badge Ring */}
        <div className="relative flex items-center justify-center size-16 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 mb-4 animate-bounce">
          <CheckCircle2Icon className="size-8 shrink-0" />
        </div>

        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Notice Dispatched Successfully
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
          The operation payload matrix has processed successfully. Live logs
          have updated across the client session layer.
        </p>

        {/* Audit Meta Parameters Card */}
        <div className="w-full bg-muted/20 border border-muted/40 rounded-xl p-4 my-6 text-left space-y-3 max-w-md">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-muted/40">
            <span className="text-muted-foreground font-medium">
              Scope Boundary
            </span>
            <span className="font-mono bg-background px-2 py-0.5 rounded border border-muted/60 text-foreground font-semibold flex items-center gap-1">
              {target === "global" ? (
                <>
                  <GlobeIcon className="size-3 text-brand" /> Global Broadcast
                </>
              ) : (
                <>
                  <UserIcon className="size-3 text-brand" /> Recipient:{" "}
                  {selectedMemberName || selectedMemberId}
                </>
              )}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Dispatched Subject
            </span>
            <div className="flex items-start gap-2 text-xs font-semibold text-foreground leading-tight">
              <FileTextIcon className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="truncate w-full">{title}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-muted-foreground font-medium">
              Log Metric Priority
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                type === "success"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : type === "warning"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {type === "info" && <InfoIcon className="size-3 shrink-0" />}
              {type === "success" && (
                <CheckCircle2Icon className="size-3 shrink-0" />
              )}
              {type === "warning" && (
                <AlertCircleIcon className="size-3 shrink-0" />
              )}
              {type}
            </span>
          </div>
        </div>

        {/* Auto Redirect Info & Manual Reset Button */}
        <div className="space-y-3">
          <p className="text-[11px] text-muted-foreground/80 font-medium animate-pulse">
            Returning to create form automatically in{" "}
            <span className="font-bold text-foreground">{countdown}s</span>...
          </p>
          <Button
            onClick={handleCreateAnother}
            variant="outline"
            className="text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all border-muted hover:bg-muted/40"
          >
            <PlusIcon className="size-3.5" /> Back Now
          </Button>
        </div>
      </div>
    );
  }

  // --- STANDARD FORM INPUT CONTROLS ---
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-background rounded-xl border border-muted/60 p-6 shadow-xs animate-in fade-in duration-300"
    >
      {/* Target Scope Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">
            Target Scope
          </label>
          <span className="text-[10px] bg-muted font-mono font-bold px-2 py-0.5 rounded text-muted-foreground">
            {workspace?.name || "Global Scope"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTarget("global")}
            className={`h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all duration-200 border border-muted/60 ${
              target === "global"
                ? "border-brand bg-brand text-white shadow-xs"
                : "bg-background hover:bg-muted/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <GlobeIcon className="size-4 shrink-0" /> Global Broadcast
          </button>
          <button
            type="button"
            onClick={() => setTarget("member")}
            className={`h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all duration-200 border border-muted/60 ${
              target === "member"
                ? "border-brand bg-brand text-white shadow-xs"
                : "bg-background hover:bg-muted/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon className="size-4 shrink-0" /> Specific Member
          </button>
        </div>
      </div>

      {/* Conditional Member Select */}
      {target === "member" && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">
            Select Recipient
          </label>
          <div className="relative">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
              className="w-full h-11 pl-3 pr-10 bg-background border border-muted/80 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Choose a member from {workspace?.name || "active context"}...
              </option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.role} ({m.id})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground/70">
              <svg className="size-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {members.length === 0 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 pl-0.5">
              ⚠️ No members registered under this workspace profile.
            </p>
          )}
        </div>
      )}

      {/* Notification Type Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">
          Priority Type Classification
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(["info", "success", "warning"] as NotificationType[]).map((t) => {
            const isActive = type === t;
            const config = {
              info: {
                activeClass:
                  "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-xs",
                inactiveClass:
                  "border-muted text-muted-foreground hover:bg-blue-500/5 hover:text-blue-500 hover:border-blue-500/30",
                icon: InfoIcon,
                label: "Info",
              },
              success: {
                activeClass:
                  "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs",
                inactiveClass:
                  "border-muted text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30",
                icon: CheckCircle2Icon,
                label: "Success",
              },
              warning: {
                activeClass:
                  "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold shadow-xs",
                inactiveClass:
                  "border-muted text-muted-foreground hover:bg-amber-500/5 hover:text-amber-500 hover:border-amber-500/30",
                icon: AlertCircleIcon,
                label: "Warning",
              },
            }[t];

            const Icon = config.icon;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-10 flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium border transition-all duration-150 ${
                  isActive ? config.activeClass : config.inactiveClass
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">
            Notice Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., System Maintenance Scheduled"
            className="h-11 bg-background border-muted/80 rounded-xl focus-visible:ring-brand/30 focus-visible:border-brand text-xs font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">
            Message Content
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide descriptive details for the operational log here..."
            className="min-h-27.5 bg-background border-muted/80 rounded-xl focus-visible:ring-brand/30 focus-visible:border-brand resize-none text-xs font-medium leading-relaxed"
            required
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        disabled={isPushing}
        className="w-full h-11 bg-brand hover:bg-brand/90 text-white font-semibold rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2"
      >
        {isPushing ? (
          <>
            <Loader2Icon className="animate-spin size-4 shrink-0" /> Dispatching
            Logs...
          </>
        ) : (
          <>
            <SendIcon className="size-3.5 shrink-0" /> Dispatch Notice
          </>
        )}
      </Button>
    </form>
  );
}
