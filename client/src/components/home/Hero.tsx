"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { RiSparklingFill, RiRobot2Line, RiArrowRightLine, RiSendPlane2Line, RiLockLine } from "react-icons/ri";
import { FiLoader } from "react-icons/fi";

const SUGGESTIONS = [
  "Recommend a keyboard under $100",
  "Best wireless earbuds for gym?",
  "Compare headphones and earbuds",
];

interface HeroMessage {
  sender: "user" | "bot";
  text: string;
}

export default function Hero() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<HeroMessage[]>([
    {
      sender: "bot",
      text: "Hi! I am ShopPilot AI. Ask me anything about our products — recommendations, comparisons, stock, pricing, and more.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() =>
    typeof window !== "undefined"
      ? (sessionStorage.getItem("shoppilot_hero_conv_id") ||
          (() => {
            const id = Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem("shoppilot_hero_conv_id", id);
            return id;
          })())
      : Math.random().toString(36).substring(2, 15)
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !user) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setQuery("");
    setIsLoading(true);

    // Placeholder for streaming bot reply
    const placeholderId = "__hero_bot_" + Date.now();
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const { authClient } = await import("@/lib/auth-client");
      const sessionData = await authClient.getSession();
      const token = sessionData?.data?.session?.token;

      const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Connection failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulated += parsed.text;
                // Update the last bot message in place
                setMessages((prev) => {
                  const updated = [...prev];
                  for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].sender === "bot") {
                      updated[i] = { ...updated[i], text: accumulated };
                      break;
                    }
                  }
                  return updated;
                });
              }
              if (parsed.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].sender === "bot") {
                      updated[i] = { ...updated[i], text: parsed.error };
                      break;
                    }
                  }
                  return updated;
                });
              }
            } catch {
              // Partial JSON chunk — skip
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].sender === "bot") {
            updated[i] = { ...updated[i], text: "Sorry, I couldn't connect to the server. Please try again." };
            break;
          }
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
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

      {/* Interactive AI Chat Preview Column */}
      <div className="flex-1 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl relative transition-all hover:shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <RiRobot2Line className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-neutral">ShopPilot AI Assistant</h3>
            <span className="text-[9px] font-medium text-green-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {user ? "Live · Powered by Gemini" : "Sign in to chat live"}
            </span>
          </div>
        </div>

        {/* Chat Output */}
        <div ref={scrollRef} className="h-48 overflow-y-auto my-4 space-y-3 pr-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-none font-semibold"
                    : "bg-surface text-text-neutral/80 rounded-tl-none border border-border"
                }`}
              >
                {m.sender === "bot" && m.text === "" && isLoading ? (
                  <span className="flex gap-1 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-neutral/30 animate-bounce [animation-delay:0.3s]" />
                  </span>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        {!isPending && user && (
          <div className="space-y-1.5 mb-4">
            <p className="text-[9px] font-bold text-text-neutral/40 uppercase tracking-wider">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  disabled={isLoading}
                  className="text-[10px] text-left font-semibold border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 hover:text-primary rounded-xl px-2.5 py-1.5 transition-all text-text-neutral/75 disabled:opacity-50 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        {!isPending && (
          user ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(query)}
                placeholder="Ask your assistant here..."
                className="flex-1 text-xs rounded-xl border border-border bg-surface px-3 py-2.5 focus:border-primary focus:bg-card focus:outline-none transition-all disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend(query)}
                disabled={isLoading || !query.trim()}
                className="flex items-center justify-center rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <RiSendPlane2Line className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 border border-primary/20 text-primary py-2.5 text-xs font-bold hover:bg-primary hover:text-white transition-all"
            >
              <RiLockLine className="h-3.5 w-3.5" />
              Sign In to Chat Live with AI
            </Link>
          )
        )}
      </div>
    </section>
  );
}
