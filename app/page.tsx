import HeroSection from "@/components/hero";
import Link from "next/link";
// import { fetchBookByQuery } from "./actions/books";

export default async function Home() {
    //  const bookData = await fetchBookByQuery("intitle:dune");
    //  console.log(bookData?.volumeInfo.title); // For testing purposes
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
         
            {/* Main */}
            <main className="grow flex items-center justify-center pt-24 pb-12 px-6 paper-texture">
             <HeroSection />
            </main>

            {/* Footer */}
            <footer className="w-full py-12 mt-auto bg-background border-t border-outline-variant/15">
                <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-7xl mx-auto">
                    <div className="font-sans text-sm tracking-wide text-on-surface-variant">
                        © 2024 The Editorial Archive. All rights reserved.
                    </div>
                    <nav className="flex gap-8">
                        <Link
                            href="/privacy"
                            className="font-sans text-sm tracking-wide text-on-surface-variant hover:text-primary transition-all"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="font-sans text-sm tracking-wide text-on-surface-variant hover:text-primary transition-all"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/help"
                            className="font-sans text-sm tracking-wide text-on-surface-variant hover:text-primary transition-all"
                        >
                            Help Center
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
