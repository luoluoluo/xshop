import { OrderStatus } from "../generated/graphql";

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return "default";
    case OrderStatus.Paid:
      return "processing";
    case OrderStatus.Completed:
      return "success";
    case OrderStatus.Cancelled:
      return "error";
    case OrderStatus.Refunded:
      return "warning";
    default:
      return "default";
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return "待支付";
    case OrderStatus.Paid:
      return "待完成";
    case OrderStatus.Completed:
      return "已完成";
    case OrderStatus.Cancelled:
      return "已取消";
    case OrderStatus.Refunded:
      return "已退款";
    default:
      return status;
  }
};
