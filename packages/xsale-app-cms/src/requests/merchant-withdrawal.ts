export const getMerchantWithdrawals = /* GraphQL */ `
  query merchantWithdrawals(
    $where: MerchantWithdrawalWhereInput
    $skip: Int
    $take: Int
  ) {
    merchantWithdrawals(where: $where, skip: $skip, take: $take) {
      data {
        id
        amount
        status
        accountName
        bankName
        bankAccount
        note
        rejectReason
        createdAt
        approvedAt
        completedAt
        rejectedAt
        merchant {
          id
          name
          phone
          balance
        }
      }
      total
    }
  }
`;

export const approveMerchantWithdrawal = /* GraphQL */ `
  mutation approveMerchantWithdrawal($id: String!) {
    approveMerchantWithdrawal(id: $id) {
      id
      status
      approvedAt
    }
  }
`;

export const rejectMerchantWithdrawal = /* GraphQL */ `
  mutation rejectMerchantWithdrawal($id: String!, $rejectReason: String!) {
    rejectMerchantWithdrawal(id: $id, rejectReason: $rejectReason) {
      id
      status
      rejectReason
      rejectedAt
    }
  }
`;

export const completeMerchantWithdrawal = /* GraphQL */ `
  mutation completeMerchantWithdrawal($id: String!) {
    completeMerchantWithdrawal(id: $id) {
      id
      status
      completedAt
    }
  }
`;
