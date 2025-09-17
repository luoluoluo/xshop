import { Show } from "@refinedev/antd";
import { Typography, Tag, Card, Descriptions, Space } from "antd";
import { parse } from "graphql";
import { WITHDRAWAL_QUERY } from "../../requests/withdrawal.graphql";
import { Withdrawal, WithdrawalStatus } from "../../generated/graphql";
import { useShow, useTranslate } from "@refinedev/core";

const { Title, Text } = Typography;

export const WithdrawalShow = () => {
  const t = useTranslate();
  const { query } = useShow({
    meta: {
      gqlQuery: parse(WITHDRAWAL_QUERY),
    },
  });
  const { data, isLoading } = query;
  const record = data?.data as Withdrawal;

  const getStatusColor = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.Created:
        return "processing";
      case WithdrawalStatus.Completed:
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.Created:
        return "待处理";
      case WithdrawalStatus.Completed:
        return "已完成";
      default:
        return status;
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={4}>{t("withdrawal.titles.show")}</Title>
            <Text type="secondary">查看提现申请的详细信息</Text>
          </div>

          <Descriptions column={1} bordered>
            <Descriptions.Item label={t("withdrawal.fields.id")}>
              {record?.id}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.amount")}>
              <Text strong>¥{record?.amount?.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.taxAmount")}>
              ¥{record?.taxAmount?.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.afterTaxAmount")}>
              <Text strong type="success">
                ¥{record?.afterTaxAmount?.toFixed(2)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.status")}>
              <Tag color={getStatusColor(record?.status as WithdrawalStatus)}>
                {getStatusText(record?.status as WithdrawalStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.bankAccountName")}>
              {record?.bankAccountName}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.bankAccountNumber")}>
              {record?.bankAccountNumber?.replace(/(.{4}).*(.{4})/, "$1****$2")}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.note")}>
              {record?.note || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.createdAt")}>
              {record?.createdAt
                ? new Date(record.createdAt).toLocaleString()
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("withdrawal.fields.completedAt")}>
              {record?.completedAt
                ? new Date(record.completedAt).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </Show>
  );
};
