import { Suspense } from "react";
import GuestLibraryClient from './guest-library-client';

export default function LibraryPage() {
  
    return (
        <Suspense
            fallback={
                <div className="min-h-screen pt-24 flex items-center justify-center">
                    Loading library...
                </div>
            }
        >
            <GuestLibraryClient />
        </Suspense>
    );
}
