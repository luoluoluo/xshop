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

export const createMerchantWithdrawal = /* GraphQL */ `
  mutation createMerchantWithdrawal($data: CreateMerchantWithdrawalInput!) {
    createMerchantWithdrawal(data: $data) {
      id
      amount
      status
      accountName
      bankName
      bankAccount
      note
      createdAt
      merchant {
        id
        name
        phone
        balance
      }
    }
  }
`;
