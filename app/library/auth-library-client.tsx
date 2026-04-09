"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getUserLibraryAction,
  updateBookStatusAction,
  removeBookFromLibraryAction,
  type LibraryBook,
} from "@/app/actions/library";

// Status badge configuration
const statusConfig = {
  "to-read": {
    label: "To Read",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  reading: {
    label: "Reading",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  finished: {
    label: "Finished",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

// Loading skeleton component
function BookCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-stone-100" />
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
}

export default function AuthLibraryClient() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getUserLibraryAction().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (
    bookId: string,
    status: LibraryBook["status"]
  ) => {
    setUpdatingId(bookId);
    const res = await updateBookStatusAction(bookId, status);
    if (res.success) {
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status } : b))
      );
    }
    setUpdatingId(null);
  };

  const removeBook = async (bookId: string) => {
    if (!confirm("Remove this book from your library?")) return;
    const res = await removeBookFromLibraryAction(bookId);
    if (res.success) {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-stone-100 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline text-primary-container">
              My Library
            </h1>
            <p className="text-sm text-secondary mt-1">
              {books.length} {books.length === 1 ? "book" : "books"} in your
              collection
            </p>
          </div>
          
          {/* Optional: Add filter/sort controls here */}
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center bg-surface/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
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
            <h3 className="text-lg font-semibold text-primary mb-2">
              Your library is empty
            </h3>
            <p className="text-sm text-secondary max-w-sm mx-auto">
              Search for books and add them to start building your personal
              collection.
            </p>
          </div>
        ) : (
          /* Book Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => {
              const status = statusConfig[book.status];
              return (
                <article
                  key={book.id}
                  className="group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-gradient-to-br from-stone-50 to-stone-100">
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
                    
                    {/* Status badge overlay on mobile */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full border ${status.className} sm:hidden`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Book Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
                      {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary mt-1 line-clamp-1">
                      {book.author}
                    </p>
                    
                    {book.publishedYear && (
                      <p className="text-xs text-secondary/60 mt-0.5">
                        {book.publishedYear}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      {/* Status Select */}
                      <div className="relative flex-1">
                        <select
                          value={book.status}
                          onChange={(e) =>
                            updateStatus(
                              book.id,
                              e.target.value as LibraryBook["status"]
                            )
                          }
                          disabled={updatingId === book.id}
                          className="w-full appearance-none text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer"
                          aria-label={`Change reading status for ${book.title}`}
                        >
                          <option value="to-read">To Read</option>
                          <option value="reading">Reading</option>
                          <option value="finished">Finished</option>
                        </select>
                        {/* Custom dropdown arrow */}
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

                      {/* Remove Button */}
                      <button
                        onClick={() => removeBook(book.id)}
                        disabled={updatingId === book.id}
                        className="p-1.5 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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

                    {/* Desktop status badge */}
                    <span
                      className={`hidden sm:inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full border ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}