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
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-neutral/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products by title or description..."
        className="w-full rounded-xl border border-bg-secondary bg-background pl-11 pr-10 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-neutral/40 hover:text-red-500 transition-colors"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
