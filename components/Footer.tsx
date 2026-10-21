import Link from "next/link";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL, ACTIVE_CONCEPT } from "@/lib/config";
import { getAllServices } from "@/lib/data";
import { tokens } from "@/lib/tokens";

export default async function Footer({
  city,
  stateCode,
  placeSlug,
}: {
  city?: string;
  stateCode?: string;
  placeSlug?: string;
}) {
  const allServices = await getAllServices();
  const footerServices = allServices.slice(0, 5);
  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  const location = city && stateCode ? `${city}, ${stateCode}` : "Nationwide";
  const hasContext = !!(stateCode && placeSlug);

  return (
    <footer
      style={{
        backgroundColor: t.palette.surface,
        borderTop: `1px solid ${t.palette.line}`,
        padding: "48px 24px 80px",
        color: t.palette.muted,
        fontFamily: t.font,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontWeight: 800, color: t.palette.text, fontSize: "1.1rem", marginBottom: 12 }}>
              {BRAND_NAME}
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 12, color: t.palette.muted }}>
              Connecting homeowners with licensed, verified professionals {location !== "Nationwide" ? `in ${location}` : "across the US"}.
            </p>
            <a href={`tel:${PHONE_TEL}`} style={{ color: t.palette.accent, fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
              ☎ {PHONE_NUMBER}
            </a>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: t.palette.text, marginBottom: 12, fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              TOP SERVICES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem" }}>
              {footerServices.map((svc) =>
                hasContext ? (
                  <Link
                    key={svc.service_slug}
                    href={`/${stateCode!.toLowerCase()}/${placeSlug}/${svc.service_slug}`}
                    style={{ color: t.palette.muted, textDecoration: "none" }}
                  >
                    {svc.service_name}
                  </Link>
                ) : (
                  <span key={svc.service_slug} style={{ color: t.palette.muted }}>{svc.service_name}</span>
                )
              )}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: t.palette.text, marginBottom: 12, fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              DIRECTORY
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem" }}>
              <Link href="/" style={{ color: t.palette.muted, textDecoration: "none" }}>Home</Link>
              {stateCode && (
                <Link href={`/${stateCode.toLowerCase()}`} style={{ color: t.palette.muted, textDecoration: "none" }}>
                  All {stateCode.toUpperCase()} Cities
                </Link>
              )}
              <Link href="/sitemap.xml" style={{ color: t.palette.muted, textDecoration: "none" }}>XML Sitemap</Link>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${t.palette.line}`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: "0.8rem",
            color: t.palette.muted,
          }}
        >
          <span>&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
          <span>Licensed &amp; Insured &mdash; 24/7 Rapid Response</span>
        </div>
      </div>
    </footer>
  );
}
