# FreshStart Cleaning Co. website

Astro static site. Every push to `main` is deployed by Cloudflare Workers (static assets).

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # checks every page's SEO fields, then builds to dist/
```

## Where to edit things

| What | File |
|---|---|
| Business name, phone, Messenger link, socials, hours, service areas | `src/data/business.json` |
| Site URL (domain) | `astro.config.mjs` (`SITE_URL`) and `public/robots.txt` |
| A service page: title tag, meta description, H1, hero line, price, FAQs, related pages | Frontmatter at the top of `src/content/services/<page>.md` |
| A service page's body copy and price tables | The Markdown below the frontmatter in the same file |
| Publish or hide a service | `draft: true` hides it (pressure washing, car care, upholstery, property hub, garbage and junk removal are hidden until the equipment or permits are in place) |
| Blog guides | `src/content/blog/*.md` (`draft: true` until ready) |
| Social media posts (planning and automation; not published on the site) | `src/content/social/*.md` |
| Colours and fonts | `src/styles/global.css` |
| Home, prices, book, about pages | `src/pages/*.astro` |

The build fails on purpose if a title is over 70 characters or a meta description is over 165, so a bad SEO edit never goes live.

## Service page frontmatter

```yaml
url: "house-cleaning/deep-cleaning"       # page address, no slashes at the ends
level: "secondary"                         # primary = GBP category page, secondary = GBP service page
parent: "house-cleaning"                   # the primary page it sits under
title: "Deep Cleaning Service in Fairview & Novaliches | FreshStart"
description: "Meta description, 150-160 characters."
h1: "Deep cleaning service in Fairview, Lagro and Novaliches"
hero: "One-line promise under the H1."
priceFrom: "From ₱2,890"
gbp: "Deep cleaning (House cleaning service)"   # the GBP item this page mirrors
serviceType: "Deep cleaning"                     # schema.org Service type
offerPrice: 2890                                 # lowest price, for structured data
draft: false
faqs: [{"q": "Question?", "a": "Answer."}]
related: ["house-cleaning/regular-cleaning-plans"]
```

Each page automatically gets: canonical URL, Open Graph tags, LocalBusiness + Service + BreadcrumbList (+ FAQPage) JSON-LD, sitemap entry, breadcrumbs, child-service cards, related links and the booking buttons.

## Prices

The FreshStart Price Book is the source of truth. When a price changes, update the service page(s), the Google Business Profile service, the Facebook price card and the workbook on the same day, and change `pricesUpdated` in `business.json`.

## Deploy (Cloudflare Workers, free)

The Cloudflare Worker `freshstart-website` is connected to this repository and rebuilds the site on every push to `main`, usually live within a minute or two. A build that fails (for example an SEO field over its length limit) is not published, so the live site never breaks.

Cloudflare build settings (Worker → Settings → Build):

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Build variable | `NODE_VERSION` = `22` |

`wrangler.jsonc` tells Cloudflare to serve `dist/` as static files, with trailing-slash URLs and `404.html` for missing pages. `public/_headers` sets long caching for Astro's fingerprinted files.

Custom domains: `freshstartcleaningco.com.ph` (main) and `www.freshstartcleaningco.com.ph`, with a Cloudflare redirect rule sending www to the bare domain. The domain's DNS is on Cloudflare, so the Google Workspace records (MX, SPF, DKIM, DMARC) live there too.

`.github/workflows/build-check.yml` runs the same build on GitHub so problems show as a red X on the commit.
