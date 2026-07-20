"use client";

import { FiTrendingUp } from "react-icons/fi";

interface SortDropdownProps {
  sortBy: string;
  order: string;
  onSortChange: (sortBy: string, order: string) => void;
}

const SORT_OPTIONS = [
  { label: "Newest Arrivals", sortBy: "createdAt", order: "desc" },
  { label: "Price: Low to High", sortBy: "price", order: "asc" },
  { label: "Price: High to Low", sortBy: "price", order: "desc" },
  { label: "High Rating", sortBy: "rating", order: "desc" },
];

export default function SortDropdown({ sortBy, order, onSortChange }: SortDropdownProps) {
  const selectedValue = `${sortBy}:${order}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newOrder] = e.target.value.split(":");
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className="flex items-center gap-2">
      <FiTrendingUp className="h-4 w-4 text-text-neutral/40" />
      <span className="text-xs text-text-neutral/50 font-medium whitespace-nowrap">
        Sort By:
      </span>
      <select
        value={selectedValue}
        onChange={handleChange}
        className="rounded-xl border border-bg-secondary bg-background px-3 py-1.5 text-xs font-semibold text-text-neutral focus:border-primary focus:outline-none transition-all shadow-sm"
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
