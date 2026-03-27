import type { ConnectionStatus as StatusType } from "../types/message";

type Props = {
  status: StatusType;
  reconnectAttempts: number;
  onReconnect: () => void;
  onDisconnect: () => void;
};

const STATUS_STYLES: Record<StatusType, string> = {
  connecting: "text-yellow-600 bg-yellow-50 border-yellow-200",
  connected: "text-green-600 bg-green-50 border-green-200",
  disconnected: "text-red-600 bg-red-50 border-red-200",
  reconnecting: "text-orange-600 bg-orange-50 border-orange-200",
};

const STATUS_LABELS: Record<StatusType, string> = {
  connecting: "🔄 Connecting...",
  connected: "✅ Connected",
  disconnected: "❌ Disconnected",
  reconnecting: "🔁 Reconnecting...",
};

export function ConnectionStatus({
  status,
  reconnectAttempts,
  onReconnect,
  onDisconnect,
}: Props) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-sm font-medium ${STATUS_STYLES[status]}`}>
      <span>{STATUS_LABELS[status]}</span>

      {status === "reconnecting" && reconnectAttempts > 0 && (
        <span className="text-xs opacity-70">
          (attempt {reconnectAttempts})
        </span>
      )}

      {status === "disconnected" && (
        <button
          onClick={onReconnect}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
        >
          Reconnect
        </button>
      )}

      {status === "connected" && (
        <button
          onClick={onDisconnect}
          className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}