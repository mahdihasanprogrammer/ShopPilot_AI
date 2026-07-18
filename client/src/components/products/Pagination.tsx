"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-bg-secondary bg-background hover:bg-bg-secondary text-text-neutral hover:text-primary transition-all disabled:opacity-50"
        aria-label="Previous Page"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "border border-bg-secondary bg-background hover:bg-bg-secondary text-text-neutral hover:text-primary"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-bg-secondary bg-background hover:bg-bg-secondary text-text-neutral hover:text-primary transition-all disabled:opacity-50"
        aria-label="Next Page"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
