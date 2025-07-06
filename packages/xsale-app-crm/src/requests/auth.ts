import { gql } from "graphql-tag";

export const me = /* GraphQL */ `
  query me {
    me {
      id
      name
      phone
      balance
      createdAt
      wechatOAuth {
        openId
        nickName
        avatar
        createdAt
      }
    }
  }
`;

export const sendSmsCode = gql`
  mutation sendSmsCode($data: SendSmsCodeInput!) {
    sendSmsCode(data: $data)
  }
`;

export const login = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
      expiresIn
      affiliate {
        id
        name
        phone
        balance
        wechatOAuth {
          openId
          nickName
          avatar
          createdAt
        }
      }
    }
  }
`;

export const register = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      token
      expiresIn
      affiliate {
        id
        name
        phone
        balance
        wechatOAuth {
          openId
          nickName
          avatar
          createdAt
        }
      }
    }
  }
`;

export const updateMe = /* GraphQL */ `
  mutation updateMe($data: UpdateMeInput!) {
    updateMe(data: $data) {
      id
      name
      phone
      balance
      createdAt
      updatedAt
    }
  }
`;

export const updateMeWechatAccessToken = gql`
  mutation updateMeWechatAccessToken($code: String!) {
    updateMeWechatAccessToken(code: $code) {
      openId
    }
  }
`;
export const getWechatOauthUrl = /* GraphQL */ `
  query wechatOauthUrl($redirectUrl: String!, $scope: String, $state: String) {
    wechatOauthUrl(redirectUrl: $redirectUrl, scope: $scope, state: $state)
  }
`;
