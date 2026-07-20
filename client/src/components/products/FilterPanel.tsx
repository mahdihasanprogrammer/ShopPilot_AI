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
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-sm text-heading">
          <FiFilter className="h-4.5 w-4.5 text-primary" />
          <span>Filters</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {/* Category */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-border-hover transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">$</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              placeholder="Min"
              min="0"
              className="w-full rounded-xl border border-border bg-surface pl-6 pr-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-border-hover transition-all placeholder:text-muted"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">$</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              placeholder="Max"
              min="0"
              className="w-full rounded-xl border border-border bg-surface pl-6 pr-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-border-hover transition-all placeholder:text-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
