"use client";

import { Review } from "@/types";
import { RiStarFill, RiStarLine } from "react-icons/ri";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 rounded-xl border border-bg-secondary bg-background shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-neutral">{review.name}</h4>
        <span className="text-[10px] text-text-neutral/40 font-semibold">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* Star rating */}
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => {
          const starVal = i + 1;
          return starVal <= review.rating ? (
            <RiStarFill key={i} className="h-3.5 w-3.5" />
          ) : (
            <RiStarLine key={i} className="h-3.5 w-3.5 text-text-neutral/20" />
          );
        })}
      </div>

      <p className="text-xs text-text-neutral/70 leading-relaxed font-medium">
        {review.comment}
      </p>
    </div>
  );
}
