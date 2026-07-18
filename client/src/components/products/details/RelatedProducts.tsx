"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/shared/ProductCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      const res = await api.get<{ products: Product[] }>(
        `/products?category=${encodeURIComponent(category)}&limit=5`
      );
      if (res.success && res.data) {
        // Exclude current product, and show max 4
        const filtered = res.data.products
          .filter((p) => p.id !== currentProductId)
          .slice(0, 4);
        setProducts(filtered);
      }
      setLoading(false);
    }
    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-text-neutral">Related Products</h3>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
