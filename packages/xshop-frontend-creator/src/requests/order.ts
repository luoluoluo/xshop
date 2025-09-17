import {
  Order,
  OrderPagination,
  OrderStatus,
  OrderWhereInput,
} from "../generated/graphql";
import { request } from "../utils/request";
import {
  ORDERS_QUERY,
  ORDER_QUERY,
  COMPLETE_ORDER_MUTATION,
  REFUND_ORDER_MUTATION,
  ORDER_STATUS_QUERY,
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

export const completeOrder = (variables: { id: string }) => {
  return request<{ completeOrder: Order }>({
    query: COMPLETE_ORDER_MUTATION,
    variables,
  });
};

export const refundOrder = (variables: { id: string }) => {
  return request<{ refundOrder: Order }>({
    query: REFUND_ORDER_MUTATION,
    variables,
  });
};

export const getOrderStatus = (variables: { id: string }) => {
  return request<{ orderStatus: OrderStatus }>({
    query: ORDER_STATUS_QUERY,
    variables,
  });
};
