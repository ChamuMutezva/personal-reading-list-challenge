"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
    searchBooksAction,
    addBookToLibraryAction,
    type SearchBook,
} from "@/app/actions/books";
import { useDebounce } from "use-debounce";

type GuestBook = SearchBook & {
    status: "to-read" | "reading" | "finished";
    addedAt: string;
};

export default function GuestLibraryClient() {
    const searchParams = useSearchParams();
    const isGuest = searchParams.get("mode") === "guest";

    // ✅ Always start empty on server + client (ensures hydration match)
    const [library, setLibrary] = useState<GuestBook[]>([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debouncedQuery] = useDebounce(query, 800);

    // ✅ Single setState call: load from localStorage after mount
    useEffect(() => {
        const saved = localStorage.getItem("guest_library");
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLibrary(JSON.parse(saved));
            } catch (e) {
                console.warn("Failed to parse guest_library:", e);
            }
        }
    }, []); // Runs once on mount

    // ✅ Search when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) return;

        const performSearch = async () => {
            setLoading(true);
            setError(null);
            const response = await searchBooksAction(debouncedQuery);
            if (response.success) {
                setResults(response.data || []);
            } else {
                setError(response.error || "Search failed");
            }
            setLoading(false);
        };

        performSearch();
    }, [debouncedQuery]);

    const saveLibrary = (books: GuestBook[]) => {
        localStorage.setItem("guest_library", JSON.stringify(books));
        setLibrary(books);
    };

    const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const response = await searchBooksAction(query);

        if (response.success) {
            setResults(response.data || []);
        } else {
            setError(response.error || "Search failed");
        }

        setLoading(false);
    };

    const handleAdd = async (book: SearchBook) => {
        if (library.some((b) => b.googleId === book.googleId)) return;

        const response = await addBookToLibraryAction(book);

        if (response.success) {
            saveLibrary([
                ...library,
                {
                    ...book,
                    status: "to-read",
                    addedAt: new Date().toISOString(),
                },
            ]);
        } else {
            setError(response.error || "Failed to save book");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            {/* Guest Banner */}
            {isGuest && (
                <div className="max-w-7xl mx-auto mb-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="font-medium text-primary">
                        👋 Browsing as guest
                    </p>
                    <p className="text-sm text-secondary">
                        Library saved locally.{" "}
                        <a href="/sign-up" className="underline">
                            Create account
                        </a>{" "}
                        to sync.
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="max-w-7xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                    {error.includes("Too many requests") && (
                        <button
                            onClick={() => setError(null)}
                            className="ml-2 underline hover:text-red-900"
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search Panel */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search titles, authors..."
                            className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-container text-surface rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? "⏳" : "🔍"}
                        </button>
                    </form>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {results.map((book) => {
                            const isInLibrary = library.some(
                                (b) => b.googleId === book.googleId,
                            );
                            return (
                                <div
                                    key={book.googleId}
                                    className="flex gap-3 p-3 bg-surface border rounded-lg"
                                >
                                    {book.coverUrl ? (
                                        <Image
                                            src={book.coverUrl}
                                            alt=""
                                            className="w-12 h-16 object-cover rounded"
                                            width={48}
                                            height={64}
                                        />
                                    ) : (
                                        <div className="w-12 h-16 bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500">
                                            No Cover
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-secondary truncate">
                                            {book.author}
                                        </p>
                                        <button
                                            onClick={() => handleAdd(book)}
                                            disabled={isInLibrary || loading}
                                            className="mt-2 text-xs font-medium text-primary hover:underline disabled:opacity-50"
                                        >
                                            {isInLibrary ? "✓ Added" : "+ Add"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {results.length === 0 && !loading && !error && (
                            <p className="text-sm text-secondary text-center py-4">
                                Search to find books
                            </p>
                        )}
                    </div>
                </div>

                {/* Library Panel - ✅ Same container structure always */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-headline text-primary-container mb-4">
                        My Library
                    </h2>

                    {/* ✅ Always render the grid container - only children change */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {library.length === 0 ? (
                            // Empty state as a grid item (col-span-full)
                            <div className="col-span-full border-2 border-dashed border-border rounded-lg p-12 text-center">
                                <p className="text-secondary">
                                    Your library is empty
                                </p>
                                <p className="text-sm text-secondary/70">
                                    Search and add books to get started.
                                </p>
                            </div>
                        ) : (
                            // Loaded state: map books
                            library.map((book) => (
                                <div
                                    key={book.googleId}
                                    className="flex gap-4 p-4 bg-surface border rounded-lg"
                                >
                                    {book.coverUrl && (
                                        <Image
                                            src={book.coverUrl}
                                            alt=""
                                            className="w-16 h-24 object-cover rounded"
                                            width={64}
                                            height={96}
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-secondary">
                                            {book.author}
                                        </p>
                                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full capitalize">
                                            {book.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
