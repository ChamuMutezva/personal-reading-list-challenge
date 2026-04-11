// ─────────────────────────────────────────────────────────────
// 🧩 Reusable Skeleton Sub-Components
// ─────────────────────────────────────────────────────────────
export const BookCardSkeleton = () => (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-3/4 bg-stone-100" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
            <div className="flex gap-2 pt-2">
                <div className="h-7 bg-stone-100 rounded flex-1" />
                <div className="h-7 w-7 bg-stone-100 rounded" />
            </div>
        </div>
    </div>
);
