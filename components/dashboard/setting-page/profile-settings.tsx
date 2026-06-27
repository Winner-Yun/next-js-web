"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProfileSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the live preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call to upload image and save profile data
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Profile updated successfully.");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-foreground">My Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal details and public profile.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        {/* Profile Picture Upload Area */}
        <div className="flex items-center gap-5">
          <Avatar className="size-20 border border-muted/60 shadow-sm">
            <AvatarImage
              src={avatarUrl}
              alt="Profile Picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
              AM
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 border-muted/60"
            >
              <CameraIcon className="size-4 mr-2" /> Change Picture
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Recommended: Square JPG, PNG. Max 2MB.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Full Name
          </label>
          <Input
            defaultValue="Alex Mercer"
            className="h-10 text-sm border-muted/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Email Address
          </label>
          <Input
            defaultValue="alex@worksmart.ai"
            type="email"
            className="h-10 text-sm border-muted/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Job Title
          </label>
          <Input
            defaultValue="Lead Engineer"
            className="h-10 text-sm border-muted/60"
          />
        </div>

        <div className="pt-2">
          <Button
            disabled={isSaving}
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
    </div>
  );
}
