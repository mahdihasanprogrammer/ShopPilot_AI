"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { IoChatbubbleEllipsesSharp, IoClose, IoPaperPlane } from "react-icons/io5";
import { RiRobot2Line, RiSparklingLine } from "react-icons/ri";
import { FiLoader, FiUser, FiInfo, FiCornerDownRight } from "react-icons/fi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I am your AI Shopping Companion. I can help you search products, recommend matching options, and answer store questions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initialise or load conversationId from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      let savedId = sessionStorage.getItem("shoppilot_chat_conv_id");
      if (!savedId) {
        savedId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("shoppilot_chat_conv_id", savedId);
      }
      setConversationId(savedId);
    }
  }, []);

  // Detect current viewed product ID from path (e.g. /products/123)
  const productDetailsMatch = pathname.match(/^\/products\/([a-zA-Z0-9_\-]+)$/);
  const currentProductId = productDetailsMatch ? productDetailsMatch[1] : undefined;

  // Don't render until hydration is done
  if (isPending) return null;

  // Admins do not buy products — hide chat widget for them
  if (user && isAdmin) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading || !user) return;

    // 1. Append user message
    const userMsgId = Math.random().toString(36).substring(2, 9);
    const newMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);
    setSuggestions([]);

    // 2. Add placeholder assistant streaming message
    const assistantMsgId = Math.random().toString(36).substring(2, 9);
    const placeholderMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, placeholderMsg]);

    try {
      // Get auth token
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
          message: textToSend,
          conversationId,
          currentProductId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to assistant stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              if (parsed.error) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: parsed.error }
                      : msg
                  )
                );
              } else if (parsed.text) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: msg.content + parsed.text }
                      : msg
                  )
                );
              } else if (parsed.suggestions) {
                setSuggestions(parsed.suggestions);
              }
            } catch (err) {
              // Ignore partial chunk syntax errors
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, content: "Sorry, I lost connection to the server. Please try again." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-[480px] w-80 md:w-96 flex-col rounded-3xl border border-black/[0.06] bg-white shadow-2xl animate-fadeIn overflow-hidden">
          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-black/[0.05] bg-gradient-to-r from-primary to-primary-dark px-5 py-4 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                <RiRobot2Line className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm block">ShopPilot AI</span>
                <span className="text-[10px] text-white/75 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-all rounded-xl p-2 hover:bg-white/10 cursor-pointer"
              aria-label="Close chat"
            >
              <IoClose className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* ── Content Body ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf9fc] overscroll-contain">
            {messages.map((msg) => {
              const isAI = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${!isAI ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar bubble */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-black shadow-sm ${
                      isAI
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-gradient-to-br from-primary to-accent border-transparent text-white"
                    }`}
                  >
                    {isAI ? <RiRobot2Line className="h-4 w-4" /> : <FiUser className="h-3.5 w-3.5" />}
                  </div>

                  {/* Message content */}
                  <div className="max-w-[75%] space-y-1">
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-xs border ${
                        isAI
                          ? "bg-white text-text-neutral border-black/[0.04] rounded-tl-none"
                          : "bg-primary text-white border-transparent rounded-tr-none"
                      }`}
                    >
                      {/* Simple markdown parser for product links */}
                      {isAI ? (
                        <p className="whitespace-pre-line">
                          {msg.content.split(/(\[[^\]]+\]\(\/products\/[a-zA-Z0-9_\-]+\))/g).map((part, i) => {
                            const match = part.match(/\[([^\]]+)\]\(\/products\/([a-zA-Z0-9_\-]+)\)/);
                            if (match) {
                              return (
                                <Link
                                  key={i}
                                  href={`/products/${match[2]}`}
                                  className="text-primary hover:underline font-bold"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {match[1]}
                                </Link>
                              );
                            }
                            return part;
                          })}
                        </p>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Typing indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border bg-primary/10 border-primary/20 text-primary shadow-sm">
                  <RiRobot2Line className="h-4 w-4" />
                </div>
                <div className="bg-white border border-black/[0.04] rounded-2xl rounded-tl-none px-3.5 py-3 flex items-center gap-1.5 shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Prompts Section ── */}
          {suggestions.length > 0 && !loading && (
            <div className="bg-white px-4 py-2 border-t border-black/[0.04] shrink-0">
              <p className="text-[9px] font-black text-text-neutral/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <RiSparklingLine className="h-3 w-3 text-primary animate-pulse" /> Suggested actions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-[10px] font-bold text-primary bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/10 rounded-full px-2.5 py-1 text-left flex items-center gap-0.5 transition-all cursor-pointer"
                  >
                    <FiCornerDownRight className="h-2.5 w-2.5 shrink-0" />
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input bar footer ── */}
          <div className="border-t border-black/[0.05] p-3.5 bg-white shrink-0">
            {user ? (
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for details, stock, comparisons..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-black/[0.06] bg-gray-50 px-3.5 py-2 text-xs font-semibold text-text-neutral placeholder:text-text-neutral/30 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Send message"
                >
                  <IoPaperPlane className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              /* If not logged in, show login promo teaser */
              <div className="flex flex-col gap-2 p-1.5 text-center">
                <p className="text-[11px] font-semibold text-text-neutral/60 leading-normal">
                  Want to query stock levels or get shopping assistance?
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login?callbackUrl=" + pathname);
                  }}
                  className="w-full flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <FiInfo className="h-3.5 w-3.5" /> Sign In to Chat
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Floating Widget button wrapper */
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-primary/20 cursor-pointer"
          aria-label="Open AI chat"
          id="ai-chat-bubble"
        >
          <IoChatbubbleEllipsesSharp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
