"use client";
import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { migrateGuestLibraryAction } from "@/app/actions/migrate";

export function SyncGuestLibrary() {
  const user = useUser();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user?.id || typeof globalThis.window === "undefined") return;
    
    const guestData = localStorage.getItem("guest_library");
    if (!guestData) return;

    // Start the sync process
    const syncLibrary = async () => {
      setSyncing(true);
      try {
        await migrateGuestLibraryAction(JSON.parse(guestData));
        localStorage.removeItem("guest_library");
      } finally {
        setSyncing(false);
      }
    };

    syncLibrary();
  }, [user?.id]);

  if (!syncing) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary text-background px-4 py-2 rounded-lg shadow-lg animate-pulse">
      Syncing your guest library...
    </div>
  );
}