"use client";

import Link from "next/link";
import {
    CredentialSignUp,
    MagicLinkSignIn,
    useStackApp,
} from "@stackframe/stack";

export default function SignUpPage() {
    const app = useStackApp();

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-body antialiased">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-6 md:px-8 py-4 md:py-6">
                <Link
                    href="/"
                    className="text-xl md:text-2xl font-headline italic text-foreground hover:opacity-80 transition-opacity"
                >
                    The Editorial Archive
                </Link>
                <div className="hidden md:flex gap-8 items-center">
                    <span className="font-label text-xs tracking-[0.2em] text-foreground uppercase">
                        Authentication Portal
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 paper-texture relative">
                <div className="absolute inset-0 bg-linear-to-br from-background/20 via-transparent to-primary-container/5 pointer-events-none" />

                <div className="w-full max-w-6xl grid md:grid-cols-12 gap-0 overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Left Editorial Column */}
                    <div className="md:col-span-5 relative bg-gradient-to-br from-primary to-surface-tint p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-15">
                            <span
                                className="material-symbols-outlined text-[10rem]"
                                style={{ fontVariationSettings: "'wght' 100" }}
                                aria-hidden="true"
                            >
                                auto_stories
                            </span>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <h1 className="font-headline text-4xl md:text-5xl text-primary-foreground italic leading-tight">
                                Begin your archival journey.
                            </h1>
                            <p className="font-body text-primary-foreground text-base md:text-lg leading-relaxed max-w-xs">
                                Create a personal collection to track, annotate,
                                and preserve your reading legacy.
                            </p>
                        </div>

                        <div className="relative z-10 mt-12">
                            <div className="flex items-center gap-4 text-on-primary-container/80">
                                <div className="w-12 h-px bg-on-primary-container/40" />
                                <span className="text-[11px] uppercase tracking-[0.3em] font-bold">
                                    Volume MMXXIV
                                </span>
                            </div>
                        </div>

                        <div className="absolute -bottom-8 -right-8 w-40 h-40 md:w-48 md:h-48 rounded-full border border-on-primary-container/15 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-tertiary-container/30 flex items-center justify-center backdrop-blur-md shadow-inner">
                                <span
                                    className="material-symbols-outlined text-on-tertiary-container text-3xl md:text-4xl"
                                    style={{
                                        fontVariationSettings: "'FILL' 1",
                                    }}
                                    aria-hidden="true"
                                >
                                    token
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Sign-Up Form */}
                    <div className="md:col-span-7 bg-surface-container-lowest p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                        <div className="mb-8 md:mb-10">
                            <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-2">
                                Create Account
                            </h2>
                            <p className="text-on-surface-variant text-sm">
                                Join the archive to start curating your
                                collection.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Email & Password */}
                            <CredentialSignUp />

                            {/* Divider */}
                            <div className="relative flex items-center py-2">
                                <div className="grow border-t border-outline-variant/30" />
                                <span className="shrink mx-4 text-[11px] uppercase tracking-[0.2em] text-outline/70 font-semibold">
                                    Or continue with
                                </span>
                                <div className="grow border-t border-outline-variant/30" />
                            </div>

                            {/* Magic Link */}
                            <MagicLinkSignIn />

                            {/* OAuth Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        app.signInWithOAuth("google")
                                    }
                                    className="flex items-center justify-center gap-2 w-full border border-outline-variant/40 hover:border-primary hover:bg-surface-container-low py-3 rounded-xl font-medium text-foreground transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="sr-only text-foreground md:not-sr-only">
                                        Google
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        app.signInWithOAuth("github")
                                    }
                                    className="flex items-center justify-center gap-2 w-full border border-outline-variant/40 hover:border-primary hover:bg-surface-container-low py-3 rounded-xl font-medium text-foreground transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                    <span className="sr-only text-foreground md:not-sr-only">
                                        GitHub
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="mt-10 text-center">
                            <p className="text-sm text-on-surface-variant/80">
                                Already a member?{" "}
                                <Link
                                    href="/signin"
                                    className="text-foreground font-semibold hover:underline underline-offset-4 transition-all"
                                >
                                    Sign in to your account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
