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

export const AFFILIATE_ORDERS_QUERY = /* GraphQL */ `
  query affiliateOrders($where: OrderWhereInput, $skip: Int, $take: Int) {
    affiliateOrders(where: $where, skip: $skip, take: $take) {
      data {
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

export const AFFILIATE_ORDER_QUERY = /* GraphQL */ `
  query affiliateOrder($id: String!) {
    affiliateOrder(id: $id) {
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
      productTitle
      productImage
      productPrice
      receiverName
      receiverPhone
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = /* GraphQL */ `
  query customerOrders($where: OrderWhereInput, $skip: Int, $take: Int) {
    customerOrders(where: $where, skip: $skip, take: $take) {
      data {
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

export const CUSTOMER_ORDER_QUERY = /* GraphQL */ `
  query customerOrder($id: String!) {
    customerOrder(id: $id) {
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
