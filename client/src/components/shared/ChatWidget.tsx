"use client";

import { useState } from "react";
import { IoChatbubbleEllipsesSharp, IoClose, IoPaperPlane } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-96 w-80 flex-col rounded-2xl border border-bg-secondary bg-background shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bg-secondary bg-primary px-4 py-3 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <RiRobot2Line className="h-5 w-5" />
              <span className="font-semibold text-sm">ShopPilot AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors rounded-lg p-0.5 hover:bg-white/10"
              aria-label="Close chat"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 text-sm text-text-neutral/70">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <RiRobot2Line className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="rounded-xl rounded-tl-none bg-bg-secondary px-3 py-2 text-xs leading-relaxed">
                Hi! I am your AI Shopping Assistant. How can I help you today?
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-bg-secondary p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-bg-secondary px-3 py-1.5 text-sm focus:border-primary focus:outline-none bg-background"
                disabled
              />
              <button className="flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-white hover:bg-primary-dark transition-colors" aria-label="Send message">
                <IoPaperPlane className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105"
          aria-label="Open AI chat"
        >
          <IoChatbubbleEllipsesSharp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
