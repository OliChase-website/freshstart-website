// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change SITE_URL once the domain is bought (also update src/data/business.json).
const SITE_URL = 'https://www.example.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap()],
});
