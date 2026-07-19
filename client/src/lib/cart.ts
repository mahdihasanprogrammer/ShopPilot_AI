// ---- Cart Utility (localStorage-backed) ----

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
}

const CART_KEY = "shoppilot_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }): void {
  if (typeof window === "undefined") return;
  const cart = getCart();
  const existing = cart.findIndex((c) => c.productId === item.productId);
  if (existing >= 0) {
    cart[existing].qty += item.qty ?? 1;
  } else {
    cart.push({ ...item, qty: item.qty ?? 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(productId: string): void {
  if (typeof window === "undefined") return;
  const cart = getCart().filter((c) => c.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateQty(productId: string, qty: number): void {
  if (typeof window === "undefined") return;
  if (qty <= 0) { removeFromCart(productId); return; }
  const cart = getCart().map((c) =>
    c.productId === productId ? { ...c, qty } : c
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
