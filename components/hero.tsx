import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section
            className="relative py-20 md:py-24 px-6 overflow-hidden"
            aria-label="Welcome"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Text Content */}
                <div className="relative z-10 flex flex-col justify-center">
                    <span className="text-foreground font-label uppercase tracking-widest text-sm font-bold mb-4 block">
                        An Archival Legacy
                    </span>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-headline text-primary-container leading-[1.1] mb-6">
                        Your Intellectual <br className="hidden sm:block" />
                        <span className="italic">Sanctuary</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-secondary-foreground max-w-lg mb-8 sm:mb-10 leading-relaxed font-body">
                        Organize, track, and celebrate your reading journey with
                        elegance. A digital home for the modern bibliophile.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto bg-primary-container text-surface px-8 py-3.5 sm:px-10 sm:py-4 rounded-lg text-lg font-medium shadow-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            Sign Up
                        </Link>
                        <Link
                            href="/signin"
                            className="w-full sm:w-auto border border-primary-container text-primary-container px-8 py-3.5 sm:px-10 sm:py-4 rounded-lg text-lg font-medium hover:bg-primary-container hover:text-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/library?mode=guest"
                            className="text-secondary-foreground font-medium hover:opacity-60 transition-colors underline underline-offset-4 decoration-outline-variant py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1"
                        >
                            Continue as Guest
                        </Link>
                    </div>
                </div>

                {/* Image & Floating Quote */}
                <div className="relative mt-10 lg:mt-0">
                    <div className="aspect-square rounded-lg overflow-hidden shadow-2xl rotate-1 relative bg-stone-200">
                        <Image
                            src="/grand-private-library.jpg"
                            alt="Close-up of high-quality old leather-bound books on a dark wooden shelf with soft, warm dust motes and atmospheric lighting"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                        />
                    </div>

                    {/* Floating Accent Card */}
                    <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-background p-5 md:p-6 shadow-xl rounded-lg border border-stone-200 max-w-[85%] md:max-w-xs z-20">
                        <div className="mb-2 text-tertiary-container">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                        </div>
                        <blockquote className="italic font-headline text-primary-container text-base md:text-lg leading-snug">
                            &quot;A room without books is like a body without a
                            soul.&quot;
                        </blockquote>
                        <cite className="text-xs text-muted-foreground mt-2 font-label uppercase block not-italic">
                            — Marcus Tullius Cicero
                        </cite>
                    </div>
                </div>
            </div>
        </section>
    );
}
