import { request } from "../utils/request.server";
import {
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  UpdateMeInput,
  User,
  WechatLoginInput,
} from "../generated/graphql";
import {
  ME_QUERY,
  SEND_SMS_CODE_MUTATION,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  UPDATE_ME_MUTATION,
  WECHAT_LOGIN_MUTATION,
  WECHAT_OAUTH_URL_QUERY,
  CHECK_TOKEN_QUERY,
} from "./auth.graphql";
import { getLogger } from "@/utils/logger";

export const getMe = (token?: string) => {
  return request<{ me?: User }>(
    {
      query: ME_QUERY,
    },
    token ? { Authorization: `Bearer ${token}` } : undefined,
  );
};

export const checkToken = async (token?: string) => {
  return request<{ me?: User }>(
    {
      query: CHECK_TOKEN_QUERY,
    },
    token ? { Authorization: `Bearer ${token}` } : undefined,
  ).then((res) => {
    if (res.errors) {
      getLogger().error("checkToken", {
        token,
        errors: res.errors,
      });
      return false;
    }
    return true;
  });
};

export const sendSmsCode = (variables: { data: SendSmsCodeInput }) => {
  return request<{ sendSmsCode: boolean }>({
    query: SEND_SMS_CODE_MUTATION,
    variables,
  });
};

export const login = (variables: { data: LoginInput }) => {
  return request<{ login: AuthToken }>({
    query: LOGIN_MUTATION,
    variables,
  });
};

export const wechatLogin = (variables: { data: WechatLoginInput }) => {
  return request<{ wechatLogin: AuthToken }>({
    query: WECHAT_LOGIN_MUTATION,
    variables,
  });
};

export const register = (variables: { data: RegisterInput }) => {
  return request<{ register: AuthToken }>({
    query: REGISTER_MUTATION,
    variables,
  });
};

export const updateMe = (variables: { data: UpdateMeInput }) => {
  return request<{ updateMe: User }>({
    query: UPDATE_ME_MUTATION,
    variables,
  });
};

export const getWechatOauthUrl = (variables: {
  redirectUrl: string;
  scope?: "snsapi_base" | "snsapi_userinfo";
  state?: string;
}) => {
  return request<{ wechatOauthUrl: string }>({
    query: WECHAT_OAUTH_URL_QUERY,
    variables,
  });
};
