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
    title: z.string().max(70),             // <title> tag
    description: z.string().max(165),      // meta description
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

export const collections = { services, blog, social };
