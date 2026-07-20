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
    <section className="w-full bg-card border-y border-border py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent border border-accent/20">
            User Testimonials
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="text-sm text-body font-medium leading-relaxed">
            Hear from our shoppers who discovered the perfect products through our conversational shopping guide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-border bg-surface hover:bg-card shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-300 relative group flex flex-col justify-between"
            >
              <RiDoubleQuotesR className="absolute top-6 right-6 h-8 w-8 text-primary/5 transition-transform group-hover:scale-105" />
              
              <div>
                {/* Rating stars */}
                <div className="flex gap-0.5 mb-4 text-accent">
                  {[...Array(t.rating)].map((_, i) => (
                    <RiStarFill key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-xs text-body italic leading-relaxed font-medium">
                  "{t.comment}"
                </p>
              </div>

              {/* Profile info */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-heading">{t.name}</h4>
                  <p className="text-[10px] text-body/50 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
