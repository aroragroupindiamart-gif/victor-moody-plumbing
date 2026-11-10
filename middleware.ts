import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sitemap aliases to bypass Google Search Console cached sitemap index records
  if (
    pathname === "/sitemap-main.xml" ||
    pathname === "/sitemap_v2.xml" ||
    pathname === "/sitemap-fresh.xml"
  ) {
    return NextResponse.rewrite(new URL("/sitemap.xml", request.url));
  }

  // Intercept crawler artifacts: /&, /$, /{state}/{city}, or any un-interpolated template variables
  if (
    pathname === "/&" ||
    pathname === "/$" ||
    pathname.includes("{") ||
    pathname.includes("}") ||
    pathname.includes("%7B") ||
    pathname.includes("%7D")
  ) {
    return NextResponse.redirect(new URL("/", request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
