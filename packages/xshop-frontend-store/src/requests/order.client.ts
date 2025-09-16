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
  COMPLETE_ORDER_MUTATION,
  REFUND_ORDER_MUTATION,
  CREATE_ORDER_MUTATION,
  CREATE_ORDER_PAYMENT_MUTATION,
  ORDER_STATUS_QUERY,
  AFFILIATE_ORDERS_QUERY,
  CUSTOMER_ORDERS_QUERY,
  AFFILIATE_ORDER_QUERY,
  CUSTOMER_ORDER_QUERY,
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

export const createOrderPayment = (variables: {
  data: CreateOrderPaymentInput;
}) => {
  return request<{ createOrderPayment: Payment }>({
    query: CREATE_ORDER_PAYMENT_MUTATION,
    variables,
  });
};
