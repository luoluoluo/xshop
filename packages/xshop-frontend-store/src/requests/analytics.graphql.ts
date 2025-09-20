export const TRACK_VIEW_MUTATION = /* GraphQL */ `
  mutation trackView($data: TrackViewInput!) {
    trackView(data: $data) {
      id
      pageType
      pageUrl
      productId
      articleId
      creatorId
      ipAddress
      userAgent
      referer
      createdAt
    }
  }
`;

export const GET_PRODUCT_VIEWS_QUERY = /* GraphQL */ `
  query getProductViews($productId: String!) {
    getProductViews(productId: $productId)
  }
`;

export const GET_USER_PAGE_VIEWS_QUERY = /* GraphQL */ `
  query getUserPageViews($userId: String!) {
    getUserPageViews(userId: $userId)
  }
`;

export const GET_VIEWS_IN_TIME_RANGE_QUERY = /* GraphQL */ `
  query getViewsInTimeRange($data: AnalyticsTimeRangeInput!) {
    getViewsInTimeRange(data: $data)
  }
`;
