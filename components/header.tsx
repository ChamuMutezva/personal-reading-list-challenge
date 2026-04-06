"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";


export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { href: "/library", label: "Library" },
        { href: "/goals", label: "Goals" },
        { href: "/statistics", label: "Statistics" },
        { href: "/progress", label: "Progress" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand */}
                    <Link
                        href="/"
                        className="text-2xl font-family-headline italic text-primary hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                        The Editorial Archive
                    </Link>

                    {/* Desktop Nav + Auth */}
                    <nav
                        className="hidden md:flex items-center gap-8"
                        aria-label="Main navigation"
                    >
                        <ul className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 py-0.5 ${
                                            isActive(link.href)
                                                ? "text-primary border-b-2 border-primary"
                                                : "text-on-surface-variant hover:text-primary"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
                            <Link
                                href="/signin"
                                className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-bold bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        type={"button"}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="md:hidden p-2 rounded-md text-on-surface-variant hover:bg-surface-variant/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {isOpen ? <X width={24} height={24}/> : <Menu width={24} height={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div
                    id="mobile-menu"
                    className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
                >
                    <nav
                        className="px-4 py-4 space-y-1"
                        aria-label="Mobile navigation"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={`block px-3 py-2 text-base font-bold rounded-md transition-colors ${
                                    isActive(link.href)
                                        ? "bg-primary/10 text-primary"
                                        : "text-on-surface-variant hover:bg-surface-variant/10 hover:text-primary"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4 pt-4 border-t border-border space-y-2">
                            <Link
                                href="/signin"
                                onClick={closeMenu}
                                className="block w-full text-center px-3 py-2 text-base font-bold text-on-surface-variant hover:text-primary transition-colors rounded-md"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={closeMenu}
                                className="block w-full text-center px-3 py-2 text-base font-bold bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
