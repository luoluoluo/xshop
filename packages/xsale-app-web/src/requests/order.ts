export const createOrder = /* GraphQL */ `
  mutation createOrder($data: CreateOrderInput!) {
    createOrder(data: $data) {
      id
      amount
      quantity
      status
      note
      productTitle
      productImage
      productPrice
      createdAt
      updatedAt
      paidAt
      completedAt
      cancelledAt
      refundedAt
      merchant {
        id
        name
        logo
        phone
        address
      }
      affiliate {
        id
        name
        phone
      }
    }
  }
`;

export const cancelOrder = /* GraphQL */ `
  mutation cancelOrder($id: String!) {
    cancelOrder(id: $id) {
      id
      status
      cancelledAt
      updatedAt
    }
  }
`;

export const createOrderPayment = /* GraphQL */ `
  mutation createOrderPayment($data: CreatePaymentInput!) {
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

export const refundOrder = /* GraphQL */ `
  mutation refundOrder($data: RefundOrderInput!) {
    refundOrder(data: $data) {
      id
      status
      refundedAt
      updatedAt
    }
  }
`;

export const getOrder = /* GraphQL */ `
  query order($id: String!) {
    order(id: $id) {
      id
      merchantId
      amount
      quantity
      status
      note
      productTitle
      productImage
      productPrice
      createdAt
      updatedAt
      paidAt
      completedAt
      cancelledAt
      refundedAt
      affiliate {
        id
        name
        phone
      }
    }
  }
`;

export const getOrders = /* GraphQL */ `
  query orders($skip: Int, $take: Int, $where: OrderWhereInput) {
    orders(skip: $skip, take: $take, where: $where) {
      total
      data {
        id
        merchantId
        amount
        quantity
        status
        note
        productTitle
        productImage
        productPrice
        createdAt
        updatedAt
        paidAt
        completedAt
        cancelledAt
        refundedAt
      }
    }
  }
`;

export const getOrderStatus = /* GraphQL */ `
  query orderStatus($id: String!) {
    orderStatus(id: $id)
  }
`;
