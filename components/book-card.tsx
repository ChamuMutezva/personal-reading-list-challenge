import Image from "next/image";
import { type LibraryBook } from "@/app/actions/library";
import { STATUS_CONFIG } from "@/lib/helpers";
import Link from "next/link";
interface BookCardProps {
    book: LibraryBook;
    onUpdateStatus: (id: string, status: LibraryBook["status"]) => void;
    onRemove: (id: string) => void;
    updatingId: string | null;
    isMobile?: boolean;
}

interface StatusBadgeProps {
    status: keyof typeof STATUS_CONFIG;
    className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${config.className} ${className}`}
        >
            {config.label}
        </span>
    );
};

export const BookCard = ({
    book,
    onUpdateStatus,
    onRemove,
    updatingId,
    isMobile = false,
}: BookCardProps) => {
    const isUpdating = updatingId === book.id;

    return (
        <article
            className={`group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 `}
        >
            <div className={`relative aspect-3/4 bg-stone-100 overflow-hidden`}>
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={`${book.title} by ${book.author}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes={
                            isMobile ? "50vw" : "(max-width: 1024px) 50vw, 33vw"
                        }
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-linear-to-br from-stone-50 to-stone-100">
                        <svg
                            className="w-8 h-8 mb-2"
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
                {isMobile && (
                    <StatusBadge
                        status={book.status}
                        className="absolute top-2 left-2"
                    />
                )}
            </div>

            <div className={`p-3 sm:p-4`}>
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight ">
                    {book.title}
                </h3>
                <p className="text-xs text-foreground mt-1 line-clamp-1">
                    {book.author}
                </p>
                {book.publishedYear && (
                    <p className="text-xs text-foreground/75 mt-0.5">
                        {book.publishedYear}
                    </p>
                )}

                <Link
                    href={`/library/book/${book.googleId}`}
                    className="flex gap-3 p-3 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                    <span className="text-xs text-foreground font-medium">
                        View Details
                    </span>
                </Link>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <div className="relative flex-1">
                        <select
                            value={book.status}
                            onChange={(e) =>
                                onUpdateStatus(
                                    book.id,
                                    e.target.value as LibraryBook["status"],
                                )
                            }
                            disabled={isUpdating}
                            className="w-full appearance-none text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer"
                            aria-label={`Change reading status for ${book.title}`}
                        >
                            <option value="to-read">To Read</option>
                            <option value="reading">Reading</option>
                            <option value="finished">Finished</option>
                        </select>
                        <svg
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>

                    <button
                        onClick={() => onRemove(book.id)}
                        disabled={isUpdating}
                        className="p-1.5 text-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Remove ${book.title} from library`}
                        title="Remove from library"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>

                {!isMobile && (
                    <StatusBadge status={book.status} className="mt-2" />
                )}
            </div>
        </article>
    );
};
