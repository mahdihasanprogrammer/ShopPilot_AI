"use client";

import Link from "next/link";
import { FiMonitor, FiLayers, FiHome, FiHeart, FiBook, FiSun } from "react-icons/fi";

const CATEGORIES = [
  {
    name: "Electronics",
    description: "Gadgets, mechanical keyboards, headphones, and more",
    icon: FiMonitor,
    color: "from-indigo-500/10 to-primary/10 text-primary border-primary/10",
    slug: "Electronics",
  },
  {
    name: "Fashion",
    description: "Premium outfits, shoes, jackets, and accessories",
    icon: FiLayers,
    color: "from-secondary-light/15 to-secondary/10 text-secondary border-secondary/10",
    slug: "Fashion",
  },
  {
    name: "Home & Kitchen",
    description: "Minimalist lighting, desktop setup items, and comfort",
    icon: FiHome,
    color: "from-accent-light/20 to-accent/10 text-accent border-accent/20",
    slug: "Home & Kitchen",
  },
  {
    name: "Sports",
    description: "Smart bands, sports gear, and wellness equipment",
    icon: FiHeart,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
    slug: "Sports",
  },
  {
    name: "Books",
    description: "Fiction, self-improvement, tech, and productivity",
    icon: FiBook,
    color: "from-violet-500/10 to-purple-500/10 text-purple-600 border-purple-500/20",
    slug: "Books",
  },
  {
    name: "Beauty",
    description: "Skincare, cosmetics, and organic supplements",
    icon: FiSun,
    color: "from-cyan-500/10 to-sky-500/10 text-sky-600 border-sky-500/20",
    slug: "Beauty",
  },
];

export default function Categories() {
  return (
    <section className="w-full bg-card border-y border-border py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
            Catalog Collections
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
            Explore by Category
          </h2>
          <p className="text-sm text-body font-medium leading-relaxed">
            Find what you need instantly from our curated catalog of smart tech and lifestyle items.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                href={`/products?category=${c.slug}`}
                className="group flex flex-col p-6 rounded-2xl border border-border bg-surface hover:bg-card shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} border mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-heading group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-xs text-body font-medium leading-relaxed">
                  {c.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
