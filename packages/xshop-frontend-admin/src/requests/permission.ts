export const GET_PERMISSIONS_QUERY = /* GraphQL */ `
  query permissions {
    permissions {
      action
      resource
      value
    }
  }
`;
