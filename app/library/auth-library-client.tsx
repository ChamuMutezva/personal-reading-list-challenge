"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import {
    addBookToLibraryAction,
    getUserLibraryAction,
    updateBookStatusAction,
    removeBookFromLibraryAction,
    type LibraryBook,
} from "@/app/actions/library";
import { searchBooksAction, type SearchBook } from "@/app/actions/books";
import { BookCardSkeleton } from "@/components/book-card-skeleton";
import { EmptyLibraryState } from "@/components/empty-library";
import { SearchResultItem } from "@/components/search-item-results";
import { BookCard } from "@/components/book-card";

export default function AuthLibraryClient() {
    // Library State
    const [library, setLibrary] = useState<LibraryBook[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(true);

    // Search State
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 400);
    const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // UI State
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"library" | "search">("library");

    // Load library on mount
    useEffect(() => {
        getUserLibraryAction().then((data) => {
            setLibrary(data);
            setLibraryLoading(false);
        });
    }, []);

    // Effect 1: Clear search state when query is empty
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setSearchResults([]);
            setSearchError(null);
        }
    }, [debouncedQuery]);

    // Effect 2: Perform search with abort cleanup
    useEffect(() => {
        if (!debouncedQuery.trim()) return;

        let cancelled = false;
        const performSearch = async () => {
            setSearchLoading(true);
            try {
                const response = await searchBooksAction(debouncedQuery);
                if (!cancelled) {
                    if (response.success) {
                        setSearchResults(response.data || []);
                        setSearchError(null);
                    } else {
                        setSearchError(response.error || "Search failed");
                    }
                }
            } catch {
                if (!cancelled) setSearchError("Search failed");
            } finally {
                if (!cancelled) setSearchLoading(false);
            }
        };

        performSearch();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    // Handlers
    const handleAddBook = useCallback(
        async (book: SearchBook) => {
            if (library.some((b) => b.googleId === book.googleId)) return;

            const response = await addBookToLibraryAction(book);           
            if (response.success) {
                const newBook: LibraryBook = {
                    id: crypto.randomUUID(),
                    ...book,
                    status: "to-read",
                    addedAt: new Date().toISOString(),
                    notes: null,
                };
                setLibrary((prev) => [newBook, ...prev]);
                setActiveTab("library");
            } else {
                setSearchError(response.error || "Failed to add book");
            }
        },
        [library],
    );

    const updateStatus = useCallback(
        async (bookId: string, status: LibraryBook["status"]) => {
            setUpdatingId(bookId);
            const res = await updateBookStatusAction(bookId, status);
            if (res.success) {
                setLibrary((prev) =>
                    prev.map((b) => (b.id === bookId ? { ...b, status } : b)),
                );
            }
            setUpdatingId(null);
        },
        [],
    );

    const removeBook = useCallback(async (bookId: string) => {
        if (!confirm("Remove this book from your library?")) return;
        const res = await removeBookFromLibraryAction(bookId);
        if (res.success) {
            setLibrary((prev) => prev.filter((b) => b.id !== bookId));
        }
    }, []);

    const isInLibrary = useCallback(
        (googleId: string) => library.some((b) => b.googleId === googleId),
        [library],
    );

    // Render Logic
    const renderSearchPanel = () => (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {searchError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {searchError}
                </p>
            )}
            {searchResults.map((book) => (
                <SearchResultItem
                    key={book.googleId}
                    book={book}
                    onAdd={handleAddBook}
                    isInLibrary={isInLibrary(book.googleId)}
                    loading={searchLoading}
                />
            ))}
            {searchResults.length === 0 &&
                !searchLoading &&
                !searchError &&
                debouncedQuery.trim() && (
                    <p className="text-sm text-secondary text-center py-4">
                        No results for &quot;{debouncedQuery}&quot;
                    </p>
                )}
            {searchResults.length === 0 &&
                !searchLoading &&
                !searchError &&
                !debouncedQuery.trim() && (
                    <p className="text-sm text-primary-container text-center py-4">
                        Search to find books
                    </p>
                )}
        </div>
    );

    const renderLibraryGrid = (skeletonCount: number = 6) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {libraryLoading
                ? Array.from({ length: skeletonCount }).map((_, i) => (
                      <BookCardSkeleton key={i} />
                  ))
                : library.map((book) => (
                      <BookCard
                          key={book.id}
                          book={book}
                          onUpdateStatus={updateStatus}
                          onRemove={removeBook}
                          updatingId={updatingId}
                      />
                  ))}
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-headline text-primary-container">
                            My Library
                        </h1>
                        <p className="text-sm text-primary-container mt-1">
                            {library.length}{" "}
                            {library.length === 1 ? "book" : "books"} in your
                            collection
                        </p>
                    </div>
                    <div className="flex sm:hidden bg-surface border border-border rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab("library")}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "library" ? "bg-primary text-primary-foreground" : "text-primary hover:text-foreground"}`}
                        >
                            Library
                        </button>
                        <button
                            onClick={() => setActiveTab("search")}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "search" ? "bg-primary text-primary-foreground" : "text-primary hover:text-foreground"}`}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Desktop Layout: Two Columns */}
                <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                Discover Books
                            </h2>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="flex gap-2"
                            >
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search titles, authors..."
                                    className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={searchLoading}
                                    className="px-4 py-2.5 bg-primary-container text-surface rounded-lg font-medium hover:opacity-90 disabled:opacity-50 text-sm"
                                >
                                    {searchLoading ? "⏳" : "🔍"}
                                </button>
                            </form>
                            {renderSearchPanel()}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {library.length === 0 && !libraryLoading ? (
                            <EmptyLibraryState />
                        ) : (
                            renderLibraryGrid(6)
                        )}
                    </div>
                </div>

                {/* Mobile Layout: Tabbed Interface */}
                <div className="sm:hidden">
                    {activeTab === "search" && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                Discover Books
                            </h2>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="flex gap-2"
                            >
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search titles, authors..."
                                    className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={searchLoading}
                                    className="px-4 py-2.5 bg-primary-container text-surface rounded-lg font-medium hover:opacity-90 disabled:opacity-50 text-sm"
                                >
                                    {searchLoading ? "⏳" : "🔍"}
                                </button>
                            </form>
                            {renderSearchPanel()}
                        </div>
                    )}
                    {activeTab === "library" && (
                        <>
                            {library.length === 0 && !libraryLoading ? (
                                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-surface/50">
                                    <p className="text-sm text-secondary">
                                        Your library is empty. Search for books
                                        to get started.
                                    </p>
                                </div>
                            ) : (
                                renderLibraryGrid(4)
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
