"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Tag,
  message,
  Breadcrumb,
  Typography,
  Tabs,
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { getWithdrawals } from "@/requests/withdrawal.client";
import {
  Withdrawal,
  WithdrawalPagination,
  WithdrawalWhereInput,
  WithdrawalStatus,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Text } = Typography;

export default function WithdrawalListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [withdrawalPagination, setWithdrawalPagination] =
    useState<WithdrawalPagination>();
  const [selectedStatus, setSelectedStatus] = useState<
    WithdrawalStatus | undefined
  >();

  const [withdrawalVariables, setWithdrawalVariables] = useState<{
    where?: WithdrawalWhereInput;
    skip?: number;
    take?: number;
  }>({
    skip: 0,
    take: 10,
  });

  // 获取提现列表
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await getWithdrawals(withdrawalVariables);

      if (response.data) {
        setWithdrawalPagination(response.data.withdrawals);
      }
    } catch (error) {
      message.error("获取提现列表失败");
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    void fetchWithdrawals();
  }, [withdrawalVariables]);

  // 跳转到创建提现页面
  const handleCreateWithdrawal = () => {
    router.push("/workspace/withdrawal/create");
  };

  // 查看提现详情
  const handleView = (withdrawal: Withdrawal) => {
    router.push(`/workspace/withdrawal/show?id=${withdrawal.id}`);
  };

  // 状态筛选
  const handleStatusFilter = (status: WithdrawalStatus | undefined) => {
    setSelectedStatus(status);
    setWithdrawalVariables({
      ...withdrawalVariables,
      where: status ? { status } : undefined,
      skip: 0,
    });
  };

  // 获取状态标签颜色
  const getStatusColor = (status: WithdrawalStatus | null | undefined) => {
    switch (status) {
      case WithdrawalStatus.Created:
        return "blue";
      case WithdrawalStatus.Completed:
        return "green";
      default:
        return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: WithdrawalStatus | null | undefined) => {
    switch (status) {
      case WithdrawalStatus.Created:
        return "提现中";
      case WithdrawalStatus.Completed:
        return "已完成";
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
        <Breadcrumb.Item>提现管理</Breadcrumb.Item>
      </Breadcrumb>

      {/* 操作按钮 */}
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateWithdrawal}
        >
          申请提现
        </Button>
      </div>

      {/* 状态筛选 */}
      <Tabs
        activeKey={selectedStatus?.toString() || ""}
        onChange={(key) => handleStatusFilter(key as WithdrawalStatus)}
        items={[
          {
            label: "全部",
            key: "",
          },
          {
            label: "提现中",
            key: WithdrawalStatus.Created,
          },
          {
            label: "已完成",
            key: WithdrawalStatus.Completed,
          },
        ]}
      />

      <List
        loading={loading || !withdrawalPagination}
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
          total: withdrawalPagination?.total,
          pageSize: withdrawalVariables.take ?? 10,
          current:
            (withdrawalVariables.skip ?? 0) / (withdrawalVariables.take ?? 10) +
            1,
          onChange: (page, pageSize) => {
            setWithdrawalVariables({
              ...withdrawalVariables,
              skip: (page - 1) * pageSize,
              take: pageSize,
            });
          },
        }}
        dataSource={withdrawalPagination?.data}
        renderItem={(withdrawal) => (
          <List.Item>
            <Card
              key={withdrawal.id}
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  color="green"
                  onClick={() => handleView(withdrawal)}
                >
                  详情
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong className="text-sm">
                        提现单号: {withdrawal.id}
                      </Text>
                      <br />
                      <Text className="text-xs text-gray-500">
                        {withdrawal.bankAccountName} -{" "}
                        {withdrawal.bankAccountNumber}
                      </Text>
                    </div>
                    <Tag color={getStatusColor(withdrawal.status)}>
                      {getStatusText(withdrawal.status)}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Text strong>提现金额: </Text>
                        <Text className="text-red-500">
                          ¥{withdrawal.amount}
                        </Text>
                      </div>
                      <div>
                        <Text strong>税费: </Text>
                        <Text className="text-orange-500">
                          ¥{withdrawal.taxAmount}
                        </Text>
                      </div>
                      <div>
                        <Text strong>实际到账: </Text>
                        <Text className="text-green-500">
                          ¥{withdrawal.afterTaxAmount}
                        </Text>
                      </div>
                      <div>
                        <Text strong>银行账户: </Text>
                        <Text>{withdrawal.bankAccountNumber}</Text>
                      </div>
                    </div>

                    {withdrawal.user && (
                      <div className="text-xs">
                        <Text strong>申请人: </Text>
                        <Text>
                          {withdrawal.user.name} ({withdrawal.user.phone})
                        </Text>
                        <Text className="text-gray-500 ml-2">
                          余额: ¥{withdrawal.user.balance}
                        </Text>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <div>
                        申请时间:{" "}
                        {formatDate(withdrawal.createdAt as string | null)}
                      </div>
                      {withdrawal.approvedAt && (
                        <div>
                          审核时间:{" "}
                          {formatDate(withdrawal.approvedAt as string | null)}
                        </div>
                      )}
                      {withdrawal.completedAt && (
                        <div>
                          完成时间:{" "}
                          {formatDate(withdrawal.completedAt as string | null)}
                        </div>
                      )}
                    </div>

                    {withdrawal.note && (
                      <div className="text-xs">
                        <Text strong>备注: </Text>
                        <Text>{withdrawal.note}</Text>
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
