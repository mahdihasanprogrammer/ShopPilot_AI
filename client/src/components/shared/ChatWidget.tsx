"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-96 w-80 flex-col rounded-2xl border border-bg-secondary bg-background shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bg-secondary bg-primary px-4 py-3 text-white rounded-t-2xl">
            <span className="font-semibold">ShopPilot AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Messages body placeholder */}
          <div className="flex-1 overflow-y-auto p-4 text-sm text-text-neutral/70">
            Hi! I am your AI Shopping Assistant. How can I help you today?
          </div>
          {/* Input placeholder */}
          <div className="border-t border-bg-secondary p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-bg-secondary px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                disabled
              />
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105"
        >
          💬
        </button>
      )}
    </div>
  );
}
