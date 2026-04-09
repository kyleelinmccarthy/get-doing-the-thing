/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@doing-the-thing/shared"],
};

export default nextConfig;
