import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedLocations, getAllServices } from "@/lib/data";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL, NICHE, NICHE_PLURAL, SCHEMA_TYPE, SITE_URL, CONTENT_SALT } from "@/lib/config";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL },
};

export default async function HomePage() {
  const featuredCities = await getFeaturedLocations(CONTENT_SALT, 16);
  const allServices = await getAllServices();
  const topServices = allServices.slice(0, 6);

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
        <span style={{ color: "#f97316", fontWeight: 700 }}>24/7 EMERGENCY DISPATCH</span>
        {" "}&mdash;{" "}
        Licensed &amp; Insured Technicians on Standby &mdash; Call{" "}
        <a href={`tel:${PHONE_TEL}`} style={{ color: "white", fontWeight: 700 }}>{PHONE_NUMBER}</a>
      </div>

      <section className="hero-gradient" style={{ padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", color: "#f97316", marginBottom: 16 }}>
            TRUSTED 24/7 {NICHE.toUpperCase()} SERVICES
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: "white" }}>
            Emergency {NICHE} Dispatch Near You
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#94a3b8", marginBottom: 36, lineHeight: 1.7, maxWidth: 680, margin: "0 auto 36px" }}>
            {BRAND_NAME} connects homeowners with licensed, vetted local {NICHE_PLURAL.toLowerCase()}. Upfront pricing, fast on-site arrival, and zero after-hours fees.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href={`tel:${PHONE_TEL}`} className="btn-primary" style={{ fontSize: "1.15rem", padding: "18px 40px", borderRadius: 12 }}>
              ☎ Call {PHONE_NUMBER}
            </a>
            <a href="#hubs" className="btn-secondary" style={{ fontSize: "1.1rem", padding: "18px 32px", borderRadius: 12 }}>
              View Active Coverage Hubs ↓
            </a>
          </div>

          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: "0.9rem", color: "#cbd5e1" }}>
            <span>✓ Licensed &amp; Insured</span>
            <span>✓ Upfront Pricing Guarantee</span>
            <span>✓ 30&ndash;45 Min Average Response</span>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#0d1526", padding: "50px 24px", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: 36, color: "white" }}>
            How Our Emergency Dispatch Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "Call Our Dispatcher", desc: `Call ${PHONE_NUMBER}. A live dispatcher answers 24/7 — never an automated bot.` },
              { step: "02", title: "Technician Dispatched", desc: "The closest available licensed technician rolls to your location with a fully stocked truck." },
              { step: "03", title: "Fixed on the Spot", desc: "You approve a flat, upfront quote before work begins. Backed by our workmanship warranty." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: 16 }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f97316", lineHeight: 1, minWidth: 44 }}>{item.step}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "white", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hubs" style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", color: "#f97316", textTransform: "uppercase" }}>
                Active Service Hubs
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white", marginTop: 4 }}>
                Featured Regional Dispatch Locations
              </h2>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
              Crews on standby across major metro areas &middot; 24/7 dispatch
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {featuredCities.map((city) => (
              <Link
                key={city.id}
                href={`/${city.state_code.toLowerCase()}/${city.place_slug}`}
                className="state-card"
                style={{ padding: "18px 20px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, color: "white", fontSize: "1.05rem" }}>
                    {city.place_name}, {city.state_code}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
                    Online
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  Emergency {NICHE} &middot; 24/7 Available
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#0b1220", padding: "60px 24px 80px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: 32 }}>
            Emergency {NICHE} Services We Provide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {topServices.map((svc) => (
              <div key={svc.id} style={{ background: "#111c33", border: "1px solid #263453", borderRadius: 12, padding: "22px" }}>
                <div style={{ color: "#f97316", fontWeight: 800, fontSize: "1.1rem", marginBottom: 8 }}>
                  {svc.service_name}
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "0.875rem", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Fast local dispatch for residential and commercial {svc.service_name.toLowerCase()}. Upfront flat pricing on every job.
                </p>
                <a href={`tel:${PHONE_TEL}`} style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
                  Call for Dispatch &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f97316", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white", marginBottom: 12 }}>
            Need An Emergency Plumber Right Now?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24, fontSize: "1rem" }}>
            Our network of licensed professionals is available 24/7, 365 days a year.
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{ backgroundColor: "white", color: "#f97316", fontWeight: 800, padding: "16px 40px", borderRadius: 10, textDecoration: "none", fontSize: "1.15rem", display: "inline-block" }}
          >
            {PHONE_NUMBER}
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
