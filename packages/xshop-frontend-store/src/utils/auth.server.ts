import { redirect } from "next/navigation";
import { TOKEN_KEY } from "./auth";
import { getUrl } from "./index.server";
import { headers } from "next/headers";
export const getToken = () => {
  return headers().get(TOKEN_KEY) || undefined;
};

export const getLoginUrl = (url?: string) => {
  const redirectUrl = url || getUrl();
  return `/login?redirect=${encodeURIComponent(redirectUrl)}`;
};

export const logout = () => {
  redirect(getLoginUrl());
};

export const checkToken = () => {
  const token = getToken();
  if (!token) logout();
};
