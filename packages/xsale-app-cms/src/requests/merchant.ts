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
        createdAt
        businessScope
        wechatQrcode
        wechatMerchantStatus
        wechatMerchantSignUrl
        wechatMerchantNote
        wechatMerchantId
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
      createdAt
      businessScope
      wechatQrcode
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

export const approveWechatMerchant = /* GraphQL */ `
  mutation approveWechatMerchant($data: ApproveWechatMerchantInput!) {
    approveWechatMerchant(data: $data) {
      id
      wechatMerchantStatus
      wechatMerchantSignUrl
    }
  }
`;

export const rejectWechatMerchant = /* GraphQL */ `
  mutation rejectWechatMerchant($data: RejectWechatMerchantInput!) {
    rejectWechatMerchant(data: $data) {
      id
      wechatMerchantStatus
      wechatMerchantNote
    }
  }
`;

export const completeWechatMerchant = /* GraphQL */ `
  mutation completeWechatMerchant($data: CompleteWechatMerchantInput!) {
    completeWechatMerchant(data: $data) {
      id
      wechatMerchantStatus
      wechatMerchantId
    }
  }
`;
