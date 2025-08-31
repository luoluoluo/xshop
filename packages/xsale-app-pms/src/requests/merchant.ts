export const getMerchants = /* GraphQL */ `
  query merchants($where: MerchantWhereInput, $skip: Int, $take: Int) {
    merchants(where: $where, skip: $skip, take: $take) {
      data {
        id
        name
        logo
        phone
        address
        description
        isActive
        balance
        createdAt
      }
      total
    }
  }
`;

export const getMerchant = /* GraphQL */ `
  query merchant($id: String!) {
    merchant(id: $id) {
      id
      name
      logo
      images
      phone
      address
      description
      isActive
      balance
      createdAt
      wechatMerchantId
    }
  }
`;

export const updateMerchant = /* GraphQL */ `
  mutation updateMerchant($id: String!, $data: UpdateMerchantInput!) {
    updateMerchant(id: $id, data: $data) {
      id
    }
  }
`;

export const createMerchant = /* GraphQL */ `
  mutation createMerchant($data: CreateMerchantInput!) {
    createMerchant(data: $data) {
      id
    }
  }
`;

export const deleteMerchant = /* GraphQL */ `
  mutation deleteMerchant($id: String!) {
    deleteMerchant(id: $id)
  }
`;
