export const VIEWS_QUERY = /* GraphQL */ `
  query views(
    $where: ViewWhereInput
    $skip: Int
    $take: Int
    $sorters: [SorterInput!]
  ) {
    views(where: $where, skip: $skip, take: $take, sorters: $sorters) {
      data {
        id
        userId
        user {
          id
          name
          phone
        }
        productId
        product {
          id
          title
          slug
        }
        articleId
        article {
          id
          title
          slug
        }
        creatorId
        creator {
          id
          name
        }
        ipAddress
        userAgent
        referer
        pageType
        pageUrl
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const VIEW_QUERY = /* GraphQL */ `
  query view($id: String!) {
    view(id: $id) {
      id
      userId
      user {
        id
        name
        phone
      }
      productId
      product {
        id
        title
        slug
      }
      articleId
      article {
        id
        title
        slug
      }
      creatorId
      creator {
        id
        name
      }
      ipAddress
      userAgent
      referer
      pageType
      pageUrl
      createdAt
      updatedAt
    }
  }
`;
