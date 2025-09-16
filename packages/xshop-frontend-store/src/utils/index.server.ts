import { cookies, headers } from "next/headers";
import { AFFILIATE_ID_KEY, URL_KEY } from ".";

export const getUrl = () => {
  return headers().get(URL_KEY) || "";
};

export const getAffiliateId = () => {
  return (
    headers().get(AFFILIATE_ID_KEY) || cookies().get(AFFILIATE_ID_KEY)?.value
  );
};

export const getChannel = (options?: { headers?: Headers }) => {
  const userAgent = options?.headers
    ? options.headers.get("user-agent")
    : headers().get("user-agent");
  if (userAgent && /MicroMessenger/i.test(userAgent)) {
    return "wechat";
  }
  return undefined;
};
