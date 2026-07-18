"use client";

import { RiDoubleQuotesR, RiStarFill } from "react-icons/ri";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Tech Enthusiast",
    comment: "The AI Shopping Assistant is amazing. I asked it to suggest a compact mechanical keyboard, and it recommended the Keychron K2, explaining exactly why. Bought it instantly!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    rating: 5,
  },
  {
    name: "Sophia Martinez",
    role: "Fitness Instructor",
    comment: "I was looking for durable workout earbuds. The recommendation engine suggested the Soundcore Sport X10 with rotatable hooks. They fit perfectly and never drop during running.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    rating: 5,
  },
  {
    name: "Daniel Chen",
    role: "Minimalist Designer",
    comment: "Great experience. The site design is super clean, fast, and the AI summary cards on product pages save so much time. I didn't have to read through hundreds of reviews.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-bg-secondary/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
          What Our Users Say
        </h2>
        <p className="mt-2 text-sm text-text-neutral/60">
          Hear from our shoppers who discovered the perfect products through our conversational shopping guide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="p-6 rounded-2xl border border-bg-secondary bg-background shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <RiDoubleQuotesR className="absolute top-6 right-6 h-8 w-8 text-primary/5 transition-transform group-hover:scale-105" />
            
            <div>
              {/* Rating stars */}
              <div className="flex gap-0.5 mb-4 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <RiStarFill key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-xs text-text-neutral/70 italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>

            {/* Profile info */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-bg-secondary/50">
              <img
                src={t.avatar}
                alt={t.name}
                className="h-10 w-10 rounded-full object-cover border border-primary/20"
              />
              <div>
                <h4 className="text-xs font-bold text-text-neutral">{t.name}</h4>
                <p className="text-[10px] text-text-neutral/50">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
