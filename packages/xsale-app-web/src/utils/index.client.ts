import Cookies from "js-cookie";
import { affiliateIdKey } from ".";
export const getChannel = () => {
  const userAgent = window.navigator.userAgent;
  if (/MicroMessenger/i.test(userAgent)) return "wechat";
  return "";
};

export const getAffiliateId = () => {
  return Cookies.get(affiliateIdKey);
};
