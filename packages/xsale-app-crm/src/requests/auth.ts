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
export const login = /* GraphQL */ `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
      affiliate {
        id
        name
        phone
        balance
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
