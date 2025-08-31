export const getAffiliates = /* GraphQL */ `
  query affiliates($where: AffiliateWhereInput, $skip: Int, $take: Int) {
    affiliates(where: $where, skip: $skip, take: $take) {
      data {
        id
        name
        phone
        createdAt
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
      createdAt
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
