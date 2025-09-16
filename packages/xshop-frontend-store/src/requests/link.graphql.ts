export const LINKS_QUERY = /* GraphQL */ `
  query links(
    $where: LinkWhereInput
    $skip: Int
    $take: Int
    $sorters: [SorterInput!]!
  ) {
    links(where: $where, skip: $skip, take: $take, sorters: $sorters) {
      data {
        id
        userId
        user {
          id
          name
          phone
        }
        name
        url
        logo
        qrcode
        sort
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const LINK_QUERY = /* GraphQL */ `
  query link($id: String!) {
    link(id: $id) {
      id
      userId
      user {
        id
        name
      }
      name
      url
      logo
      qrcode
      sort
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_LINK_MUTATION = /* GraphQL */ `
  mutation deleteLink($id: String!) {
    deleteLink(id: $id)
  }
`;

export const CREATE_LINK_MUTATION = /* GraphQL */ `
  mutation createLink($data: CreateLinkInput!) {
    createLink(data: $data) {
      id
    }
  }
`;

export const UPDATE_LINK_MUTATION = /* GraphQL */ `
  mutation updateLink($id: String!, $data: UpdateLinkInput!) {
    updateLink(id: $id, data: $data) {
      id
    }
  }
`;
