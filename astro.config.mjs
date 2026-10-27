// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Change SITE_URL if the domain changes (also update src/data/business.json and public/robots.txt).
const SITE_URL = 'https://freshstartcleaningqc.com';

// Keep the Guides index out of the sitemap while every guide is still a draft (the page is noindex then).
const publishedGuides = readdirSync('./src/content/blog')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !/^draft:\s*true\s*$/m.test(readFileSync(`./src/content/blog/${f}`, 'utf8')));

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => publishedGuides.length > 0 || !page.endsWith('/blog/'),
    }),
  ],
});
