export const GET_ANALYTICS_STATS_QUERY = /* GraphQL */ `
  query getAnalyticsStats($where: AnalyticsStatsWhereInput!) {
    getAnalyticsStats(where: $where) {
      pv
      uv
      orderCount
      orderAmount
    }
  }
`;
