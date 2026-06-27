"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCheckIcon,
  Edit2Icon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import type { ChatMessage } from "./chat-types";

interface ChatMessageBubbleProps {
  msg: ChatMessage;
  onEdit: (msg: ChatMessage) => void;
  onDelete: (id: string) => void;
}

export function ChatMessageBubble({
  msg,
  onEdit,
  onDelete,
}: ChatMessageBubbleProps) {
  const timeFormatted = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full ${msg.isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${msg.isMine ? "items-end" : "items-start"}`}
      >
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium px-1">
          <span>{msg.senderName}</span>
          <span>•</span>
          <span>{timeFormatted}</span>
        </div>

        {/* Bubble & Actions */}
        <div
          className={`group relative flex items-start gap-2 ${msg.isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          <div
            className={`p-3 rounded-2xl text-sm shadow-xs relative ${
              msg.isMine
                ? "bg-brand text-white rounded-tr-sm"
                : "bg-muted/30 border border-muted/60 text-foreground rounded-tl-sm"
            }`}
          >
            <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
              {msg.message}
            </p>

            <div
              className={`flex items-center gap-1 mt-1 text-[10px] ${
                msg.isMine
                  ? "text-brand-foreground/70 justify-end"
                  : "text-muted-foreground"
              }`}
            >
              {msg.isEdited && <span>(edited)</span>}
              {msg.isMine && (
                <CheckCheckIcon
                  className={`size-3.5 ${msg.isRead ? "text-white" : "opacity-50"}`}
                />
              )}
            </div>
          </div>

          {/* Context Menu for sender */}
          {msg.isMine && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-md mt-1 shrink-0">
                  <MoreVerticalIcon className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 text-xs">
                <DropdownMenuItem
                  onClick={() => onEdit(msg)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2Icon className="size-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(msg.id)}
                  className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <Trash2Icon className="size-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
