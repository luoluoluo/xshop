import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  Order,
  OrderPagination,
  OrderStatus,
  OrderWhereInput,
  Payment,
} from "@/generated/graphql";
import { request } from "../utils/request.client";
import {
  ORDERS_QUERY,
  ORDER_QUERY,
  CREATE_ORDER_MUTATION,
  CREATE_ORDER_PAYMENT_MUTATION,
  ORDER_STATUS_QUERY,
} from "./order.graphql";

export const createOrder = (variables: { data: CreateOrderInput }) => {
  return request<{ createOrder: Order }>({
    query: CREATE_ORDER_MUTATION,
    variables,
  });
};

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

export const getOrderStatus = (variables: { id: string }) => {
  return request<{ orderStatus: OrderStatus }>({
    query: ORDER_STATUS_QUERY,
    variables,
  });
};

export const createOrderPayment = (variables: {
  data: CreateOrderPaymentInput;
}) => {
  return request<{ createOrderPayment: Payment }>({
    query: CREATE_ORDER_PAYMENT_MUTATION,
    variables,
  });
};
