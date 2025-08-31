// Get single merchant by ID
export const getMerchant = /* GraphQL */ `
  query merchant($id: String!) {
    merchant(id: $id) {
      id
      name
      description
      logo
      images
      address
      phone
      createdAt
      updatedAt
      businessScope
      wechatQrcode
    }
  }
`;

// Get merchants list with pagination
export const getMerchants = /* GraphQL */ `
  query merchants($skip: Int, $take: Int, $where: MerchantWhereInput) {
    merchants(skip: $skip, take: $take, where: $where) {
      data {
        id
        name
        description
        logo
        address
        phone
        createdAt
        updatedAt
        businessScope
        wechatQrcode
      }
      total
    }
  }
`;
