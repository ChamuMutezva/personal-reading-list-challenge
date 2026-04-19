"use server";
import { revalidatePath } from "next/cache";
export interface SearchBook {
    rating: number | undefined;
    genre: string;
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
}
interface GoogleBooksResponse {
    items?: Array<{
        id: string;
        volumeInfo: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            industryIdentifiers: any;
            title: string;
            authors?: string[];
            publishedDate?: string;
            description?: string;
            imageLinks?: {
                thumbnail?: string;
            };
            pageCount?: number;
            averageRating?: number;
            ratingsCount?: number;
            publisher?: string;
            infoLink?: string;
        };
    }>;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

async function fetchWithRetry<T>(
    url: string,
    retries = MAX_RETRIES,
    delay = INITIAL_DELAY,
): Promise<T> {
    try {
        const response = await fetch(url);
        if (response.status === 429 && retries > 0) {
            // Rate limited – wait and retry with exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (
            retries > 0 &&
            error instanceof Error &&
            error.message.includes("429")
        ) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw error;
    }
}

// 4. Normalization helper (reusable, pure function)
function normalizeBook(
    item: NonNullable<GoogleBooksResponse["items"]>[0],
): SearchBook {
    const vi = item.volumeInfo || {};
    let cover = vi.imageLinks?.thumbnail || null;
    if (cover) cover = cover.replace("http://", "https://");

     // Safely extract ISBN-13
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isbn13 = vi.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier || null;

    return {
        googleId: item.id,
        title: vi.title || "Unknown Title",
        author: vi.authors?.join(", ") || "Unknown Author",
        coverUrl: cover,
        publishedYear: vi.publishedDate?.slice(0, 4) || null,
        publishedDate: vi.publishedDate || null,
        description: vi.description || null,
        pageCount: vi.pageCount || null,
        averageRating: vi.averageRating || null,
        ratingsCount: vi.ratingsCount || null,
        publisher: vi.publisher || null, 
        isbn13,
        infoLink: vi.infoLink || null,   
    };
}

// ✅ SERVER ACTION: Call this from client components
export async function searchBooksAction(
    query: string,
): Promise<{ success: boolean; data?: SearchBook[]; error?: string }> {
    "use server";

    try {
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

        if (!query.trim()) {
            return { success: true, data: [] };
        }

        // ⚠️ This runs on the SERVER - env vars are available here
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10${apiKey ? `&key=${apiKey}` : ""}`;

        const data = await fetchWithRetry<GoogleBooksResponse>(url);
        const results = (data.items || []).map(normalizeBook);

        return { success: true, data: results };
    } catch (error) {
        console.error("Server Action searchBooksAction failed:", error);

        // User-friendly error messages
        if (error instanceof Error && error.message.includes("429")) {
            return {
                success: false,
                error: "Too many requests. Please wait a moment before searching again.",
            };
        }

        return {
            success: false,
            error: "Failed to search books. Please try again.",
        };
    }
}

// ✅ SERVER ACTION: Add book to Neon DB
export async function addBookToLibraryAction(
    book: SearchBook,
): Promise<{ success: boolean; error?: string }> {
    "use server";

    try {
        // TODO: Replace with your actual Neon DB logic
        // Example using @neondatabase/serverless:
        // import { db } from '@/lib/db';
        // await db`INSERT INTO books ...`;      

        revalidatePath("/library");
        return { success: true };
    } catch (error) {
        console.error("Failed to add book:", error);
        return {
            success: false,
            error: "Could not save book. Please try again.",
        };
    }
}
