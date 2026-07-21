"use client";

import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { CATEGORIES } from "@/lib/categories";

interface FilterPanelProps {
  category: string;
  minPrice: string;
  maxPrice: string;
  onFilterChange: (filters: { category?: string; minPrice?: string; maxPrice?: string }) => void;
  onClear: () => void;
}

export default function FilterPanel({
  category,
  minPrice,
  maxPrice,
  onFilterChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm transition-colors duration-250">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-sm text-heading">
          <FiFilter className="h-4.5 w-4.5 text-primary" />
          <span>Filters</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <FiRefreshCw className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-xs text-heading focus:border-primary focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Inputs */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            placeholder="Min"
            min="0"
            className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-xs text-heading placeholder:text-muted focus:border-primary focus:outline-none transition-all"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            placeholder="Max"
            min="0"
            className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-xs text-heading placeholder:text-muted focus:border-primary focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
