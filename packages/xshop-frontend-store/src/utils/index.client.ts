import Cookies from "js-cookie";
import { AFFILIATE_ID_KEY, URL_KEY } from ".";
export const getChannel = () => {
  const userAgent = window.navigator.userAgent;
  if (/MicroMessenger/i.test(userAgent)) return "wechat";
  return "";
};

export const getUrl = () => {
  return Cookies.get(URL_KEY);
};

export const getAffiliateId = () => {
  return Cookies.get(AFFILIATE_ID_KEY);
};
