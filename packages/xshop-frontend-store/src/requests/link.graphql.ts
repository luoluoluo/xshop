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
