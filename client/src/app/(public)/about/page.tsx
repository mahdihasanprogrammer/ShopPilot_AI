"use client";

import Link from "next/link";
import { RiRobot2Line, RiSparklingLine, RiShieldUserLine, RiCustomerService2Line } from "react-icons/ri";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function AboutPage() {
  const values = [
    {
      icon: RiSparklingLine,
      title: "Smart Curation",
      desc: "We don't believe in endless catalog scrolling. ShopPilot AI curates premium candidates specific to your interests.",
    },
    {
      icon: RiShieldUserLine,
      title: "Security & Trust",
      desc: "With verified Better Auth integrations and secure Stripe elements, your buying flow is protected at every endpoint.",
    },
    {
      icon: RiCustomerService2Line,
      title: "Customer Centric",
      desc: "Our agentic conversational assistant operates in real-time to solve queries, outline stock status, and facilitate cart orders.",
    },
  ];

  const features = [
    "Gemini 3.5 Flash powered recommendation engine",
    "Real-time streamable site-wide shopping widget",
    "Automated product detail context parsing",
    "Persistent database carts matching your profile",
    "Stripe integration with instant stock updates",
    "Modern adaptive light & dark mode design",
  ];

  return (
    <main className="flex-1 bg-background py-12 md:py-20 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">

        {/* ── Hero / Heading Section ── */}
        <section className="text-center max-w-3xl mx-auto space-y-6 animate-premium-fade">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
            <RiRobot2Line className="h-3.5 w-3.5" />
            Our Story
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-heading leading-tight">
            Redefining E-Commerce with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Agentic AI</span>
          </h1>
          <p className="text-sm md:text-base text-body/80 leading-relaxed font-medium">
            ShopPilot AI is a next-generation shopping platform built to bridge the gap between large product catalogs and smart, personalized curation. By placing agentic intelligence at the core of the experience, we make shopping interactive, straightforward, and secure.
          </p>
        </section>

        {/* ── Split Section: Platform and AI ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-heading tracking-tight">
              The ShopPilot Experience
            </h2>
            <p className="text-xs md:text-sm text-body/80 leading-relaxed font-medium">
              We started with a simple question: *Why should online shopping feel like searching a spreadsheet?* Typical online stores flood you with filters, unrelated banners, and endless scroll lists.
            </p>
            <p className="text-xs md:text-sm text-body/80 leading-relaxed font-medium">
              ShopPilot does the heavy lifting for you. Our server retrieves your past order history, current cart list, and custom refinement queries, sending them to **Gemini 3.5 Flash** to reason and handpick recommendations with actual written explanations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-bold text-heading/80">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <FiCheck className="h-3 w-3" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 transition-colors duration-250">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <RiRobot2Line className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-heading leading-none">ShopPilot AI Assistant</h3>
                  <span className="text-[9px] font-bold text-emerald-500 mt-0.5 block">Streaming Active</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                Agent
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black">
                  AI
                </div>
                <p className="rounded-2xl rounded-tl-none bg-surface border border-border px-3 py-2.5 text-xs text-body leading-relaxed font-medium italic">
                  &ldquo;I notice you purchased a wireless mechanical keyboard last month. To complete your desktop cleanup, I recommend the high-precision gaming mouse below which is currently in stock.&rdquo;
                </p>
              </div>

              <div className="flex items-start gap-2.5 flex-row-reverse">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white text-[10px] font-black">
                  U
                </div>
                <p className="rounded-2xl rounded-tr-none bg-primary border-transparent px-3 py-2 text-xs text-white leading-relaxed font-medium">
                  Show similar options under $60
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-primary">
              <span className="flex items-center gap-1">
                <RiSparklingLine className="h-4 w-4" /> Context Recognition
              </span>
              <span className="text-muted">Injected Automatically</span>
            </div>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl font-extrabold text-heading tracking-tight">Our Core Values</h2>
            <p className="text-xs md:text-sm text-body/80 font-medium leading-relaxed">
              We guide our product layout and AI decision boundaries by a set of strict guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-heading">{val.title}</h3>
                  <p className="text-xs text-body/80 leading-relaxed font-medium">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Call To Action ── */}
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-center text-white space-y-6 shadow-xl shadow-primary/10">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">Ready to start shopping?</h2>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
              Explore our diverse collections and start chatting with our conversational shopping assistant to curate your ideal cart.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-primary hover:bg-white/90 transition-all shadow-sm cursor-pointer"
            >
              Browse Catalog
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
