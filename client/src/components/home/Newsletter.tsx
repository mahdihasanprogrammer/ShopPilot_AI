"use client";

import { useState } from "react";
import { RiMailSendLine, RiCheckLine, RiLoader4Line } from "react-icons/ri";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API registration delay
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-bg-secondary/40">
      <div className="relative overflow-hidden rounded-3xl border border-bg-secondary bg-background p-8 sm:p-12 text-center shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-36 w-36 rounded-full bg-primary/5 blur-xl" />
        
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <RiMailSendLine className="h-6 w-6" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
            Stay in the Loop
          </h2>
          <p className="text-sm text-text-neutral/60 leading-relaxed">
            Subscribe to get notifications about new features, AI integrations, and exclusive weekly shopping deals.
          </p>

          {subscribed ? (
            <div className="mx-auto max-w-md flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 animate-scaleIn">
              <RiCheckLine className="h-6 w-6 shrink-0 bg-green-500 text-white rounded-full p-0.5" />
              <p className="text-xs font-bold">Successfully Subscribed!</p>
              <p className="text-[10px] text-green-600/80">Thank you for joining. Check your inbox for updates soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto max-w-md space-y-2" noValidate>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="name@example.com"
                  className={`flex-1 rounded-xl border ${
                    error ? "border-red-400 bg-red-50/20" : "border-bg-secondary bg-background"
                  } px-4 py-3 text-xs text-text-neutral focus:border-primary focus:outline-none transition-all`}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <RiLoader4Line className="h-4 w-4 animate-spin" />
                      Subscribing
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {error && (
                <p className="text-[10px] font-semibold text-red-500 text-left sm:text-center mt-1">
                  ⚠️ {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
