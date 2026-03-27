import { Message } from "../types/message";

export function sortMessagesByNewest(messages: Message[]): Message[] {
  return [...messages].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );
}

export function deduplicateMessages(messages: Message[]): Message[] {
  const seen = new Set<string>();
  return messages.filter((msg) => {
    if (seen.has(msg.id)) return false;
    seen.add(msg.id);
    return true;
  });
}

export function countUnread(messages: Message[]): number {
  return messages.filter((msg) => !msg.isRead).length;
}
