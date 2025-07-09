// Get single product by ID
export const getProduct = /* GraphQL */ `
  query product($id: String!) {
    product(id: $id) {
      id
      title
      description
      content
      image
      price
      commission
      stock
      merchantId
      createdAt
      updatedAt
      isActive
      merchant {
        id
        name
        logo
        address
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
        description
        image
        price
        commission
        stock
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
