export const getProducts = /* GraphQL */ `
  query products($where: ProductWhereInput, $skip: Int, $take: Int) {
    products(where: $where, skip: $skip, take: $take) {
      data {
        id
        merchantId
        merchant {
          id
          name
          phone
          affiliate {
            id
            name
            phone
          }
        }
        title
        image
        isActive
        createdAt
        price
        commission
        stock
        poster
        posterQrcodeConfig {
          x
          y
          w
          h
        }
      }
      total
    }
  }
`;

export const getProduct = /* GraphQL */ `
  query product($id: String!) {
    product(id: $id) {
      id
      merchantId
      merchant {
        id
        name
      }
      title
      content
      image
      isActive
      createdAt
      price
      commission
      stock
      poster
      posterQrcodeConfig {
        x
        y
        w
        h
      }
    }
  }
`;

export const deleteProduct = /* GraphQL */ `
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const createProduct = /* GraphQL */ `
  mutation createProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
    }
  }
`;

export const updateProduct = /* GraphQL */ `
  mutation updateProduct($id: String!, $data: UpdateProductInput!) {
    updateProduct(id: $id, data: $data) {
      id
    }
  }
`;

export const searchProducts = `
  query SearchProducts($keyword: String!, $take: Int) {
    products(where: { title: $keyword }, take: $take) {
      data {
        id
        title
      }
    }
  }
`;
