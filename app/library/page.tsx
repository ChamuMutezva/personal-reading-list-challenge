import { Suspense } from "react";
import GuestLibraryClient from "./guest-library-client";
import { stackServerApp } from "@/stack/server";
import AuthLibraryClient from "./auth-library-client";
import { SyncGuestLibrary } from "@/components/sync-library-guest";

export default async function LibraryPage() {
    const user = await stackServerApp.getUser();
    console.log("Current user:", user); // Debugging line to check user state
    return (
        <>
            <Suspense
                fallback={
                    <div className="min-h-screen pt-24 flex items-center justify-center">
                        Loading library...
                    </div>
                }
            >
                {user ? <AuthLibraryClient /> : <GuestLibraryClient />}
            </Suspense>
            <SyncGuestLibrary />
        </>
    );
}
