import type { Metadata } from "next";
import Link from "next/link";
import { getDripStates } from "@/lib/data";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL, NICHE, NICHE_PLURAL, SCHEMA_TYPE, SITE_URL } from "@/lib/config";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL },
};

export default async function HomePage() {
  const states = await getDripStates();
  const totalPages     = states.reduce((sum, s) => sum + s.page_count, 0);
  const totalLocations = states.reduce((sum, s) => sum + s.location_count, 0);

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <div className="announcement-bar" style={{ textAlign: "center", padding: "10px 24px", fontSize: "0.85rem", color: "#94a3b8", paddingTop: 80 }}>
        <span style={{ color: "#f97316", fontWeight: 700 }}>24/7 EMERGENCY SERVICE</span>
        {" "}&mdash;{" "}
        Serving All 50 States &mdash; Licensed &amp; Insured &mdash; Call{" "}
        <a href={`tel:${PHONE_TEL}`} style={{ color: "white", fontWeight: 700 }}>{PHONE_NUMBER}</a>
      </div>

      <section className="hero-gradient" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", color: "#f97316", marginBottom: 16 }}>
            TRUSTED {NICHE.toUpperCase()} NATIONWIDE
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: "white" }}>
            Find Local {NICHE_PLURAL} in Your City
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#94a3b8", marginBottom: 40, lineHeight: 1.7 }}>
            {BRAND_NAME} connects homeowners and businesses with trusted, licensed {NICHE_PLURAL.toLowerCase()} across the United States.
            From emergency calls to scheduled jobs &mdash; we have you covered 24/7.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <a href={`tel:${PHONE_TEL}`} className="btn-primary" style={{ fontSize: "1.1rem", padding: "16px 36px" }}>
              Call Now &mdash; {PHONE_NUMBER}
            </a>
            <a href="#states" className="btn-secondary" style={{ fontSize: "1.1rem", padding: "16px 36px" }}>
              Browse by State
            </a>
          </div>

          <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { value: "50",                               label: "States Covered" },
              { value: totalLocations.toLocaleString(),    label: "Cities Served" },
              { value: totalPages.toLocaleString(),        label: "Service Pages" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f97316" }}>{stat.value}</div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#0d1526", padding: "60px 24px", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: 40, color: "white" }}>
            How It Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "Find Your City",     desc: `Browse by state and city to find local ${NICHE_PLURAL.toLowerCase()} in your area.` },
              { step: "02", title: "Choose a Service",   desc: `Select from our full list of ${NICHE.toLowerCase()} services — emergency or scheduled.` },
              { step: "03", title: "Call Directly",      desc: `Connect instantly with a local professional — no middleman, no delays.` },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: 16 }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f97316", lineHeight: 1, minWidth: 48 }}>{item.step}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "white", marginBottom: 8 }}>{item.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="states" style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8, color: "white" }}>Browse by State</h2>
          <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: "0.9rem" }}>
            Select your state to find local {NICHE_PLURAL.toLowerCase()} in your area.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {states.map((state) => (
              <Link key={state.state_code} href={`/${state.state_code.toLowerCase()}`} className="state-card">
                <div style={{ fontWeight: 700, color: "white", marginBottom: 4, fontSize: "0.95rem" }}>
                  {state.state_name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {state.location_count} {state.location_count === 1 ? "city" : "cities"} &middot; {state.page_count.toLocaleString()} pages
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f97316", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white", marginBottom: 12 }}>
            Need Help? Call Now.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24, fontSize: "1rem" }}>
            Our network of licensed professionals is available 24/7, 365 days a year.
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{ backgroundColor: "white", color: "#f97316", fontWeight: 800, padding: "16px 40px", borderRadius: 6, textDecoration: "none", fontSize: "1.15rem", display: "inline-block" }}
          >
            {PHONE_NUMBER}
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
