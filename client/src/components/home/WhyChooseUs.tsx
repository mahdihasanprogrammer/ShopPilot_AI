"use client";

import { RiRobot2Line, RiSearch2Line, RiSecurePaymentLine, RiUserHeartLine } from "react-icons/ri";

const FEATURES = [
  {
    title: "AI Shopping Assistant",
    description: "Our conversational assistant runs live Claude intelligence to summarize features, resolve inquiries, and compare items instantly.",
    icon: RiRobot2Line,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Smart Recommendation",
    description: "Deep analytics reasoning evaluates your cart history and candidates to suggest products tailored uniquely to you.",
    icon: RiSearch2Line,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Secure Payment checkout",
    description: "100% secure Stripe payment integration with instant digital billing confirmations and invoice records.",
    icon: RiSecurePaymentLine,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Tailored For You",
    description: "Everything is constructed to make shopping simple, clean, and customized to your specific lifestyle goals.",
    icon: RiUserHeartLine,
    color: "bg-amber-500/10 text-amber-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-bg-secondary/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
          Why Shop with ShopPilot?
        </h2>
        <p className="mt-2 text-sm text-text-neutral/60">
          We combine premium retail quality with next-generation agentic AI features to deliver a superior shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-bg-secondary bg-background shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color} mb-4 transition-transform group-hover:scale-105`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-text-neutral">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-text-neutral/60 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
