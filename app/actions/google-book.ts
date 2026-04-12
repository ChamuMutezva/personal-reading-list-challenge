import { unstable_cache } from "next/cache";

export interface BookDetails {
    googleId: string;
    title: string;
    author: string;
    coverUrl: string | null;
    publishedYear: string | null;
    description: string | null;
    pageCount: number | null;
    categories: string[];
    averageRating: number | null;
    ratingsCount: number | null;
    publisher: string | null;
    language: string | null;
    isbn10: string | null;
    isbn13: string | null;
    infoLink: string | null;
    printType: string | null;
    previewLink: string | null;
    pagesRead?: number | null;
}

export const fetchFullBookData = unstable_cache(
    async (googleId: string): Promise<BookDetails | null> => {
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

        try {
            // ✅ Add API key if available (increases rate limit from 100 → 1000/day)
            const url = `https://www.googleapis.com/books/v1/volumes/${googleId}${apiKey ? `?key=${apiKey}` : ""}`;

            const res = await fetch(url, {
                next: { revalidate: 86400 }, // Cache response for 24 hours
            });

            // ✅ Handle 429 specifically with helpful log
            if (res.status === 429) {
                console.warn(
                    "⚠️ Google Books API rate limit hit for:",
                    googleId,
                );
                return null; // Return null to trigger fallback
            }

            if (!res.ok) {
                console.error(
                    "🌐 Google Books API error:",
                    res.status,
                    res.statusText,
                );
                return null;
            }

            const data = await res.json();
            if (!data.volumeInfo) return null;

            const vi = data.volumeInfo;
            const identifiers = vi.industryIdentifiers || [];

            return {
                googleId: data.id,
                title: vi.title || "Unknown Title",
                author: vi.authors?.join(", ") || "Unknown Author",
                coverUrl:
                    vi.imageLinks?.thumbnail?.replace("http://", "https://") ||
                    null,
                publishedYear: vi.publishedDate?.slice(0, 4) || null,
                description:
                    vi.description?.replace(/<[^>]*>/g, "").trim() || null,
                pageCount: vi.pageCount || null,
                categories: vi.categories || [],
                averageRating: vi.averageRating || null,
                ratingsCount: vi.ratingsCount || null,
                publisher: vi.publisher || null,
                language: vi.language || null,
                isbn10:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    identifiers.find((i: any) => i.type === "ISBN_10")
                        ?.identifier || null,
                isbn13:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    identifiers.find((i: any) => i.type === "ISBN_13")
                        ?.identifier || null,
                infoLink: vi.infoLink || null,
                printType: vi.printType || null,
                previewLink: vi.previewLink || null,
            };
        } catch (error) {
            console.error("💥 Fetch error for", googleId, ":", error);
            return null;
        }
    },
    // ✅ CRITICAL: Include googleId in cache key so each book caches separately
    ["book-details"],
    { revalidate: 86400 }, // Revalidate cache every 24 hours
);
