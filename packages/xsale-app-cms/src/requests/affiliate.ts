export const getAffiliates = /* GraphQL */ `
  query affiliates($where: AffiliateWhereInput, $skip: Int, $take: Int) {
    affiliates(where: $where, skip: $skip, take: $take) {
      data {
        id
        name
        phone
        isActive
        balance
        createdAt
        merchantAffiliates {
          id
          merchant {
            id
            name
            phone
          }
        }
      }
      total
    }
  }
`;

export const getAffiliate = /* GraphQL */ `
  query affiliate($id: String!) {
    affiliate(id: $id) {
      id
      name
      phone
      isActive
      balance
      createdAt
      merchantAffiliates {
        id
        merchant {
          id
          name
          phone
        }
      }
    }
  }
`;

export const updateAffiliate = /* GraphQL */ `
  mutation updateAffiliate($id: String!, $data: UpdateAffiliateInput!) {
    updateAffiliate(id: $id, data: $data) {
      id
    }
  }
`;

export const createAffiliate = /* GraphQL */ `
  mutation createAffiliate($data: CreateAffiliateInput!) {
    createAffiliate(data: $data) {
      id
    }
  }
`;

export const deleteAffiliate = /* GraphQL */ `
  mutation deleteAffiliate($id: String!) {
    deleteAffiliate(id: $id)
  }
`;
