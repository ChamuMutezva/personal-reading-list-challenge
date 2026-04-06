import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-8 mt-auto bg-background border-t border-outline-variant/15">
            <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-4 max-w-7xl mx-auto">
                <div className="text-xs text-on-surface-variant/60">
                    © 2026 The Editorial Archive. All rights reserved.
                </div>
                <nav className="flex gap-6">
                    <Link
                        href="/privacy"
                        className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors"
                    >
                        Terms
                    </Link>
                    <Link
                        href="/help"
                        className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors"
                    >
                        Help
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
