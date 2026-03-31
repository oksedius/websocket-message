"use client";

import { useState } from "react";
import type { ConnectionStatus } from "../types/message";

type Props = {
  onSend: (text: string) => void;
  status: ConnectionStatus;
};

export function MessageInput({ onSend, status }: Props) {
  const [text, setText] = useState("");

  const isDisabled = status !== "connected";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isDisabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const textareaClass = [
    "flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none text-sm",
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
    "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    "transition-colors w-full",
  ].join(" ");

  const buttonClass = [
    "px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium",
    "hover:bg-blue-600 transition-colors",
    "disabled:bg-gray-300 disabled:cursor-not-allowed",
  ].join(" ");

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={isDisabled ? "Waiting for connection..." : "Type a message... (Enter to send)"}
        rows={2}
        className={textareaClass}
      />
      <button
        type="submit"
        disabled={isDisabled || !text.trim()}
        className={buttonClass}
      >
        Send
      </button>
    </form>
  );
}