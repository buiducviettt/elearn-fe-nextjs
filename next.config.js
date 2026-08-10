/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    /* config options here */
    basePath: "/wp-elearn",
    assetPrefix: "/wp-elearn/",
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ["img.freepik.com"],
    },
    output: "export",
};

module.exports = nextConfig;
