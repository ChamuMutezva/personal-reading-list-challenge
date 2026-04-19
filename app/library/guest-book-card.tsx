import { useState } from "react";
import { type SearchBook } from "@/app/actions/books";
import Image from "next/image";
import { BookOpen, Bookmark, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GuestBook = SearchBook & {
    status: "to-read" | "reading" | "finished";
    addedAt: string;
    progressPercent: number;
    pageCount: number;
    genre?: string;
    rating?: number;
};

interface BookCardProps {
    book: GuestBook;
    onAdd: (book: SearchBook) => void;
    isInLibrary: boolean;
    loading: boolean;
}

const GENRE_COLORS: Record<string, string> = {
    Fiction: "from-rose-500/20 to-pink-500/20 border-rose-200",
    "Non-Fiction": "from-blue-500/20 to-cyan-500/20 border-blue-200",
    "Sci-Fi & Fantasy": "from-purple-500/20 to-violet-500/20 border-purple-200",
    "Self-Improvement": "from-amber-500/20 to-orange-500/20 border-amber-200",
    "Tech & Programming":
        "from-emerald-500/20 to-teal-500/20 border-emerald-200",
};

const STATUS_BADGE: Record<
    GuestBook["status"],
    { label: string; color: string; icon: LucideIcon }
> = {
    "to-read": {
        label: "To Read",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: BookOpen,
    },
    reading: {
        label: "Reading",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Bookmark,
    },
    finished: {
        label: "Finished",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
    },
};

function StatusBadge({ status }: Readonly<{ status: GuestBook["status"] }>) {
    const config = STATUS_BADGE[status];
    const IconComponent = config.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full border ${config.color}`}
        >
            <IconComponent className="w-3 h-3" aria-hidden="true" />
            {config.label}
        </span>
    );
}

const STATUS_COLORS: Record<GuestBook["status"], string> = {
    "to-read": "bg-blue-500",
    reading: "bg-amber-500",
    finished: "bg-emerald-500",
};

function ProgressBar({
    percent,
    status,
}: Readonly<{
    percent: number;
    status: GuestBook["status"];
}>) {
    const color = STATUS_COLORS[status];
    return (
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percent}%` }}
                role="progressbar"
                aria-label={`Reading progress: ${percent}%`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
}

export function BookCard({
    book,
    onAdd,
    isInLibrary,
    loading,
}: Readonly<BookCardProps>) {
    const [isHovered, setIsHovered] = useState(false);
    const STATUS_PROGRESS: Record<GuestBook["status"], number> = {
        "to-read": 0,
        reading: book.progressPercent ?? 0,
        finished: 100,
    };
    const progress = STATUS_PROGRESS[book.status];
    return (
        <article
            className="group relative bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Cover Image */}
            <div className="relative aspect-3/4 bg-linear-to-br from-stone-50 to-stone-100 overflow-hidden">
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                        <svg
                            className="w-12 h-12 mb-2 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <span className="text-xs">No Cover</span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div
                    className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
                >
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs font-medium line-clamp-2 mb-2">
                            {book.description?.slice(0, 100)}
                            {book.description && book.description.length > 100
                                ? "..."
                                : ""}
                        </p>
                        <div className="flex items-center gap-2">
                            <ProgressBar
                                percent={progress}
                                status={book.status}
                            />
                            <span className="text-[10px] font-medium">
                                {progress}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <StatusBadge status={book.status} />
                </div>

                {/* Genre Tag */}
                {book.genre && (
                    <div
                        className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full bg-linear-to-r ${GENRE_COLORS[book.genre] || "from-stone-100 to-stone-200"} border backdrop-blur-sm`}
                    >
                        {book.genre.split(" ")[0]}
                    </div>
                )}
            </div>

            {/* Book Info */}
            <div className="p-4">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight min-h-10 group-hover:text-primary transition-colors">
                    {book.title}
                </h3>
                <p className="text-xs text-foreground mt-1 line-clamp-1">
                    {book.author}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <button
                        onClick={() => onAdd(book)}
                        disabled={isInLibrary || loading}
                        className={`flex-1 mr-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                            isInLibrary
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                : "bg-primary text-background hover:opacity-90 active:scale-95"
                        } disabled:opacity-50`}
                    >
                        {isInLibrary ? "✓ In Library" : "+ Add"}
                    </button>

                    {book.rating && (
                        <div className="flex items-center gap-0.5 text-amber-500">
                            <svg
                                className="w-3.5 h-3.5 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[10px] font-medium text-foreground">
                                {book.rating}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
