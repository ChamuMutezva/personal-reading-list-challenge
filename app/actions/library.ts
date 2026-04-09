"use server";
import "server-only";
import { neon } from "@neondatabase/serverless";
import { stackServerApp } from "@/stack/server";
import { revalidatePath } from "next/cache";

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
  // ✅ Correct Stack Auth v1 method
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    // 1. Upsert book metadata
    const bookResult = await db`
      INSERT INTO books (google_id, title, author, cover_url, published_year, description)
      VALUES (${book.googleId}, ${book.title}, ${book.author}, ${book.coverUrl}, ${book.publishedYear}, ${book.description})
      ON CONFLICT (google_id) DO UPDATE SET title = EXCLUDED.title
      RETURNING id
    `;

    const bookId = bookResult[0]?.id;

    // 2. Link to user's library
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
      notes: row.notes || null,
      addedAt: new Date(row.addedAt).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch library:", error);
    return [];
  }
}

export async function updateBookStatusAction(
  bookId: string, 
  status: "to-read" | "reading" | "finished"
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