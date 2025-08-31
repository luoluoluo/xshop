import { List, useTable } from "@refinedev/antd";
import { useNotification, useTranslate } from "@refinedev/core";
import { Form, Table, Tag, Tooltip, Button, Space, Radio } from "antd";
import { parse } from "graphql";
import { getOrders, completeOrder, refundOrder } from "../../requests/order";
import {
  Affiliate,
  Order,
  OrderStatus,
  OrderWhereInput,
} from "../../generated/graphql";
import dayjs from "dayjs";
import { getStatusColor, getStatusText } from "../../utils/order";
import { useState } from "react";
import { request } from "../../utils/request";

export const OrderList = () => {
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [where, setWhere] = useState<OrderWhereInput>();
  const t = useTranslate();
  const { tableProps, tableQuery } = useTable({
    meta: {
      gqlQuery: parse(getOrders),
      variables: {
        where,
      },
    },
  });

  const handleCompleteOrder = (orderId: string) => {
    if (loading) return;
    setLoading(true);
    request({
      query: completeOrder,
      variables: {
        id: orderId,
      },
    })
      .then((res) => {
        if (res.errors) {
          notification?.open?.({
            type: "error",
            message: res.errors[0].message,
          });
        } else {
          notification?.open?.({
            type: "success",
            message: "订单完成成功",
          });
          tableQuery?.refetch();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRefundOrder = (orderId: string) => {
    if (loading) return;
    setLoading(true);
    request({
      query: refundOrder,
      variables: {
        id: orderId,
      },
    })
      .then((res) => {
        if (res.errors) {
          notification?.open?.({
            type: "error",
            message: res.errors[0].message,
          });
        } else {
          notification?.open?.({
            type: "success",
            message: "订单退款成功",
          });
          tableQuery?.refetch();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <List>
      <Form layout="inline" className="mb-4">
        <Form.Item name="status" label="状态">
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
        <Table.Column dataIndex="id" title={t("order.fields.id")} width={120} />
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
        <Table.Column
          title="操作"
          dataIndex="actions"
          width={150}
          render={(_, record: Order) => (
            <Space>
              {record.status === OrderStatus.Paid && (
                <>
                  <Button
                    type="primary"
                    size="small"
                    loading={loading}
                    onClick={() => handleCompleteOrder(record.id)}
                  >
                    完成订单
                  </Button>
                  <Button
                    danger
                    size="small"
                    loading={loading}
                    onClick={() => handleRefundOrder(record.id)}
                  >
                    退款
                  </Button>
                </>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
