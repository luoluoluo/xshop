import { Customer } from "@/generated/graphql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { meKey, tokenKey } from "./auth";
import { getUrl } from "./index.server";
export const getMe = () => {
  const me = cookies().get(meKey)?.value;
  if (me) {
    return JSON.parse(me) as Customer;
  }
};

export const getToken = () => {
  return cookies().get(tokenKey)?.value || undefined;
};

export const getLoginUrl = () => {
  const url = getUrl();
  return `/auth/login?redirect=${encodeURIComponent(url)}`;
};

export const logout = () => {
  redirect(getLoginUrl());
};

export const checkToken = () => {
  const token = getToken();
  if (!token) logout();
};
