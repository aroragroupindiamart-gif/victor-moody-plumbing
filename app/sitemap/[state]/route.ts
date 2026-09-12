import { getLocationsByState, getAllServices, getStates } from "@/lib/data";
import { SITE_URL } from "@/lib/config";

const MAX_URLS = 50000;

export async function generateStaticParams() {
  const states = await getStates();
  return states.map((s) => ({ state: s.state_code.toLowerCase() }));
}

interface RouteProps {
  params: Promise<{ state: string }>;
}

export async function GET(_req: Request, { params }: RouteProps) {
  const { state } = await params;

  const clean = state.replace(/\.xml$/, "");
  const match = clean.match(/^([a-z]{2})(?:-(\d+))?$/);
  if (!match) return new Response("Not Found", { status: 404 });

  const stateCode = match[1].toUpperCase();
  const page = match[2] ? parseInt(match[2], 10) : 1;

  const [locations, allServices] = await Promise.all([
    getLocationsByState(stateCode),
    getAllServices(),
  ]);

  if (locations.length === 0) return new Response("Not Found", { status: 404 });

  const today = new Date().toISOString().split("T")[0];
  const allUrls: string[] = [];

  for (const loc of locations) {
    const total = allServices.length;
    const limit = loc.tier === 1 ? total : loc.tier === 2 ? Math.ceil(total * 0.5) : Math.ceil(total * 0.17);
    const services = allServices.slice(0, limit);
    for (const svc of services) {
      allUrls.push(
        `  <url>\n    <loc>${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}/${svc.service_slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      );
    }
  }

  const start    = (page - 1) * MAX_URLS;
  const pageUrls = allUrls.slice(start, start + MAX_URLS);

  if (pageUrls.length === 0) return new Response("Not Found", { status: 404 });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
