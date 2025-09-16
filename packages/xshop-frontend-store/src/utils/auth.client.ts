"use client";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "./auth";

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY) || undefined;
};

export const setToken = (token: string | undefined, expiresIn?: number) => {
  if (!token) {
    Cookies.remove(TOKEN_KEY);
    return;
  }
  const expires = expiresIn
    ? dayjs().add(expiresIn, "seconds").toDate()
    : undefined;
  Cookies.set(TOKEN_KEY, token, {
    expires,
  });
};

export const logout = () => {
  setToken(undefined);
  window.location.href = getLoginUrl();
};
export const getLoginUrl = () => {
  return `/login?url=${encodeURIComponent(window.location.href)}`;
};
