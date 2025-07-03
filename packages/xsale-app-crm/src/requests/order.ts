export const getOrders = /* GraphQL */ `
  query orders($where: OrderWhereInput, $skip: Int, $take: Int) {
    orders(where: $where, skip: $skip, take: $take) {
      data {
        id
        amount
        affiliateAmount
        merchantAmount
        merchantAffiliateAmount
        platformAmount
        quantity
        status
        note
        createdAt
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
        merchantAffiliate {
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

export const getOrder = /* GraphQL */ `
  query order($id: String!, $isMerchantAffiliate: Boolean) {
    order(id: $id, isMerchantAffiliate: $isMerchantAffiliate) {
      id
      amount
      affiliateAmount
      merchantAmount
      merchantAffiliateAmount
      platformAmount
      quantity
      status
      note
      createdAt
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
      merchantAffiliate {
        id
        name
        phone
      }
      affiliate {
        id
        name
        phone
      }
      receiverName
      receiverPhone
    }
  }
`;
