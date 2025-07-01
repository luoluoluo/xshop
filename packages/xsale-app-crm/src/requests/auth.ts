import { gql } from "graphql-tag";

export const me = /* GraphQL */ `
  query me {
    me {
      id
      name
      phone
      balance
      createdAt
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
