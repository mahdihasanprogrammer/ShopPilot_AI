"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({ initialValue, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products by title or description..."
        className="w-full rounded-xl border border-border bg-card pl-11 pr-10 py-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-border-hover transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-red-500 transition-colors"
          aria-label="Clear search"
        >
          <FiX className="h-4.5 w-4.5" />
        </button>
      )}
    </form>
  );
}
