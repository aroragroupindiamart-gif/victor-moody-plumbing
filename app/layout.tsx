import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import {
  BRAND_NAME, NICHE, PHONE_NUMBER, PHONE_TEL,
  GA_ID, ADSENSE_ID, GSC_TOKEN,
} from "@/lib/config";
import StickyNav from "@/components/StickyNav";
import MobileStickyBar from "@/components/MobileStickyBar";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Local ${NICHE}`,
  description: `${BRAND_NAME} connects you with trusted local ${NICHE.toLowerCase()} professionals across the US. 24/7 service. Call ${PHONE_NUMBER} now.`,
  ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
  openGraph: {
    images: [{ url: "/opengraph.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      <body>
        <StickyNav />
        <main>{children}</main>
        <MobileStickyBar phoneNumber={PHONE_NUMBER} phoneTel={PHONE_TEL} />
      </body>
    </html>
  );
}
