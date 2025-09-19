export const PRODUCTS_QUERY = /* GraphQL */ `
  query products(
    $where: ProductWhereInput
    $skip: Int
    $take: Int
    $sorters: [SorterInput!]
  ) {
    products(where: $where, skip: $skip, take: $take, sorters: $sorters) {
      data {
        id
        slug
        userId
        user {
          id
          name
          phone
        }
        title
        description
        images
        isActive
        createdAt
        price
        commission
        stock
        sort
      }
      total
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query product($id: String!) {
    product(id: $id) {
      id
      slug
      userId
      user {
        id
        name
      }
      title
      description
      images
      isActive
      createdAt
      price
      commission
      stock
      sort
    }
  }
`;
