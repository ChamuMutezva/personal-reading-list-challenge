"use server";
import "server-only";
import { neon } from "@neondatabase/serverless";
import { stackServerApp } from "@/stack/server";
import { revalidatePath } from "next/cache";
import { fetchFullBookData } from "./google-book";

if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
}

const db = neon(process.env.DATABASE_URL);

export interface LibraryBook {
    id: string;
    googleId: string;
    title: string;
    author: string;
    coverUrl: string | null;
    publishedYear: string | null;
    publishedDate?: string | null;
    description: string | null;
    pageCount?: number | null;
    averageRating?: number | null;
    ratingsCount?: number | null;
    publisher?: string | null;
    language?: string | null;
    isbn13?: string | null;
    infoLink?: string | null;
    status: "to-read" | "reading" | "finished";
    addedAt: string;
    notes: string | null;
}

export async function addBookToLibraryAction(book: {
    googleId: string;
    title: string;
    author: string;
    coverUrl: string | null;
    publishedYear: string | null;
    description: string | null;
}) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // 1. Fetch full metadata (cached, so fast after first call)
        const fullData = await fetchFullBookData(book.googleId);

        // 2. Upsert book with ALL fields
        const bookResult = await db`
      INSERT INTO books (
        google_id, title, author, cover_url, published_year, description,
        page_count, categories, average_rating, ratings_count,
        publisher, language, isbn_10, isbn_13, info_link, print_type, preview_link
      )
      VALUES (
        ${book.googleId}, ${book.title}, ${book.author}, ${book.coverUrl}, 
        ${book.publishedYear}, ${book.description},
        ${fullData?.pageCount}, ${fullData?.categories}, ${fullData?.averageRating},
        ${fullData?.ratingsCount}, ${fullData?.publisher}, ${fullData?.language},
        ${fullData?.isbn10}, ${fullData?.isbn13}, ${fullData?.infoLink},
        ${fullData?.printType}, ${fullData?.previewLink}
      )
      ON CONFLICT (google_id) DO UPDATE SET 
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        cover_url = EXCLUDED.cover_url,
        page_count = COALESCE(EXCLUDED.page_count, books.page_count),
        average_rating = COALESCE(EXCLUDED.average_rating, books.average_rating)
      RETURNING id
    `;

        const bookId = bookResult[0]?.id;

        // 3. Link to user's library
        await db`
      INSERT INTO user_library (book_id, user_id, status)
      VALUES (${bookId}, ${user.id}, 'to-read')
      ON CONFLICT (book_id, user_id) DO NOTHING
    `;

        revalidatePath("/library");
        return { success: true };
    } catch (error) {
        console.error("Failed to add book:", error);
        return { success: false, error: "Database error" };
    }
}
export async function getUserLibraryAction(): Promise<LibraryBook[]> {
    const user = await stackServerApp.getUser();
    if (!user) return [];

    try {
        const results = await db`
      SELECT 
        b.id,
        b.google_id as "googleId",
        b.title,
        b.author,
        b.cover_url as "coverUrl",
        b.published_year as "publishedYear",
        b.page_count as "pageCount",
        ul.pages_read as "pagesRead",
        b.average_rating as "averageRating",
        b.ratings_count as "ratingsCount",
        b.publisher,
        b.language,
        b.isbn_13 as "isbn13",
        b.info_link as "infoLink",
        ul.status,
        ul.added_at as "addedAt",
        ul.notes
      FROM user_library ul
      JOIN books b ON ul.book_id = b.id
      WHERE ul.user_id = ${user.id}
      ORDER BY ul.added_at DESC
    `;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return results.map((row: any) => ({
            ...row,
            coverUrl: row.coverUrl || null,
            publishedYear: row.publishedYear || null,
            pageCount: row.pageCount || null,
            averageRating: row.averageRating || null,
            ratingsCount: row.ratingsCount || null,
            publisher: row.publisher || null,
            language: row.language || null,
            isbn13: row.isbn13 || null,
            infoLink: row.infoLink || null,
            notes: row.notes || null,
            addedAt: row.addedAt
                ? new Date(row.addedAt).toISOString()
                : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Failed to fetch library:", error);
        return [];
    }
}

export async function updateBookStatusAction(
    bookId: string,
    status: "to-read" | "reading" | "finished",
) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    await db`
    UPDATE user_library 
    SET status = ${status} 
    WHERE book_id = ${bookId} AND user_id = ${user.id}
  `;

    revalidatePath("/library");
    return { success: true };
}

export async function removeBookFromLibraryAction(bookId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    await db`
    DELETE FROM user_library 
    WHERE book_id = ${bookId} AND user_id = ${user.id}
  `;

    revalidatePath("/library");
    return { success: true };
}

export async function updateReadingProgressAction(
    libraryBookId: string,
    pagesRead: number,
) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    // Validate input
    if (pagesRead < 0) throw new Error("Pages read cannot be negative");

    await db`
    UPDATE user_library 
    SET pages_read = ${pagesRead},
    last_read_at = NOW()
    WHERE id = ${libraryBookId} AND user_id = ${user.id}
  `;

    revalidatePath("/library");
    return { success: true };
}
