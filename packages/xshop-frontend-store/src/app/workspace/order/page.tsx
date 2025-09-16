"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Tag,
  Popconfirm,
  message,
  Breadcrumb,
  Typography,
  Tabs,
} from "antd";
import { RollbackOutlined, EyeOutlined } from "@ant-design/icons";
import { getOrders, refundOrder } from "@/requests/order.client";
import {
  Order,
  OrderPagination,
  OrderWhereInput,
  OrderStatus,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Text } = Typography;

export default function OrderListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [orderPagination, setOrderPagination] = useState<OrderPagination>();
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();

  const [orderVariables, setOrderVariables] = useState<{
    where?: OrderWhereInput;
    skip?: number;
    take?: number;
  }>({
    skip: 0,
    take: 10,
  });

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(orderVariables);

      if (response.data) {
        setOrderPagination(response.data.orders);
      }
    } catch (error) {
      message.error("获取订单列表失败");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    void fetchOrders();
  }, [orderVariables]);

  // 退款订单
  const handleRefund = async (id: string) => {
    try {
      await refundOrder({ id });
      void fetchOrders();
      message.success("订单已退款");
    } catch (error) {
      message.error("退款失败");
      console.error("Error refunding order:", error);
    }
  };

  // 查看订单详情
  const handleView = (order: Order) => {
    router.push(`/workspace/order/show?id=${order.id}`);
  };

  // 状态筛选
  const handleStatusFilter = (status: OrderStatus | undefined) => {
    setSelectedStatus(status);
    setOrderVariables({
      ...orderVariables,
      where: status ? { status } : undefined,
      skip: 0,
    });
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
    return new Date(date).toLocaleString("zh-CN");
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>订单列表</Breadcrumb.Item>
      </Breadcrumb>

      {/* 状态筛选 */}
      <Tabs
        activeKey={selectedStatus?.toString() || ""}
        onChange={(key) => handleStatusFilter(key as OrderStatus)}
        items={[
          {
            label: "全部",
            key: "",
          },
          {
            label: "待发货",
            key: OrderStatus.Created,
          },
          {
            label: "待收货",
            key: OrderStatus.Paid,
          },
          {
            label: "已完成",
            key: OrderStatus.Completed,
          },

          {
            label: "已退款",
            key: OrderStatus.Refunded,
          },
        ]}
      />

      <List
        loading={loading || !orderPagination}
        className="!mt-4"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        pagination={{
          total: orderPagination?.total,
          pageSize: orderVariables.take ?? 10,
          current: (orderVariables.skip ?? 0) / (orderVariables.take ?? 10) + 1,
          onChange: (page, pageSize) => {
            setOrderVariables({
              ...orderVariables,
              skip: (page - 1) * pageSize,
              take: pageSize,
            });
          },
        }}
        dataSource={orderPagination?.data}
        renderItem={(order) => (
          <List.Item>
            <Card
              key={order.id}
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  color="green"
                  onClick={() => handleView(order)}
                >
                  详情
                </Button>,
                // 只有已支付或已完成的订单才能退款
                (order.status === OrderStatus.Paid ||
                  order.status === OrderStatus.Completed) && (
                  <Popconfirm
                    title="确定退款此订单吗？"
                    onConfirm={() => void handleRefund(order.id)}
                  >
                    <Button
                      type="link"
                      icon={<RollbackOutlined />}
                      color="orange"
                    >
                      退款
                    </Button>
                  </Popconfirm>
                ),
              ].filter(Boolean)}
            >
              <Card.Meta
                title={
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong className="text-sm">
                        订单号: {order.id}
                      </Text>
                      <br />
                      <Text className="text-xs text-gray-500">
                        {order.productTitle}
                      </Text>
                    </div>
                    <Tag color={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Text strong>金额: </Text>
                        <Text className="text-red-500">¥{order.amount}</Text>
                      </div>
                      <div>
                        <Text strong>数量: </Text>
                        <Text>{order.quantity}</Text>
                      </div>
                      <div>
                        <Text strong>收货人: </Text>
                        <Text>{order.receiverName}</Text>
                      </div>
                      <div>
                        <Text strong>收货电话: </Text>
                        <Text>{order.receiverPhone}</Text>
                      </div>
                    </div>

                    {order.customer && (
                      <div className="text-xs">
                        <Text strong>客户: </Text>
                        <Text>
                          {order.customer.name} ({order.customer.phone})
                        </Text>
                      </div>
                    )}

                    {order.affiliate && (
                      <div className="text-xs">
                        <Text strong>推广员: </Text>
                        <Text>
                          {order.affiliate.name} ({order.affiliate.phone})
                        </Text>
                        {order.affiliateAmount && (
                          <Text className="text-green-500 ml-2">
                            佣金: ¥{order.affiliateAmount}
                          </Text>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <div>创建时间: {formatDate(order.createdAt)}</div>
                      {order.paidAt && (
                        <div>支付时间: {formatDate(order.paidAt)}</div>
                      )}
                      {order.completedAt && (
                        <div>完成时间: {formatDate(order.completedAt)}</div>
                      )}
                      {order.refundedAt && (
                        <div>退款时间: {formatDate(order.refundedAt)}</div>
                      )}
                    </div>

                    {order.note && (
                      <div className="text-xs">
                        <Text strong>备注: </Text>
                        <Text>{order.note}</Text>
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}
