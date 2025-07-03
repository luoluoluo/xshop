import { List, useTable } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";
import { getOrders } from "../../requests/order";
import {
  Affiliate,
  Customer,
  Merchant,
  Order,
  OrderStatus,
  User,
} from "../../generated/graphql";
import dayjs from "dayjs";

export const OrderList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getOrders),
    },
  });

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Created:
        return "已创建";
      case OrderStatus.Paid:
        return "已支付";
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

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={t("order.fields.id")} width={120} />
        <Table.Column
          dataIndex="merchant"
          title={t("order.fields.merchant")}
          render={(merchant: Merchant) => {
            return (
              <div>
                <div className="font-medium">{merchant?.name || "-"}</div>
                <div className="text-sm text-gray-500">
                  {merchant?.phone || "-"}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="customer"
          title={t("order.fields.customer")}
          render={(_, record: Order) => {
            return (
              <div>
                <div className="font-medium">{record?.receiverName || "-"}</div>
                <div className="text-sm text-gray-500">
                  {record?.receiverPhone || "-"}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="product"
          title={t("order.fields.product")}
          render={(_, record: Order) => {
            return (
              <div className="flex items-center space-x-2">
                <img
                  className="w-auto h-12 object-cover rounded"
                  src={record.productImage || ""}
                  alt={record.productTitle || ""}
                />
                <div>
                  <div className="font-medium">
                    {record.productTitle || "-"}
                  </div>
                  <div className="text-sm text-gray-500">
                    ¥{record.productPrice?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {`x ${record.quantity}`}
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="amount"
          title={t("order.fields.amount")}
          render={(amount: number) => `¥${amount?.toFixed(2) || "0.00"}`}
        />
        <Table.Column
          dataIndex="affiliate"
          title={t("order.fields.affiliate")}
          render={(affiliate: Affiliate) => {
            return (
              <div>
                <div className="font-medium">{affiliate?.name || "-"}</div>
                <div className="text-sm text-gray-500">
                  {affiliate?.phone || "-"}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="affiliateAmount"
          title={t("order.fields.affiliateAmount")}
          render={(affiliateAmount: number) =>
            `¥${affiliateAmount?.toFixed(2) || "0.00"}`
          }
        />

        <Table.Column
          dataIndex="merchantAffiliate"
          title={t("order.fields.merchantAffiliate")}
          render={(merchantAffiliate: Affiliate) => {
            return (
              <div>
                <div className="font-medium">
                  {merchantAffiliate?.name || "-"}
                </div>
                <div className="text-sm text-gray-500">
                  {merchantAffiliate?.phone || "-"}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="merchantAffiliateAmount"
          title={t("order.fields.merchantAffiliateAmount")}
          render={(merchantAffiliateAmount: number) =>
            `¥${merchantAffiliateAmount?.toFixed(2) || "0.00"}`
          }
        />

        <Table.Column
          dataIndex="note"
          title={t("order.fields.note")}
          render={(note: string) => (
            <Tooltip title={note}>
              <span className="truncate max-w-20 block">{note || "-"}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="status"
          title={t("order.fields.status")}
          render={(status: OrderStatus) => (
            <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title={t("order.fields.createdAt")}
          render={(date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
        />
      </Table>
    </List>
  );
};
