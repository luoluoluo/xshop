export const WECHAT_JS_CONFIG_QUERY = /* GraphQL */ `
  query wechatJsConfig($where: WechatJsConfigWhere!) {
    wechatJsConfig(where: $where) {
      appId
      timestamp
      nonceStr
      signature
    }
  }
`;
