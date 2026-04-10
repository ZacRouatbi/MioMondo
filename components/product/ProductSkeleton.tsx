export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image skeleton */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-[#E6E6FA]/60 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-[#E6E6FA]/60 animate-pulse" />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div className="space-y-5 pt-2">
            <div className="h-3 w-32 bg-[#E6E6FA]/80 rounded-full animate-pulse" />
            <div className="h-10 w-4/5 bg-[#E6E6FA]/80 rounded-lg animate-pulse" />
            <div className="h-10 w-2/5 bg-[#E6E6FA]/80 rounded-lg animate-pulse" />
            <div className="h-20 bg-[#E6E6FA]/60 rounded-xl animate-pulse" />
            <div className="h-14 bg-[#E6E6FA]/80 rounded-xl animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
               {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}