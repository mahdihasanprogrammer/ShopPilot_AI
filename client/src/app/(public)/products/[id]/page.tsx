"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { Product } from "@/types";
import ImageGallery from "@/components/products/details/ImageGallery";
import SpecsTable from "@/components/products/details/SpecsTable";
import ReviewCard from "@/components/products/details/ReviewCard";
import RelatedProducts from "@/components/products/details/RelatedProducts";
import AISummaryCard from "@/components/products/details/AISummaryCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { RiArrowLeftLine, RiShoppingCartLine, RiWallet2Line, RiStarFill, RiChat3Line, RiErrorWarningLine, RiCheckLine } from "react-icons/ri";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProductDetailsPage({
  params,
}: {
  params: React.Usable<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      
      const res = await api.get<Product>(`/products/${id}`);
      
      if (!res.success) {
        setError(res.error || "Failed to load product details.");
        setLoading(false);
        return;
      }
      
      if (res.data) {
        setProduct(res.data);
      } else {
        setError("Product not found.");
      }
      setLoading(false);
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Block guest — redirect to login with callback
    if (!user) {
      toast.error("Please log in to continue.");
      router.push(`/login?callbackUrl=/products/${product.id}`);
      return;
    }

    // Block admin
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Block guest — redirect to login with callback
    if (!user) {
      toast.error("Please log in to continue.");
      router.push(`/login?callbackUrl=/products/${product.id}`);
      return;
    }

    // Block admin
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
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-bg-secondary rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-bg-secondary rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-bg-secondary rounded-lg"></div>
            <div className="h-6 w-1/4 bg-bg-secondary rounded-lg"></div>
            <div className="h-20 w-full bg-bg-secondary rounded-lg"></div>
            <div className="h-12 w-1/3 bg-bg-secondary rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex-1 px-6 py-20 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
          <RiErrorWarningLine className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-text-neutral">Product Not Found</h2>
        <p className="text-sm text-text-neutral/60 max-w-md">
          {error || "The product you are looking for might have been removed or does not exist."}
        </p>
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Explore
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-16">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-text-neutral/60 hover:text-primary transition-colors bg-bg-secondary/40 border border-bg-secondary/50 rounded-xl px-3 py-2"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      {/* Main product display grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Gallery Column */}
        <ImageGallery images={product.images} title={product.title} />

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-accent font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-neutral leading-tight">
              {product.title}
            </h1>
            
            {/* Brand and Stock Availability metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold py-1">
              {product.brand && (
                <div className="flex items-center gap-1">
                  <span className="text-text-neutral/40 uppercase tracking-wider font-bold">Brand:</span>
                  <span className="text-text-neutral">{product.brand}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-text-neutral/40 uppercase tracking-wider font-bold">Availability:</span>
                {product.stock !== undefined && product.stock > 0 ? (
                  <span className="text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[10px]">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-700 font-extrabold bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5 text-[10px]">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Rating & Review counts */}
            <div className="flex items-center gap-4 text-xs font-semibold mt-1">
              <div className="flex items-center gap-1 text-amber-400">
                <RiStarFill className="h-4 w-4" />
                <span className="text-text-neutral">{product.rating?.toFixed(1) || "5.0"}</span>
              </div>
              <div className="flex items-center gap-1 text-text-neutral/40">
                <RiChat3Line className="h-4 w-4" />
                <span>{product.reviews?.length || 0} reviews</span>
              </div>
            </div>
          </div>

          <div className="text-2xl font-extrabold text-text-neutral">
            ${product.price.toFixed(2)}
          </div>

          <div className="border-t border-b border-bg-secondary py-6 space-y-4">
            <h3 className="text-xs font-bold text-text-neutral/40 uppercase tracking-wider">
              Overview
            </h3>
            <p className="text-sm text-text-neutral/70 leading-relaxed font-medium">
              {product.shortDescription}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3.5 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                addedToCart
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-primary/20 hover:border-primary bg-background text-primary hover:bg-primary/5"
              }`}
            >
              {product.stock === 0 ? (
                "Out of Stock"
              ) : addedToCart ? (
                <><RiCheckLine className="h-4.5 w-4.5" />Added to Cart!</>
              ) : (
                <><RiShoppingCartLine className="h-4.5 w-4.5" />Add to Cart</>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RiWallet2Line className="h-4.5 w-4.5" />
              Buy Now
            </button>
          </div>

          {/* AI Summary Highlight */}
          <AISummaryCard title={product.title} category={product.category} />
        </div>
      </div>

      {/* Description & Specifications row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-bg-secondary/40">
        {/* Full description */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-text-neutral">Full Description</h3>
          <p className="text-sm text-text-neutral/70 leading-relaxed font-medium whitespace-pre-line">
            {product.fullDescription || "No full description available for this product."}
          </p>
        </div>

        {/* Specifications table */}
        <div className="lg:col-span-1">
          <SpecsTable category={product.category} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 pt-8 border-t border-bg-secondary/40">
        <h3 className="text-lg font-bold text-text-neutral">Customer Reviews</h3>
        {!product.reviews || product.reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bg-secondary p-8 text-center text-text-neutral/50 text-xs font-semibold">
            No reviews yet. Be the first to buy and leave feedback!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((r, idx) => (
              <ReviewCard key={idx} review={r} />
            ))}
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      <div className="pt-8 border-t border-bg-secondary/40">
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </main>
  );
}
