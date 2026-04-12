export default function BookDetailLoading() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex justify-center">
          <div className="aspect-3/4 w-full max-w-sm bg-stone-200 rounded-xl" />
        </div>
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-200 rounded w-1/2" />
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-stone-200">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-stone-200 rounded" />)}
          </div>
          <div className="h-32 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}