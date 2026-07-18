"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "react-icons/fi";

interface ProductManageTableProps {
  isAdmin: boolean;
}

// ---- Delete Confirmation Modal ----
interface DeleteModalProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteModal({ product, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-bg-secondary bg-background p-8 shadow-2xl space-y-6 animate-scaleIn">
        {/* Close */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-text-neutral/40 hover:text-text-neutral hover:bg-bg-secondary transition-all"
          aria-label="Close dialog"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Icon + title */}
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
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Product name */}
        <div className="rounded-xl border border-bg-secondary bg-bg-secondary/30 px-4 py-3 text-sm font-semibold text-text-neutral">
          &ldquo;{product.title}&rdquo;
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-all disabled:opacity-60"
          >
            {isDeleting ? (
              <><FiLoader className="h-4 w-4 animate-spin" /> Deleting…</>
            ) : (
              <><FiTrash2 className="h-4 w-4" /> Yes, Delete</>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-bg-secondary bg-background px-4 py-2.5 text-sm font-semibold text-text-neutral hover:bg-bg-secondary transition-all disabled:opacity-60"
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
    <tr className="border-b border-bg-secondary/50 animate-pulse">
      <td className="px-6 py-4"><div className="h-3.5 w-48 rounded bg-bg-secondary" /></td>
      <td className="px-6 py-4"><div className="h-3.5 w-24 rounded bg-bg-secondary" /></td>
      <td className="px-6 py-4"><div className="h-3.5 w-16 rounded bg-bg-secondary" /></td>
      <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-bg-secondary" /></td>
      <td className="px-6 py-4 text-right"><div className="h-6 w-28 rounded-lg bg-bg-secondary ml-auto" /></td>
    </tr>
  );
}

export default function ProductManageTable({ isAdmin }: ProductManageTableProps) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Admin gets all products; regular users get their own via ownerId filter
    const endpoint = isAdmin ? "/products?limit=100" : "/products?limit=100";
    const res = await api.get<{ products: Product[] }>(endpoint);
    if (res.success && res.data) {
      setProducts(res.data.products);
    } else {
      setError(res.error || "Failed to load products.");
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await api.delete(`/products/${deleteTarget.id}`);
    setIsDeleting(false);
    setDeleteTarget(null);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("success", `"${deleteTarget.title}" deleted successfully.`);
    } else {
      showToast("error", res.error || "Failed to delete product.");
    }
  };

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

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-lg animate-fadeIn ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-bg-secondary bg-background overflow-hidden shadow-sm">
        {loading ? (
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-bg-secondary/40 border-b border-bg-secondary text-text-neutral/50 font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        ) : error ? (
          <div className="p-12 text-center space-y-2">
            <FiAlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
            <p className="text-sm font-bold text-red-500">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-text-neutral/50">
            <FiPackage className="h-12 w-12 opacity-30" />
            <p className="text-sm font-bold">No products found.</p>
            <button
              onClick={() => router.push("/dashboard/items/add")}
              className="mt-1 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-bg-secondary/40 border-b border-bg-secondary text-text-neutral/50 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-bg-secondary/50 last:border-b-0 hover:bg-bg-secondary/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-9 w-9 rounded-lg object-cover border border-bg-secondary shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0">
                            <FiPackage className="h-4 w-4 text-text-neutral/30" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-text-neutral line-clamp-1">{p.title}</p>
                          <p className="text-text-neutral/50 line-clamp-1 text-[10px] mt-0.5">
                            {p.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-neutral">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-text-neutral/60 font-medium">
                      {p.rating ? `★ ${p.rating.toFixed(1)}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => router.push(`/products/${p.id}`)}
                          title="View product"
                          className="p-2 rounded-lg text-text-neutral/40 hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/items/edit/${p.id}`)}
                          title="Edit product"
                          className="p-2 rounded-lg text-text-neutral/40 hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          title="Delete product"
                          className="p-2 rounded-lg text-text-neutral/40 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && !error && products.length > 0 && (
        <p className="text-xs text-text-neutral/50 font-medium text-right px-1">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      )}
    </>
  );
}
