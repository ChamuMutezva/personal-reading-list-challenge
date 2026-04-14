"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";

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
                        className="text-2xl font-foreground italic hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
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
                                                ? "text-foreground border-b-2 border-foreground"
                                                : "text-on-surface-variant hover:text-accent"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-3 md:ml-4 md:pl-4 md:border-l border-border">
                        <UserButton />
                    </div>                    {/* Mobile Toggle */}
                    <button
                        type={"button"}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="md:hidden p-2 rounded-md text-on-surface-variant hover:bg-surface-variant/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {isOpen ? (
                            <X width={24} height={24} />
                        ) : (
                            <Menu width={24} height={24} />
                        )}
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
                                        ? "bg-primary/10 text-foreground"
                                        : "text-on-surface-variant hover:bg-surface-variant/10 hover:text-accent"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
