"use client";

import Link from "next/link";
import { FiMonitor, FiLayers, FiHome, FiHeart, FiBook, FiSun } from "react-icons/fi";

const CATEGORIES = [
  {
    name: "Electronics",
    description: "Gadgets, mechanical keyboards, headphones, and more",
    icon: FiMonitor,
    color: "from-blue-500/10 to-indigo-500/10 text-indigo-600",
    slug: "electronics",
  },
  {
    name: "Fashion",
    description: "Premium outfits, shoes, jackets, and accessories",
    icon: FiLayers,
    color: "from-pink-500/10 to-rose-500/10 text-rose-600",
    slug: "fashion",
  },
  {
    name: "Home Decor",
    description: "Minimalist lighting, desktop setup items, and comfort",
    icon: FiHome,
    color: "from-amber-500/10 to-orange-500/10 text-orange-600",
    slug: "home-decor",
  },
  {
    name: "Fitness",
    description: "Smart bands, sports gear, and wellness equipment",
    icon: FiHeart,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    slug: "fitness",
  },
  {
    name: "Books",
    description: "Fiction, self-improvement, tech, and productivity",
    icon: FiBook,
    color: "from-violet-500/10 to-purple-500/10 text-purple-600",
    slug: "books",
  },
  {
    name: "Beauty & Health",
    description: "Skincare, cosmetics, and organic supplements",
    icon: FiSun,
    color: "from-cyan-500/10 to-sky-500/10 text-sky-600",
    slug: "beauty",
  },
];

export default function Categories() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-bg-secondary/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
          Explore by Category
        </h2>
        <p className="mt-2 text-sm text-text-neutral/60">
          Find what you need instantly from our curated catalog of smart tech and lifestyle items.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.name}
              href={`/products?category=${c.slug}`}
              className="group flex flex-col p-6 rounded-2xl border border-bg-secondary bg-background shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-text-neutral group-hover:text-primary transition-colors">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-text-neutral/50 leading-relaxed">
                {c.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
