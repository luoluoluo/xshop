export const ORDERS_QUERY = /* GraphQL */ `
  query orders($where: OrderWhereInput, $skip: Int, $take: Int) {
    orders(where: $where, skip: $skip, take: $take) {
      data {
        id
        amount
        affiliateAmount
        merchantAmount
        quantity
        status
        note
        createdAt
        updatedAt
        paidAt
        completedAt
        cancelledAt
        refundedAt
        customer {
          id
          name
          phone
        }
        merchant {
          id
          name
          phone
        }
        affiliate {
          id
          name
          phone
        }
        productTitle
        productImage
        productPrice
        receiverName
        receiverPhone
      }
      total
    }
  }
`;

export const ORDER_QUERY = /* GraphQL */ `
  query order($id: String!) {
    order(id: $id) {
      id
      merchantId
      amount
      affiliateAmount
      merchantAmount
      quantity
      status
      note
      createdAt
      updatedAt
      paidAt
      completedAt
      cancelledAt
      refundedAt
      customer {
        id
        name
        phone
        avatar
      }
      merchant {
        id
        name
        phone
        avatar
      }
      affiliate {
        id
        name
        phone
        avatar
      }
      productTitle
      productImage
      productPrice
      receiverName
      receiverPhone
    }
  }
`;

export const COMPLETE_ORDER_MUTATION = /* GraphQL */ `
  mutation completeOrder($id: String!) {
    completeOrder(id: $id) {
      id
    }
  }
`;

export const REFUND_ORDER_MUTATION = /* GraphQL */ `
  mutation refundOrder($id: String!) {
    refundOrder(id: $id) {
      id
    }
  }
`;

export const ORDER_STATUS_QUERY = /* GraphQL */ `
  query orderStatus($id: String!) {
    orderStatus(id: $id)
  }
`;
