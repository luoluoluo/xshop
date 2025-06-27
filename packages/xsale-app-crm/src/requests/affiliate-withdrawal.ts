export const getAffiliateWithdrawals = /* GraphQL */ `
  query affiliateWithdrawals(
    $where: AffiliateWithdrawalWhereInput
    $skip: Int
    $take: Int
  ) {
    affiliateWithdrawals(where: $where, skip: $skip, take: $take) {
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
        affiliate {
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

export const createAffiliateWithdrawal = /* GraphQL */ `
  mutation createAffiliateWithdrawal($data: CreateAffiliateWithdrawalInput!) {
    createAffiliateWithdrawal(data: $data) {
      id
      amount
      status
      accountName
      bankName
      bankAccount
      note
      createdAt
      affiliate {
        id
        name
        phone
        balance
      }
    }
  }
`;
