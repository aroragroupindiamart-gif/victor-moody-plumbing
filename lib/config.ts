export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(800) 555-0100";
export const PHONE_TEL   = process.env.NEXT_PUBLIC_PHONE_TEL    ?? "8005550100";
export const BRAND_NAME  = process.env.NEXT_PUBLIC_BRAND_NAME   ?? "Your Brand Name";
export const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL     ?? "https://www.yoursite.com";

export const NICHE          = process.env.NEXT_PUBLIC_NICHE          ?? "Plumbing";
export const NICHE_PLURAL   = process.env.NEXT_PUBLIC_NICHE_PLURAL   ?? "Plumbers";
export const NICHE_SINGULAR = process.env.NEXT_PUBLIC_NICHE_SINGULAR ?? "Plumber";
export const SCHEMA_TYPE    = process.env.NEXT_PUBLIC_SCHEMA_TYPE    ?? "Plumber";

export const GA_ID      = process.env.NEXT_PUBLIC_GA_ID      ?? "";
export const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? "";
export const GSC_TOKEN  = process.env.NEXT_PUBLIC_GSC_TOKEN  ?? "";
// Site launch date (YYYY-MM-DD) for automated drip feeding
export const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "";

/**
 * Per-site offset for spintax variant selection (see lib/spintax.ts).
 * Defaults to 0, which reproduces the original hash exactly — required so the
 * live site's rendered output never changes. Multi-site generation assigns each
 * new site a distinct non-zero salt so sites don't all pick the same variant
 * for the same city/service pair.
 */
export const CONTENT_SALT = Number(process.env.NEXT_PUBLIC_CONTENT_SALT ?? 0) || 0;
