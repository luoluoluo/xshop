import { AuthToken, Customer } from "@/generated/graphql";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { expireInKey, meKey, tokenKey } from "./auth";

export const getToken = () => {
  return Cookies.get(tokenKey);
};

export const getMe = (): Customer | undefined => {
  const me = Cookies.get(meKey);
  if (me) {
    return JSON.parse(me) as Customer;
  }
};
export const setToken = (token: AuthToken) => {
  const expires = dayjs().add(token.expiresIn, "seconds").toDate();
  Cookies.set(tokenKey, token.token, {
    expires
  });
  Cookies.set(meKey, JSON.stringify(token.customer), {
    expires
  });
  Cookies.set(expireInKey, String(token.expiresIn), {
    expires
  });
};

// 更新 me
export const setMe = (me: Customer) => {
  const expireIn = Cookies.get(expireInKey);
  if (expireIn) {
    const expires = dayjs().add(Number(expireIn), "seconds").toDate();
    Cookies.set(meKey, JSON.stringify(me), {
      expires
    });
  }
};

export const logout = () => {
  Cookies.remove(tokenKey);
  Cookies.remove(meKey);
  window.location.href = getLoginUrl();
};
export const getLoginUrl = () => {
  return `/auth/login?url=${encodeURIComponent(window.location.href)}`;
};
