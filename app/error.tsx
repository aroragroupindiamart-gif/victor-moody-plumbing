"use client";
import { useEffect } from "react";
import Link from "next/link";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL } from "@/lib/config";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a chunk loading failure from an asset deployment update, auto-reload once to fetch fresh chunks
    if (error.name === "ChunkLoadError" || error.message?.includes("Loading chunk")) {
      const reloaded = sessionStorage.getItem("chunk_reloaded");
      if (!reloaded) {
        sessionStorage.setItem("chunk_reloaded", "true");
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B1220", color: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 12 }}>24/7 Emergency Dispatch Active</h1>
        <p style={{ color: "#CBD5E1", marginBottom: 24, lineHeight: 1.6 }}>
          Our network dispatch coordinators are on standby 24 hours a day. Call immediately for verified local technician dispatch.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{ backgroundColor: "#E11D48", color: "#FFFFFF", padding: "14px 28px", borderRadius: 10, fontWeight: 800, textDecoration: "none" }}
          >
            ☎ Call {PHONE_NUMBER}
          </a>
          <button
            onClick={() => reset()}
            style={{ backgroundColor: "#111C33", border: "1px solid #263453", color: "#F8FAFC", padding: "14px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
