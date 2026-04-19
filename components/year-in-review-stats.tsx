"use client";

import { useMemo } from "react";

interface StatBook {
  status: "to-read" | "reading" | "finished";
  rating?: number | null;
  progressPercent: number;
  pageCount: number;
  genre: string;
}

interface YearInReviewStatsProps {
  books: StatBook[];
  className?: string;
}

export function YearInReviewStats({ books, className = "" }: Readonly<YearInReviewStatsProps>) {
  const stats = useMemo(() => {
    const finished = books.filter((b) => b.status === "finished");
    const reading = books.filter((b) => b.status === "reading");
    
    // Calculate pages read: finished = 100%, reading = progress%
    const pagesRead = books.reduce((sum, b) => {
      const percent = b.status === "finished" ? 100 : b.progressPercent;
      return sum + Math.round((percent / 100) * (b.pageCount || 0));
    }, 0);
    
    // Average rating (only rated books)
    const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
    const avgRating = ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length).toFixed(1)
      : null;
    
    // Top genre (by books with any progress)
    const genreCounts = books
      .filter((b) => b.status !== "to-read")
      .reduce<Record<string, number>>((acc, b) => {
        acc[b.genre] = (acc[b.genre] || 0) + 1;
        return acc;
      }, {});
    
    const topGenre = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    
    return {
      finishedCount: finished.length,
      readingCount: reading.length,
      pagesRead,
      avgRating,
      topGenre,
      totalBooks: books.length,
    };
  }, [books]);

  if (stats.totalBooks === 0) return null;

  return (
    <div className={`bg-surface border border-border rounded-xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shadow-sm ${className}`}>
      <StatCard
        label="Books Finished"
        value={stats.finishedCount}
        icon={
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Pages Read"
        value={stats.pagesRead.toLocaleString()}
        icon={
          <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />
      <StatCard
        label="Avg Rating"
        value={stats.avgRating ? `⭐ ${stats.avgRating}` : "—"}
        icon={
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        }
        subtle={!stats.avgRating}
      />
      <StatCard
        label="Top Genre"
        value={stats.topGenre}
        icon={
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
        valueClassName="text-sm"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtle?: boolean;
  valueClassName?: string;
}

function StatCard({ label, value, icon, subtle = false, valueClassName = "" }: Readonly<StatCardProps>) {
  return (
    <div className="text-center p-2 sm:p-3 rounded-lg hover:bg-surface-variant/30 transition-colors">
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        {icon}
      </div>
      <div className={`font-bold text-lg sm:text-xl text-foreground ${valueClassName} ${subtle ? "text-secondary/60" : ""}`}>
        {value}
      </div>
      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}