// Get banners list with pagination
export const getBanners = /* GraphQL */ `
  query banners($skip: Int, $take: Int, $where: BannerWhereInput) {
    banners(skip: $skip, take: $take, where: $where) {
      data {
        id
        title
        image
        link
        sort
        merchantId
        createdAt
        updatedAt
        merchant {
          id
          name
          logo
        }
      }
      total
    }
  }
`;
