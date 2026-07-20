"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/shared/ProductCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import SearchBar from "@/components/products/SearchBar";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import { MdInbox, MdWarning } from "react-icons/md";
import { FiGrid } from "react-icons/fi";

function ProductsExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filters & State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination meta
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Read current URL params
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1");

  // Sync state values with URL params
  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sortBy, order, page]);

  const updateUrlParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set or delete params
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset pagination to page 1 on search or filter change unless we explicitly navigate pages
    if (!newParams.page) {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    // Build API query parameters string
    const queryParts: string[] = [];
    if (search) queryParts.push(`search=${encodeURIComponent(search)}`);
    if (category) queryParts.push(`category=${encodeURIComponent(category)}`);
    if (minPrice) queryParts.push(`minPrice=${minPrice}`);
    if (maxPrice) queryParts.push(`maxPrice=${maxPrice}`);
    if (sortBy) queryParts.push(`sortBy=${sortBy}`);
    if (order) queryParts.push(`order=${order}`);
    queryParts.push(`page=${page}`);
    queryParts.push("limit=12");

    const queryStr = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

    const res = await api.get<{ products: Product[]; pagination: any }>(`/products${queryStr}`);

    if (!res.success) {
      setError(res.error || "Failed to load products.");
      setLoading(false);
      return;
    }

    if (res.data) {
      setProducts(res.data.products);
      setCurrentPage(res.data.pagination.page);
      setTotalPages(res.data.pagination.pages);
      setTotalProducts(res.data.pagination.total);
    }
    setLoading(false);
  };

  const handleSearch = (searchTerm: string) => {
    updateUrlParams({ search: searchTerm });
  };

  const handleFilterChange = (filters: { category?: string; minPrice?: string; maxPrice?: string }) => {
    updateUrlParams(filters);
  };

  const handleSortChange = (newSortBy: string, newOrder: string) => {
    updateUrlParams({ sortBy: newSortBy, order: newOrder });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() });
  };

  const handleClearFilters = () => {
    router.push(pathname); // resets all search parameters to default
  };

  return (
    <div className="space-y-6">
      {/* ── Search, Filters, and Sort Toolbar Card ── */}
      <div className="card-elevated p-4 md:p-5 bg-card border border-border shadow-sm rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Field */}
          <div className="w-full lg:max-w-md shrink-0">
            <SearchBar initialValue={search} onSearch={handleSearch} />
          </div>
          
          {/* Filters and Sorting Controls */}
          <div className="w-full flex flex-wrap lg:flex-nowrap gap-3 items-center justify-end">
            
            {/* Category Selector */}
            <select
              value={category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="rounded-xl border border-border bg-surface hover:bg-card px-3.5 py-2.5 text-xs font-bold text-heading focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Accessories">Accessories</option>
            </select>

            {/* Price Range inputs wrapper */}
            <div className="flex items-center gap-1.5 border border-border bg-surface rounded-xl px-3 py-2 text-xs">
              <span className="text-[10px] font-bold text-body/50 uppercase tracking-wider">Price ($)</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                className="w-12 bg-transparent text-xs font-bold text-heading focus:outline-none"
              />
              <span className="text-border">|</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                className="w-12 bg-transparent text-xs font-bold text-heading focus:outline-none"
              />
            </div>

            {/* Sorting Dropdown selector */}
            <SortDropdown sortBy={sortBy} order={order} onSortChange={handleSortChange} />

            {/* Clear Button */}
            {(category || minPrice || maxPrice || search) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl px-4 py-2.5 transition-all cursor-pointer border border-transparent hover:border-red-200"
              >
                Clear
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ── Product Grid Section ── */}
      <div>
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 border border-red-100 bg-red-50/50 rounded-2xl text-red-600 gap-2">
            <MdWarning className="h-10 w-10 shrink-0" />
            <p className="font-bold text-sm">Failed to Load Products</p>
            <p className="text-xs text-red-500/80">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 rounded-xl bg-red-600 text-white px-4 py-2 text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-border bg-card rounded-2xl text-heading/40 gap-3 shadow-xs">
            <MdInbox className="h-12 w-12" />
            <p className="font-bold text-sm">No Products Found</p>
            <p className="text-xs text-body/70 max-w-xs text-center">
              We couldn't find any products matching your query parameters. Try widening your price ranges or clear filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-2 rounded-xl border border-border bg-card hover:bg-surface px-4 py-2.5 text-xs font-bold text-heading transition-all cursor-pointer"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Highly Polished Statistics Pill Badge */}
            <div className="flex items-center justify-start pt-2 pb-1">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-heading shadow-xs hover:border-border-hover transition-all">
                <FiGrid className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-body font-semibold">
                  Showing <span className="text-primary font-extrabold">{products.length}</span> of{" "}
                  <span className="text-primary font-extrabold">{totalProducts}</span> Products
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p, idx) => (
                <ProductCard key={p.id || (p as any)._id || idx} product={p} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsExplorePage() {
  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-heading">
          Explore Products
        </h1>
        <p className="text-sm text-body font-medium">
          Find matching items or ask our AI Shopping Companion for real-time recommendations.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
            <div className="h-64 rounded-2xl bg-border"></div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-border"></div>
              ))}
            </div>
          </div>
        }
      >
        <ProductsExploreContent />
      </Suspense>
    </main>
  );
}
