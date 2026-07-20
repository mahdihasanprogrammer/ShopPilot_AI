"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  getCart,
  removeFromCart,
  updateQty,
  getCartTotal,
  getCartCount,
  fetchAndSyncCart,
  CartItem,
} from "@/lib/cart";
import {
  FiShoppingCart,
  FiX,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";

export default function CartDrawer() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncCart = useCallback(() => setCart(getCart(userId)), [userId]);

  useEffect(() => {
    setMounted(true);
    if (userId) {
      fetchAndSyncCart(userId).then(() => syncCart());
    } else {
      syncCart();
    }
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, [userId, syncCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  if (!mounted || isPending) {
    return <div className="h-9 w-9 rounded-xl border border-border bg-card animate-pulse" />;
  }

  if (!user || isAdmin) return null;

  const count = getCartCount(cart);
  const total = getCartTotal(cart);
  const freeShippingThreshold = 75;
  const remaining = freeShippingThreshold - total;

  return (
    <>
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-body hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-sm cursor-pointer"
        aria-label="Open cart"
        id="cart-drawer-trigger"
      >
        <FiShoppingCart className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-sm pointer-events-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* ── Drawer ── */}
      {open && (
        <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute top-0 right-0 flex flex-col bg-card border-l border-border shadow-2xl animate-slide-in-right"
            style={{ width: "min(100vw, 24rem)", height: "100dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <FiShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-heading leading-none">My Cart</h2>
                  {count > 0 && (
                    <p className="text-[10px] text-muted mt-0.5">
                      {count} item{count !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-muted hover:text-heading hover:bg-surface transition-all cursor-pointer"
                aria-label="Close cart"
              >
                <FiX className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {count > 0 && total < freeShippingThreshold && (
              <div className="px-5 py-3 bg-surface border-b border-border shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiZap className="h-3.5 w-3.5 text-accent" style={{ color: "var(--accent)" }} />
                  <span className="text-[11px] font-bold text-body">
                    Add <span style={{ color: "var(--accent)" }}>${remaining.toFixed(2)}</span> more for free shipping!
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%`,
                      background: "var(--secondary)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 bg-surface"
              style={{ minHeight: 0 }}
            >
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div className="h-16 w-16 rounded-2xl bg-border flex items-center justify-center">
                    <FiShoppingCart className="h-7 w-7 text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-body">Your cart is empty</p>
                    <p className="text-xs text-muted mt-1">
                      Browse products and add items to get started
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-border-hover transition-all"
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                        <FiShoppingBag className="h-5 w-5 text-muted" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-heading leading-snug line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm font-extrabold mt-0.5" style={{ color: "var(--secondary)" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted font-medium">
                        ${item.price.toFixed(2)} each
                      </p>

                      {/* Qty + Delete */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateQty(userId, item.productId, item.qty - 1)}
                          className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all bg-card cursor-pointer"
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-heading min-w-[22px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(userId, item.productId, item.qty + 1)}
                          className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all bg-card cursor-pointer"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(userId, item.productId)}
                          className="ml-auto h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border bg-card px-5 py-4 space-y-4 shrink-0">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Subtotal</span>
                  <span className="text-xl font-extrabold text-heading">${total.toFixed(2)}</span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Proceed to Checkout
                  <FiArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center text-xs font-semibold text-muted hover:text-primary transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
