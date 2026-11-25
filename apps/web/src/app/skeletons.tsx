export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-2"><div className="h-6 w-2/3 rounded bg-gray-200" /></div>
          <div className="h-48 bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading destinations…</span>
    </div>
  );
}
