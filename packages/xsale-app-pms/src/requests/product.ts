export const getProducts = /* GraphQL */ `
  query products($where: ProductWhereInput, $skip: Int, $take: Int) {
    products(where: $where, skip: $skip, take: $take) {
      data {
        id
        merchantId
        merchant {
          id
          name
        }
        title
        image
        sort
        isActive
        category {
          id
          name
        }
        createdAt
        price
        commission
        stock
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
      categoryId
      title
      content
      image
      isActive
      sort
      category {
        id
        name
      }
      createdAt
      attributes {
        id
        name
        values
      }
      price
      commission
      stock
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
