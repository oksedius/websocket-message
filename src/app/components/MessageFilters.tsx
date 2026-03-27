import type { MessageFilter } from "../types/message";

type Props = {
  current: MessageFilter;
  onChange: (filter: MessageFilter) => void;
};

const FILTERS: { value: MessageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export function MessageFilters({ current, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === value
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}