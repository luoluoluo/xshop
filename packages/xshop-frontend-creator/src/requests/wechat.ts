import { WechatJsConfig, WechatJsConfigWhere } from "../generated/graphql";
import { request } from "../utils/request";
import { WECHAT_JS_CONFIG_QUERY } from "./wechat.graphql";

export const getWechatJsConfig = (variables: {
  where: WechatJsConfigWhere;
}) => {
  return request<{ wechatJsConfig: WechatJsConfig }>({
    query: WECHAT_JS_CONFIG_QUERY,
    variables,
  });
};
