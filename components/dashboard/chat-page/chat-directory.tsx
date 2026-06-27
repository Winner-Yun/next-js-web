"use client";

import { useWorkspace } from "@/provider/workspace-provider";
import { MessageSquareIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// Sub-components
import { ChatHeader } from "./chat-header";
import { ChatInputArea } from "./chat-input-area";
import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatSidebar } from "./chat-sidebar";
import type { ChatMessage, ChatType } from "./chat-types"; //[cite: 1, 5]

export function ChatDirectory() {
  const { workspace } = useWorkspace();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // State to track active chat (Workspace Group vs Direct)
  const [activeChat, setActiveChat] = useState<{
    id: string;
    type: ChatType; //[cite: 5]
    name: string;
  }>({
    id: "worksmart",
    type: "group", //[cite: 5]
    name: "worksmart",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messagesData, setMessagesData] = useState<
    Record<string, ChatMessage[]> //[cite: 1]
  >({
    worksmart: [
      {
        id: "msg-1",
        senderId: "sys",
        senderName: "System",
        message: "Welcome to the workspace chat.", //[cite: 1, 5]
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isEdited: false,
        isRead: true,
        isMine: false,
        chatType: "group", //[cite: 5]
      },
    ],
    dm_u2: [
      {
        id: "msg-dm-1",
        senderId: "u2",
        senderName: "Sombath",
        message: "Hey boss, do you have a minute?", //[cite: 5]
        createdAt: new Date(Date.now() - 1000000).toISOString(),
        isEdited: false,
        isRead: true,
        isMine: false,
        chatType: "direct", //[cite: 5]
      },
    ],
  });

  useEffect(() => {
    if (workspace?.id) {
      setActiveChat({
        id: workspace.id,
        type: "group", //[cite: 5]
        name: workspace.name,
      });
    }
  }, [workspace]);

  const currentMessages = useMemo(() => {
    return messagesData[activeChat.id] || [];
  }, [messagesData, activeChat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  useEffect(() => {
    if (!activeChat.id) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeChat.id]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChat.id) return;
    try {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "me",
        senderName: "You",
        message: inputValue, //[cite: 1, 5]
        createdAt: new Date().toISOString(),
        isEdited: false,
        isRead: false,
        isMine: true,
        chatType: activeChat.type, //[cite: 5]
      };
      setMessagesData((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
      }));
      setInputValue("");
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  const handleEditMessage = async () => {
    if (!inputValue.trim() || !activeChat.id || !editingMessageId) return;
    try {
      setMessagesData((prev) => {
        const current = prev[activeChat.id] || [];
        return {
          ...prev,
          [activeChat.id]: current.map((m) =>
            m.id === editingMessageId
              ? { ...m, message: inputValue, isEdited: true } //[cite: 1, 5]
              : m,
          ),
        };
      });
      setInputValue("");
      setEditingMessageId(null);
      toast.success("Message updated.");
    } catch (error) {
      toast.error("Failed to edit message.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeChat.id) return;
    try {
      setMessagesData((prev) => {
        const current = prev[activeChat.id] || [];
        return {
          ...prev,
          [activeChat.id]: current.filter((m) => m.id !== messageId),
        };
      });
      toast.success("Message deleted.");
    } catch (error) {
      toast.error("Failed to delete message.");
    }
  };

  const submitAction = editingMessageId ? handleEditMessage : handleSendMessage;

  const startEditing = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setInputValue(msg.message); //[cite: 1, 5]
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setInputValue("");
  };

  return (
    <div className="w-full flex h-[calc(100vh-8rem)] animate-in fade-in duration-300 gap-4">
      {/* Extracted Sidebar Component */}
      <ChatSidebar
        workspace={workspace}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader chatName={activeChat.name} chatType={activeChat.type} />

        <div className="flex-1 overflow-y-auto bg-background border border-muted/60 rounded-xl p-4 shadow-xs space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground animate-pulse">
              Loading communications for {activeChat.name}...
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <MessageSquareIcon className="size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground font-medium">
                No messages in{" "}
                {activeChat.type === "group"
                  ? `the ${activeChat.name} channel`
                  : `your private chat with ${activeChat.name}`}{" "}
                yet.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                msg={msg}
                onEdit={startEditing}
                onDelete={handleDeleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInputArea
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={submitAction}
          editingMessageId={editingMessageId}
          onCancelEdit={cancelEditing}
        />
      </div>
    </div>
  );
}
