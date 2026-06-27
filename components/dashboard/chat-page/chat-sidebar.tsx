"use client";

import { HashIcon, UserIcon } from "lucide-react";
import type { ChatType } from "./chat-types"; //[cite: 5]

// Dictionary pattern mapping workspace IDs to their members
export const MEMBERS_DATA: Record<
  string,
  { id: string; name: string; role: string }[]
> = {
  worksmart: [
    { id: "u2", name: "Sombath", role: "member" },
    { id: "u3", name: "Alice", role: "member" },
  ],
  company: [{ id: "u4", name: "Bob", role: "member" }],
};

interface ActiveChat {  
  id: string;
  type: ChatType; //[cite: 5]
  name: string;
}

interface ChatSidebarProps {
  workspace: { id: string; name: string } | null | undefined;
  activeChat: ActiveChat;
  setActiveChat: (chat: ActiveChat) => void;
}

export function ChatSidebar({
  workspace,
  activeChat,
  setActiveChat,
}: ChatSidebarProps) {
  // Pull members directly from the dictionary using the workspace ID
  const workspaceMembers = workspace?.id
    ? MEMBERS_DATA[workspace.id] || []
    : [];

  return (
    <div className="w-64 bg-background border border-muted/60 rounded-xl p-4 shadow-xs flex flex-col gap-4 overflow-y-auto shrink-0">
      {/* Channels Section */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Channels
        </h2>
        <button
          onClick={() =>
            workspace &&
            setActiveChat({
              id: workspace.id,
              type: "group",
              name: workspace.name,
            })
          }
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeChat.id === workspace?.id
              ? "bg-brand/10 text-brand font-medium"
              : "text-foreground hover:bg-muted/50"
          }`}
        >
          <HashIcon className="size-4" />
          {workspace?.name || "Global Workspace"}
        </button>
      </div>

      {/* Direct Messages Section */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
          Direct Messages
        </h2>
        <div className="flex flex-col gap-1">
          {workspaceMembers.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-1">
              No members in this workspace.
            </p>
          ) : (
            workspaceMembers.map((member) => (
              <button
                key={member.id}
                onClick={() =>
                  setActiveChat({
                    id: `dm_${member.id}`,
                    type: "direct",
                    name: member.name,
                  })
                }
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeChat.id === `dm_${member.id}`
                    ? "bg-brand/10 text-brand font-medium"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <UserIcon className="size-4" />
                {member.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
