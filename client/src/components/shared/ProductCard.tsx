"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { addToCart } from "@/lib/cart";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";
import { MdStar } from "react-icons/md";
import { FiEye, FiCheck } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id || String((product as any)._id),
      title: product.title,
      price: product.price,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const productId = product.id || String((product as any)._id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Product Image */}
      <Link href={`/products/${productId}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-black/[0.02]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-neutral/20">
              <HiOutlinePhotograph className="h-10 w-10" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4">
        <Link href={`/products/${productId}`}>
          <h3 className="text-sm font-bold text-text-neutral hover:text-primary transition-colors line-clamp-1 leading-snug">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 text-[11px] text-text-neutral/50 line-clamp-2 font-medium leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <MdStar className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-text-neutral/60">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Action row: Price | Details icon | Add to Cart */}
        <div className="mt-3.5 flex items-center gap-2">
          <span className="flex-1 text-base font-extrabold text-text-neutral">
            ${product.price.toFixed(2)}
          </span>

          {/* Details icon button — always visible */}
          <Link
            href={`/products/${productId}`}
            title="View Details"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/[0.06] text-text-neutral/50 hover:text-primary hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-200 shrink-0"
          >
            <FiEye className="h-4 w-4" />
          </Link>

          {/* Add to Cart — hidden for admins, shown as button for users */}
          {/* Only show after mount to avoid hydration mismatch */}
          {mounted && !isAdmin && (
            <button
              onClick={handleAddToCart}
              title={added ? "Added!" : "Add to Cart"}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 shrink-0 ${
                added
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-primary/[0.07] text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {added ? (
                <><FiCheck className="h-3.5 w-3.5" />Added</>
              ) : (
                <><BsCartPlus className="h-3.5 w-3.5" />Add</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
