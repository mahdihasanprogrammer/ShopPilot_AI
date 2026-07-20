"use client";

import { RiRobot2Line, RiSparklingFill, RiChatHeartLine, RiLightbulbLine } from "react-icons/ri";

const HIGHLIGHTS = [
  {
    title: "Available Site-Wide",
    description: "Launch the chat bubble in the bottom right corner anytime to ask questions, compare specifications, or check inventory status.",
    icon: RiChatHeartLine,
  },
  {
    title: "Context-Aware Summaries",
    description: "When opened from a product detail page, the assistant automatically loads description context to save your time reading.",
    icon: RiLightbulbLine,
  },
];

export default function AIAssistantHighlight() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-border/40">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-surface p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-sm">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent/10 blur-2xl" />

        {/* Copywriting */}
        <div className="flex-1 space-y-6 relative z-10 text-center lg:text-left">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
            <RiSparklingFill className="h-3.5 w-3.5" />
            Agentic AI Companion
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-text-neutral leading-[1.15]">
            Meet Your Conversational Shopping Assistant
          </h2>
          <p className="text-sm text-text-neutral/70 max-w-xl leading-relaxed">
            Click the floating blue message icon at the bottom right corner of your screen at any time to open a persistent conversational pipeline. Compare specifications, ask follow-up questions in English or Bengali, and get instant guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{h.title}</span>
                  </div>
                  <p className="text-xs text-text-neutral/60 leading-relaxed">
                    {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulated Assistant UI Widget preview */}
        <div className="flex-1 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-neutral/40">Live Demo Preview</span>
            </div>
            <RiRobot2Line className="h-4.5 w-4.5 text-primary" />
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-none bg-surface border border-border p-3 text-text-neutral/80 max-w-[85%] leading-relaxed">
                👋 Hello! Try prompting me in Bengali! For example: <span className="font-bold text-primary">"১০০ ডলারের মধ্যে সেরা হেডফোন কোনটা?"</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-none bg-primary text-white p-3 max-w-[85%] leading-relaxed">
                ১০০ ডলারের মধ্যে সেরা হেডফোন কোনটা?
              </div>
            </div>

            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-none bg-surface border border-border p-3 text-text-neutral/80 max-w-[85%] leading-relaxed">
                ১০০ ডলার বাজেটের মধ্যে আমি আপনাকে <span className="font-bold text-primary">Anker Soundcore Life Q30</span> ($79.99) নেওয়ার পরামর্শ দেবো। এটিতে চমৎকার Active Noise Cancellation (ANC) এবং ৪০ ঘণ্টার ব্যাটারি ব্যাকআপ রয়েছে।
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
