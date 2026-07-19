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
