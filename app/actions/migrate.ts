"use server";
import "server-only";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { SearchBook } from "@/app/actions/books";

export async function migrateGuestLibraryAction(books: SearchBook[]) {
    const user = await stackServerApp.getUser();
    if (!user?.id || !books.length) return { success: false };

    try {
        for (const book of books) {
            const bookResult = await db`
        INSERT INTO books (google_id, title, author, cover_url, published_year, description)
        VALUES (${book.googleId}, ${book.title}, ${book.author}, ${book.coverUrl}, ${book.publishedYear}, ${book.description})
        ON CONFLICT (google_id) DO UPDATE SET title = EXCLUDED.title
        RETURNING id
      `;

            const bookId = bookResult[0]?.id;
            await db`
        INSERT INTO user_library (book_id, user_id, status)
        VALUES (${bookId}, ${user.id}, 'to-read')
        ON CONFLICT (book_id, user_id) DO NOTHING
      `;
        }
        return { success: true };
    } catch (error) {
        console.error("Migration failed:", error);
        return { success: false };
    }
}
