# Victor Moody Plumbing — Base Directory Template

This repository serves as the master production template for programmatic local plumbing directories. It compiles to Cloudflare Workers via `@opennextjs/cloudflare`.

---

## 1. Core Architecture & Quality Standards

* **16-Week Progressive Crawl-Budget Drip**: Sitemaps and internal links dynamically meter URL exposure to match domain authority growth over 112 days (16 weeks).
* **Zero-404 Rule**: Every valid US city and catalog service combo returns HTTP 200. Combinations beyond the active crawl window return `<meta name="robots" content="noindex, follow">` to protect crawl budget without emitting 404s.
* **Measured Uniqueness Standard (<30.0% Boilerplate Ceiling)**: Evaluates full page content using local engineering narratives across water hardness, climate frost lines, and housing eras.
* **Strict Fabrication Gate**: Zero hallucinated review Schema markup (`aggregateRating` stripped to adhere to Google Structured Data policies).

---

## 2. 16-Week Drip Schedule

| Window | Days Elapsed | Metro Coverage | Service Inventory | Maximum Sitemapped URLs |
|---|---|---|---|---|
| **Weeks 1–2** | Days 0–14 | Top 60–100 Metros | 10 Core Emergency Services | **610 URLs** |
| **Weeks 3–4** | Days 15–28 | Top 100–250 Cities | Top 15 Services | **~3,760 URLs** |
| **Weeks 5–6** | Days 29–42 | Top 250–500 Cities | Top 25 Services | **~12,510 URLs** |
| **Weeks 7–8** | Days 43–56 | Top 500–800 Cities | Top 35 Services | **~28,010 URLs** |
| **Weeks 9–10** | Days 57–70 | Top 800–1,200 Cities | Top 50 Services | **~60,010 URLs** |
| **Weeks 11–12** | Days 71–84 | Top 1,200–1,600 Cities | Top 75 Services | **~120,010 URLs** |
| **Weeks 13–14** | Days 85–98 | Top 1,600–2,000 Cities | Top 100 Services | **~200,010 URLs** |
| **Weeks 15–16** | Days 99–112 | All 2,249 Cities | Top 125 Services | **~281,135 URLs** |
| **Week 16+** | Day 112+ | All 2,249 Cities | All 150 Services | **337,360 URLs** |

---

## 3. Environment Variables & GitHub Secrets

Every cloned site from the factory injects these secrets:

| Secret | Purpose | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_LAUNCH_DATE` | Start anchor date (YYYY-MM-DD) for the 16-week drip | Defaults dynamically to launch day |
| `NEXT_PUBLIC_BRAND_NAME` | Business brand name displayed across templates | `Victor Moody Plumbing` |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain URL | `https://victormoodyplumbing.com` |
| `NEXT_PUBLIC_PHONE_NUMBER` | Formatted phone number | `(800) 555-0100` |
| `NEXT_PUBLIC_PHONE_TEL` | Digits-only telephone link | `8005550100` |
| `NEXT_PUBLIC_PHONE_WATER_PRESSURE` | Optional LeadSmart DID for PRV/Pressure calls | Falls back to primary phone |
| `NEXT_PUBLIC_PHONE_BACKFLOW` | Optional LeadSmart DID for Backflow calls | Falls back to primary phone |
| `NEXT_PUBLIC_PHONE_REPIPE` | Optional LeadSmart DID for Repipe calls | Falls back to primary phone |
| `NEXT_PUBLIC_GSC_TOKEN` | Google Search Console HTML verification tag | Preserved per domain |
| `NEXT_PUBLIC_CONTENT_SALT` | Unique integer offset for spintax & design concept selection | `101` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare deployment token | Standard worker deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Account ID hash |

---

## 4. Hard Rules for Operators & Factory

1. **Never edit a live site's `CONTENT_SALT` or content pack** after Google has indexed pages. Changing the salt shifts spintax selections and invalidates cached text.
2. **Never push code to live money sites directly**: Apply all improvements to this template first, test via CI quality gates, and only rebuild live sites during planned maintenance cycles.
3. **Always preserve verification tokens**: Ensure `NEXT_PUBLIC_GSC_TOKEN` is maintained across all builds to prevent losing Google Search Console ownership.

---

## 5. Development & CI Verification

```bash
# Run TypeScript compilation
pnpm run typecheck

# Run Quality & Boilerplate Uniqueness Gate (<30% ceiling)
pnpm run test:quality

# Build for Cloudflare Workers
pnpm run build:cf
```
