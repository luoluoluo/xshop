export const ROLES_QUERY = /* GraphQL */ `
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

export const ROLE_QUERY = /* GraphQL */ `
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

export const DELETE_ROLE_MUTATION = /* GraphQL */ `
  mutation deleteRole($id: String!) {
    deleteRole(id: $id)
  }
`;

export const CREATE_ROLE_MUTATION = /* GraphQL */ `
  mutation createRole($data: CreateRoleInput!) {
    createRole(data: $data) {
      id
    }
  }
`;

export const UPDATE_ROLE_MUTATION = /* GraphQL */ `
  mutation updateRole($id: String!, $data: UpdateRoleInput!) {
    updateRole(id: $id, data: $data) {
      id
    }
  }
`;
