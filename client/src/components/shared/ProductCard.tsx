"use client";

import { useState } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin) return;
    addToCart({
      productId: product.id || String((product as any)._id),
      title: product.title,
      price: product.price,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Product Image */}
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
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent shadow-sm">
          {product.category}
        </span>

        {/* Details icon button — always visible on hover */}
        <button
          onClick={handleDetails}
          title="View Details"
          className="absolute top-2.5 right-2.5 h-8 w-8 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm text-text-neutral/60 hover:text-primary hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <FiEye className="h-4 w-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-text-neutral group-hover:text-primary transition-colors line-clamp-1 leading-snug">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>
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

        <div className="mt-3.5 flex items-center justify-between gap-2">
          <span className="text-base font-extrabold text-text-neutral">
            ${product.price.toFixed(2)}
          </span>

          {/* Add to cart — hidden for admins */}
          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              title={added ? "Added!" : "Add to Cart"}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                added
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-primary/[0.07] text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {added ? (
                <>
                  <FiCheck className="h-3.5 w-3.5" />
                  Added
                </>
              ) : (
                <>
                  <BsCartPlus className="h-3.5 w-3.5" />
                  Add
                </>
              )}
            </button>
          )}

          {/* Admins see a details link instead */}
          {isAdmin && (
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold bg-black/[0.03] text-text-neutral/60 hover:text-primary transition-all"
            >
              <FiEye className="h-3.5 w-3.5" />
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
