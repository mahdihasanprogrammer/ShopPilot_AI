// Shared canonical category list used across FilterPanel, AddProductForm, and API filters.
// Values must exactly match the stored category field in the products collection.
export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Accessories",
] as const;

export type Category = typeof CATEGORIES[number];

export function getCategoryBadgeStyles(category?: string): string {
  const c = category?.toLowerCase().trim() || "";
  if (c.includes("electronics")) {
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }
  if (c.includes("fashion")) {
    return "bg-pink-50 text-pink-700 border-pink-200";
  }
  if (c.includes("home") || c.includes("kitchen")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (c.includes("beauty")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  if (c.includes("sports")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (c.includes("books")) {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }
  if (c.includes("accessories")) {
    return "bg-teal-50 text-teal-700 border-teal-200";
  }
  return "bg-primary/5 text-primary border-primary/20";
}
