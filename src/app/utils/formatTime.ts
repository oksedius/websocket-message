// Форматирует ISO строку в читаемое время "14:32:05"
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
