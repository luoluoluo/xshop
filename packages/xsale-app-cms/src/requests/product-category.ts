export const getProductCategories = /* GraphQL */ `
  query productCategories(
    $where: ProductCategoryWhereInput
    $skip: Int
    $take: Int
  ) {
    productCategories(where: $where, skip: $skip, take: $take) {
      data {
        id
        merchantId
        merchant {
          id
          name
        }
        name
        image
        isActive
        sort
        createdAt
      }
      total
    }
  }
`;

export const getProductCategory = /* GraphQL */ `
  query productCategory($id: String!) {
    productCategory(id: $id) {
      id
      merchantId
      merchant {
        id
        name
      }
      name
      image
      isActive
      sort
      createdAt
    }
  }
`;

export const deleteProductCategory = /* GraphQL */ `
  mutation deleteProductCategory($id: String!) {
    deleteProductCategory(id: $id)
  }
`;

export const createProductCategory = /* GraphQL */ `
  mutation createProductCategory($data: CreateProductCategoryInput!) {
    createProductCategory(data: $data) {
      id
    }
  }
`;

export const updateProductCategory = /* GraphQL */ `
  mutation updateProductCategory(
    $id: String!
    $data: UpdateProductCategoryInput!
  ) {
    updateProductCategory(id: $id, data: $data) {
      id
    }
  }
`;

export const searchProductCategories = `
  query SearchProductCategories($keyword: String!, $take: Int) {
    productCategories(where: { name: $keyword }, take: $take) {
      data {
        id
        name
      }
    }
  }
`;
