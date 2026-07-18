import { Product } from "@/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-bg-secondary bg-background shadow-sm hover:shadow-md transition-all">
      {/* Product Image placeholder */}
      <div className="relative aspect-square w-full overflow-hidden bg-bg-secondary">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-neutral/40">
            No Image
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="p-4">
        <span className="text-xs text-accent font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="mt-1 text-sm font-semibold text-text-neutral group-hover:text-primary transition-colors line-clamp-1">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-text-neutral/60 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-text-neutral">
            ${product.price.toFixed(2)}
          </span>
          <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
