"use client";

import { MessageSquareIcon } from "lucide-react";

interface ChatHeaderProps {
  workspaceName?: string;
}

export function ChatHeader({ workspaceName }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3.5 border-b border-muted/60 pb-4 mb-4 shrink-0">
      <div className="p-2.5 rounded-xl bg-brand/10 text-brand border border-brand/10 shadow-xs">
        <MessageSquareIcon className="size-5" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Workspace Chat
        </h1>
        <p className="text-xs text-muted-foreground/90 mt-0.5">
          Active channel for {workspaceName || "Global Workspace"}
        </p>
      </div>
    </div>
  );
}
