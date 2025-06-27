import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { affiliateIdExpireDays, affiliateIdKey, urlKey } from "./utils";
export async function middleware(request: Request) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const u: URL = new URL(request.url);
  const host = request.headers.get("host");
  const xurl = u.toString().replace(u.origin, `${host?.includes("localhost") ? "http" : "https"}://${host}`);
  requestHeaders.set(urlKey, xurl);

  const affiliateId = u.searchParams.get(affiliateIdKey);
  if (affiliateId) {
    requestHeaders.set(affiliateIdKey, affiliateId);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  if (affiliateId) {
    response.cookies.set(affiliateIdKey, affiliateId, { expires: dayjs().add(affiliateIdExpireDays, "days").toDate() });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next|images|favicon.ico).*)"
  ]
};
