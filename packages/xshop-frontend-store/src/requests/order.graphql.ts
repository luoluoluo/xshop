export const ORDERS_QUERY = /* GraphQL */ `
  query orders($where: OrderWhereInput, $skip: Int, $take: Int) {
    orders(where: $where, skip: $skip, take: $take) {
      data {
        id
        productId
        amount
        affiliateAmount
        quantity
        status
        note
        createdAt
        updatedAt
        paidAt
        completedAt
        cancelledAt
        refundedAt
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
      productId
      amount
      affiliateAmount
      quantity
      status
      note
      createdAt
      updatedAt
      paidAt
      completedAt
      cancelledAt
      refundedAt
      productTitle
      productImage
      productPrice
      receiverName
      receiverPhone
    }
  }
`;

export const ORDER_STATUS_QUERY = /* GraphQL */ `
  query orderStatus($id: String!) {
    orderStatus(id: $id)
  }
`;

export const CREATE_ORDER_MUTATION = /* GraphQL */ `
  mutation createOrder($data: CreateOrderInput!) {
    createOrder(data: $data) {
      id
      amount
    }
  }
`;

export const CREATE_ORDER_PAYMENT_MUTATION = /* GraphQL */ `
  mutation createOrderPayment($data: CreateOrderPaymentInput!) {
    createOrderPayment(data: $data) {
      appId
      timeStamp
      nonceStr
      package
      signType
      paySign
    }
  }
`;
