import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { notFound } from "next/navigation";
import { BookDetailClient } from "./book-detail-client";
import { mapDbRowToBookDetails } from "@/lib/db-mappers";
import type { Metadata } from "next";
import { BookDetails } from "@/app/actions/google-book";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ googleId: string }>;
}): Promise<Metadata> {
    const { googleId } = await params;

    const book = await db`
    SELECT title, description FROM books WHERE google_id = ${googleId} LIMIT 1
  `.then((rows) => rows[0]);

    if (!book) {
        return { title: "Book Not Found | The Editorial Archive" };
    }

    return {
        title: `${book.title} | The Editorial Archive`,
        description:
            book.description?.slice(0, 150) || `Details for ${book.title}`,
    };
}

export default async function BookDetailPage({
    params,
}: Readonly<{
    params: Promise<{ googleId: string }>;
}>) {
    const { googleId } = await params;
    const user = await stackServerApp.getUser();

    // ✅ Query database with explicit column selection
    const dbRow = await db`
    SELECT 
      id,
      google_id,
      title,
      author,
      cover_url,
      published_year,
      page_count,
      average_rating,
      ratings_count,
      publisher,
      language,
      isbn_10,
      isbn_13,
      info_link,
      print_type,
      preview_link,
      description,
      categories
    FROM books
    WHERE google_id = ${googleId}
    LIMIT 1
  `.then((rows) => rows[0] || null);

    if (!dbRow) {
        console.log("🔍 Book not found in DB:", googleId);
        notFound();
    }

    // ✅ Map DB row to BookDetails interface
    const book: BookDetails = mapDbRowToBookDetails(dbRow);

    // ✅ Check if book is in user's library
    let libraryBookId: string | null = null;
    let currentStatus: "to-read" | "reading" | "finished" | null = null;

    if (user) {
        const libraryEntry = await db`
      SELECT id, status FROM user_library 
      WHERE book_id = ${dbRow.id} AND user_id = ${user.id}
      LIMIT 1
    `.then((rows) => rows[0] || null);

        if (libraryEntry) {
            libraryBookId = libraryEntry.id;
            currentStatus = libraryEntry.status;
        }
    }

    return (
        <BookDetailClient
            book={book}
            libraryBookId={libraryBookId}
            currentStatus={currentStatus}
        />
    );
}
