import { Product } from "@/types";
import Link from "next/link";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";
import { MdStar } from "react-icons/md";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-bg-secondary bg-background shadow-sm hover:shadow-md transition-all">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-bg-secondary">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-neutral/30">
            <HiOutlinePhotograph className="h-10 w-10" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-2 left-2 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
          {product.category}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="mt-0.5 text-sm font-semibold text-text-neutral group-hover:text-primary transition-colors line-clamp-1">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-text-neutral/60 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-text-neutral">
            ${product.price.toFixed(2)}
          </span>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all">
            <BsCartPlus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
