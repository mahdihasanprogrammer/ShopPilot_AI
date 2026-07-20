export default function SkeletonLoader() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Image area */}
      <div className="skeleton aspect-square w-full rounded-none" />
      {/* Content area */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/4 rounded-full" />
        <div className="skeleton h-4 w-4/5 rounded-lg" />
        <div className="skeleton h-3 w-3/4 rounded-lg" />
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton h-5 w-1/3 rounded-lg" />
          <div className="skeleton h-8 w-1/4 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
