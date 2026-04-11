
export const EmptyLibraryState = () => (
    <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center bg-surface/50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">
            Your library is empty
        </h3>
        <p className="text-sm text-secondary max-w-sm mx-auto">
            Search for books on the left and add them to start building your
            collection.
        </p>
    </div>
);