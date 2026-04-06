import HeroSection from "@/components/hero";
// import Link from "next/link";
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
        </div>
    );
}
