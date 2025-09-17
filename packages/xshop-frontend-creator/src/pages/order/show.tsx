import { Show } from "@refinedev/antd";
import { useShow, useTranslate } from "@refinedev/core";
import { Descriptions, Tag, Card, Row, Col, Divider } from "antd";
import { parse } from "graphql";
import { ORDER_QUERY } from "../../requests/order.graphql";
import { getStatusColor, getStatusText } from "../../utils/order";
import dayjs from "dayjs";

export const OrderShow = () => {
  const t = useTranslate();
  const { query } = useShow({
    meta: {
      gqlQuery: parse(ORDER_QUERY),
    },
  });
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Card title="订单信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="订单号">{record?.code}</Descriptions.Item>
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
              ? dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="支付时间">
            {record?.paidAt
              ? dayjs(record.paidAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="完成时间">
            {record?.completedAt
              ? dayjs(record.completedAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="取消时间">
            {record?.cancelledAt
              ? dayjs(record.cancelledAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="退款时间">
            {record?.refundedAt
              ? dayjs(record.refundedAt).format("YYYY-MM-DD HH:mm:ss")
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
              <h3 className="text-lg font-medium">{record.product.title}</h3>
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

      <Card title="推广者信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="推广者">
            {record?.affiliate?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {record?.affiliate?.email || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="金额分配">
        <Descriptions column={1}>
          <Descriptions.Item label="推广者分成">
            ¥{record?.affiliateAmount?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="商家分成">
            ¥{record?.merchantAmount?.toFixed(2) || "0.00"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};
