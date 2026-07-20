"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import ProductCard from "../shared/ProductCard";
import SkeletonLoader from "../shared/SkeletonLoader";
import { api } from "@/lib/api";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Keychron K2 Mechanical Keyboard",
    shortDescription: "Compact 84-key mechanical keyboard with tactile blue switches and RGB backlight.",
    fullDescription: "Detailed description of the keyboard.",
    price: 79.99,
    category: "electronics",
    images: [],
    rating: 4.8,
  },
  {
    id: "p2",
    title: "Anker Soundcore Sport X10",
    shortDescription: "Wireless sports earbuds with rotatable ear hooks, deep bass, and IPX7 waterproofing.",
    fullDescription: "Detailed description of earbuds.",
    price: 69.99,
    category: "fitness",
    images: [],
    rating: 4.6,
  },
  {
    id: "p3",
    title: "Minimalist Wooden Desk Lamp",
    shortDescription: "Clean warm-light LED lamp featuring stepless brightness dimmer and USB charging.",
    fullDescription: "Detailed description of desk lamp.",
    price: 29.99,
    category: "home-decor",
    images: [],
    rating: 4.5,
  },
  {
    id: "p4",
    title: "Ultra-Light Carbon Running Shoes",
    shortDescription: "Performance running shoes equipped with responsive carbon fiber plate cushioning.",
    fullDescription: "Detailed description of shoes.",
    price: 129.99,
    category: "fashion",
    images: [],
    rating: 4.7,
  },
  {
    id: "p5",
    title: "Ergonomic Memory Foam Cushion",
    shortDescription: "Premium orthopedic seat cushion offering ultimate posture comfort and lumbar support.",
    fullDescription: "Detailed description of cushion.",
    price: 34.99,
    category: "home-decor",
    images: [],
    rating: 4.4,
  },
  {
    id: "p6",
    title: "Premium Matte Leather Backpack",
    shortDescription: "Water-resistant commuter pack with dedicated 16-inch padded laptop compartment.",
    fullDescription: "Detailed description of backpack.",
    price: 89.99,
    category: "fashion",
    images: [],
    rating: 4.8,
  },
  {
    id: "p7",
    title: "4K High-Res UltraWide Monitor",
    shortDescription: "IPS display featuring 99% sRGB color accuracy, perfect for multitasking.",
    fullDescription: "Detailed description of monitor.",
    price: 349.99,
    category: "electronics",
    images: [],
    rating: 4.9,
  },
  {
    id: "p8",
    title: "Double-Wall Insulated Flask",
    shortDescription: "Stainless steel vacuum-sealed water flask keeping beverages cold up to 24 hours.",
    fullDescription: "Detailed description of flask.",
    price: 24.99,
    category: "fitness",
    images: [],
    rating: 4.6,
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      setLoading(true);
      const res = await api.get<{ products: Product[] }>("/products?limit=8");
      if (res.success && res.data && res.data.products?.length > 0) {
        setProducts(res.data.products);
      } else {
        // Fallback to mock data if catalog is empty or fetch fails
        setProducts(MOCK_PRODUCTS);
      }
      setLoading(false);
    }
    loadFeatured();
  }, []);

  return (
    <section className="px-6 py-16 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-bg-secondary/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
          Featured Products
        </h2>
        <p className="mt-2 text-sm text-text-neutral/60">
          Discover our top recommendation candidates selected by the AI recommendation engine this week.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {products.map((p, idx) => (
            <ProductCard key={p.id || (p as any)._id || idx} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
