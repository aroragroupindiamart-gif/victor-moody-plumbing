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
 */
export const CONTENT_SALT = Number(process.env.NEXT_PUBLIC_CONTENT_SALT ?? 0) || 0;

export const DESIGN_CONCEPT = process.env.NEXT_PUBLIC_DESIGN_CONCEPT ?? "";
const CONCEPTS_LIST = ["dispatch", "credential", "journey", "hyperlocal", "onethumb"];
export const ACTIVE_CONCEPT = DESIGN_CONCEPT || CONCEPTS_LIST[Math.abs(CONTENT_SALT) % CONCEPTS_LIST.length];

// Per-Vertical / Per-Hub LeadSmart Tracking DIDs (defaults cleanly to primary portfolio phone)
export const PHONE_WATER_PRESSURE = process.env.NEXT_PUBLIC_PHONE_WATER_PRESSURE ?? PHONE_NUMBER;
export const PHONE_BACKFLOW       = process.env.NEXT_PUBLIC_PHONE_BACKFLOW       ?? PHONE_NUMBER;
export const PHONE_REPIPE         = process.env.NEXT_PUBLIC_PHONE_REPIPE         ?? PHONE_NUMBER;

export function getDidForService(serviceSlugOrCategory?: string): { number: string; tel: string } {
  if (!serviceSlugOrCategory) return { number: PHONE_NUMBER, tel: PHONE_TEL };
  const s = serviceSlugOrCategory.toLowerCase();
  let num = PHONE_NUMBER;
  if (s.includes("water-pressure") || s.includes("prv")) {
    num = PHONE_WATER_PRESSURE;
  } else if (s.includes("backflow")) {
    num = PHONE_BACKFLOW;
  } else if (s.includes("repipe") || s.includes("pipe")) {
    num = PHONE_REPIPE;
  }
  return {
    number: num,
    tel: num.replace(/\D/g, ""),
  };
}
