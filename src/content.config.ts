import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

// One Markdown file per website service page (primary = GBP category, secondary = GBP service).
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    url: z.string(),                       // path without slashes, e.g. "house-cleaning/deep-cleaning"
    level: z.enum(['primary', 'secondary']),
    parent: z.string().optional(),         // url of the primary page
    title: z.string().max(60),             // <title> tag (GBP doc rule: under 60 characters)
    description: z.string().max(155),      // meta description (under 155)
    h1: z.string(),
    hero: z.string(),                      // one-line promise under the H1
    priceFrom: z.string(),                 // e.g. "From ₱2,890"
    gbp: z.string(),                       // GBP category or service it mirrors
    serviceType: z.string(),               // schema.org Service.serviceType
    offerPrice: z.number().optional(),     // lowest price for schema Offer
    menuLabel: z.string().optional(),
    order: z.number().default(50),
    draft: z.boolean().default(false),     // true = not published (service not available yet)
    faqs: z.array(faq).default([]),
    related: z.array(z.string()).default([]),
    breadcrumbParent: z.string().optional(), // interim breadcrumb parent while the real parent page is a draft
  }),
});

// One Markdown file per service-area page (e.g. /areas/fairview/). The playbook rule: publish an area
// page only once there are at least two real jobs (and ideally reviews) there, so they start as drafts.
const job = z.object({
  title: z.string(),            // "Deep clean of a 2BR townhouse"
  service: z.string(),          // service page url, e.g. "house-cleaning/deep-cleaning"
  month: z.string(),            // "November 2026"
  summary: z.string(),          // 1-2 sentences: what was done, how long, what the client needed
  image: z.string().optional(), // optional image slot key in src/data/images.json
});
const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    name: z.string(),                       // must match a name in business.json "areas"
    slug: z.string(),                       // page address: /areas/<slug>/
    title: z.string().max(60),
    description: z.string().max(155),
    h1: z.string(),
    hero: z.string(),
    services: z.array(z.string()).default([]), // the 3-4 services most booked there (service urls)
    jobs: z.array(job).default([]),
    faqs: z.array(faq).default([]),
    draft: z.boolean().default(true),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(165),
    h1: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    services: z.array(z.string()).default([]),
  }),
});

// Social posts are kept as files for planning and automation; they are NOT published as web pages.
const social = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/social' }),
  schema: z.object({
    platform: z.array(z.enum(['facebook', 'instagram', 'tiktok', 'gbp', 'viber'])),
    publishOn: z.coerce.date(),
    status: z.enum(['idea', 'draft', 'approved', 'posted']).default('draft'),
    link: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { services, areas, blog, social };
