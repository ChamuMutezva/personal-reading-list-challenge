import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "books.google.com",
                pathname: "/books/content/**", // Only allow book cover images
            },
            // Optional: Add fallback for missing covers
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
