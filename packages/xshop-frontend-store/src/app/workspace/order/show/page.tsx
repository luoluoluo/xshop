"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Descriptions,
  Tag,
  Image,
  Space,
  Row,
  Col,
  Breadcrumb,
  Popconfirm,
} from "antd";
import { ArrowLeftOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrder, refundOrder } from "@/requests/order.client";
import { Order, OrderStatus } from "@/generated/graphql";
import dayjs from "dayjs";
import Link from "next/link";

interface OrderResponse {
  order: Order;
}

export default function OrderShowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      void fetchOrder();
    } else {
      message.error("缺少订单ID参数");
      router.push("/workspace/order");
    }
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const response = await getOrder({ id: orderId });
      if (response.data) {
        const data = response.data as OrderResponse;
        setOrder(data.order);
      } else {
        message.error("订单不存在");
        router.push("/workspace/order");
      }
    } catch (error) {
      message.error("获取订单信息失败");
      console.error("Error fetching order:", error);
      router.push("/workspace/order");
    } finally {
      setLoading(false);
    }
  };

  // 退款订单
  const handleRefund = async () => {
    if (!order) return;

    try {
      await refundOrder({ id: order.id });
      void fetchOrder();
      message.success("订单已退款");
    } catch (error) {
      message.error("退款失败");
      console.error("Error refunding order:", error);
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: OrderStatus | null | undefined) => {
    switch (status) {
      case OrderStatus.Created:
        return "blue";
      case OrderStatus.Paid:
        return "orange";
      case OrderStatus.Completed:
        return "green";
      case OrderStatus.Cancelled:
        return "red";
      case OrderStatus.Refunded:
        return "purple";
      default:
        return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: OrderStatus | null | undefined) => {
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
        return "未知";
    }
  };

  // 格式化日期
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  };

  if (!order) {
    return <div>订单不存在</div>;
  }

  return (
    <div>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/order">订单列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>订单详情</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="订单信息"
        size="small"
        loading={loading}
        extra={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/workspace/order")}
            >
              返回列表
            </Button>
            {/* 只有已支付或已完成的订单才能退款 */}
            {(order.status === OrderStatus.Paid ||
              order.status === OrderStatus.Completed) && (
              <Popconfirm
                title="确定退款此订单吗？"
                onConfirm={() => void handleRefund()}
              >
                <Button type="primary" danger icon={<RollbackOutlined />}>
                  退款
                </Button>
              </Popconfirm>
            )}
          </Space>
        }
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="订单ID">{order.id}</Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="商品标题">
            {order.productTitle || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="商品图片">
            {order.productImage ? (
              <Image src={order.productImage} width={100} height={100} />
            ) : (
              <div className="text-center py-8 text-gray-500">暂无图片</div>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="商品价格">
            ¥{order.productPrice || 0}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            ¥{order.amount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            {order.quantity || 0}
          </Descriptions.Item>
          <Descriptions.Item label="商家收入">
            ¥{order.merchantAmount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="推广佣金">
            ¥{order.affiliateAmount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="收货人">
            {order.receiverName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="收货电话">
            {order.receiverPhone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {order.note || "-"}
          </Descriptions.Item>
        </Descriptions>

        {/* 用户信息 */}
        <Card title="用户信息" size="small" className="!mt-4">
          <Row gutter={16}>
            <Col span={8}>
              <Card size="small" title="客户信息">
                {order.customer ? (
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="姓名">
                      {order.customer.name || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="电话">
                      {order.customer.phone || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    无客户信息
                  </div>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="商家信息">
                {order.merchant ? (
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="姓名">
                      {order.merchant.name || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="电话">
                      {order.merchant.phone || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    无商家信息
                  </div>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="推广员信息">
                {order.affiliate ? (
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="姓名">
                      {order.affiliate.name || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="电话">
                      {order.affiliate.phone || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    无推广员信息
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Card>

        {/* 时间信息 */}
        <Card title="时间信息" size="small" className="!mt-4">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="创建时间">
              {formatDate(order.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {formatDate(order.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="支付时间">
              {formatDate(order.paidAt)}
            </Descriptions.Item>
            <Descriptions.Item label="完成时间">
              {formatDate(order.completedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="取消时间">
              {formatDate(order.cancelledAt)}
            </Descriptions.Item>
            <Descriptions.Item label="退款时间">
              {formatDate(order.refundedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </div>
  );
}
