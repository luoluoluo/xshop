export const ME_QUERY = /* GraphQL */ `
  query me {
    me {
      id
      slug
      name
      title
      phone
      email
      wechatId
      description
      createdAt
      avatar
      backgroundImage
    }
  }
`;

export const CHECK_TOKEN_QUERY = /* GraphQL */ `
  query me {
    me {
      id
    }
  }
`;

export const SEND_SMS_CODE_MUTATION = /* GraphQL */ `
  mutation sendSmsCode($data: SendSmsCodeInput!) {
    sendSmsCode(data: $data)
  }
`;

export const LOGIN_MUTATION = /* GraphQL */ `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
      expiresIn
    }
  }
`;

export const REGISTER_MUTATION = /* GraphQL */ `
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      token
      expiresIn
    }
  }
`;

export const UPDATE_ME_MUTATION = /* GraphQL */ `
  mutation updateMe($data: UpdateMeInput!) {
    updateMe(data: $data) {
      id
    }
  }
`;

export const WECHAT_OAUTH_URL_QUERY = /* GraphQL */ `
  query wechatOauthUrl($redirectUrl: String!, $scope: String, $state: String) {
    wechatOauthUrl(redirectUrl: $redirectUrl, scope: $scope, state: $state)
  }
`;

export const WECHAT_ACCESS_TOKEN_QUERY = /* GraphQL */ `
  query wechatAccessToken($code: String!) {
    wechatAccessToken(code: $code) {
      accessToken
      expiresIn
      openId
    }
  }
`;

export const WECHAT_LOGIN_MUTATION = /* GraphQL */ `
  mutation wechatLogin($data: WechatLoginInput!) {
    wechatLogin(data: $data) {
      token
      expiresIn
    }
  }
`;
