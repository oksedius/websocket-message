export type WsMessage =
  | { type: "hello" }
  | { type: "message"; data: { id: string; text: string; createdAt: string } }
  | { type: "message_read"; data: { id: string } }
  | { type: "message_deleted"; data: { id: string } }
  | { type: "system"; data: { text: string; createdAt: string } }
  | { type: "error"; data: { message: string } };

export type Message = {
  id: string;
  text: string;
  createdAt: string;
  receivedAt: string;
  isRead: boolean;
  isSystem: boolean;
};

export type MessageFilter = "all" | "unread" | "read";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";
