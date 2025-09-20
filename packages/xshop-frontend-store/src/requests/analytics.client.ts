import { request } from "@/utils/request";
import {
  TRACK_VIEW_MUTATION,
  GET_PRODUCT_VIEWS_QUERY,
  GET_USER_PAGE_VIEWS_QUERY,
  GET_VIEWS_IN_TIME_RANGE_QUERY,
} from "./analytics.graphql";

export interface TrackViewInput {
  userId?: string;
  pageUrl: string;
}

export interface AnalyticsTimeRangeInput {
  startDate: string;
  endDate: string;
  creatorId?: string;
}

export const trackView = async (data: TrackViewInput) => {
  return request({
    query: TRACK_VIEW_MUTATION,
    variables: { data },
  });
};

export const getProductViews = async (productId: string) => {
  return request({
    query: GET_PRODUCT_VIEWS_QUERY,
    variables: { productId },
  });
};

export const getUserPageViews = async (userId: string) => {
  return request({
    query: GET_USER_PAGE_VIEWS_QUERY,
    variables: { userId },
  });
};

export const getViewsInTimeRange = async (data: AnalyticsTimeRangeInput) => {
  return request({
    query: GET_VIEWS_IN_TIME_RANGE_QUERY,
    variables: { data },
  });
};
