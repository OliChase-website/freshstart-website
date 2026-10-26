# FreshStart Cleaning Co. website

Astro static site. Every push to `main` is deployed by Cloudflare Pages.

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

## Deploy (Hostinger, via GitHub Actions)

Every push to `main` builds the site and uploads `dist/` to Hostinger over SSH (`.github/workflows/deploy.yml`). A failed SEO check stops the deploy, so the live site never breaks.

Repository secrets (GitHub → Settings → Secrets and variables → Actions):

| Secret | Value (from Hostinger hPanel → Advanced → SSH Access) |
|---|---|
| `HOSTINGER_HOST` | SSH IP address |
| `HOSTINGER_PORT` | SSH port (usually 65002) |
| `HOSTINGER_USER` | SSH username (u123456789) |
| `HOSTINGER_PATH` | `/home/<username>/domains/freshstartcleaningco.com.ph/public_html` |
| `HOSTINGER_SSH_KEY` | The private key of the deploy key pair; its public key is added in hPanel → SSH Access → SSH keys |

`public/.htaccess` forces HTTPS and the bare domain, adds trailing slashes and serves the 404 page.
