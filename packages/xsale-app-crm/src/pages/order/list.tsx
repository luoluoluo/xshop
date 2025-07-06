import { List, useTable } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Form, Radio, Select, Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";
import { getOrders } from "../../requests/order";
import {
  Affiliate,
  Merchant,
  Order,
  OrderStatus,
  OrderWhereInput,
} from "../../generated/graphql";
import dayjs from "dayjs";
import { getStatusColor, getStatusText } from "../../utils/order";
import { useState } from "react";

export const OrderList = () => {
  const [where, setWhere] = useState<OrderWhereInput>({
    isMerchantAffiliate: false,
  });
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getOrders),
      variables: {
        where,
      },
    },
  });

  return (
    <>
      <List>
        <Form layout="inline" className="mb-4">
          <Form.Item
            name="isMerchantAffiliate"
            label={t("order.filter.affiliateType.label")}
            initialValue={where.isMerchantAffiliate ? "true" : "false"}
          >
            <Radio.Group
              options={[
                {
                  label: t("order.filter.affiliateType.affiliate"),
                  value: "false",
                },
                {
                  label: t("order.filter.affiliateType.merchantAffiliate"),
                  value: "true",
                },
              ]}
              onChange={(e) => {
                setWhere({
                  ...where,
                  isMerchantAffiliate: e.target.value === "true",
                });
              }}
            />
          </Form.Item>
          <Form.Item name="status" label={t("order.filter.status.label")}>
            <Radio.Group
              optionType="button"
              options={[
                {
                  label: "全部",
                  value: undefined,
                },
                {
                  label: getStatusText(OrderStatus.Created),
                  value: OrderStatus.Created,
                },
                {
                  label: getStatusText(OrderStatus.Paid),
                  value: OrderStatus.Paid,
                },
                {
                  label: getStatusText(OrderStatus.Completed),
                  value: OrderStatus.Completed,
                },
              ]}
              onChange={(e) => {
                setWhere({
                  ...where,
                  status: e.target.value as OrderStatus,
                });
              }}
            />
          </Form.Item>
        </Form>
        <Table {...tableProps} rowKey="id" className="mt-4">
          <Table.Column
            dataIndex="id"
            title={t("order.fields.id")}
            width={120}
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
            dataIndex="customer"
            title={t("order.fields.customer")}
            render={(_, record: Order) => {
              return (
                <div>
                  <div className="font-medium">
                    {record?.receiverName || "-"}
                  </div>
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
    </>
  );
};
