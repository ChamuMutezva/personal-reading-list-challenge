import { Suspense } from "react";
import GuestLibraryClient from "./guest-library-client";
import { stackServerApp } from "@/stack/server";
import AuthLibraryClient from "./auth-library-client";

export default async function LibraryPage() {
    const user = await stackServerApp.getUser();
    return (
        <Suspense
            fallback={
                <div className="min-h-screen pt-24 flex items-center justify-center">
                    Loading library...
                </div>
            }
        >
            {user ? <AuthLibraryClient /> : <GuestLibraryClient />}
        </Suspense>
    );
}
