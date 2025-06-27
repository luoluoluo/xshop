export const getRoles = /* GraphQL */ `
  query roles($where: RoleWhereInput, $skip: Int, $take: Int) {
    roles(where: $where, skip: $skip, take: $take) {
      data {
        id
        name
        permissions
        createdAt
        isActive
      }
      total
    }
  }
`;

export const getRole = /* GraphQL */ `
  query role($id: String!) {
    role(id: $id) {
      id
      name
      permissions
      isActive
      createdAt
    }
  }
`;

export const deleteRole = /* GraphQL */ `
  mutation deleteRole($id: String!) {
    deleteRole(id: $id)
  }
`;

export const createRole = /* GraphQL */ `
  mutation createRole($data: CreateRoleInput!) {
    createRole(data: $data) {
      id
    }
  }
`;

export const updateRole = /* GraphQL */ `
  mutation updateRole($id: String!, $data: UpdateRoleInput!) {
    updateRole(id: $id, data: $data) {
      id
    }
  }
`;
