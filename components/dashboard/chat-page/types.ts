export type ChatType = "group" | "direct";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string; // Maps to {"message": "string"}
  createdAt: string;
  isEdited: boolean;
  isRead: boolean;      
  isMine: boolean;
  chatType: ChatType;
}
