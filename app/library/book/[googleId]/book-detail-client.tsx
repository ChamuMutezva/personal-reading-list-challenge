"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    addBookToLibraryAction,
    updateBookStatusAction,
    removeBookFromLibraryAction,
    updateReadingProgressAction,
} from "@/app/actions/library";
import { BookDetails } from "@/app/actions/google-book";

interface BookDetailClientProps {
    book: BookDetails;
    libraryBookId: string | null;
    currentStatus: "to-read" | "reading" | "finished" | null;
    pagesRead?: number | null;
}

export function BookDetailClient({
    book,
    libraryBookId,
    currentStatus,
    pagesRead: initialPagesRead = 0,
}: Readonly<BookDetailClientProps>) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [pagesRead, setPagesRead] = useState(initialPagesRead);
    const [progressLoading, setProgressLoading] = useState(false);

    // Calculate progress percentage
    const progressPercent =
        book.pageCount && book.pageCount > 0
            ? Math.min(
                  100,
                  Math.max(
                      0,
                      Math.round(((pagesRead ?? 0) / book.pageCount) * 100),
                  ),
              )
            : 0;

    const handleAddToLibrary = async () => {
        if (loading) return;
        setLoading(true);
        const res = await addBookToLibraryAction(book);
        if (res.success) {
            setStatus("to-read");
            router.refresh(); // Re-fetch server props
        }
        setLoading(false);
    };

    const handleStatusChange = async (
        newStatus: "to-read" | "reading" | "finished",
    ) => {
        if (!libraryBookId || loading) return;
        setLoading(true);
        const res = await updateBookStatusAction(libraryBookId, newStatus);
        if (res.success) setStatus(newStatus);
        setLoading(false);
    };

    // ← NEW: Handle progress update
    const handleProgressChange = async (newPagesRead: number) => {
        if (!libraryBookId || progressLoading) return;

        // Validate: don't exceed total pages
        const clampedPages = Math.min(
            newPagesRead,
            book.pageCount || newPagesRead,
        );

        setProgressLoading(true);
        setPagesRead(clampedPages); // Optimistic update

        try {
            const res = await updateReadingProgressAction(
                libraryBookId,
                clampedPages,
            );
            if (!res.success) {
                // Revert on failure
                setPagesRead(initialPagesRead || 0);
            }
        } catch (error) {
            console.error("Failed to update progress:", error);
            setPagesRead(initialPagesRead || 0); // Revert on error
        } finally {
            setProgressLoading(false);
        }
    };

    const handleRemove = async () => {
        if (
            !libraryBookId ||
            loading ||
            !confirm("Remove this book from your library?")
        )
            return;
        setLoading(true);
        const res = await removeBookFromLibraryAction(libraryBookId);
        if (res.success) {
            setStatus(null);
            router.refresh();
        }
        setLoading(false);
    };

    const isInLibrary = !!status;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb / Back */}
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary mb-6 transition-colors"
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
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Library
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Cover Image with Progress */}
                    <div className="lg:col-span-4 flex justify-center">
                        <div className="relative w-full max-w-70 sm:max-w-[320px] rounded-xl overflow-hidden shadow-2xl bg-stone-100">
                            <div className="relative aspect-3/4">
                                {book.coverUrl ? (
                                    <Image
                                        src={book.coverUrl}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-gradient-to-br from-stone-50 to-stone-100">
                                        <svg
                                            className="w-12 h-12 mb-2"
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
                                        <span className="text-sm">
                                            No Cover
                                        </span>
                                    </div>
                                )}
                            </div>
                              {/* Progress Indicator Overlay */}
                        {libraryBookId &&
                            book.pageCount &&
                            book.pageCount > 0 && (
                                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-foreground">
                                            Reading Progress
                                        </span>
                                        <span className="text-xs font-semibold text-primary">
                                            {progressPercent}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                                            style={{
                                                width: `${progressPercent}%`,
                                            }}
                                            role="progressbar"
                                            aria-valuenow={progressPercent}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`Reading progress: ${progressPercent}%`}
                                        />
                                    </div>

                                    {/* Pages read indicator */}
                                    <p className="text-[10px] text-secondary mt-1.5">
                                        {pagesRead} of {book.pageCount} pages
                                    </p>
                                </div>
                            )}
                        </div>                      
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-8 space-y-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-headline text-primary-container leading-tight">
                                {book.title}
                            </h1>
                            <p className="text-lg text-primary-container mt-1">
                                by {book.author}
                            </p>
                        </div>

                        {/* Quick Metadata Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border">
                            {book.pageCount && (
                                <MetaItem
                                    label="Pages"
                                    value={book.pageCount}
                                />
                            )}
                            {book.publisher && (
                                <MetaItem
                                    label="Publisher"
                                    value={book.publisher}
                                />
                            )}
                            {book.publishedYear && (
                                <MetaItem
                                    label="Published"
                                    value={book.publishedYear}
                                />
                            )}
                            {book.language && (
                                <MetaItem
                                    label="Language"
                                    value={book.language.toUpperCase()}
                                />
                            )}
                            {book.printType && (
                                <MetaItem
                                    label="Format"
                                    value={book.printType}
                                />
                            )}
                            {book.averageRating ? (
                                <div className="flex flex-col">
                                    <span className="text-xs text-primary-container uppercase tracking-wider">
                                        Rating
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                                        ⭐ {book.averageRating.toFixed(1)}{" "}
                                        <span className="text-xs text-primary">
                                            ({book.ratingsCount})
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Categories */}
                        {book.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {book.categories.slice(0, 5).map((cat, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                                    >
                                        {cat.split("/").pop()?.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* ISBNs */}
                        <div className="text-xs text-primary-container space-y-1">
                            {book.isbn13 && <p>ISBN-13: {book.isbn13}</p>}
                            {book.isbn10 && <p>ISBN-10: {book.isbn10}</p>}
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="prose prose-sm max-w-none text-foreground/80">
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Synopsis
                                </h3>
                                <p className="leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        )}

                        {/* ← NEW: Reading Progress Input (only show if in library and has page count) */}
                        {libraryBookId &&
                            book.pageCount &&
                            book.pageCount > 0 && (
                                <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Update Progress
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Slider Input */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label
                                                    htmlFor="pages-read"
                                                    className="text-sm font-medium text-foreground"
                                                >
                                                    Pages Read
                                                </label>
                                                <span className="text-sm font-semibold text-primary">
                                                    {pagesRead} /{" "}
                                                    {book.pageCount}
                                                </span>
                                            </div>

                                            <input
                                                id="pages-read"
                                                type="range"
                                                min={0}
                                                max={book.pageCount}
                                                value={pagesRead ?? 0}
                                                onChange={(e) =>
                                                    handleProgressChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                disabled={progressLoading}
                                                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                                                aria-label={`Set pages read for ${book.title}`}
                                            />

                                            {/* Slider ticks for visual reference */}
                                            <div className="flex justify-between mt-1 text-[10px] text-secondary">
                                                <span>0</span>
                                                <span>
                                                    {Math.round(
                                                        book.pageCount / 2,
                                                    )}
                                                </span>
                                                <span>{book.pageCount}</span>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleProgressChange(
                                                        Math.min(
                                                            (pagesRead ?? 0) +
                                                                10,
                                                            book.pageCount ?? 0,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    progressLoading ||
                                                    (pagesRead ?? 0) >=
                                                        book.pageCount
                                                }
                                                className="px-3 py-1.5 text-xs font-medium bg-surface-variant text-foreground rounded-lg hover:bg-surface-variant/80 disabled:opacity-50 transition-colors"
                                            >
                                                +10 pages
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleProgressChange(
                                                        Math.min(
                                                            (pagesRead ?? 0) +
                                                                25,
                                                            book.pageCount ?? 0,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    progressLoading ||
                                                    (pagesRead ?? 0) >=
                                                        book.pageCount
                                                }
                                                className="px-3 py-1.5 text-xs font-medium bg-surface-variant text-foreground rounded-lg hover:bg-surface-variant/80 disabled:opacity-50 transition-colors"
                                            >
                                                +25 pages
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleProgressChange(
                                                        book.pageCount ?? 0,
                                                    )
                                                }
                                                disabled={
                                                    progressLoading ||
                                                    (pagesRead ?? 0) >=
                                                        book.pageCount
                                                }
                                                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors"
                                            >
                                                Mark as Finished
                                            </button>
                                        </div>

                                        {/* Loading State */}
                                        {progressLoading && (
                                            <p className="text-xs text-secondary animate-pulse">
                                                Saving progress...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {!isInLibrary ? (
                                <button
                                    onClick={handleAddToLibrary}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-primary text-background rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    {loading ? "Adding..." : "Add to Library"}
                                </button>
                            ) : (
                                <>
                                    <select
                                        aria-label="Change reading status"
                                        value={status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                e.target.value as typeof status,
                                            )
                                        }
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                    >
                                        <option value="to-read">
                                            📖 To Read
                                        </option>
                                        <option value="reading">
                                            📖 Currently Reading
                                        </option>
                                        <option value="finished">
                                            ✅ Finished
                                        </option>
                                    </select>
                                    <button
                                        onClick={handleRemove}
                                        disabled={loading}
                                        className="px-4 py-3 text-destructive border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>

                        {/* External Links */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            {book.infoLink && (
                                <a
                                    href={book.infoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    View on Google Books ↗
                                </a>
                            )}
                            {book.previewLink && (
                                <a
                                    href={book.previewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    Read Preview ↗
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for metadata grid
function MetaItem({
    label,
    value,
}: Readonly<{ label: string; value: string | number }>) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-primary-container uppercase tracking-wider">
                {label}
            </span>
            <span className="font-medium text-primary-container">{value}</span>
        </div>
    );
}
