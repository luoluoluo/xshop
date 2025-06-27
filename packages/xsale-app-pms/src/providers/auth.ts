// import type { AuthProvider } from "@refinedev/core";
import { request } from "../utils/request";

export const TOKEN_KEY = "pmsAuthToken";
export const TOKEN_EXPIRATION_KEY = "pmsTokenExpiration";
export const USER_KEY = "pmsAuthUser";
import { Merchant, AuthToken, LoginInput } from "../generated/graphql";
// import { gql } from "../generated/gql";
import { AuthProvider } from "@refinedev/core";
import { login, me } from "../requests/auth";
import Cookies from "js-cookie";
import dayjs from "dayjs";

export const authProvider: AuthProvider = {
  login: async ({ phone, password }: LoginInput) => {
    console.log(phone);
    if (!phone || !password) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "手机号和密码不能为空",
        },
      };
    }
    const res = await request<{ login?: AuthToken }>({
      query: login,
      variables: {
        data: {
          phone,
          password,
        },
      },
    });
    if (res.errors) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: res.errors[0].message,
        },
      };
    }
    const expires = dayjs()
      .add(res.data?.login?.expiresIn || 0, "seconds")
      .toDate();
    Cookies.set(TOKEN_KEY, res.data?.login?.token || "", {
      expires,
    });
    Cookies.set(TOKEN_EXPIRATION_KEY, expires.toString(), {
      expires,
    });
    Cookies.set(USER_KEY, JSON.stringify(res.data?.login?.merchant), {
      expires: expires,
    });
    return {
      success: true,
      redirectTo: "/",
    };
  },
  logout: async () => {
    Cookies.remove(USER_KEY);
    Cookies.remove(TOKEN_KEY);
    return new Promise((resolve) => {
      resolve({
        success: true,
        redirectTo: "/login",
      });
    });
  },
  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      Cookies.remove(USER_KEY);
      Cookies.remove(TOKEN_KEY);
      return new Promise((resolve) => {
        resolve({
          authenticated: false,
          redirectTo: "/login",
          error: {
            name: "Unauthorized",
            message: "Please log in again.",
          },
        });
      });
    }
    return new Promise((resolve) => {
      resolve({
        authenticated: true,
      });
    });
  },
  getPermissions: async () => {
    const merchant = authProvider.getIdentity
      ? ((await authProvider.getIdentity()) as Merchant)
      : undefined;
    if (!merchant) {
      return [];
    }
    // CRM应用中Merchant没有roles，返回空数组
    return [];
  },
  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      return undefined;
    }
    const res = await request<{ me?: Merchant }>({
      query: me,
    });
    const merchant = res.data?.me as Merchant;
    if (merchant) {
      const expires = dayjs(Cookies.get(TOKEN_EXPIRATION_KEY)).toDate();
      Cookies.set(USER_KEY, JSON.stringify(me), {
        expires,
      });
      return merchant;
    }
    return JSON.parse(Cookies.get(USER_KEY) || "{}") as Merchant;
  },
  onError: async (error: {
    statusCode: number;
    message: string;
    extensions: {
      code: string;
    };
  }) => {
    if (error.extensions.code === "UNAUTHENTICATED") {
      Cookies.remove(USER_KEY);
      Cookies.remove(TOKEN_KEY);
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }
    return new Promise((resolve) => {
      resolve({ error });
    });
  },
};
