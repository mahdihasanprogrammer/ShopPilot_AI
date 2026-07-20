"use client";

import { useState } from "react";
import Link from "next/link";
import { RiSparklingFill, RiRobot2Line, RiArrowRightLine } from "react-icons/ri";

const SUGGESTIONS = [
  "Recommend a mechanical keyboard under $100",
  "What are the best wireless earbuds for fitness?",
  "Suggest a minimal desk lamp with warm light",
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hi! I am ShopPilot AI. Try clicking one of the suggestions below to see how I help you find products!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const simulateBotReply = (userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let reply = "Based on top reviews, I recommend the Keychron K2 mechanical keyboard ($79.99). It is compact, offers great tactile response, and has wireless multi-device pairing!";
      
      if (userText.toLowerCase().includes("earbud") || userText.toLowerCase().includes("wireless")) {
        reply = "I suggest the Anker Soundcore Sport X10 ($69.99). They have rotatable ear hooks for secure fit, IPX7 waterproofing, and punchy bass for workouts.";
      } else if (userText.toLowerCase().includes("lamp") || userText.toLowerCase().includes("desk")) {
        reply = "Consider the Baseus Magnetic Desk Lamp ($29.99). It features adjustable brightness, step-less color temperature tuning, and a clean minimalist profile.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setQuery("");
    simulateBotReply(text);
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

      {/* Copywriting Column */}
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
          <RiSparklingFill className="h-3.5 w-3.5 animate-spin" />
          The Future of Shopping
        </span>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text-neutral leading-[1.1]">
          Shop Smarter with{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Conversational AI
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-text-neutral/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Say goodbye to endless filtering. Simply chat with our intelligent Shopping Assistant to discover products, compare features, and get personalized recommendations in real-time.
        </p>

        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Explore Products
            <RiArrowRightLine className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-text-neutral hover:bg-surface transition-all"
          >
            How it works
          </Link>
        </div>
      </div>

      {/* Interactive Element Column (AI Sandbox Preview) */}
      <div className="flex-1 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl relative transition-all hover:shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <RiRobot2Line className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-neutral">ShopPilot AI Assistant</h3>
            <span className="text-[9px] font-medium text-green-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Online & Ready
            </span>
          </div>
        </div>

        {/* Chat Output */}
        <div className="h-48 overflow-y-auto my-4 space-y-3 pr-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-none font-semibold"
                    : "bg-surface text-text-neutral/80 rounded-tl-none border border-border"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-none bg-surface border border-border px-3.5 py-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-1.5 mb-4">
          <p className="text-[9px] font-bold text-text-neutral/40 uppercase tracking-wider">Suggested Queries:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                disabled={isTyping}
                className="text-[10px] text-left font-semibold border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 hover:text-primary rounded-xl px-2.5 py-1.5 transition-all text-text-neutral/75"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(query)}
            placeholder="Ask your assistant here..."
            className="flex-1 text-xs rounded-xl border border-border bg-surface px-3 py-2.5 focus:border-primary focus:bg-card focus:outline-none transition-all"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend(query)}
            disabled={isTyping}
            className="rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </div>
    </section>
  );
}
