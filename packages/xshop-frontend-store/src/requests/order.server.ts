import { OrderPagination, OrderWhereInput, Order } from "@/generated/graphql";
import { request } from "../utils/request.server";
import { ORDERS_QUERY, ORDER_QUERY } from "./order.graphql";

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
