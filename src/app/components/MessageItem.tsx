import type { Message } from "../types/message";
import { formatTime } from "../utils/formatTime";

type Props = {
  message: Message;
  onRead: (id: string) => void;
};

export function MessageItem({ message, onRead }: Props) {
  if (message.isSystem) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
        <span>🔔</span>
        <span>{message.text}</span>
        <span className="ml-auto text-xs">{formatTime(message.receivedAt)}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border transition-colors ${
        message.isRead
          ? "bg-white border-gray-200 opacity-70"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          message.isRead ? "bg-gray-300" : "bg-blue-500"
        }`}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{message.text}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatTime(message.receivedAt)}
        </p>
      </div>

      {!message.isRead && (
        <button
          onClick={() => onRead(message.id)}
          className="shrink-0 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Read
        </button>
      )}

      {message.isRead && (
        <span className="shrink-0 text-xs text-gray-400">✓ read</span>
      )}
    </div>
  );
}