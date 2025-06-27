// import type { AuthProvider } from "@refinedev/core";
import { request } from "../utils/request";

export const TOKEN_KEY = "crmAuthToken";
export const TOKEN_EXPIRATION_KEY = "crmTokenExpiration";
export const USER_KEY = "crmAuthUser";
import { Affiliate, AuthToken, LoginInput } from "../generated/graphql";
// import { gql } from "../generated/gql";
import { AuthProvider } from "@refinedev/core";
import { forgotPassword, login, me, resetPassword } from "../requests/auth";
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
    Cookies.set(USER_KEY, JSON.stringify(res.data?.login?.affiliate), {
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
    const affiliate = authProvider.getIdentity
      ? ((await authProvider.getIdentity()) as Affiliate)
      : undefined;
    if (!affiliate) {
      return [];
    }
    // CRM应用中Affiliate没有roles，返回空数组
    return [];
  },
  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      return undefined;
    }
    const res = await request<{ me?: Affiliate }>({
      query: me,
    });
    const affiliate = res.data?.me as Affiliate;
    if (affiliate) {
      const expires = dayjs(Cookies.get(TOKEN_EXPIRATION_KEY)).toDate();
      Cookies.set(USER_KEY, JSON.stringify(me), {
        expires,
      });
      return affiliate;
    }
    return JSON.parse(Cookies.get(USER_KEY) || "{}") as Affiliate;
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
  forgotPassword: async ({ email }: { email: string }) => {
    const res = await request({
      query: forgotPassword,
      variables: {
        data: {
          email,
        },
      },
    });
    if (res.errors) {
      return {
        success: false,
        // redirectTo: `/update-password`,
        error: {
          statusCode: 500,
          message: res.errors[0].message,
        },
      };
    }

    // ...
    return {
      success: true,
      // redirectTo: `/update-password`,
      successNotification: {
        message: "Password reset successful",
        description: "Your password has been successfully reset.",
      },
    };
  },
  updatePassword: async (params: {
    password: string;
    confirmPassword: string;
    token: string;
  }) => {
    const res = await request({
      query: resetPassword,
      variables: {
        data: {
          token: params.token,
          password: params.password,
        },
      },
    });
    if (res.errors) {
      return {
        success: false,
        // redirectTo: `/login`,
        error: {
          statusCode: 500,
          // name: "Error",
          message: res.errors[0].message,
        },
      };
    }
    // you can access query strings from params.queryStrings
    return {
      success: true,
      redirectTo: `/login`,
      // redirectTo: redirectPath,
      successNotification: {
        message: "Update password successful",
        description: "You have successfully updated password.",
      },
    };
    // ...
  },
};
