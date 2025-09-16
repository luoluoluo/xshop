import { request } from "../utils/request.client";
import {
  AuthToken,
  CreateUserWechatMerchantInput,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  UpdateMeInput,
  User,
  WechatAccessToken,
  WechatLoginInput,
} from "../generated/graphql";
import {
  ME_QUERY,
  CREATE_USER_WECHAT_MERCHANT_MUTATION,
  SEND_SMS_CODE_MUTATION,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  UPDATE_ME_MUTATION,
  WECHAT_OAUTH_URL_QUERY,
  WECHAT_LOGIN_MUTATION,
  WECHAT_ACCESS_TOKEN_QUERY,
} from "./auth.graphql";

export const getMe = () => {
  return request<{ me?: User }>({
    query: ME_QUERY,
  });
};

export const createUserWechatMerchant = (variables: {
  data: CreateUserWechatMerchantInput;
}) => {
  return request({
    query: CREATE_USER_WECHAT_MERCHANT_MUTATION,
    variables,
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

export const wechatLogin = (variables: { data: WechatLoginInput }) => {
  return request<{ wechatLogin: AuthToken }>({
    query: WECHAT_LOGIN_MUTATION,
    variables,
  });
};

export const getWechatAccessToken = (variables: { code: string }) => {
  return request<{ wechatAccessToken: WechatAccessToken }>({
    query: WECHAT_ACCESS_TOKEN_QUERY,
    variables,
  });
};
