// import type { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = "adminToken";
export const USER_KEY = "adminMe";
import { User, AuthToken, LoginInput } from "../generated/graphql";
// import { gql } from "../generated/gql";
import { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { getMe, login } from "../requests/auth";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: LoginInput) => {
    console.log(email);
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Email and password are required",
        },
      };
    }
    const res = await login({
      data: {
        email,
        password,
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
    Cookies.set(USER_KEY, JSON.stringify(res.data?.login?.user), {
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
  // 1. check 方法：负责验证和更新缓存
  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      // 清理认证数据
      return { authenticated: false, redirectTo: "/login" };
    }

    // 调用后端验证 token 并获取最新用户信息
    const res = await getMe();

    if (res.errors) {
      // Token 无效，清理数据
      return { authenticated: false, redirectTo: "/login" };
    }

    // 更新用户信息缓存
    if (res.data?.me) {
      Cookies.set(USER_KEY, JSON.stringify(res.data.me), {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    return { authenticated: true };
  },
  getPermissions: async () => {
    const user = authProvider.getIdentity
      ? ((await authProvider.getIdentity()) as User)
      : undefined;
    if (!user) {
      return [];
    }
    const permissions: string[] = [];

    user.roles?.map((role) => {
      role?.permissions?.map((permission) => {
        permissions.push(permission);
      });
    });
    return permissions;
  },
  // 2. getIdentity 方法：只从缓存读取
  getIdentity: async () => {
    const user = Cookies.get(USER_KEY);
    if (!user) {
      return undefined;
    }

    try {
      return JSON.parse(user) as User;
    } catch (error) {
      console.error("Failed to parse cached user:", error);
      Cookies.remove(USER_KEY);
      return undefined;
    }
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
