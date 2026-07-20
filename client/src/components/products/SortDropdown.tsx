"use client";

import { FiTrendingUp } from "react-icons/fi";

interface SortDropdownProps {
  sortBy: string;
  order: string;
  onSortChange: (sortBy: string, order: string) => void;
}

const SORT_OPTIONS = [
  { label: "Newest Arrivals",   sortBy: "createdAt", order: "desc" },
  { label: "Price: Low → High", sortBy: "price",     order: "asc"  },
  { label: "Price: High → Low", sortBy: "price",     order: "desc" },
  { label: "Highest Rated",     sortBy: "rating",    order: "desc" },
];

export default function SortDropdown({ sortBy, order, onSortChange }: SortDropdownProps) {
  const selectedValue = `${sortBy}:${order}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newOrder] = e.target.value.split(":");
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className="flex items-center gap-2">
      <FiTrendingUp className="h-4 w-4 text-muted shrink-0" />
      <span className="text-xs text-muted font-medium whitespace-nowrap hidden sm:block">
        Sort by:
      </span>
      <select
        value={selectedValue}
        onChange={handleChange}
        className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-border-hover transition-all shadow-sm cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={`${o.sortBy}:${o.order}`} value={`${o.sortBy}:${o.order}`}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
