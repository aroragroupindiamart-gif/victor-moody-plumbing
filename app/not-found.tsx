import Link from "next/link";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL } from "@/lib/config";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#0B1528",
        color: "#F1F5F9",
      }}
    >
      <div style={{ maxWidth: 600, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 9999,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#EF4444",
            fontWeight: 800,
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            marginBottom: 16,
          }}
        >
          404 ERROR &middot; PAGE NOT FOUND
        </div>

        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 16,
            color: "#FFFFFF",
          }}
        >
          Location or Service Not in Active Directory
        </h1>

        <p
          style={{
            color: "#94A3B8",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          The page you requested is not currently active in our verified dispatch
          network. You can browse our core infrastructure diagnostic guides below
          or reach our 24/7 intake desk directly.
        </p>

        {/* 24/7 Phone CTA */}
        <div style={{ marginBottom: 36 }}>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 800,
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1.05rem",
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
            }}
          >
            <span>☎</span>
            <span>24/7 Emergency Dispatch: {PHONE_NUMBER}</span>
          </a>
        </div>

        {/* Hub Links */}
        <div
          style={{
            borderTop: "1px solid #1E293B",
            paddingTop: 28,
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            Core Infrastructure Diagnostic Hubs
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            <Link
              href="/low-water-pressure"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#111E36",
                border: "1px solid #1E293B",
                color: "#E2E8F0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              &rarr; Low Water Pressure Diagnostics
            </Link>
            <Link
              href="/high-water-pressure-pressure-reducing-valve"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#111E36",
                border: "1px solid #1E293B",
                color: "#E2E8F0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              &rarr; High Water Pressure & PRVs
            </Link>
            <Link
              href="/backflow-testing"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#111E36",
                border: "1px solid #1E293B",
                color: "#E2E8F0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              &rarr; Municipal Backflow Testing
            </Link>
            <Link
              href="/whole-house-repipe"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#111E36",
                border: "1px solid #1E293B",
                color: "#E2E8F0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              &rarr; Whole-House Repiping Guide
            </Link>
            <Link
              href="/"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#111E36",
                border: "1px solid #1E293B",
                color: "#60A5FA",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
                textAlign: "center",
                gridColumn: "1 / -1",
              }}
            >
              &larr; Return to Directory Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
