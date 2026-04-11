import Image from "next/image";
import { type SearchBook } from "@/app/actions/books";

interface SearchResultItemProps {
    book: SearchBook;
    onAdd: (book: SearchBook) => void;
    isInLibrary: boolean;
    loading: boolean;
}

export const SearchResultItem = ({
    book,
    onAdd,
    isInLibrary,
    loading,
}: SearchResultItemProps) => (
    <div className="flex gap-3 p-3 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors">
        {book.coverUrl ? (
            <Image
                src={book.coverUrl}
                alt=""
                className="w-12 h-16 object-cover rounded"
                width={48}
                height={64}
            />
        ) : (
            <div className="w-12 h-16 bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500">
                No Cover
            </div>
        )}
        <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{book.title}</h3>
            <p className="text-xs text-secondary truncate">{book.author}</p>
            <button
                onClick={() => onAdd(book)}
                disabled={isInLibrary || loading}
                className={`mt-2 text-xs font-medium ${isInLibrary ? "text-emerald-600 cursor-default" : "text-primary hover:underline"} disabled:opacity-50`}
            >
                {isInLibrary ? "✓ In Library" : "+ Add"}
            </button>
        </div>
    </div>
);
