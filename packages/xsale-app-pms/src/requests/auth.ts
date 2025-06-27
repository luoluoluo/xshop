export const me = /* GraphQL */ `
  query me {
    me {
      id
      name
      balance
      phone
      createdAt
    }
  }
`;
export const login = /* GraphQL */ `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
      merchant {
        id
        name
        phone
        balance
      }
      expiresIn
    }
  }
`;
