// ---- Cart Utility (localStorage-backed, isolated per user) ----

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
}

export function removeFromCart(userId: string | undefined, productId: string): void {
  if (typeof window === "undefined") return;
  const cart = getCart(userId).filter((c) => c.productId !== productId);
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
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
}

export function clearCart(userId?: string): void {
  if (typeof window === "undefined") return;
  const key = getCartKey(userId);
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
