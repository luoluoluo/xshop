// import type { AuthProvider } from "@refinedev/core";
import { request } from "../utils/request";

export const TOKEN_KEY = "authToken";
export const TOKEN_EXPIRATION_KEY = "tokenExpiration";
export const USER_KEY = "authUser";
import { User, AuthToken, LoginInput } from "../generated/graphql";
// import { gql } from "../generated/gql";
import { AuthProvider } from "@refinedev/core";
import { forgotPassword, login, resetPassword } from "../requests/auth";
import Cookies from "js-cookie";
import dayjs from "dayjs";

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
    const res = await request<{ login?: AuthToken }>({
      query: login,
      variables: {
        data: {
          email,
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
    Cookies.set(USER_KEY, JSON.stringify(res.data?.login?.user), {
      expires: expires,
    });
    return {
      success: true,
      redirectTo: "/user",
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
  getIdentity: async () => {
    const user = Cookies.get(USER_KEY);
    if (!user) {
      return undefined;
    }
    return new Promise((resolve) => {
      resolve(JSON.parse(user) as User);
    });
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
