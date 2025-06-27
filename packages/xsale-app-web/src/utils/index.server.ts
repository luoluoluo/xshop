import { cookies, headers } from "next/headers";
import { affiliateIdKey, urlKey } from ".";

export const getUrl = () => {
  return headers().get(urlKey) || "";
};

export const getAffiliateId = () => {
  return headers().get(affiliateIdKey) || cookies().get(affiliateIdKey)?.value;
};
