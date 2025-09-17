import { List, useTable } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Table, Tag, Space, Descriptions, Button, Popconfirm } from "antd";
import { parse } from "graphql";
import { WITHDRAWALS_QUERY } from "../../requests/withdrawal.graphql";
import { User, Withdrawal, WithdrawalStatus } from "../../generated/graphql";
import { completeWithdrawal } from "../../requests/withdrawal";

export const WithdrawalList = () => {
  const t = useTranslate();
  const { tableProps, tableQuery } = useTable({
    meta: {
      gqlQuery: parse(WITHDRAWALS_QUERY),
    },
  });

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
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={t("withdrawal.fields.id")} />
        <Table.Column
          dataIndex="user"
          title={t("withdrawal.fields.user")}
          render={(user: User) => {
            return (
              <Descriptions title={t("withdrawal.fields.user")}>
                <Descriptions.Item label={t("withdrawal.fields.id")}>
                  {user?.id}
                </Descriptions.Item>
                <Descriptions.Item label={t("withdrawal.fields.name")}>
                  {user?.name}
                </Descriptions.Item>
                <Descriptions.Item label={t("withdrawal.fields.phone")}>
                  {user?.phone}
                </Descriptions.Item>
                <Descriptions.Item label={t("withdrawal.fields.balance")}>
                  ¥{user?.balance?.toFixed(2)}
                </Descriptions.Item>
              </Descriptions>
            );
          }}
        />
        <Table.Column
          dataIndex="amount"
          title={t("withdrawal.fields.amount")}
          render={(amount: number) => {
            return <span>¥{amount?.toFixed(2)}</span>;
          }}
        />
        <Table.Column
          dataIndex="taxAmount"
          title={t("withdrawal.fields.taxAmount")}
          render={(taxAmount: number) => {
            return <span>¥{taxAmount?.toFixed(2)}</span>;
          }}
        />
        <Table.Column
          dataIndex="afterTaxAmount"
          title={t("withdrawal.fields.afterTaxAmount")}
          render={(afterTaxAmount: number) => {
            return <span>¥{afterTaxAmount?.toFixed(2)}</span>;
          }}
        />
        <Table.Column
          dataIndex="status"
          title={t("withdrawal.fields.status")}
          render={(status: WithdrawalStatus) => (
            <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
          )}
        />
        <Table.Column
          dataIndex="bankAccountName"
          title={t("withdrawal.fields.bankAccountName")}
        />
        <Table.Column
          dataIndex="bankAccountNumber"
          title={t("withdrawal.fields.bankAccountNumber")}
          render={(bankAccountNumber: string) => {
            return (
              <span>
                {bankAccountNumber?.replace(/(.{4}).*(.{4})/, "$1****$2")}
              </span>
            );
          }}
        />
        <Table.Column
          dataIndex="note"
          title={t("withdrawal.fields.note")}
          render={(note: string) => {
            return (
              <div className="w-32 text-ellipsis overflow-hidden">
                {note || "-"}
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="createdAt"
          title={t("withdrawal.fields.createdAt")}
          render={(createdAt: string) => {
            return new Date(createdAt).toLocaleString();
          }}
        />
        <Table.Column
          dataIndex="completedAt"
          title={t("withdrawal.fields.completedAt")}
          render={(completedAt: string) => {
            return completedAt ? new Date(completedAt).toLocaleString() : "-";
          }}
        />
        <Table.Column
          fixed="right"
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: Withdrawal) => (
            <Space direction="vertical">
              <Popconfirm
                title={t("withdrawal.fields.completeConfirm")}
                onConfirm={() => {
                  completeWithdrawal({ id: record.id });
                  tableQuery.refetch();
                }}
              >
                <Button size="small">{t("withdrawal.fields.complete")}</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
