// app/actions/books.ts
interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }>;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES,
  delay = INITIAL_DELAY
): Promise<T> {
  try {
    const response = await fetch(url);
    if (response.status === 429 && retries > 0) {
      // Rate limited – wait and retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('429')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function fetchBookByQuery(query: string) {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Google Books API key');
    }
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${apiKey}`;
    const data = await fetchWithRetry<GoogleBooksResponse>(url);
    return data.items?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch from Google Books:', error);
    return null; // graceful fallback
  }
}