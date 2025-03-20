import { writeFileSync } from 'fs';
import { resolve } from 'path';
import axios from 'axios'; // Для запросов к API

const SITE_URL = 'https://made.quixoria.ru';

// Функция для получения динамических путей новостей
async function fetchNewsPaths() {
  const response = await axios.get(`${SITE_URL}/api/news`);
  return response.data.map((news) => `/news/${news.slug}`);
}

async function fetchProductPaths() {
  const response = await axios.get(`${SITE_URL}/api/products`);
  return response.data.map((product) => `/catalog/${product.category.name}/${product.slug}`);
}

async function generateSitemap() {
  const staticPaths = [
    '/',
    '/about',
    '/user',
    '/cart',
  ];

  const newsPaths = await fetchNewsPaths();
  const productPaths = await fetchProductPaths();

  const allPaths = [...staticPaths, ...newsPaths, ...productPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map(
          (path) => `
        <url>
          <loc>${SITE_URL}${path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}
    </urlset>
  `;

  const filePath = resolve('./public/sitemap.xml');
  writeFileSync(filePath, sitemap);
  console.log(`Sitemap generated at ${filePath}`);
}

generateSitemap();