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
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const syncCart = useCallback(() => setCart(getCart()), []);

  useEffect(() => {
    syncCart();
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, [syncCart]);

  // Don't show cart icon at all for admins
  if (isAdmin) return null;

  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white/60 text-text-neutral/70 hover:text-primary hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-200"
        aria-label="Open cart"
      >
        <FiShoppingCart className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-sm">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col bg-white/90 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.04] px-5 py-4">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-extrabold text-text-neutral">
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
            className="rounded-xl p-2 text-text-neutral/50 hover:text-text-neutral hover:bg-black/[0.03] transition-all"
          >
            <FiX className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-black/[0.03] flex items-center justify-center">
                <FiShoppingCart className="h-7 w-7 text-text-neutral/20" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-neutral/50">Your cart is empty</p>
                <p className="text-xs text-text-neutral/40 mt-1 font-medium">
                  Browse products and add items to get started
                </p>
              </div>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-3 rounded-2xl border border-black/[0.04] bg-white/60 p-3 transition-all hover:border-black/[0.08]"
              >
                {/* Image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-14 w-14 rounded-xl object-cover border border-black/[0.04] shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-black/[0.03] flex items-center justify-center shrink-0">
                    <FiShoppingBag className="h-5 w-5 text-text-neutral/20" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-neutral line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-extrabold text-primary mt-0.5">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="h-6 w-6 rounded-lg border border-black/[0.06] flex items-center justify-center text-text-neutral/60 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-text-neutral min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="h-6 w-6 rounded-lg border border-black/[0.06] flex items-center justify-center text-text-neutral/60 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <FiPlus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-auto h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
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
          <div className="border-t border-black/[0.04] px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text-neutral/60">Total</span>
              <span className="text-base font-extrabold text-text-neutral">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
