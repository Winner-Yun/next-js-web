"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2Icon, SendIcon } from "lucide-react";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSubmit: () => void;
  editingMessageId: string | null;
  onCancelEdit: () => void;
}

export function ChatInputArea({
  inputValue,
  setInputValue,
  onSubmit,
  editingMessageId,
  onCancelEdit,
}: ChatInputAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="mt-4 bg-background border border-muted/60 rounded-xl p-3 shadow-xs shrink-0">
      {editingMessageId && (
        <div className="flex items-center justify-between bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-md mb-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Edit2Icon className="size-3.5" /> Editing Message...
          </span>
          <button onClick={onCancelEdit} className="hover:underline">
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            editingMessageId ? "Update your message..." : "Type a message..."
          }
          className="min-h-11 max-h-32 resize-none border-none focus-visible:ring-0 px-2 py-3 text-sm bg-transparent"
          rows={1}
        />
        <Button
          onClick={onSubmit}
          disabled={!inputValue.trim()}
          className="h-11 w-11 rounded-xl bg-brand text-white shrink-0 shadow-xs hover:bg-brand/90 transition-all flex items-center justify-center p-0"
        >
          <SendIcon className="size-4 ml-1" />
        </Button>
      </div>

      <div className="px-2 pt-1.5 text-[10px] text-muted-foreground flex justify-between">
        <span>
          <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new
          line.
        </span>
      </div>
    </div>
  );
}
