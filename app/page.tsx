import HeroSection from "@/components/hero";

export default async function Home() {
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <main className="grow flex items-center justify-center pt-24 pb-12 px-6 paper-texture">
                <HeroSection />
            </main>
        </div>
    );
}
