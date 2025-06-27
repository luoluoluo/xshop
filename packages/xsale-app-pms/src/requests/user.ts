export const getUsers = /* GraphQL */ `
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

export const getUser = /* GraphQL */ `
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

export const deleteUser = /* GraphQL */ `
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export const createUser = /* GraphQL */ `
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation updateUser($id: String!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
    }
  }
`;
