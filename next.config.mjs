/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;