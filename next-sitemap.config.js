/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://made.quixoria.ru",
  changefreq: "daily",
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ["/admin", "/api/"],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
