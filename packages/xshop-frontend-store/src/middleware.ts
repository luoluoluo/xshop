import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  checkToken,
  getWechatOauthUrl,
  wechatLogin,
} from "./requests/auth.server";
import { AFFILIATE_ID_KEY, URL_KEY } from "./utils";
import { TOKEN_KEY } from "./utils/auth";
import { getLogger } from "./utils/logger";
import { getChannel } from "./utils/index.server";

export async function middleware(request: Request) {
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
  requestHeaders.set(URL_KEY, xurl);

  let token = searchParams.get(TOKEN_KEY) || cookies().get(TOKEN_KEY)?.value;
  // 推广id
  const affiliateId = searchParams.get(AFFILIATE_ID_KEY);
  if (affiliateId) {
    requestHeaders.set(AFFILIATE_ID_KEY, affiliateId);
  }

  // 检查token
  if (token) {
    const isTokenValid = await checkToken(token);
    if (!isTokenValid) {
      token = undefined;
    }
  }
  const channel = getChannel({
    headers: requestHeaders,
  });
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  /* 微信登录  start */
  if (code && state) {
    token = await wechatLogin({
      data: {
        code,
        state,
      },
    }).then((res) => {
      if (res.errors) {
        getLogger().error(res.errors, "登录错误");
        return undefined;
      }
      return res.data?.wechatLogin?.token;
    });
    if (token) {
      const isTokenValid = await checkToken(token);
      if (!isTokenValid) {
        token = undefined;
      }
    } else {
      token = undefined;
    }
  } else if (!token && channel === "wechat") {
    // wechat oauth
    const wechatOauthUrl = await getWechatOauthUrl({
      redirectUrl: xurl,
      state: "wechat",
    }).then((res) => {
      if (res.errors) {
        getLogger().error(res.errors, "登录错误");
        return undefined;
      }
      return res.data?.wechatOauthUrl;
    });
    if (wechatOauthUrl) {
      return NextResponse.redirect(wechatOauthUrl);
    }
  }
  /* 微信登录  end */

  if (token) {
    requestHeaders.set(TOKEN_KEY, token);
  } else {
    requestHeaders.delete(TOKEN_KEY);
  }

  const response = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });

  if (affiliateId) {
    response.cookies.set(AFFILIATE_ID_KEY, affiliateId, {
      expires: dayjs().add(30, "days").toDate(),
    });
  }
  if (token) {
    response.cookies.set(TOKEN_KEY, token, {
      expires: dayjs().add(30, "days").toDate(),
    });
  } else {
    response.cookies.delete(TOKEN_KEY);
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
