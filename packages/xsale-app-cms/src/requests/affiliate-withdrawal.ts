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

export const approveAffiliateWithdrawal = /* GraphQL */ `
  mutation approveAffiliateWithdrawal($id: String!) {
    approveAffiliateWithdrawal(id: $id) {
      id
      status
      approvedAt
    }
  }
`;

export const rejectAffiliateWithdrawal = /* GraphQL */ `
  mutation rejectAffiliateWithdrawal($id: String!, $rejectReason: String!) {
    rejectAffiliateWithdrawal(id: $id, rejectReason: $rejectReason) {
      id
      status
      rejectReason
      rejectedAt
    }
  }
`;

export const completeAffiliateWithdrawal = /* GraphQL */ `
  mutation completeAffiliateWithdrawal($id: String!) {
    completeAffiliateWithdrawal(id: $id) {
      id
      status
      completedAt
    }
  }
`;
