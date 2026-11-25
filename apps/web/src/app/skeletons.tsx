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
function Bone({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-gray-200 ${className}`} />;
}

export function DestinationDetailSkeleton() {
  return (
    <div role="status" className="mt-6 animate-pulse">
      {/* Title */}
      <Bone className="mt-2 h-8 w-1/2" />

      {/* Photos: one on mobile, three from sm up */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={i > 0 ? 'hidden sm:block' : undefined}>
            <Bone className="h-48 w-full rounded-lg" />
            <Bone className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 max-w-prose space-y-2">
        <Bone className="h-4" />
        <Bone className="h-4" />
        <Bone className="h-4 w-5/6" />
      </div>

      {/* Things to see */}
      <Bone className="mt-8 h-6 w-40" />
      <ul className="mt-2 divide-y divide-gray-200">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="space-y-2 py-2">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-3 w-1/2" />
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading destination…</span>
    </div>
  );
}

export function ItinerariesSkeleton() {
  return (
    <section role="status" className="mx-auto max-w-3xl animate-pulse">
      {/* Heading */}
      <Bone className="mb-6 h-9 w-56" />

      {/* Form row: name, start, end, button */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Bone className="h-10 flex-1" />
        <Bone className="h-10 w-36" />
        <Bone className="h-10 w-36" />
        <Bone className="h-10 w-20" />
      </div>

      {/* Itinerary cards */}
      <ul className="space-y-4">
        {[0, 1].map((i) => (
          <li key={i} className="rounded border border-gray-200 p-4">
            <Bone className="h-6 w-1/3" />
            <Bone className="mt-2 h-4 w-1/4" />
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((j) => (
                <div key={j}>
                  <Bone className="h-24 w-full" />
                  <Bone className="mt-1 h-4 w-2/3" />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading itineraries…</span>
    </section>
  );
}
