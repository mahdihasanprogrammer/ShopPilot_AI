"use client";

import Link from "next/link";
import { RiSparklingFill, RiRobot2Line, RiArrowRightLine, RiChatSmile3Line } from "react-icons/ri";
import { FiCheckCircle } from "react-icons/fi";

const AI_FEATURES = [
  "Real-time streaming responses powered by Gemini 2.5 Flash",
  "Context-aware: loads product details when viewing an item",
  "Bilingual support — chat in English or Bengali",
  "Personalized picks based on your orders and cart",
];

function openChatWidget() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-chat-widget"));
  }
}

export default function Hero() {
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

      {/* AI Assistant Teaser Card */}
      <div className="flex-1 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl relative transition-all hover:shadow-2xl">
        {/* Card Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <RiRobot2Line className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-text-neutral">ShopPilot AI Assistant</h3>
            <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · Powered by Gemini 2.5 Flash
            </span>
          </div>
          <span className="ml-auto rounded-full bg-accent/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent border border-accent/20">
            AI
          </span>
        </div>

        {/* Feature Bullets */}
        <ul className="mt-5 space-y-3">
          {AI_FEATURES.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-text-neutral/70 leading-relaxed">
              <FiCheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {/* Decorative chat bubble preview */}
        <div className="mt-5 rounded-xl border border-border bg-surface p-3.5 space-y-2.5 text-xs">
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-none bg-white border border-border px-3 py-2 text-text-neutral/75 max-w-[85%] leading-relaxed shadow-xs">
              Which mechanical keyboard is best under $100?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-tr-none bg-primary text-white px-3 py-2 max-w-[85%] leading-relaxed font-medium">
              Based on your preferences, I recommend checking out our top-rated keyboards in the Electronics section…
            </div>
          </div>
          <p className="text-center text-[9px] text-text-neutral/30 font-semibold uppercase tracking-wider pt-0.5">
            Illustrative preview · Sign in to chat live
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={openChatWidget}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <RiChatSmile3Line className="h-4.5 w-4.5" />
          Open AI Chat Assistant
        </button>
      </div>
    </section>
  );
}
