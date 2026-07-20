"use client";

import { RiRobot2Line, RiSearch2Line, RiSecurePaymentLine, RiUserHeartLine } from "react-icons/ri";

const FEATURES = [
  {
    title: "AI Shopping Assistant",
    description: "Our conversational assistant runs live Claude intelligence to summarize features, resolve inquiries, and compare items instantly.",
    icon: RiRobot2Line,
    color: "bg-primary/10 text-primary border-primary/20",
  },
  {
    title: "Smart Recommendation",
    description: "Deep analytics reasoning evaluates your cart history and candidates to suggest products tailored uniquely to you.",
    icon: RiSearch2Line,
    color: "bg-secondary/10 text-secondary border-secondary/20",
  },
  {
    title: "Secure Payment checkout",
    description: "100% secure Stripe payment integration with instant digital billing confirmations and invoice records.",
    icon: RiSecurePaymentLine,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    title: "Tailored For You",
    description: "Everything is constructed to make shopping simple, clean, and customized to your specific lifestyle goals.",
    icon: RiUserHeartLine,
    color: "bg-accent/10 text-accent border-accent/20",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-card border-y border-border py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20">
            Platform Benefits
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
            Why Shop with ShopPilot?
          </h2>
          <p className="text-sm text-body font-medium leading-relaxed">
            We combine premium retail quality with next-generation agentic AI features to deliver a superior shopping experience.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-border bg-surface hover:bg-card shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-300 group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${f.color} mb-4 transition-transform group-hover:scale-105`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-heading">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs text-body font-medium leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
