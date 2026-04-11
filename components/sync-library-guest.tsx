"use client";
import { useEffect, useState } from "react";
import { migrateGuestLibraryAction } from "@/app/actions/migrate";

export function SyncGuestLibrary() {
    const [hasGuestData, setHasGuestData] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check for guest data on mount (client-side only)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const guestData = localStorage.getItem("guest_library");
        setHasGuestData(!!guestData);
    }, []);

    const handleSync = async () => {
        if (syncing) return;

        setSyncing(true);
        setError(null);

        try {
            const guestData = localStorage.getItem("guest_library");
            if (!guestData) {
                setHasGuestData(false);
                return;
            }

            const result = await migrateGuestLibraryAction(
                JSON.parse(guestData),
            );

            if (result.success) {
                localStorage.removeItem("guest_library");
                setSynced(true);
                setHasGuestData(false);
                // Optional: auto-hide success message after 3s
                setTimeout(() => setSynced(false), 3000);
            } else {
                setError("Failed to sync library. Please try again.");
            }
        } catch (err) {
            console.error("Sync error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSyncing(false);
        }
    };

    // Don't render anything if no guest data or already synced
    if (!hasGuestData || synced) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-accent-foreground border border-border rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-secondary">
                            Sync your guest library?
                        </h4>
                        <p className="text-xs text-secondary mt-0.5">
                            Move your locally-saved books to your account so
                            they&apos;re available on any device.
                        </p>

                        {/* Error message */}
                        {error && (
                            <p className="text-xs text-red-600 mt-2">{error}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                {syncing ? (
                                    <>
                                        <svg
                                            className="animate-spin w-3 h-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Syncing...
                                    </>
                                ) : (
                                    "Sync Now"
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    // User chose not to sync → hide the prompt
                                    setHasGuestData(false);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-foreground transition-colors"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
