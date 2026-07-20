export default function SkeletonLoader() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Image area */}
      <div className="aspect-square w-full skeleton" />

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Category pill */}
        <div className="skeleton h-4 w-16 rounded-full" />
        {/* Title */}
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        {/* Description */}
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>
        {/* Rating */}
        <div className="skeleton h-3 w-20 rounded" />
        {/* Price + action row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="flex gap-1.5">
            <div className="skeleton h-8 w-8 rounded-xl" />
            <div className="skeleton h-8 w-16 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
