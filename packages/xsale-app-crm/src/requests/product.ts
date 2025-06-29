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
        createdAt
        price
        commission
        platformCommission
        merchantAffiliateCommission
        affiliateCommission
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
      sort
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
