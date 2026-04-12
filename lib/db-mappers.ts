import { BookDetails } from "@/app/actions/google-book";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbRowToBookDetails(row: Record<string, any>): BookDetails {
  return {
    googleId: row.google_id,
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url,
    publishedYear: row.published_year,
    description: row.description,
    pageCount: row.page_count,
    categories: row.categories || [],
    averageRating: row.average_rating,
    ratingsCount: row.ratings_count,
    publisher: row.publisher,
    language: row.language,
    isbn10: row.isbn_10,
    isbn13: row.isbn_13,
    infoLink: row.info_link,
    printType: row.print_type,
    previewLink: row.preview_link,
  };
}