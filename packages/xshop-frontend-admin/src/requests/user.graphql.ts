export const USERS_QUERY = /* GraphQL */ `
  query users($where: UserWhereInput, $skip: Int, $take: Int) {
    users(where: $where, skip: $skip, take: $take) {
      data {
        email
        phone
        id
        name
        isActive
        roles {
          name
          id
        }
        createdAt
      }
      total
    }
  }
`;

export const USER_QUERY = /* GraphQL */ `
  query user($id: String!) {
    user(id: $id) {
      email
      phone
      id
      name
      isActive
      roles {
        name
        id
      }
      createdAt
    }
  }
`;

export const DELETE_USER_MUTATION = /* GraphQL */ `
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_USER_MUTATION = /* GraphQL */ `
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const UPDATE_USER_MUTATION = /* GraphQL */ `
  mutation updateUser($id: String!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
    }
  }
`;
