"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BRAND_NAME, PHONE_NUMBER, PHONE_TEL, NICHE, ACTIVE_CONCEPT } from "@/lib/config";
import { tokens } from "@/lib/tokens";

function slugToTitle(s: string): string {
  return s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const parts = pathname.split("/").filter(Boolean);

  // Leaf service pages already render Muse's dedicated concept top bar
  if (parts.length >= 3) return null;

  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  let contextLabel: string | null = null;
  let stateSlug: string | null = null;
  let citySlug:  string | null = null;

  if (parts.length >= 2) {
    stateSlug = parts[0];
    citySlug  = parts[1];
    contextLabel = `${slugToTitle(citySlug)}, ${stateSlug.toUpperCase()}`;
  } else if (parts.length === 1 && parts[0].length === 2) {
    stateSlug = parts[0];
  }

  const navLinks: { label: string; href: string }[] =
    parts.length >= 2 && stateSlug && citySlug
      ? [
          { label: stateSlug.toUpperCase(), href: `/${stateSlug}` },
          { label: "All States", href: "/" },
        ]
      : parts.length === 1 && stateSlug
      ? [{ label: "All States", href: "/" }]
      : [
          { label: NICHE, href: "/" },
          { label: "All States", href: "/" },
        ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrolled ? t.palette.surface : t.palette.bg,
        borderBottom: `1px solid ${t.palette.line}`,
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
        transition: "background-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" style={{ color: t.palette.text, textDecoration: "none", fontWeight: 800, fontSize: "1.15rem", whiteSpace: "nowrap" }}>
          {BRAND_NAME}
          {contextLabel && (
            <span className="nav-context-label" style={{ color: t.palette.muted, fontWeight: 400, fontSize: "0.85rem", marginLeft: 8 }}>
              — {contextLabel}
            </span>
          )}
        </Link>

        <div style={{ display: "flex", gap: 24, fontSize: "0.85rem" }} className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href} style={{ color: t.palette.muted, textDecoration: "none", fontWeight: 600 }}>
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href={`tel:${PHONE_TEL}`}
          className="nav-phone-btn"
          style={{
            backgroundColor: t.palette.accent,
            color: t.palette.accentText || "#ffffff",
            fontWeight: 800,
            padding: "10px 20px",
            borderRadius: t.cta?.radius ? (t.cta.radius.includes("full") ? 9999 : 12) : 10,
            textDecoration: "none",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
          }}
        >
          {PHONE_NUMBER}
        </a>
      </div>
    </nav>
  );
}
