"use client";
import { usePathname } from "next/navigation";
import { ACTIVE_CONCEPT } from "@/lib/config";
import { tokens } from "@/lib/tokens";

export default function MobileStickyBar({
  phoneNumber,
  phoneTel,
}: {
  phoneNumber: string;
  phoneTel: string;
}) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  // Leaf service pages already render Muse's dedicated concept sticky call bar
  if (parts.length >= 3) return null;

  const t = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  return (
    <div
      className="mobile-sticky-bar"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        backgroundColor: t.palette.bg,
        borderTop: `1px solid ${t.palette.line}`,
      }}
    >
      <a
        href={`tel:${phoneTel}`}
        style={{
          display: "block",
          textAlign: "center",
          padding: "16px",
          backgroundColor: t.palette.accent,
          color: t.palette.accentText || "#ffffff",
          fontWeight: 800,
          fontSize: "1.05rem",
          textDecoration: "none",
          borderRadius: t.cta?.radius ? (t.cta.radius.includes("full") ? 9999 : 12) : 10,
          margin: "8px 16px",
        }}
      >
        Call Now &mdash; {phoneNumber}
      </a>
    </div>
  );
}
