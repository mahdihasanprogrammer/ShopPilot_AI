export default function SkeletonLoader() {
  return (
    <div className="w-full animate-pulse rounded-xl border border-bg-secondary bg-background p-4 shadow-sm">
      <div className="aspect-square w-full rounded-lg bg-bg-secondary"></div>
      <div className="mt-4 h-3 w-1/4 rounded bg-bg-secondary"></div>
      <div className="mt-2 h-4 w-3/4 rounded bg-bg-secondary"></div>
      <div className="mt-2 h-3 w-5/6 rounded bg-bg-secondary"></div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-1/4 rounded bg-bg-secondary"></div>
        <div className="h-8 w-1/3 rounded bg-bg-secondary"></div>
      </div>
    </div>
  );
}
