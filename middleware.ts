import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
