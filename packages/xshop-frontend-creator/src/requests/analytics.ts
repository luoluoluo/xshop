import { request } from "../utils/request";
import { GET_ANALYTICS_STATS_QUERY } from "./analytics.graphql";
import { AnalyticsStatsWhereInput, AnalyticsStats } from "../generated/graphql";

export const getAnalyticsStats = async (variables: {
  where: AnalyticsStatsWhereInput;
}): Promise<AnalyticsStats> => {
  const response = await request<{ getAnalyticsStats: AnalyticsStats }>({
    query: GET_ANALYTICS_STATS_QUERY,
    variables,
  });

  if (response.errors) {
    throw new Error(
      response.errors[0]?.message || "Failed to fetch analytics data",
    );
  }

  return (
    response.data?.getAnalyticsStats || {
      pv: 0,
      uv: 0,
      orderCount: 0,
      orderAmount: 0,
    }
  );
};
