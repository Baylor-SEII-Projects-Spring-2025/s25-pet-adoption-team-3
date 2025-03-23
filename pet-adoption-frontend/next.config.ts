const isProd = process.env.NODE_ENV === "production";

// Load .env only in development
if (!isProd) {
    require("dotenv").config();
}

console.log(
    "🔍 Loaded NEXT_PUBLIC_API_BASE_URL:",
    process.env.NEXT_PUBLIC_API_BASE_URL,
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["via.placeholder.com"], // ✅ Add this to allow external images
    }
};

module.exports = nextConfig;
