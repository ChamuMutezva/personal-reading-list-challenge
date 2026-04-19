"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CURATED_GUEST_LIBRARY } from "@/data/curated-guest-library";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
    searchBooksAction,
    addBookToLibraryAction,
    type SearchBook,
} from "@/app/actions/books";
import { YearInReviewStats } from "@/components/year-in-review-stats";
import { BookCard } from "./guest-book-card";

type GuestBook = SearchBook & {
    status: "to-read" | "reading" | "finished";
    addedAt: string;
    progressPercent: number;
    pageCount: number;
    genre?: string;
    rating?: number;
};

export default function GuestLibraryClient() {
    const searchParams = useSearchParams();
    const isGuest = searchParams.get("mode") === "guest";

    const [library, setLibrary] = useState<GuestBook[]>([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debouncedQuery] = useDebounce(query, 600);

    // Load from localStorage after mount (hydration-safe)
    useEffect(() => {
        if (!isGuest || typeof window === "undefined") return;

        const id = requestAnimationFrame(() => {
            const saved = localStorage.getItem("guest_library_v2");

            if (saved) {
                // User has existing guest data
                try {
                    setLibrary(JSON.parse(saved));
                } catch (e) {
                    console.warn("Failed to parse guest_library:", e);
                    seedLibrary(); // Fallback to curated data
                }
            } else {
                // First-time guest: auto-seed with curated library
                seedLibrary();
            }
            setLoading(false);
        });

        return () => cancelAnimationFrame(id);
    }, [isGuest]);

    // Debounced search
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        let cancelled = false;
        const performSearch = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await searchBooksAction(debouncedQuery);
                if (!cancelled) {
                    if (response.success) {
                        setResults(response.data || []);
                    } else {
                        setError(response.error || "Search failed");
                    }
                }
            } catch {
                if (!cancelled) setError("Search failed");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        performSearch();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    // Seed library with curated books for first-time guests
    const seedLibrary = () => {
        if (typeof window === "undefined") return;

        // Transform CuratedBook → GuestBook shape
        const guestBooks: GuestBook[] = CURATED_GUEST_LIBRARY.map((book) => ({
            ...book,
            // Ensure all required SearchBook fields are present with defaults
            publishedYear: (book.publishedYear ?? 0).toString(),
            description: book.description ?? "",
            // Ensure all required GuestBook fields are present
            status: "to-read",
            addedAt: new Date().toISOString(),
            progressPercent: book.progressPercent ?? 0,
            pageCount: book.pageCount ?? 0,
            genre: book.genre ?? "Other",
            rating: book.rating,
        }));

        localStorage.setItem("guest_library_v2", JSON.stringify(guestBooks));
        setLibrary(guestBooks);
    };

    const saveLibrary = (books: GuestBook[]) => {
        if (globalThis.window === undefined) return;
        localStorage.setItem("guest_library_v2", JSON.stringify(books));
        setLibrary(books);
    };

    const handleAdd = async (book: SearchBook) => {
        if (library.some((b) => b.googleId === book.googleId)) return;

        const response = await addBookToLibraryAction(book);
        if (response.success) {
            // ✅ Explicitly define the new book with all required GuestBook fields
            const newBook: GuestBook = {
                ...book,
                status: "to-read",
                addedAt: new Date().toISOString(),
                progressPercent: 0, // ✅ New default
                pageCount: book.pageCount ?? 0, // ✅ Fallback if null/undefined
                genre: book.genre ?? "Other", // ✅ Fallback if missing
                rating: book.rating, // ✅ Keep optional as-is
            };

            saveLibrary([...library, newBook]);
        } else {
            setError(response.error || "Failed to save book");
        }
    };

    const isInLibrary = (googleId: string) =>
        library.some((b) => b.googleId === googleId);

    // Group books by genre for shelf display
    const booksByGenre = useMemo(() => {
        return library.reduce<Record<string, GuestBook[]>>((acc, book) => {
            const genre = book.genre || "Other";
            if (!acc[genre]) acc[genre] = [];
            acc[genre].push(book);
            return acc;
        }, {});
    }, [library]);

    const genres = [
        "Fiction",
        "Non-Fiction",
        "Sci-Fi & Fantasy",
        "Self-Improvement",
        "Tech & Programming",
    ];

    if (!isGuest) return null;

    return (
        <div className="min-h-screen bg-linear-to-b from-background via-background to-surface/30">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="mt-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-foreground border border-primary/20 text-xs font-semibold mb-4">
                                <span className="w-2 h-2 rounded-full bg-primary text-foreground animate-pulse" />
                                Guest Mode
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-headline text-foreground leading-tight">
                                Explore Your Curated Library
                            </h1>
                            <p className="text-foreground mt-3 max-w-xl">
                                Discover 45 hand-picked books across genres.
                                Your progress saves locally—create an account to
                                sync forever.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <YearInReviewStats
                            books={library}
                            className="lg:w-auto w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Guest Banner */}
                <div className="mb-8 bg-linear-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="font-semibold text-foreground">
                                Browsing as Guest
                            </p>
                            <p className="text-sm mt-0.5">
                                All progress saved locally.{" "}
                                <a
                                    href="/sign-up"
                                    className="font-medium text-accent hover:underline"
                                >
                                    Create account to sync across devices
                                </a>
                            </p>
                        </div>
                    </div>
                    <a
                        href="/sign-up"
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary text-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        Save My Progress →
                    </a>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">
                                {error}
                            </p>
                            {error.includes("Too many requests") && (
                                <Button
                                    onClick={() => setError(null)}
                                    className="text-xs text-destructive hover:text-red-800 underline mt-1"
                                >
                                    Dismiss
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Search Panel */}
                <div className="mb-10">
                    <div className="relative max-w-2xl mx-auto">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="relative"
                        >
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search titles, authors, or genres..."
                                className="w-full px-5 py-4 pl-12 border border-border rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm shadow-sm"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </form>

                        {/* Search Results Dropdown */}
                        {results.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                                <div className="p-3 border-b border-border bg-surface/50">
                                    <p className="text-xs font-medium text-foreground">
                                        {results.length} results for &quot;
                                        {debouncedQuery}&quot;
                                    </p>
                                </div>
                                <div className="divide-y divide-border">
                                    {results.slice(0, 6).map((book) => (
                                        <Button
                                            key={book.googleId}
                                            onClick={() => handleAdd(book)}
                                            disabled={isInLibrary(
                                                book.googleId,
                                            )}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors text-left disabled:opacity-50"
                                        >
                                            {book.coverUrl ? (
                                                <Image
                                                    src={book.coverUrl}
                                                    alt=""
                                                    className="w-10 h-14 object-cover rounded"
                                                    width={40}
                                                    height={56}
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-stone-100 rounded flex items-center justify-center text-[8px] text-stone-400">
                                                    No Cover
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {book.title}
                                                </p>
                                                <p className="text-xs text-secondary truncate">
                                                    {book.author}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${isInLibrary(book.googleId) ? "bg-emerald-100 text-emerald-700" : "bg-primary text-background"}`}
                                            >
                                                {isInLibrary(book.googleId)
                                                    ? "✓ Added"
                                                    : "+ Add"}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Genre Shelves */}
                <div className="space-y-12">
                    {genres.map((genre) => {
                        const books = booksByGenre[genre] || [];
                        if (books.length === 0) return null;

                        return (
                            <section key={genre} className="group">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-headline text-foreground">
                                            {genre}
                                        </h2>
                                        <span className="px-2.5 py-1 text-xs font-medium bg-surface border border-border rounded-full text-foreground">
                                            {books.length}{" "}
                                            {books.length === 1
                                                ? "book"
                                                : "books"}
                                        </span>
                                    </div>
                                    <Link
                                        href="#"
                                        className="text-sm text-foreground font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        View all →
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                    {books.map((book) => (
                                        <BookCard
                                            key={book.googleId}
                                            book={book}
                                            onAdd={handleAdd}
                                            isInLibrary={isInLibrary(
                                                book.googleId,
                                            )}
                                            loading={loading}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Empty State */}
                {library.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-foreground"
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
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Your library is empty
                        </h3>
                        <p className="text-foreground max-w-md mx-auto mb-6">
                            Search for books above and add them to start
                            building your personal collection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={seedLibrary}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
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
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                                Load Curated Library
                            </button>

                            <a
                                href="#search"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
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
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                Start Exploring
                            </a>
                        </div>
                        <p className="text-xs text-secondary mt-4 max-w-sm mx-auto">
                            Or load 45 hand-picked books across genres to
                            explore instantly.
                        </p>
                    </div>
                )}
            </div>

            {/* Floating CTA for Mobile */}
            <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40">
                <a
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-foreground rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Save Progress & Sign Up
                </a>
            </div>
        </div>
    );
}
