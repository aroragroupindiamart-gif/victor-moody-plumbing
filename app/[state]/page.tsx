import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getStates, getStateByCode, getLocationsByState,
  getDripLocationsByState,
} from "@/lib/data";
import {
  BRAND_NAME, PHONE_NUMBER, PHONE_TEL, SITE_URL, NICHE, NICHE_PLURAL,
  SCHEMA_TYPE, ACTIVE_CONCEPT,
} from "@/lib/config";
import Footer from "@/components/Footer";
import { tokens } from "@/lib/tokens";

export const revalidate = 2592000; // 30 days edge cache
export const dynamicParams = true;

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const stateRow = await getStateByCode(stateCode);
  if (!stateRow) return { title: "Not Found" };
  const canonicalUrl = `${SITE_URL}/${stateCode.toLowerCase()}`;
  return {
    title: `${NICHE} in ${stateRow.state_name} | ${BRAND_NAME}`,
    description: `Find licensed ${NICHE_PLURAL.toLowerCase()} across ${stateRow.state_name}. Browse top metro locations with 24/7 service. Call ${PHONE_NUMBER}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const [stateRow, drippedLocations, allStateLocations] = await Promise.all([
    getStateByCode(stateCode),
    getDripLocationsByState(stateCode),
    getLocationsByState(stateCode),
  ]);

  if (!stateRow) notFound();

  // If drip locations exist for this state, prioritize them; otherwise show top population cities
  const displayLocations = drippedLocations.length > 0 ? drippedLocations : allStateLocations.slice(0, 40);
  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  const stateJsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE,
    name: `${BRAND_NAME} — ${stateRow.state_name}`,
    telephone: PHONE_NUMBER,
    url: `${SITE_URL}/${stateCode.toLowerCase()}`,
    areaServed: {
      "@type": "State",
      name: stateRow.state_name,
    },
    openingHours: "Mo-Su 00:00-23:59",
  };

  return (
    <div style={{ backgroundColor: t.palette.bg, color: t.palette.text, fontFamily: t.font, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stateJsonLd) }} />

      {/* Announcement Bar */}
      <div
        style={{
          textAlign: "center",
          padding: "12px 24px",
          fontSize: "0.85rem",
          color: t.palette.muted,
          paddingTop: 80,
          borderBottom: `1px solid ${t.palette.line}`,
          backgroundColor: t.palette.surface,
        }}
      >
        <span style={{ color: t.palette.accent, fontWeight: 800 }}>● 24/7 LIVE DISPATCH</span>
        {" "}&mdash; Serving All of {stateRow.state_name} &mdash;{" "}
        <a href={`tel:${PHONE_TEL}`} style={{ color: t.palette.text, fontWeight: 800, textDecoration: "none" }}>
          Call {PHONE_NUMBER}
        </a>
      </div>

      {/* Hero Section */}
      <section style={{ padding: "60px 24px 50px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: "0.85rem", color: t.palette.muted, display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/" style={{ color: t.palette.muted, textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: t.palette.text, fontWeight: 600 }}>{stateRow.state_name}</span>
          </nav>

          <div style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.15em", color: t.palette.accent, marginBottom: 12, textTransform: "uppercase" }}>
            STATEWIDE {NICHE.toUpperCase()} NETWORK &middot; {stateRow.state_name.toUpperCase()}
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, color: t.palette.text, marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Local {NICHE_PLURAL} in {stateRow.state_name}
          </h1>

          <p style={{ color: t.palette.muted, fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720, marginBottom: 32 }}>
            Browse our network of licensed, insured {NICHE_PLURAL.toLowerCase()} serving cities across {stateRow.state_name}. Available 24 hours a day, 7 days a week with rapid on-site dispatch.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={`tel:${PHONE_TEL}`}
              style={{
                backgroundColor: t.palette.accent,
                color: t.palette.accentText || "#ffffff",
                fontWeight: 800,
                fontSize: "1.1rem",
                padding: "16px 36px",
                borderRadius: t.cta?.radius?.includes("full") ? 9999 : 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              ☎ Call {PHONE_NUMBER}
            </a>
            <span style={{ fontSize: "0.85rem", color: t.palette.muted, fontWeight: 600 }}>
              ✓ Statewide Coverage &middot; 24/7 Service
            </span>
          </div>
        </div>
      </section>

      {/* Cities Directory Grid */}
      <section style={{ backgroundColor: t.palette.surface, padding: "60px 24px 80px", borderTop: `1px solid ${t.palette.line}`, borderBottom: `1px solid ${t.palette.line}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", color: t.palette.accent, textTransform: "uppercase" }}>
                Service Areas
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.palette.text, marginTop: 4 }}>
                Active Service Hubs in {stateRow.state_name}
              </h2>
            </div>
            <p style={{ color: t.palette.muted, fontSize: "0.9rem", margin: 0 }}>
              Select a city for local dispatch and service details
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {displayLocations.map((loc) => (
              <Link
                key={loc.place_slug}
                href={`/${stateCode.toLowerCase()}/${loc.place_slug}`}
                style={{
                  backgroundColor: t.palette.bg,
                  border: `1px solid ${t.palette.line}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  textDecoration: "none",
                  display: "block",
                  transition: "transform 0.15s, border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, color: t.palette.text, fontSize: "1.05rem" }}>
                    {loc.place_name}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
                    Live
                  </span>
                </div>
                <div style={{ fontSize: "0.825rem", color: t.palette.muted }}>
                  Emergency {NICHE} &middot; 24/7 Available
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ backgroundColor: t.palette.accent, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: t.palette.accentText || "#ffffff", marginBottom: 12 }}>
            Need A Plumber Anywhere in {stateRow.state_name}?
          </h2>
          <p style={{ color: t.palette.accentText || "#ffffff", opacity: 0.9, marginBottom: 24, fontSize: "1rem" }}>
            Our verified statewide technicians are available 24/7.
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{
              backgroundColor: t.palette.surface || "#ffffff",
              color: t.palette.text,
              fontWeight: 800,
              padding: "16px 40px",
              borderRadius: t.cta?.radius?.includes("full") ? 9999 : 12,
              textDecoration: "none",
              fontSize: "1.1rem",
              display: "inline-block",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            Call {PHONE_NUMBER}
          </a>
        </div>
      </section>

      <Footer stateCode={stateCode} />
    </div>
  );
}
