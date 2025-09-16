import { OrderPagination, OrderWhereInput, Order } from "@/generated/graphql";
import { request } from "../utils/request.server";
import {
  AFFILIATE_ORDERS_QUERY,
  AFFILIATE_ORDER_QUERY,
  CUSTOMER_ORDERS_QUERY,
  CUSTOMER_ORDER_QUERY,
  ORDERS_QUERY,
  ORDER_QUERY,
} from "./order.graphql";

export const getOrders = (variables: {
  where?: OrderWhereInput;
  skip?: number;
  take?: number;
}) => {
  return request<{ orders: OrderPagination }>({
    query: ORDERS_QUERY,
    variables,
  });
};

export const getOrder = (variables: { id: string }) => {
  return request<{ order: Order }>({
    query: ORDER_QUERY,
    variables,
  });
};
export const getAffiliateOrders = (variables: {
  where?: OrderWhereInput;
  skip?: number;
  take?: number;
}) => {
  return request<{ affiliateOrders: OrderPagination }>({
    query: AFFILIATE_ORDERS_QUERY,
    variables,
  });
};

export const getAffiliateOrder = (variables: { id: string }) => {
  return request<{ affiliateOrder: Order }>({
    query: AFFILIATE_ORDER_QUERY,
    variables,
  });
};

export const getCustomerOrders = (variables: {
  where?: OrderWhereInput;
  skip?: number;
  take?: number;
}) => {
  return request<{ customerOrders: OrderPagination }>({
    query: CUSTOMER_ORDERS_QUERY,
    variables,
  });
};

export const getCustomerOrder = (variables: { id: string }) => {
  return request<{ customerOrder: Order }>({
    query: CUSTOMER_ORDER_QUERY,
    variables,
  });
};
