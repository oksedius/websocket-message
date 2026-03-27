type Props = {
  message: string | null;
  onClose: () => void;
};

export function ErrorBanner({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
      <span>⚠️ {message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
}
