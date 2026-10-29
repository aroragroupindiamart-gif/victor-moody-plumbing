import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
