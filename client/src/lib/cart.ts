// ---- Cart Utility (Database-backed & isolated per user) ----
import { api } from "@/lib/api";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
}

const getCartKey = (userId?: string) => {
  return userId ? `shoppilot_cart_${userId}` : "shoppilot_cart_guest";
};

// Retrieve cart from localStorage (synchronous fallback/cache)
export function getCart(userId?: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getCartKey(userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persist cart to DB if logged in, and localStorage
async function syncCartToDb(userId: string | undefined, items: CartItem[]): Promise<void> {
  if (typeof window === "undefined" || !userId) return;
  try {
    await api.post("/cart", { items });
  } catch (err) {
    console.error("Failed to sync cart to database:", err);
  }
}

// Fetch cart from DB and populate localStorage (called on mount/login)
export async function fetchAndSyncCart(userId: string | undefined): Promise<CartItem[]> {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const res = await api.get<{ items: CartItem[] }>("/cart");
    if (res.success && res.data?.items) {
      const key = getCartKey(userId);
      localStorage.setItem(key, JSON.stringify(res.data.items));
      window.dispatchEvent(new Event("cart-updated"));
      return res.data.items;
    }
  } catch (err) {
    console.error("Failed to fetch cart from database:", err);
  }
  return getCart(userId);
}

export function addToCart(userId: string | undefined, item: Omit<CartItem, "qty"> & { qty?: number }): void {
  if (typeof window === "undefined") return;
  const cart = getCart(userId);
  const existing = cart.findIndex((c) => c.productId === item.productId);
  if (existing >= 0) {
    cart[existing].qty += item.qty ?? 1;
  } else {
    cart.push({ ...item, qty: item.qty ?? 1 });
  }
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));

  // Sync to database
  if (userId) {
    syncCartToDb(userId, cart);
  }
}

export function removeFromCart(userId: string | undefined, productId: string): void {
  if (typeof window === "undefined") return;
  const cart = getCart(userId).filter((c) => c.productId !== productId);
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));

  // Sync to database
  if (userId) {
    syncCartToDb(userId, cart);
  }
}

export function updateQty(userId: string | undefined, productId: string, qty: number): void {
  if (typeof window === "undefined") return;
  if (qty <= 0) { removeFromCart(userId, productId); return; }
  const cart = getCart(userId).map((c) =>
    c.productId === productId ? { ...c, qty } : c
  );
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));

  // Sync to database
  if (userId) {
    syncCartToDb(userId, cart);
  }
}

export function clearCart(userId?: string): void {
  if (typeof window === "undefined") return;
  const key = getCartKey(userId);
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("cart-updated"));

  // Sync to database
  if (userId) {
    syncCartToDb(userId, []);
  }
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
