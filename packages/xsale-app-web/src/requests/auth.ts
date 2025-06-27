export const login = /* GraphQL */ `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      expiresIn
      token
      customer {
        id
        name
        phone
      }
    }
  }
`;

export const wechatAccessToken = /* GraphQL */ `
  query wechatAccessToken($code: String!) {
    wechatAccessToken(code: $code) {
      accessToken
      expiresIn
      openId
    }
  }
`;

export const getMe = /* GraphQL */ `
  query me {
    me {
      id
      name
      phone
      createdAt
      updatedAt
    }
  }
`;

export const updateMe = /* GraphQL */ `
  mutation updateMe($data: UpdateMeInput!) {
    updateMe(data: $data) {
      id
      name
      phone
      createdAt
      updatedAt
    }
  }
`;

export const wechatOauthUrl = /* GraphQL */ `
  query wechatOauthUrl($redirectUrl: String!, $scope: String, $state: String) {
    wechatOauthUrl(redirectUrl: $redirectUrl, scope: $scope, state: $state)
  }
`;
