import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllLocations, getLocation, getServicesByLocationTier,
  isLocationAllowed,
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
  params: Promise<{ state: string; place: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, place } = await params;
  const stateCode = state.toUpperCase();
  const loc = await getLocation(stateCode, place);
  if (!loc) return { title: "Not Found" };
  const allowed = await isLocationAllowed(stateCode, place);
  if (!allowed) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}`;
  return {
    title: `${NICHE_PLURAL} in ${loc.place_name}, ${stateCode} | ${BRAND_NAME}`,
    description: `Find licensed ${NICHE_PLURAL.toLowerCase()} in ${loc.place_name}, ${loc.state_name}. 24/7 service available. Call ${PHONE_NUMBER}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default async function CityPage({ params }: Props) {
  const { state, place } = await params;
  const stateCode = state.toUpperCase();
  const loc = await getLocation(stateCode, place);
  if (!loc) notFound();

  const allowed = await isLocationAllowed(stateCode, place);
  if (!allowed) notFound();

  const services = await getServicesByLocationTier(loc.tier);
  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  const cityJsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE,
    name: `${BRAND_NAME} — ${loc.place_name}`,
    telephone: PHONE_NUMBER,
    url: `${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}`,
    areaServed: {
      "@type": "City",
      name: loc.place_name,
      containedInPlace: { "@type": "State", name: loc.state_name },
    },
    openingHours: "Mo-Su 00:00-23:59",
  };

  return (
    <div style={{ backgroundColor: t.palette.bg, color: t.palette.text, fontFamily: t.font, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }} />

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
        {" "}&mdash; Serving {loc.place_name}, {stateCode} &mdash;{" "}
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
            <Link href={`/${stateCode.toLowerCase()}`} style={{ color: t.palette.muted, textDecoration: "none" }}>{loc.state_name}</Link>
            <span>/</span>
            <span style={{ color: t.palette.text, fontWeight: 600 }}>{loc.place_name}</span>
          </nav>

          <div style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.15em", color: t.palette.accent, marginBottom: 12, textTransform: "uppercase" }}>
            {NICHE.toUpperCase()} SERVICES IN {loc.place_name.toUpperCase()}, {stateCode}
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, color: t.palette.text, marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {NICHE} in {loc.place_name}, {stateCode}
          </h1>

          <p style={{ color: t.palette.muted, fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720, marginBottom: 32 }}>
            Our licensed and insured {NICHE_PLURAL.toLowerCase()} in {loc.place_name} are ready to handle any job &mdash; from emergency calls to scheduled maintenance. Fast 30&ndash;45 min response, upfront pricing, 24/7 availability.
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
              ✓ 24/7 Available &middot; Zero Dispatch Fee
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ backgroundColor: t.palette.surface, padding: "60px 24px 80px", borderTop: `1px solid ${t.palette.line}`, borderBottom: `1px solid ${t.palette.line}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", color: t.palette.accent, textTransform: "uppercase" }}>
                Available Services
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.palette.text, marginTop: 4 }}>
                {NICHE} Services in {loc.place_name}
              </h2>
            </div>
            <p style={{ color: t.palette.muted, fontSize: "0.9rem", margin: 0 }}>
              Select a service below for local pricing &amp; immediate dispatch
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {services.map((svc) => (
              <Link
                key={svc.service_slug}
                href={`/${stateCode.toLowerCase()}/${loc.place_slug}/${svc.service_slug}`}
                style={{
                  backgroundColor: t.palette.bg,
                  border: `1px solid ${t.palette.line}`,
                  borderRadius: 14,
                  padding: "20px 22px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.15s, border-color 0.15s",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: t.palette.text, fontSize: "1.05rem", marginBottom: 6 }}>
                    {svc.service_name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: t.palette.muted, lineHeight: 1.5 }}>
                    Professional {svc.service_name.toLowerCase()} in {loc.place_name}. Licensed specialists available 24/7.
                  </div>
                </div>
                <div style={{ marginTop: 16, fontSize: "0.85rem", fontWeight: 700, color: t.palette.accent, display: "flex", alignItems: "center", gap: 6 }}>
                  View Details &amp; Rates &rarr;
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
            Need Emergency {NICHE} in {loc.place_name}?
          </h2>
          <p style={{ color: t.palette.accentText || "#ffffff", opacity: 0.9, marginBottom: 24, fontSize: "1rem" }}>
            Our {loc.place_name} dispatch team is standing by 24 hours a day.
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

      <Footer city={loc.place_name} stateCode={stateCode} placeSlug={loc.place_slug} />
    </div>
  );
}
