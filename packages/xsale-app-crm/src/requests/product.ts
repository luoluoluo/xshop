export const getProducts = /* GraphQL */ `
  query products($where: ProductWhereInput, $skip: Int, $take: Int) {
    products(where: $where, skip: $skip, take: $take) {
      data {
        id
        merchantId
        merchant {
          id
          name
          affiliate {
            id
            name
          }
        }
        title
        image
        sort
        category {
          id
          name
        }
        createdAt
        price
        commission
        platformCommission
        merchantAffiliateCommission
        affiliateCommission
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
