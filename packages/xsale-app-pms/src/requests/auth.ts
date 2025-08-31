import { gql } from "graphql-tag";

export const me = /* GraphQL */ `
  query me {
    me {
      id
      name
      phone
      description
      logo
      address
      businessScope
      wechatQrcode
      idCardFrontPhoto
      idCardBackPhoto
      businessLicensePhoto
      bankCardPhoto
      wechatMerchantStatus
      wechatMerchantSignUrl
      wechatMerchantNote
      wechatMerchantId
      createdAt
    }
  }
`;

export const applyWechatMerchant = /* GraphQL */ `
  mutation applyWechatMerchant($data: ApplyWechatMerchantInput!) {
    applyWechatMerchant(data: $data) {
      id
      wechatMerchantStatus
      wechatMerchantSignUrl
      wechatMerchantNote
      wechatMerchantId
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
      merchant {
        id
        name
        phone
        description
        logo
        address
        businessScope
        wechatQrcode
        createdAt
      }
    }
  }
`;

export const register = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      token
      expiresIn
      merchant {
        id
        name
        balance
        phone
        description
        logo
        address
        businessScope
        wechatQrcode
        createdAt
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
      description
      logo
      address
      businessScope
      wechatQrcode
      createdAt
      updatedAt
    }
  }
`;
