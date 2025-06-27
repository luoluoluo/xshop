import { List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";
import { getOrders } from "../../requests/order";
import { Merchant, OrderStatus, User } from "../../generated/graphql";

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
        <Table.Column
          dataIndex="code"
          title={t("order.fields.code")}
          width={120}
        />
        <Table.Column
          dataIndex="product"
          title={t("order.fields.product")}
          render={(product: any) => {
            return (
              <div className="flex items-center space-x-2">
                {product?.image && (
                  <img
                    className="w-12 h-12 object-cover rounded"
                    src={product.image}
                    alt={product.title}
                  />
                )}
                <div>
                  <div className="font-medium">{product?.title || "-"}</div>
                  <div className="text-sm text-gray-500">
                    ¥{product?.price?.toFixed(2) || "0.00"}
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
          dataIndex="merchantAmount"
          title={t("order.fields.merchantAmount")}
          render={(merchantAmount: number) =>
            `¥${merchantAmount?.toFixed(2) || "0.00"}`
          }
        />
        <Table.Column
          dataIndex="affiliate"
          title={t("order.fields.affiliate")}
          render={(affiliate: User) => {
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
          render={(merchantAffiliate: User) => {
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
          dataIndex="quantity"
          title={t("order.fields.quantity")}
          width={80}
        />
        <Table.Column
          dataIndex="user"
          title={t("order.fields.customer")}
          render={(user: User) => {
            return (
              <div>
                <div className="font-medium">{user?.name || "-"}</div>
                <div className="text-sm text-gray-500">
                  {user?.phone || "-"}
                </div>
              </div>
            );
          }}
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
          render={(date: string) => new Date(date).toLocaleString()}
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
      </Table>
    </List>
  );
};
