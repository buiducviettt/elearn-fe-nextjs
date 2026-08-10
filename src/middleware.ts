import { NextRequest, NextResponse } from "next/server";
import { URL_HOME, URL_LOGIN, URLS_PUBLIC } from "./constants/common";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicUrl = URLS_PUBLIC.some((url) => pathname.startsWith(url));

  // REDIRECT TO AUTHENTICATE
  if (!isPublicUrl && !token) {
    return NextResponse.redirect(new URL(URL_LOGIN, request.url));
  }
  if (isPublicUrl && token) {
    return NextResponse.redirect(new URL(URL_HOME, request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
