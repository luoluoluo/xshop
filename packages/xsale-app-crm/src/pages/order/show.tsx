import { Show } from "@refinedev/antd";
import { useShow, useTranslate } from "@refinedev/core";
import { Descriptions, Tag, Card, Row, Col, Divider } from "antd";
import { parse } from "graphql";
import { getOrder } from "../../requests/order";
import { OrderStatus } from "../../generated/graphql";

export const OrderShow = () => {
  const t = useTranslate();
  const { queryResult } = useShow({
    meta: {
      gqlQuery: parse(getOrder),
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

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
    <Show isLoading={isLoading}>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="订单信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="订单号">
                {record?.code}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={getStatusColor(record?.status)}>
                  {getStatusText(record?.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">
                ¥{record?.amount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="商品数量">
                {record?.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {record?.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="支付时间">
                {record?.paidAt
                  ? new Date(record.paidAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="完成时间">
                {record?.completedAt
                  ? new Date(record.completedAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="取消时间">
                {record?.cancelledAt
                  ? new Date(record.cancelledAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="退款时间">
                {record?.refundedAt
                  ? new Date(record.refundedAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {record?.note || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="商品信息" style={{ marginBottom: 16 }}>
            {record?.product && (
              <div className="flex items-start space-x-4">
                {record.product.image && (
                  <img
                    className="w-24 h-24 object-cover rounded"
                    src={record.product.image}
                    alt={record.product.title}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium">
                    {record.product.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{record.product.content}</p>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-red-600">
                      ¥{record.product.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="客户信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="姓名">
                {record?.user?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {record?.user?.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="电话">
                {record?.user?.phone || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="商家信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="商家名称">
                {record?.merchant?.name || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="推广员信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="推广员">
                {record?.affiliate?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {record?.affiliate?.email || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="金额分配">
            <Descriptions column={1}>
              <Descriptions.Item label="推广员分成">
                ¥{record?.affiliateAmount?.toFixed(2) || "0.00"}
              </Descriptions.Item>
              <Descriptions.Item label="商家分成">
                ¥{record?.merchantAmount?.toFixed(2) || "0.00"}
              </Descriptions.Item>
              <Descriptions.Item label="平台分成">
                ¥{record?.platformAmount?.toFixed(2) || "0.00"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
