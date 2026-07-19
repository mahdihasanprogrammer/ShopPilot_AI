"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useSession } from "@/lib/auth-client";
import { RiRobot2Line, RiSparklingLine, RiSearchEyeLine } from "react-icons/ri";
import { FiEye, FiArrowRight, FiLoader, FiAlertCircle } from "react-icons/fi";
import { BsCartPlus } from "react-icons/bs";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

interface RecommendedProduct extends Product {
  reasoning?: string;
}

export default function RecommendationsSection() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refinement, setRefinement] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const fetchRecommendations = async (queryText = "") => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<RecommendedProduct[]>("/ai/recommendations", {
        prompt: queryText,
      });
      if (res.success && res.data) {
        setRecommendations(res.data);
      } else {
        setError(res.error || "Failed to retrieve recommendations.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const handleRefine = (e: FormEvent) => {
    e.preventDefault();
    if (!refinement.trim()) return;
    setActiveQuery(refinement);
    fetchRecommendations(refinement);
  };

  const handleClearRefinement = () => {
    setRefinement("");
    setActiveQuery("");
    fetchRecommendations("");
  };

  // If user is guest, show a premium teaser promo block instead of completely hiding
  if (!user) {
    return (
      <section className="rounded-3xl border border-black/[0.05] bg-gradient-to-br from-primary/[0.03] via-background to-accent/[0.03] p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto my-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <RiRobot2Line className="h-7 w-7" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-extrabold text-text-neutral tracking-tight">
            Personalized AI Recommendations
          </h2>
          <p className="text-sm text-text-neutral/60 leading-relaxed font-medium">
            Log in to unlock our advanced agentic recommendation engine. ShopPilot AI analyzes your order history and shopping cart to curate custom selections.
          </p>
        </div>
        <div>
          <Link
            href="/login?callbackUrl=/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
          >
            Sign In to Unlock
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  // Admins are not buyer roles, so hide recommendation engine
  if (isAdmin) return null;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <RiRobot2Line className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-neutral tracking-tight flex items-center gap-1.5">
              ShopPilot Recommendation Engine
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                <RiSparklingLine className="h-3 w-3" /> Agentic AI
              </span>
            </h2>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              Personalized candidate products selected by Claude based on your past orders and cart items.
            </p>
          </div>
        </div>

        {/* Refinement input */}
        <form onSubmit={handleRefine} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={refinement}
              onChange={(e) => setRefinement(e.target.value)}
              placeholder="Refine (e.g., 'Under $50', 'only tech')"
              className="w-full rounded-xl border border-black/[0.06] bg-white px-3.5 py-2 text-xs font-semibold text-text-neutral placeholder:text-text-neutral/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {activeQuery && (
              <button
                type="button"
                onClick={handleClearRefinement}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-neutral/40 hover:text-red-500 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !refinement.trim()}
            className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shrink-0"
          >
            {loading ? <FiLoader className="h-3.5 w-3.5 animate-spin" /> : <RiSearchEyeLine className="h-3.5 w-3.5" />}
            Refine
          </button>
        </form>
      </div>

      {/* Query notification badge */}
      {activeQuery && (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 border border-primary/10 px-3 py-1.5 text-xs text-primary font-semibold">
          <span>Refined filtering by: <strong>&ldquo;{activeQuery}&rdquo;</strong></span>
        </div>
      )}

      {/* Skeletons Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse border border-black/[0.05] rounded-2xl p-5 bg-white space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-8 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error state */
        <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50/50 p-5 text-sm font-medium text-red-600">
          <FiAlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : recommendations.length === 0 ? (
        /* Empty state */
        <div className="text-center py-12 border border-dashed border-black/[0.06] rounded-2xl bg-white space-y-2">
          <p className="text-sm font-bold text-text-neutral/50">No recommendations found</p>
          <p className="text-xs text-text-neutral/40">Try resetting filters or expanding your active profile list.</p>
        </div>
      ) : (
        /* Recommendation Grid cards rendering */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((prod) => {
            const prodId = prod.id || String((prod as any)._id);
            return (
              <div
                key={prodId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Image display */}
                  <div className="relative aspect-video w-full bg-black/[0.02] overflow-hidden">
                    {prod.images?.[0] ? (
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-neutral/20 bg-gray-50">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent shadow-sm border border-black/[0.04]">
                      {prod.category}
                    </span>
                  </div>

                  {/* Card Content info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-text-neutral/40 leading-none">
                      {prod.brand || "Catalog"}
                    </h3>
                    <h4 className="text-sm font-bold text-text-neutral group-hover:text-primary transition-colors leading-snug line-clamp-1">
                      {prod.title}
                    </h4>
                    <p className="text-xs font-semibold text-text-neutral">${prod.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Reasoning segment block (stands out, premium styling) */}
                <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                  {prod.reasoning && (
                    <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-3 mb-4 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
                        <RiSparklingLine className="h-3 w-3 animate-pulse" /> AI Reasoning
                      </p>
                      <p className="text-[11px] font-medium text-text-neutral/70 leading-relaxed italic">
                        &ldquo;{prod.reasoning}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Card Action footer buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    <Link
                      href={`/products/${prodId}`}
                      className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] text-xs font-bold text-text-neutral/70 hover:text-primary hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer"
                    >
                      <FiEye className="h-3.5 w-3.5" />
                      Details
                    </Link>

                    <button
                      onClick={() => {
                        addToCart(userId, {
                          productId: prodId,
                          title: prod.title,
                          price: prod.price,
                          image: prod.images?.[0],
                        });
                        toast.success(`"${prod.title}" added to cart!`);
                      }}
                      disabled={prod.stock === 0}
                      className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <BsCartPlus className="h-3.5 w-3.5" />
                      {prod.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
