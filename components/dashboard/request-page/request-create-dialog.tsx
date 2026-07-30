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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_IMAGES = 5;

interface RequestCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    description: string;
    images: File[];
  }) => Promise<void> | void;
}

export function RequestCreateDialog({
  isOpen,
  onClose,
  onSave,
}: RequestCreateDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setImages([]);
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        images,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-125 p-2 overflow-hidden bg-background"
        onInteractOutside={(e) => isSaving && e.preventDefault()}
        onEscapeKeyDown={(e) => isSaving && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <DialogHeader className="p-5 pb-3 shrink-0">
            <DialogTitle className="text-base font-bold">
              New Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a request or issue for the workspace admins to review.
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 border-y border-muted/30 overflow-y-auto">
            <div className="space-y-1.5">
              <Label
                htmlFor="request-title"
                className="text-xs font-semibold text-foreground"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="request-title"
                placeholder="e.g., Broken AC in Room 204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9 bg-background/50"
                autoFocus
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="request-description"
                className="text-xs font-semibold text-foreground"
              >
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="request-description"
                placeholder="Describe the issue or request in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs min-h-24 bg-background/50"
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Attachments (up to {MAX_IMAGES} images)
              </Label>
              <div className="flex flex-wrap gap-2">
                {images.map((file, i) => (
                  <div
                    key={i}
                    className="relative size-16 rounded-lg border border-muted/60 overflow-hidden group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={isSaving}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <XIcon className="size-4 text-white" />
                    </button>
                  </div>
                ))}

                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="size-16 rounded-lg border border-dashed border-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs cursor-pointer h-9 bg-brand text-white hover:bg-brand/90 px-4 transition-all"
              disabled={isSaving || !title.trim() || !description.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
