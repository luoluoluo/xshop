export const getWechatJsConfig = /* GraphQL */ `
  query wechatJsConfig($where: WechatJsConfigWhere!) {
    wechatJsConfig(where: $where) {
      appId
      timestamp
      nonceStr
      signature
    }
  }
`;
