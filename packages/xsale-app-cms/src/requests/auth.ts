export const me = /* GraphQL */ `
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
export const login = /* GraphQL */ `
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

export const forgotPassword = /* GraphQL */ `
  mutation forgotPassword($data: ForgotPasswordData) {
    forgotPassword(data: $data)
  }
`;

export const resetPassword = /* GraphQL */ `
  mutation resetPassword($data: ResetPasswordData) {
    resetPassword(data: $data)
  }
`;
