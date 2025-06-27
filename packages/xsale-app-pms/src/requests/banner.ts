export const getBanners = /* GraphQL */ `
  query GetBanners {
    banners {
      data {
        id
        merchantId
        merchant {
          id
          name
        }
        title
        image
        link
        sort
        isActive
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const getBanner = /* GraphQL */ `
  query GetBanner($id: String!) {
    banner(id: $id) {
      id
      merchantId
      merchant {
        id
        name
      }
      title
      image
      link
      sort
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const createBanner = /* GraphQL */ `
  mutation CreateBanner($data: CreateBannerInput!) {
    createBanner(data: $data) {
      id
      title
      image
      link
      sort
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const updateBanner = /* GraphQL */ `
  mutation UpdateBanner($id: String!, $data: UpdateBannerInput!) {
    updateBanner(id: $id, data: $data) {
      id
      title
      image
      link
      sort
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const deleteBanner = /* GraphQL */ `
  mutation DeleteBanner($id: String!) {
    deleteBanner(id: $id)
  }
`;
