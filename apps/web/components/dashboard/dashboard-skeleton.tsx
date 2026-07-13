export function DashboardSkeleton() {
  return (
    <div className="bg-jl-bg rounded-xl p-3 md:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="h-4 w-full sm:w-64 jl-shimmer rounded" />
        <div className="flex gap-2 flex-wrap">
          <div className="h-6 w-28 jl-shimmer rounded" />
          <div className="h-6 w-28 jl-shimmer rounded" />
          <div className="h-6 w-28 jl-shimmer rounded" />
        </div>
      </div>
      <div className="h-8 jl-shimmer rounded-md mb-4" />

      <div className="mb-1.5">
        <div className="h-3 w-24 jl-shimmer rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="jl-shimmer rounded-md p-3 h-[72px]" />
        ))}
      </div>

      <div className="h-3 w-20 jl-shimmer rounded mb-1.5" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
        <div className="jl-shimmer rounded-md h-[90px]" />
        <div className="jl-shimmer rounded-md h-[90px]" />
        <div className="jl-shimmer rounded-md h-[90px]" />
      </div>

      <div className="h-3 w-32 jl-shimmer rounded mb-2.5" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
        <div className="jl-shimmer rounded-md h-[120px]" />
        <div className="jl-shimmer rounded-md h-[120px] md:col-span-2" />
      </div>

      <div className="h-3 w-24 jl-shimmer rounded mb-2.5" />
      <div className="jl-shimmer rounded-md h-[200px] mb-4" />

      <div className="h-3 w-40 jl-shimmer rounded mb-2.5" />
      <div className="jl-shimmer rounded-md h-[100px] mb-4" />
      <div className="h-3 w-36 jl-shimmer rounded mb-2.5" />
      <div className="jl-shimmer rounded-md h-[200px]" />
    </div>
  );
}
