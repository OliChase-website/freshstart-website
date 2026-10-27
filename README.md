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
| Business name, phone, Viber, Messenger link, socials, hours, service areas, GA4 ID, booking form link | `src/data/business.json` (a contact button stays hidden until its placeholder is replaced) |
| Site URL (domain) | `astro.config.mjs` (`SITE_URL`) and `public/robots.txt` |
| A service page: title tag, meta description, H1, hero line, price, FAQs, related pages | Frontmatter at the top of `src/content/services/<page>.md` |
| A service page's body copy and price tables | The Markdown below the frontmatter in the same file |
| Publish or hide a service | `draft: true` hides it (pressure washing, car care, upholstery, property hub, garbage and junk removal are hidden until the equipment or permits are in place) |
| Area pages (/areas/fairview/ etc.) | `src/content/areas/*.md` (`draft: true` until there are 2+ real jobs there; add them under `jobs:`) |
| Images | Drop files into `src/assets/images/` named as in `src/data/images.json` (see below) |
| Blog guides | `src/content/blog/*.md` (`draft: true` until ready) |
| Social media posts (planning and automation; not published on the site) | `src/content/social/*.md` |
| Colours and fonts | `src/styles/global.css` |
| Home, prices, book, about pages | `src/pages/*.astro` |

The build fails on purpose if a service or area page title is over 60 characters or a meta description is over 155 (guides: 70 and 165), so a bad SEO edit never goes live.

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

## Images

`src/data/images.json` lists every image slot: the file name to use, the page, the aspect ratio, the alt text and a description of the scene. Save an image in `src/assets/images/` with that file name (any of .jpg, .png, .webp, .avif) and push: the build resizes it, converts it to AVIF and WebP, lazy-loads everything except the hero, and uses it for that page's link preview and schema. A slot with no file shows nothing. `public/og-default.png` is the fallback link-preview image.

Area pages and before-and-after photos must be real FreshStart job photos (no client faces, house numbers or plate numbers).

## SEO and tracking

- LocalBusiness schema on the home page; Service (with Offer or OfferCatalog), BreadcrumbList and FAQPage on every service page; Article on guides.
- Every service page shows the six areas (linked to each area page once it is live) and links to the prices page.
- Google Analytics 4: put the measurement ID in `ga4Id` in `business.json`. Clicks on Messenger, Viber, call, email and booking buttons are sent as events `click_messenger`, `click_viber`, `click_call`, `click_email`, `click_book`, `click_quote`, `click_booking_form`.
- Search Console: verify the domain with a DNS TXT record in Cloudflare (preferred), or paste the HTML-tag code into `searchConsoleVerification`. Submit `https://freshstartcleaningqc.com/sitemap-index.xml`.

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

Custom domains: `freshstartcleaningqc.com` (main) and `www.freshstartcleaningqc.com`, with a Cloudflare redirect rule sending www to the bare domain. The domain's DNS is on Cloudflare, so the Google Workspace records (MX, SPF, DKIM, DMARC) live there too.

`.github/workflows/build-check.yml` runs the same build on GitHub so problems show as a red X on the commit.
