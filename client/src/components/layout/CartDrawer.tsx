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

  // Lock body scroll when drawer is open — compensate for scrollbar width to avoid layout shift
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

  // Don't render until client-side hydration is complete
  if (!mounted || isPending) {
    return <div className="h-9 w-9 rounded-xl border border-border bg-card/40 animate-pulse" />;
  }

  // Cart icon is ONLY shown to logged-in non-admin users
  if (!user || isAdmin) return null;

  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  return (
    <>
      {/* ── Cart Trigger Button ── */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-body hover:text-primary hover:border-primary/20 hover:bg-primary/10 transition-all duration-200 cursor-pointer shadow-xs"
        aria-label="Open cart"
        id="cart-drawer-trigger"
      >
        <FiShoppingCart className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-sm pointer-events-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* ── Portal-style overlay + drawer (rendered only when open) ── */}
      {open && (
        <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
          {/* Backdrop — click to close */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel — right side, full height, flex column */}
          <div
            className="absolute top-0 right-0 flex flex-col bg-card border-l border-border shadow-2xl transition-colors duration-250"
            style={{
              width: "min(100vw, 24rem)",
              height: "100dvh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed height, never scrolls */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card shrink-0">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="h-4.5 w-4.5 text-primary" />
                <h2 className="text-sm font-extrabold text-heading">
                  My Cart
                  {count > 0 && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                      {count} item{count !== 1 ? "s" : ""}
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-muted hover:text-heading hover:bg-bg-secondary transition-all cursor-pointer"
                aria-label="Close cart"
              >
                <FiX className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable items area — takes all remaining space */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 bg-background"
              style={{ minHeight: 0 }}
            >
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div className="h-16 w-16 rounded-2xl bg-bg-secondary flex items-center justify-center border border-border">
                    <FiShoppingCart className="h-7 w-7 text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading/70">Your cart is empty</p>
                    <p className="text-xs text-muted mt-1 font-medium">
                      Browse products and add items to get started
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer shadow-sm"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 rounded-xl object-cover border border-border shrink-0 bg-bg-secondary"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-bg-secondary flex items-center justify-center shrink-0 border border-border">
                        <FiShoppingBag className="h-5 w-5 text-muted" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-heading leading-snug line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm font-extrabold text-primary mt-0.5">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted font-medium">
                        ${item.price.toFixed(2)} each
                      </p>

                      {/* Qty controls + delete */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateQty(userId, item.productId, item.qty - 1)}
                          className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary/30 transition-all bg-card cursor-pointer"
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-heading min-w-[22px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(userId, item.productId, item.qty + 1)}
                          className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary/30 transition-all bg-card cursor-pointer"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(userId, item.productId)}
                          className="ml-auto h-6 w-6 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer — fixed at bottom, never scrolls */}
            {cart.length > 0 && (
              <div className="border-t border-border bg-card px-5 py-4 space-y-3 shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Total</p>
                    <p className="text-xl font-extrabold text-heading">${total.toFixed(2)}</p>
                  </div>
                  {total < 75 && (
                    <p className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1 text-right">
                      ${(75 - total).toFixed(2)} to<br />free shipping!
                    </p>
                  )}
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Proceed to Checkout
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
