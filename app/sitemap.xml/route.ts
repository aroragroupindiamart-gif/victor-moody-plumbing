import { getDripStates } from "@/lib/data";
import { SITE_URL } from "@/lib/config";

const MAX_URLS = 50000;

export async function GET() {
  const states = await getDripStates();
  const today = new Date().toISOString().split("T")[0];

  const entries: string[] = [];

  for (const s of states) {
    const sc = s.state_code.toLowerCase();
    const totalFiles = Math.ceil(s.page_count / MAX_URLS) || 1;
    for (let i = 1; i <= totalFiles; i++) {
      const suffix = i === 1 ? "" : `-${i}`;
      entries.push(
        `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${sc}${suffix}.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
