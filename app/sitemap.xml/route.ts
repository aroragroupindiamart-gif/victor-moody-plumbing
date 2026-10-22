import { getDripLocations, getDripServices } from "@/lib/data";
import { AUTHORITY_HUBS } from "@/lib/hubs";
import { SITE_URL } from "@/lib/config";

export const revalidate = 0; // Fresh on every request

export async function GET() {
  const [dripLocations, dripServices] = await Promise.all([
    getDripLocations(),
    getDripServices(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  // 1. Homepage (Priority 1.0)
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. All Authority Diagnostic Hubs & Cost Guide (Priority 0.9)
  for (const hub of AUTHORITY_HUBS) {
    urls.push(`  <url>
    <loc>${SITE_URL}/${hub.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  // 3. Active Wave-1 City Pages (Priority 0.8)
  for (const loc of dripLocations) {
    for (const svc of dripServices) {
      urls.push(`  <url>
    <loc>${SITE_URL}/${loc.state_code.toLowerCase()}/${loc.place_slug}/${svc.service_slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate, no-cache",
    },
  });
}
