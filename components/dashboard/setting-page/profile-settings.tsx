/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  CameraIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

type Gender = "" | "male" | "female" | "other";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarSuccessUrl, setAvatarSuccessUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isProcessing = isSaving || isUploadingAvatar;

  // Load current profile from backend on mount
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok) {
          toast.error(data?.detail || "Failed to load profile.");
          return;
        }

        setName(typeof data.name === "string" ? data.name : "");
        setEmail(typeof data.email === "string" ? data.email : "");
        setAvatarUrl(typeof data.avatar === "string" ? data.avatar : "");

        const rawGender =
          typeof data.gender === "string" ? data.gender.toLowerCase() : "";
        const allowed: Gender[] = ["male", "female", "other"];
        setGender(
          allowed.includes(rawGender as Gender) ? (rawGender as Gender) : "",
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        if (!cancelled) toast.error("Failed to load profile.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const handlePickAvatar = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("You are not signed in.");
      return;
    }

    setIsUploadingAvatar(true);
    window.dispatchEvent(new Event("profile-updating"));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/auth/me/profile-image", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.detail || "Failed to update profile picture.");
        return;
      }

      if (typeof data.avatar === "string") {
        setAvatarUrl(data.avatar);
        setAvatarSuccessUrl(data.avatar);
      } else {
        setAvatarSuccessUrl(avatarUrl || null);
      }

      toast.success("Profile picture updated.");
      mutate("/api/auth/me");
    } catch (error) {
      toast.error("Failed to update profile picture.");
    } finally {
      setIsUploadingAvatar(false);
      window.dispatchEvent(new Event("profile-updated"));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("You are not signed in.");
      return;
    }

    setIsSaving(true);
    window.dispatchEvent(new Event("profile-updating"));

    try {
      const payload: { name: string; gender: string } = {
        name: name.trim(),
        gender: gender || "",
      };

      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.detail || "Failed to update profile.");
        return;
      }

      if (typeof data.name === "string") setName(data.name);
      if (typeof data.avatar === "string") setAvatarUrl(data.avatar);

      const rawGender =
        typeof data.gender === "string" ? data.gender.toLowerCase() : "";
      const allowed: Gender[] = ["male", "female", "other"];
      setGender(
        allowed.includes(rawGender as Gender) ? (rawGender as Gender) : "",
      );

      toast.success("Profile updated successfully.");
      mutate("/api/auth/me");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
      window.dispatchEvent(new Event("profile-updated"));
    }
  };

  const initials = name.trim()
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase() || "")
        .join("")
    : "U";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Global strict interaction blocker screen overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 cursor-not-allowed animate-in fade-in duration-200">
          <div className="bg-popover border shadow-md rounded-xl p-5 flex flex-col items-center gap-3 min-w-50">
            <Loader2Icon className="size-8 text-brand animate-spin" />
            <p className="text-xs font-medium text-muted-foreground">
              Processing updates...
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-foreground">My Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal details. Email is linked to your account and
          cannot be changed.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      {isLoading ? (
        <ProfileSettingsSkeleton />
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="size-20 border border-muted/60 shadow-sm">
                {avatarUrl ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={name || "Profile Picture"}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={handlePickAvatar}
                disabled={isProcessing}
                aria-label="Change profile picture"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                {isUploadingAvatar ? (
                  <Loader2Icon className="size-5 text-white animate-spin" />
                ) : (
                  <CameraIcon className="size-5 text-white" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Profile picture
              </p>
              <p className="text-[11px] text-muted-foreground">
                Click the image to upload a new one. JPG, PNG, or WebP up to 5
                MB.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              disabled={isLoading || isProcessing}
              className="h-10 text-sm border-muted/60"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Email Address
            </label>
            <Input
              value={email}
              type="email"
              readOnly
              disabled
              className="h-10 text-sm border-muted/60 bg-muted/40 cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground">
              Email is managed by your sign-in provider and cannot be changed
              here.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Gender
            </label>
            <Select
              value={gender || "none"}
              onValueChange={(v) =>
                setGender(v === "none" ? "" : (v as Gender))
              }
              disabled={isLoading || isProcessing}
            >
              <SelectTrigger className="h-10 w-full text-sm border-muted/60">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Prefer not to say</SelectItem>
                {GENDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button
              disabled={isProcessing || isLoading}
              type="submit"
              className="bg-brand hover:bg-brand/90 text-white"
            >
              {isSaving ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : (
                <SaveIcon className="size-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Success Dialog */}
      <Dialog
        open={avatarSuccessUrl !== null}
        onOpenChange={(open) => {
          if (!open) setAvatarSuccessUrl(null);
        }}
      >
        <DialogContent className="w-105 max-w-[90vw] h-90 p-6 flex flex-col">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="size-7" />
            </div>

            <DialogTitle className="text-center">
              Profile picture updated
            </DialogTitle>

            <DialogDescription className="text-center">
              Your new profile picture has been saved successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex items-center justify-center">
            <Avatar className="size-20 border border-muted/60 shadow-sm">
              {avatarSuccessUrl ? (
                <AvatarImage
                  src={avatarSuccessUrl}
                  alt={name || "Profile Picture"}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              className="bg-brand hover:bg-brand/90 text-white"
              onClick={() => setAvatarSuccessUrl(null)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-xl" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-5">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-72" />
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="pt-2">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
