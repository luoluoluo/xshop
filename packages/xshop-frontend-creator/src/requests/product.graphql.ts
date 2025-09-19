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
      content
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

export const DELETE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation createProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation updateProduct($id: String!, $data: UpdateProductInput!) {
    updateProduct(id: $id, data: $data) {
      id
    }
  }
`;
