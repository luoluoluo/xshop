import { redirect } from "next/navigation";
import { TOKEN_KEY } from "./auth";
import { getUrl } from "./index.server";
import { headers } from "next/headers";
import { getMe as getMeRequest } from "../requests/auth.server";
import { getLogger } from "./logger";

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

export const getMe = async () => {
  const me = await getMeRequest().then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getMe error");
      return undefined;
    }
    return res.data?.me;
  });
  return me;
};
