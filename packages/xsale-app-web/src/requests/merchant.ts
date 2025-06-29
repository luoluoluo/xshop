// Get single merchant by ID
export const getMerchant = /* GraphQL */ `
  query merchant($id: String!, $affiliateId: String) {
    merchant(id: $id, affiliateId: $affiliateId) {
      id
      name
      description
      logo
      address
      phone
      affiliateId
      createdAt
      updatedAt
      affiliate {
        id
        name
        phone
      }
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
        affiliateId
        createdAt
        updatedAt
        affiliate {
          id
          name
          phone
        }
        businessScope
        wechatQrcode
      }
      total
    }
  }
`;
