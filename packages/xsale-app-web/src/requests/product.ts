// Get single product by ID
export const getProduct = /* GraphQL */ `
  query product($id: String!) {
    product(id: $id) {
      id
      title
      content
      image
      price
      commission
      stock
      sort
      categoryId
      merchantId
      createdAt
      updatedAt
      category {
        id
        name
        image
        sort
      }
      merchant {
        id
        name
        logo
        address
      }
      attributes {
        id
        name
        values
      }
    }
  }
`;

// Get products list with pagination
export const getProducts = /* GraphQL */ `
  query products($skip: Int, $take: Int, $where: ProductWhereInput) {
    products(skip: $skip, take: $take, where: $where) {
      data {
        id
        title
        image
        price
        commission
        stock
        sort
        categoryId
        merchantId
        createdAt
        updatedAt
        category {
          id
          name
          image
        }
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
