import Link from "next/link";
import type { AuthorityHub } from "@/lib/hubs";
import { Location } from "@/lib/data";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL } from "@/lib/config";
import Footer from "@/components/Footer";

export default function HubTemplate({
  hub,
  locations,
}: {
  hub: AuthorityHub;
  locations: Location[];
}) {
  let serviceSlug = "water-pressure-problems";
  if (hub.category === "backflow") {
    serviceSlug = "backflow-preventer-testing";
  } else if (hub.category === "repipe") {
    serviceSlug = "pipe-replacement";
  }

  return (
    <div style={{ backgroundColor: "#0B1528", color: "#F1F5F9", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1E293B", padding: "16px 24px", backgroundColor: "#0A1222", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 900, color: "#FFFFFF", textDecoration: "none", letterSpacing: "-0.02em" }}>
            {BRAND_NAME}
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 800,
              borderRadius: 8,
              textDecoration: "none",
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            }}
          >
            <span>☎</span>
            <span>24/7 Dispatch: {PHONE_NUMBER}</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "60px 24px 50px", borderBottom: "1px solid #1E293B", background: "linear-gradient(180deg, #0A1222 0%, #0F1C36 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          {/* Trust Badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 9999, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22C55E", fontSize: "0.825rem", fontWeight: 800 }}>
              <span>★ 4.8 / 5.0</span>
              <span>&middot; Verified Local Specialist Network</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 9999, backgroundColor: "rgba(37, 99, 235, 0.15)", color: "#60A5FA", fontSize: "0.825rem", fontWeight: 800 }}>
              {hub.badge}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 9999, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", fontSize: "0.825rem", fontWeight: 800 }}>
              Priority 24/7 Emergency Dispatch
            </span>
          </div>

          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: "#FFFFFF" }}>
            {hub.title}
          </h1>

          <p style={{ fontSize: "1.15rem", lineHeight: 1.65, color: "#94A3B8", maxWidth: 840, margin: "0 auto 32px" }}>
            {hub.summary}
          </p>

          <div style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href={`tel:${PHONE_TEL}`}
              style={{
                padding: "16px 36px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: "1.15rem",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 12px 30px -5px rgba(37, 99, 235, 0.5)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>☎ Call 24/7 Technician Intake:</span>
              <span>{PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Diagnostic Tree Section */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Interactive Diagnostic Triage
            </h2>
          </div>

          <div style={{ backgroundColor: "#111E36", border: "1px solid #1E293B", borderRadius: 16, padding: "28px" }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#38BDF8", marginBottom: 20 }}>
              Key Assessment: {hub.diagnosticTree.question}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              <div style={{ backgroundColor: "#0A1222", border: "1px solid #1E293B", borderRadius: 12, padding: "22px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Scenario A
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#F8FAFC", marginBottom: 10 }}>
                  {hub.diagnosticTree.scenarioA.condition}
                </div>
                <p style={{ fontSize: "0.9rem", color: "#94A3B8", lineHeight: 1.6, marginBottom: 12 }}>
                  <strong style={{ color: "#F1F5F9" }}>Diagnosis:</strong> {hub.diagnosticTree.scenarioA.diagnosis}
                </p>
                <div style={{ fontSize: "0.85rem", color: "#60A5FA", backgroundColor: "rgba(37, 99, 235, 0.1)", padding: "10px 14px", borderRadius: 8, lineHeight: 1.5 }}>
                  <strong>Action Required:</strong> {hub.diagnosticTree.scenarioA.action}
                </div>
              </div>

              <div style={{ backgroundColor: "#0A1222", border: "1px solid #1E293B", borderRadius: 12, padding: "22px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Scenario B
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#F8FAFC", marginBottom: 10 }}>
                  {hub.diagnosticTree.scenarioB.condition}
                </div>
                <p style={{ fontSize: "0.9rem", color: "#94A3B8", lineHeight: 1.6, marginBottom: 12 }}>
                  <strong style={{ color: "#F1F5F9" }}>Diagnosis:</strong> {hub.diagnosticTree.scenarioB.diagnosis}
                </p>
                <div style={{ fontSize: "0.85rem", color: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "10px 14px", borderRadius: 8, lineHeight: 1.5 }}>
                  <strong>Action Required:</strong> {hub.diagnosticTree.scenarioB.action}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call Priming Block */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ backgroundColor: "#172554", border: "2px solid #3B82F6", borderRadius: 16, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: "1.6rem" }}>📋</span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: 0 }}>
                Before You Call Dispatch: 3-Point Checklist
              </h3>
            </div>
            <p style={{ fontSize: "0.95rem", color: "#BFDBFE", lineHeight: 1.6, margin: "0 0 18px" }}>
              To ensure our intake coordinator connects you with the appropriate certified infrastructure specialist, please have the following information prepared:
            </p>
            <ol style={{ margin: 0, paddingLeft: 24, fontSize: "0.95rem", color: "#F8FAFC", lineHeight: 1.8 }}>
              <li><strong>Scope of Failure:</strong> Confirm whether the issue affects the entire property simultaneously or an isolated fixture/zone.</li>
              <li><strong>System Specifications:</strong> Note your approximate property construction year and existing pipe material (copper, galvanized, PEX, polybutylene).</li>
              <li><strong>Location:</strong> Provide your exact local ZIP code and confirm whether outdoor water shutoff valves and meters are accessible.</li>
            </ol>
          </div>
        </section>

        {/* Technical Overview & Codes */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30, marginBottom: 60 }}>
          <div style={{ backgroundColor: "#111E36", border: "1px solid #1E293B", borderRadius: 16, padding: "28px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 16 }}>
              Technical Engineering Standards
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 20 }}>
              {hub.technicalOverview}
            </p>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              Governing Codes & Certifications
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.7 }}>
              {hub.keyCodesAndStandards.map((code, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>{code}</li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: "#111E36", border: "1px solid #1E293B", borderRadius: 16, padding: "28px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 16 }}>
              Key Symptoms & Failure Signals
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#CBD5E1", fontSize: "0.95rem", lineHeight: 1.8 }}>
              {hub.symptoms.map((sym, idx) => (
                <li key={idx} style={{ marginBottom: 10 }}>{sym}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Wave-1 Local Service Areas */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FFFFFF", marginBottom: 12 }}>
              Verified Wave-1 Metro Coverage Areas
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: 640, margin: "0 auto" }}>
              Direct access to licensed, verified diagnostic plumbers across our core Arizona and California service zones.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/${loc.state_code.toLowerCase()}/${loc.place_slug}/${serviceSlug}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  backgroundColor: "#111E36",
                  border: "1px solid #1E293B",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "1rem" }}>
                    {loc.place_name}, {loc.state_code}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                    24/7 Diagnostic Dispatch
                  </div>
                </div>
                <span style={{ color: "#60A5FA", fontSize: "1.2rem" }}>&rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 24, textAlign: "center" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {hub.faqs.map((faq, idx) => (
              <div key={idx} style={{ backgroundColor: "#111E36", border: "1px solid #1E293B", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontWeight: 800, color: "#F8FAFC", fontSize: "1.05rem", marginBottom: 8 }}>
                  {faq.q}
                </div>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Card */}
        <section style={{ textAlign: "center", backgroundColor: "#172554", border: "1px solid #2563EB", borderRadius: 20, padding: "48px 24px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: 12 }}>
            Need Immediate Diagnostics or Same-Day Dispatch?
          </h2>
          <p style={{ color: "#BFDBFE", fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 28px" }}>
            Speak directly with our local diagnostic intake desk. Upfront estimates, verified state-licensed contractors, and zero after-hours emergency surcharge fees.
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{
              padding: "16px 36px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: "1.2rem",
              borderRadius: 12,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
            }}
          >
            <span>☎</span>
            <span>Call Now: {PHONE_NUMBER}</span>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
