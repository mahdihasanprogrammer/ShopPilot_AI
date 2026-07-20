"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import {
  FiEye,
  FiTrash2,
  FiEdit2,
  FiLoader,
  FiAlertTriangle,
  FiX,
  FiPackage,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiStar,
  FiCheckCircle,
  FiFilter,
} from "react-icons/fi";
import { toast } from "sonner";
import { getCategoryBadgeStyles } from "@/lib/categories";

// ---- Helpers ----

/** MongoDB returns `_id`; normalise to `id` so the UI always has `p.id` */
function normaliseProduct(raw: any): Product {
  return {
    ...raw,
    id: raw.id ?? (raw._id ? String(raw._id) : ""),
  };
}

// ---- Types ----
interface ProductManageTableProps {
  isAdmin: boolean;
  /** Pass the current user's id so non-admin rows can be client-side filtered */
  userId?: string;
}

// ---- Delete Confirmation Modal ----
interface DeleteModalProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteModal({ product, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isDeleting, onCancel]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-focus cancel button
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl space-y-6 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-body/40 hover:text-heading hover:bg-surface transition-all disabled:opacity-40"
          aria-label="Close dialog"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Warning icon + title */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-3 rounded-2xl bg-red-50 border border-red-100">
            <FiAlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2
              id="delete-modal-title"
              className="text-base font-extrabold text-text-neutral"
            >
              Delete Product
            </h2>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
              <FiPackage className="h-5 w-5 text-body/30" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-neutral truncate">{product.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryBadgeStyles(product.category)}`}>
                {product.category}
              </span>
              <span className="text-[10px] text-text-neutral/40 font-bold">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" /> Deleting&hellip;
              </>
            ) : (
              <>
                <FiTrash2 className="h-4 w-4" /> Yes, Delete
              </>
            )}
          </button>
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-heading hover:bg-background transition-all disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Skeleton Row ----
function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-36 rounded-full" />
            <div className="skeleton h-2.5 w-24 rounded-full" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-3.5 w-16 rounded-lg" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-3.5 w-12 rounded-lg" />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="skeleton h-8 w-24 rounded-lg ml-auto" />
      </td>
    </tr>
  );
}

// ---- Constants ----
const PAGE_SIZE = 10;

// ---- Main Component ----
export default function ProductManageTable({ isAdmin, userId }: ProductManageTableProps) {
  const router = useRouter();

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---- Fetch products ----
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: "200" });

    const res = await api.get<{ products: any[] }>(`/products?${params.toString()}`);

    if (res.success && res.data) {
      let raw = res.data.products.map(normaliseProduct);

      // Non-admin: client-side filter to own products
      if (!isAdmin && userId) {
        raw = raw.filter((p) => p.ownerId === userId);
      }

      setProducts(raw);
    } else {
      setError(res.error || "Failed to load products.");
    }
    setLoading(false);
  }, [isAdmin, userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ---- Client-side search filter ----
  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.shortDescription?.toLowerCase().includes(q) ?? false)
    );
  });

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePageNum = Math.min(page, totalPages);
  const paginated = filtered.slice((safePageNum - 1) * PAGE_SIZE, safePageNum * PAGE_SIZE);

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // ---- Delete handler ----
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await api.delete(`/products/${deleteTarget.id}`);
    setIsDeleting(false);
    setDeleteTarget(null);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" deleted successfully.`);
    } else {
      toast.error(res.error || "Failed to delete product.");
    }
  };

  // ---- Render ----
  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Toolbar: search + refresh */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-body/40" />
          <input
            id="product-manage-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category…"
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-heading placeholder:text-body/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-body/30 hover:text-heading transition-colors"
              aria-label="Clear search"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Count + Refresh */}
        <div className="flex items-center gap-3">
          {!loading && !error && (
            <span className="text-xs text-body/60 font-medium hidden sm:block">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {search ? ` for "${search}"` : ""}
            </span>
          )}
          <button
            onClick={fetchProducts}
            disabled={loading}
            title="Refresh products"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-bold text-body hover:text-primary hover:border-border-hover transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {loading ? (
          /* Skeleton */
          <table className="w-full text-xs text-left">
            <TableHead isAdmin={isAdmin} />
            <tbody>
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <FiAlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-500">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-1 flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
            >
              <FiRefreshCw className="h-3.5 w-3.5" /> Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <EmptyState
            search={search}
            onClearSearch={() => setSearch("")}
            onAddProduct={() => router.push("/dashboard/admin/add-product")}
          />
        ) : (
          /* Data table */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <TableHead isAdmin={isAdmin} />
              <tbody>
                {paginated.map((p, idx) => (
                  <ProductRow
                    key={p.id || (p as any)._id || idx}
                    product={p}
                    isAdmin={isAdmin}
                    onView={() => router.push(`/products/${p.id || (p as any)._id}`)}
                    onEdit={() => router.push(`/dashboard/admin/edit-product/${p.id || (p as any)._id}`)}
                    onDelete={() => setDeleteTarget(p)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-text-neutral/50 font-medium">
            Page {safePageNum} of {totalPages} &middot; {filtered.length} result
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePageNum === 1}
              className="flex items-center gap-1 rounded-lg border border-bg-secondary bg-background px-3 py-1.5 text-xs font-bold text-text-neutral hover:bg-bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>

            {/* Page number pills — show up to 5 */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const startPage =
                totalPages <= 5
                  ? 1
                  : Math.max(1, Math.min(totalPages - 4, safePageNum - 2));
              const pageNum = startPage + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                    pageNum === safePageNum
                      ? "bg-primary text-white shadow-sm"
                      : "border border-bg-secondary bg-background text-text-neutral hover:bg-bg-secondary"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePageNum === totalPages}
              className="flex items-center gap-1 rounded-lg border border-bg-secondary bg-background px-3 py-1.5 text-xs font-bold text-text-neutral hover:bg-bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <FiChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ---- Sub-components ----

function TableHead({ isAdmin }: { isAdmin: boolean }) {
  return (
    <thead>
      <tr className="bg-surface border-b border-border text-body/60 font-bold uppercase tracking-wider text-[10px]">
        <th className="px-4 py-3.5">Product</th>
        <th className="px-4 py-3.5">Category</th>
        <th className="px-4 py-3.5">Price</th>
        <th className="px-4 py-3.5">Rating</th>
        {isAdmin && <th className="px-4 py-3.5">Added</th>}
        <th className="px-4 py-3.5 text-right">Actions</th>
      </tr>
    </thead>
  );
}

interface ProductRowProps {
  product: Product;
  isAdmin: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product: p, isAdmin, onView, onEdit, onDelete }: ProductRowProps) {
  const addedDate = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-surface transition-colors group">
      {/* Product info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.title}
              className="h-10 w-10 rounded-xl object-cover border border-bg-secondary shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-bg-secondary flex items-center justify-center shrink-0">
              <FiPackage className="h-4 w-4 text-text-neutral/30" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-text-neutral line-clamp-1 text-xs">{p.title}</p>
            <p className="text-text-neutral/40 line-clamp-1 text-[10px] mt-0.5">
              {p.shortDescription}
            </p>
          </div>
        </div>
      </td>

      {/* Category badge */}
      <td className="px-4 py-4">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyles(p.category)}`}>
          {p.category}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-4 font-bold text-text-neutral text-xs">
        ${p.price.toFixed(2)}
      </td>

      {/* Rating */}
      <td className="px-4 py-4">
        {p.rating ? (
          <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
            <FiStar className="h-3 w-3 fill-current" />
            {p.rating.toFixed(1)}
          </span>
        ) : (
          <span className="text-text-neutral/30 text-xs">&mdash;</span>
        )}
      </td>

      {/* Added date — admin only */}
      {isAdmin && (
        <td className="px-4 py-4 text-text-neutral/50 font-medium text-[10px]">
          {addedDate}
        </td>
      )}

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onView}
            title="View product"
            className="p-2 rounded-lg text-text-neutral/40 hover:text-accent hover:bg-accent/10 transition-all"
            aria-label={`View ${p.title}`}
          >
            <FiEye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onEdit}
            title="Edit product"
            className="p-2 rounded-lg text-text-neutral/40 hover:text-primary hover:bg-primary/10 transition-all"
            aria-label={`Edit ${p.title}`}
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          {isAdmin && (
            <button
              onClick={onDelete}
              title="Delete product"
              className="p-2 rounded-lg text-text-neutral/40 hover:text-red-500 hover:bg-red-50 transition-all"
              aria-label={`Delete ${p.title}`}
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ---- Empty State ----
interface EmptyStateProps {
  search: string;
  onClearSearch: () => void;
  onAddProduct: () => void;
}

function EmptyState({ search, onClearSearch, onAddProduct }: EmptyStateProps) {
  if (search) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
        <div className="p-4 rounded-2xl bg-bg-secondary border border-bg-secondary">
          <FiFilter className="h-8 w-8 text-text-neutral/30" />
        </div>
        <p className="text-sm font-bold text-text-neutral">
          No results for &ldquo;{search}&rdquo;
        </p>
        <p className="text-xs text-text-neutral/50 font-medium max-w-xs leading-relaxed">
          Try a different keyword or clear the search to see all products.
        </p>
        <button
          onClick={onClearSearch}
          className="mt-1 rounded-xl bg-primary/10 px-5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <div className="relative">
        <div className="p-5 rounded-2xl bg-bg-secondary border border-bg-secondary">
          <FiPackage className="h-10 w-10 text-text-neutral/20" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-xs font-black">0</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-extrabold text-text-neutral">No products yet</p>
        <p className="text-xs text-text-neutral/50 font-medium max-w-xs leading-relaxed">
          Your product catalogue is empty. Add your first product to get started.
        </p>
      </div>
      <button
        onClick={onAddProduct}
        className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
      >
        Add Your First Product
      </button>
    </div>
  );
}
