import type { Message } from "../types/message";
import { MessageItem } from "./MessageItem";

type Props = {
  messages: Message[];
  onRead: (id: string) => void;
};

export function MessageList({ messages, onRead }: Props) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No messages yet...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} onRead={onRead} />
      ))}
    </div>
  );
}