// Get single product category by ID
export const getProductCategory = /* GraphQL */ `
  query productCategory($id: String!) {
    productCategory(id: $id) {
      id
      name
      image
      sort
      merchantId
      createdAt
      updatedAt
      merchant {
        id
        name
        logo
      }
    }
  }
`;

// Get product categories list with pagination
export const getProductCategories = /* GraphQL */ `
  query productCategories($skip: Int, $take: Int, $where: ProductCategoryWhereInput) {
    productCategories(skip: $skip, take: $take, where: $where) {
      data {
        id
        name
        image
        sort
        merchantId
        createdAt
        updatedAt
        merchant {
          id
          name
          logo
        }
      }
      total
    }
  }
`;
