/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  i18n: {
    locales: ["th"],
    defaultLocale: "th",
  },
};

export default nextConfig;
