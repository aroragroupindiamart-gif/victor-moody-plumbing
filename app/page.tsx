import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedLocations, getAllServices } from "@/lib/data";
import {
  BRAND_NAME, PHONE_NUMBER, PHONE_TEL, NICHE, NICHE_PLURAL,
  SCHEMA_TYPE, SITE_URL, CONTENT_SALT, ACTIVE_CONCEPT,
} from "@/lib/config";
import Footer from "@/components/Footer";
import { tokens } from "@/lib/tokens";

export const revalidate = 2592000; // 30 days edge cache

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL },
};

export default async function HomePage() {
  const featuredCities = await getFeaturedLocations(CONTENT_SALT, 16);
  const allServices = await getAllServices();
  const topServices = allServices.slice(0, 6);

  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE,
    name: BRAND_NAME,
    telephone: PHONE_NUMBER,
    url: SITE_URL,
    openingHours: "Mo-Su 00:00-23:59",
    areaServed: { "@type": "Country", name: "United States" },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/{state}/{city}`,
      "query-input": "required name=city",
    },
  };

  return (
    <div style={{ backgroundColor: t.palette.bg, color: t.palette.text, fontFamily: t.font, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

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
        <span style={{ color: t.palette.accent, fontWeight: 800, letterSpacing: "0.08em" }}>
          ● 24/7 LIVE DISPATCH ACTIVE
        </span>
        {" "}&mdash;{" "}
        Licensed &amp; Insured Technicians On Standby Across US Metros &mdash;{" "}
        <a href={`tel:${PHONE_TEL}`} style={{ color: t.palette.text, fontWeight: 800, textDecoration: "none" }}>
          Call {PHONE_NUMBER}
        </a>
      </div>

      {/* Hero Section */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: t.palette.accent,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            TRUSTED 24/7 {NICHE.toUpperCase()} NETWORK
          </div>
          <h1
            style={{
              fontSize: "clamp(2.3rem, 5.5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 20,
              color: t.palette.text,
              letterSpacing: "-0.02em",
            }}
          >
            Emergency {NICHE} Dispatch Near You
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: t.palette.muted,
              marginBottom: 36,
              lineHeight: 1.7,
              maxWidth: 680,
              margin: "0 auto 36px",
            }}
          >
            {BRAND_NAME} connects homeowners and property managers with verified local {NICHE_PLURAL.toLowerCase()}.
            Upfront flat-rate pricing, 30&ndash;45 minute on-site arrival, and zero after-hours fees.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            <a
              href={`tel:${PHONE_TEL}`}
              style={{
                backgroundColor: t.palette.accent,
                color: t.palette.accentText || "#ffffff",
                fontSize: "1.15rem",
                fontWeight: 800,
                padding: "18px 42px",
                borderRadius: t.cta?.radius?.includes("full") ? 9999 : 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              ☎ Call {PHONE_NUMBER}
            </a>
            <a
              href="#hubs"
              style={{
                backgroundColor: t.palette.surface,
                color: t.palette.text,
                border: `1px solid ${t.palette.line}`,
                fontSize: "1.05rem",
                fontWeight: 700,
                padding: "18px 32px",
                borderRadius: t.cta?.radius?.includes("full") ? 9999 : 14,
                textDecoration: "none",
              }}
            >
              View Active Coverage Hubs ↓
            </a>
          </div>

          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: "0.9rem", color: t.palette.muted, fontWeight: 600 }}>
            <span>✓ Verified State Licensed</span>
            <span>✓ Upfront Pricing Guarantee</span>
            <span>✓ 30&ndash;45 Min Average Response</span>
          </div>
        </div>
      </section>

      {/* 3-Step Process Band */}
      <section style={{ backgroundColor: t.palette.surface, padding: "50px 24px", borderTop: `1px solid ${t.palette.line}`, borderBottom: `1px solid ${t.palette.line}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 800, marginBottom: 36, color: t.palette.text }}>
            How Our Emergency Dispatch Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "Call Our Dispatch Center", desc: `Call ${PHONE_NUMBER}. A live local dispatcher answers 24/7 &mdash; never an overseas bot.` },
              { step: "02", title: "Technician Dispatched", desc: "The closest available licensed technician rolls to your address with a fully equipped vehicle." },
              { step: "03", title: "Approved & Fixed", desc: "You approve a written quote before any work starts. 100% satisfaction guaranteed." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: 16 }}>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: t.palette.accent, lineHeight: 1, minWidth: 48 }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: t.palette.text, marginBottom: 6, fontSize: "1.05rem" }}>{item.title}</div>
                  <div style={{ color: t.palette.muted, fontSize: "0.875rem", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coverage Hubs */}
      <section id="hubs" style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", color: t.palette.accent, textTransform: "uppercase" }}>
                Active Service Hubs
              </div>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: t.palette.text, marginTop: 4 }}>
                Featured Regional Dispatch Locations
              </h2>
            </div>
            <p style={{ color: t.palette.muted, fontSize: "0.9rem", margin: 0 }}>
              Crews on standby across major metro areas &middot; 24/7 dispatch
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {featuredCities.map((city) => (
              <Link
                key={city.id}
                href={`/${city.state_code.toLowerCase()}/${city.place_slug}`}
                style={{
                  backgroundColor: t.palette.surface,
                  border: `1px solid ${t.palette.line}`,
                  borderRadius: 14,
                  padding: "20px 22px",
                  textDecoration: "none",
                  display: "block",
                  transition: "transform 0.15s, border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, color: t.palette.text, fontSize: "1.05rem" }}>
                    {city.place_name}, {city.state_code}
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

      {/* Core Services Section */}
      <section style={{ backgroundColor: t.palette.surface, padding: "60px 24px 80px", borderTop: `1px solid ${t.palette.line}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: 800, color: t.palette.text, marginBottom: 36 }}>
            Emergency {NICHE} Services We Provide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {topServices.map((svc) => (
              <div
                key={svc.id}
                style={{
                  backgroundColor: t.palette.bg,
                  border: `1px solid ${t.palette.line}`,
                  borderRadius: 14,
                  padding: "24px",
                }}
              >
                <div style={{ color: t.palette.accent, fontWeight: 800, fontSize: "1.15rem", marginBottom: 8 }}>
                  {svc.service_name}
                </div>
                <p style={{ color: t.palette.muted, fontSize: "0.875rem", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Fast local dispatch for residential and commercial {svc.service_name.toLowerCase()}. Upfront flat pricing on every job.
                </p>
                <a
                  href={`tel:${PHONE_TEL}`}
                  style={{
                    color: t.palette.text,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Call for Dispatch &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ backgroundColor: t.palette.accent, padding: "50px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: t.palette.accentText || "#ffffff", marginBottom: 12 }}>
            Need A Licensed Plumber Right Now?
          </h2>
          <p style={{ color: t.palette.accentText || "#ffffff", opacity: 0.9, marginBottom: 28, fontSize: "1.05rem" }}>
            Our verified local technicians are on standby 24/7 across US metros.
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{
              backgroundColor: t.palette.surface || "#ffffff",
              color: t.palette.text,
              fontWeight: 800,
              padding: "18px 44px",
              borderRadius: t.cta?.radius?.includes("full") ? 9999 : 12,
              textDecoration: "none",
              fontSize: "1.15rem",
              display: "inline-block",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            Call {PHONE_NUMBER}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
