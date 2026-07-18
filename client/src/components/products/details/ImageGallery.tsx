"use client";

import { useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

interface ImageGalleryProps {
  images?: string[];
  title: string;
}

export default function ImageGallery({ images = [], title }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl bg-bg-secondary text-text-neutral/30 border border-bg-secondary">
        <HiOutlinePhotograph className="h-16 w-16" />
        <span className="text-sm font-semibold">No Image Available</span>
      </div>
    );
  }

  const activeImage = images[activeIdx];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-bg-secondary bg-bg-secondary shadow-sm">
        <img
          src={activeImage}
          alt={`${title} - view ${activeIdx + 1}`}
          className="h-full w-full object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  isActive ? "border-primary" : "border-bg-secondary opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Thumbnail view" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
