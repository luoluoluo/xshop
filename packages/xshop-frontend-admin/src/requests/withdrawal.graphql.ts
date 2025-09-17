export const WITHDRAWALS_QUERY = /* GraphQL */ `
  query withdrawals($where: WithdrawalWhereInput, $skip: Int, $take: Int) {
    withdrawals(where: $where, skip: $skip, take: $take) {
      data {
        id
        amount
        taxAmount
        afterTaxAmount
        status
        bankAccountNumber
        bankAccountName
        note
        createdAt
        approvedAt
        completedAt
        rejectedAt
        user {
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

export const WITHDRAWAL_QUERY = /* GraphQL */ `
  query withdrawal($id: String!) {
    withdrawal(id: $id) {
      id
      amount
      taxAmount
      afterTaxAmount
      status
      bankAccountNumber
      bankAccountName
      note
      createdAt
      approvedAt
      completedAt
      rejectedAt
      user {
        id
        name
        phone
        balance
      }
    }
  }
`;

export const COMPLETE_WITHDRAWAL_MUTATION = /* GraphQL */ `
  mutation completeWithdrawal($id: String!) {
    completeWithdrawal(id: $id) {
      id
    }
  }
`;
