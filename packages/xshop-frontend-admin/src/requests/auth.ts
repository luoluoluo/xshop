export const ME_QUERY = /* GraphQL */ `
  query me {
    me {
      id
      name
      email
      roles {
        id
        name
        permissions
      }
      createdAt
    }
  }
`;
export const LOGIN_MUTATION = /* GraphQL */ `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
        roles {
          id
          name
          permissions
        }
      }
      expiresIn
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = /* GraphQL */ `
  mutation forgotPassword($data: ForgotPasswordData) {
    forgotPassword(data: $data)
  }
`;

export const RESET_PASSWORD_MUTATION = /* GraphQL */ `
  mutation resetPassword($data: ResetPasswordData) {
    resetPassword(data: $data)
  }
`;
