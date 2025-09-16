import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AFFILIATE_ID_KEY, URL_KEY } from "./utils";
import { TOKEN_KEY } from "./utils/auth";

export function middleware(request: Request) {
  if (request.method !== "GET") {
    return;
  }
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const u: URL = new URL(request.url);
  const host = request.headers.get("host");
  const searchParams = u.searchParams;
  const xurl = u
    .toString()
    .replace(
      u.origin,
      `${host?.includes("localhost") ? "http" : "https"}://${host}`,
    );
  const affiliateId = searchParams.get(AFFILIATE_ID_KEY);

  const paramsToken = searchParams.get(TOKEN_KEY);
  const cookieToken = cookies().get(TOKEN_KEY)?.value;
  const token = paramsToken || cookieToken;

  // set header url
  requestHeaders.set(URL_KEY, xurl);
  // set header affiliateId
  if (affiliateId) {
    requestHeaders.set(AFFILIATE_ID_KEY, affiliateId);
  }
  // set header token
  if (token) {
    requestHeaders.set(TOKEN_KEY, token);
  } else {
    requestHeaders.delete(TOKEN_KEY);
  }

  // set header affiliateId
  if (affiliateId) {
    requestHeaders.set(AFFILIATE_ID_KEY, affiliateId);
  }

  const response = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });

  response.cookies.set(URL_KEY, xurl);

  // set cookie token
  if (paramsToken) {
    response.cookies.set(TOKEN_KEY, paramsToken, {
      expires: dayjs().add(30, "days").toDate(),
    });
  }
  // set cookie affiliateId
  if (affiliateId) {
    response.cookies.set(AFFILIATE_ID_KEY, affiliateId, {
      expires: dayjs().add(30, "days").toDate(),
    });
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
    "/((?!api|_next|images|favicon.ico).*)",
  ],
};
