/**
 * Loading skeleton components for lazy-loaded content
 * Provides visual feedback while heavy components are loading
 */

export function MapSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Tabs skeleton */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-40 bg-gray-200 rounded"></div>
          <div className="h-10 w-28 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Map skeleton */}
      <div className="w-full bg-gray-200 rounded-lg" style={{ height: '500px' }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm">Loading map...</div>
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="mt-4 flex items-center gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Chart area */}
      <div
        className="w-full bg-gray-100 rounded flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-400 text-sm">Loading chart...</div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
      </div>

      {/* Table */}
      <div className="space-y-3">
        {/* Table header */}
        <div className="flex gap-4 border-b pb-2">
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center py-2">
            <div className="flex-1 h-4 bg-gray-100 rounded"></div>
            <div className="w-24 h-4 bg-gray-100 rounded"></div>
            <div className="w-24 h-4 bg-gray-100 rounded"></div>
            <div className="w-24 h-4 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function WaffleChartSkeleton({ size = 12 }: { size?: number }) {
  return (
    <div className="animate-pulse">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-[1px] bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}

export function OccupationCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-4">
      {/* Title and category */}
      <div className="mb-3">
        <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-100 rounded"></div>
      </div>

      {/* Waffle chart placeholder */}
      <div className="mb-3">
        <WaffleChartSkeleton size={12} />
      </div>

      {/* Usage percentage */}
      <div className="h-3 w-16 bg-gray-100 rounded"></div>
    </div>
  );
}
