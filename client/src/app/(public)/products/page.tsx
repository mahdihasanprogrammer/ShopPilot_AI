"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/shared/ProductCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import SearchBar from "@/components/products/SearchBar";
import FilterPanel from "@/components/products/FilterPanel";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import { MdInbox, MdWarning } from "react-icons/md";

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
      {/* Search and Sort Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:max-w-xl">
          <SearchBar initialValue={search} onSearch={handleSearch} />
        </div>
        <SortDropdown sortBy={sortBy} order={order} onSortChange={handleSortChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filters Panel */}
        <div className="lg:col-span-1">
          <FilterPanel
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="flex flex-col items-center justify-center p-12 border border-red-100 bg-red-50/50 rounded-2xl text-red-600 gap-2">
              <MdWarning className="h-10 w-10 shrink-0" />
              <p className="font-bold text-sm">Failed to Load Products</p>
              <p className="text-xs text-red-500/80">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 rounded-xl bg-red-600 text-white px-4 py-2 text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border border-bg-secondary bg-background rounded-2xl text-text-neutral/40 gap-3">
              <MdInbox className="h-12 w-12" />
              <p className="font-semibold text-sm">No Products Found</p>
              <p className="text-xs text-text-neutral/50 max-w-xs text-center">
                We couldn't find any products matching your query parameters. Try widening your price ranges or clear filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-2 rounded-xl border border-bg-secondary bg-background hover:bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-neutral transition-all"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-xs font-semibold text-text-neutral/40 uppercase tracking-wider mb-2">
                Showing {products.length} of {totalProducts} Products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
    </div>
  );
}

export default function ProductsExplorePage() {
  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-neutral">
          Explore Products
        </h1>
        <p className="text-sm text-text-neutral/60">
          Find matching items or ask our AI Shopping Companion for real-time recommendations.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
            <div className="h-64 rounded-2xl bg-bg-secondary"></div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-bg-secondary"></div>
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
