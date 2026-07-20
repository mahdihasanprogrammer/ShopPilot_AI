"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { addToCart } from "@/lib/cart";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";
import { MdStar } from "react-icons/md";
import { FiEye, FiCheck } from "react-icons/fi";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return;
    }

    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }

    addToCart(userId, {
      productId: product.id || String((product as any)._id),
      title: product.title,
      price: product.price,
      image: product.images?.[0],
    });

    toast.success(`"${product.title}" added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const productId = product.id || String((product as any)._id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-border-hover hover:-translate-y-0.5 transition-all duration-300">
      
      {/* Product Image */}
      <Link href={`/products/${productId}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-surface">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
              <HiOutlinePhotograph className="h-10 w-10" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}

          {/* Category badge — accent orange */}
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 border border-border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm"
            style={{ color: "var(--accent)" }}>
            {product.category}
          </span>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div>
          <Link href={`/products/${productId}`}>
            <h3 className="text-sm font-bold text-heading hover:text-primary transition-colors line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Rating — accent orange */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <MdStar className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-bold text-body">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted">/5</span>
          </div>
        )}

        {/* Price + actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          {/* Price — secondary teal = success/price color */}
          <div className="flex-1 min-w-0">
            <span className="text-base font-extrabold" style={{ color: "var(--secondary)" }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* View details */}
          <Link
            href={`/products/${productId}`}
            title="View Details"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 shrink-0"
          >
            <FiEye className="h-4 w-4" />
          </Link>

          {/* Add to cart */}
          {mounted && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              title={product.stock === 0 ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                product.stock === 0
                  ? "bg-surface border-border text-muted"
                  : added
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-primary/8 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary"
              }`}
            >
              {product.stock === 0 ? (
                "N/A"
              ) : added ? (
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
