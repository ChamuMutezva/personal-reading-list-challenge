import Link from "next/link";

export default async function Home() {
    
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-8 py-6">
                <div className="text-2xl font-family-headline italic text-primary">
                    The Editorial Archive
                </div>
                <div className="hidden md:flex gap-8 items-center">
                    <span className="font-label text-sm tracking-widest text-on-surface-variant uppercase">
                        Authentication Portal
                    </span>
                </div>
            </header>
            {/* Main */}
            <main className="grow flex items-center justify-center pt-24 pb-12 px-6 paper-texture">
                <div className="w-full max-w-5xl grid md:grid-cols-12 gap-0 overflow-hidden rounded-xl bg-surface-container-low shadow-[0_32px_64px_-12px_rgba(27,28,25,0.08)] border border-outline-variant/15">
                    {/* Left editorial column */}
                    <div className="md:col-span-5 relative bg-primary-container p-12 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span
                                className="material-symbols-outlined text-[12rem]"
                                style={{ fontVariationSettings: "'wght' 100" }}
                            >
                                history_edu
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h1 className="font-headline text-5xl text-on-primary italic leading-tight mb-6">
                                Welcome back to the collection.
                            </h1>
                            <p className="font-body text-on-primary-container text-lg leading-relaxed max-w-xs">
                                Access your curated journals, preserved
                                manuscripts, and archival notes.
                            </p>
                        </div>
                        <div className="relative z-10 mt-12">
                            <div className="flex items-center gap-4 text-on-primary-container">
                                <div className="w-12 h-px bg-on-primary-container/30"></div>
                                <span className="text-xs uppercase tracking-[0.3em] font-bold">
                                    Volume MMXXIV
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-on-primary-container/10 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-tertiary-container/20 flex items-center justify-center backdrop-blur-sm">
                                <span
                                    className="material-symbols-outlined text-on-tertiary-container text-4xl"
                                    style={{
                                        fontVariationSettings: "'FILL' 1",
                                    }}
                                >
                                    token
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right sign-in form */}
                    <div className="md:col-span-7 bg-surface-container-lowest p-12 md:p-20 flex flex-col justify-center">
                        <div className="mb-12">
                            <h2 className="font-headline text-3xl text-primary mb-2">
                                Sign In
                            </h2>
                            <p className="text-on-surface-variant font-body">
                                Enter your credentials to continue your
                                research.
                            </p>
                        </div>
                        <form className="space-y-8">
                            <div className="relative group">
                                <label
                                    htmlFor="email"
                                    className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="archivist@editorial.com"
                                    defaultValue="archivist@editorial.com"
                                    className="w-full bg-transparent border-b-2 border-outline-variant py-3 font-body text-primary transition-all focus:border-primary placeholder:text-outline-variant/50"
                                />
                            </div>
                            <div className="relative group">
                                <div className="flex justify-between items-center mb-1">
                                    <label
                                        htmlFor="password"
                                        className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-bold text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    defaultValue="********"
                                    className="w-full bg-transparent border-b-2 border-outline-variant py-3 font-body text-primary transition-all focus:border-primary placeholder:text-outline-variant/50"
                                />
                            </div>
                            <div className="pt-4 flex flex-col gap-6">
                                <button
                                    type="submit"
                                    className="ink-gradient text-on-primary py-4 rounded-lg font-bold tracking-wide transition-all active:scale-[0.98] shadow-sm"
                                >
                                    Sign In
                                </button>
                                <div className="relative flex items-center py-4">
                                    <div className="grow border-t border-outline-variant/30"></div>
                                    <span className="shrink mx-4 text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                                        Alternatively
                                    </span>
                                    <div className="grow border-t border-outline-variant/30"></div>
                                </div>
                                <button
                                    type="button"
                                    className="w-full border border-outline-variant/40 hover:border-primary hover:bg-surface-container-low py-4 rounded-lg font-bold text-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Continue as Guest
                                </button>
                            </div>
                        </form>
                        <div className="mt-12 text-center">
                            <p className="text-sm text-on-surface-variant">
                                New to the Archive?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary font-bold hover:underline underline-offset-4"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
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
