import { List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";

import { Merchant, MerchantWithdrawalStatus } from "../../generated/graphql";
import { getMerchantWithdrawals } from "../../requests/merchant-withdrawal";
import dayjs from "dayjs";

export const MerchantWithdrawalList = () => {
  const t = useTranslate();

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getMerchantWithdrawals),
    },
  });

  const { data: me } = useGetIdentity<Merchant>();

  const getStatusColor = (status: MerchantWithdrawalStatus) => {
    switch (status) {
      case MerchantWithdrawalStatus.Created:
        return "processing";
      case MerchantWithdrawalStatus.Approved:
        return "warning";
      case MerchantWithdrawalStatus.Completed:
        return "success";
      case MerchantWithdrawalStatus.Rejected:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: MerchantWithdrawalStatus) => {
    switch (status) {
      case MerchantWithdrawalStatus.Created:
        return "待处理";
      case MerchantWithdrawalStatus.Approved:
        return "已通过";
      case MerchantWithdrawalStatus.Completed:
        return "已完成";
      case MerchantWithdrawalStatus.Rejected:
        return "已拒绝";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="text-2xl font-bold mb-4">我的余额：¥{me?.balance}</div>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={t("merchantWithdrawal.fields.id")}
          />

          <Table.Column
            dataIndex="amount"
            title={t("merchantWithdrawal.fields.amount")}
            render={(amount: number) => `¥${amount?.toFixed(2) || "0.00"}`}
          />
          <Table.Column
            dataIndex="bankName"
            title={t("merchantWithdrawal.fields.bank")}
            render={(bankName: string, record: any) => (
              <div>
                <div className="font-medium">{bankName || "-"}</div>
                <div className="text-sm text-gray-500">
                  {record.accountName || "-"}
                </div>
                <div className="text-sm text-gray-500">
                  {record.bankAccount || "-"}
                </div>
              </div>
            )}
          />
          <Table.Column
            dataIndex="status"
            title={t("merchantWithdrawal.fields.status")}
            render={(status: MerchantWithdrawalStatus) => (
              <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            )}
          />
          <Table.Column
            dataIndex="note"
            title={t("merchantWithdrawal.fields.note")}
            render={(note: string) => (
              <Tooltip title={note}>
                <span className="truncate max-w-20 block">{note || "-"}</span>
              </Tooltip>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title={t("merchantWithdrawal.fields.createdAt")}
            render={(date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
          />
          <Table.Column
            dataIndex="approvedAt"
            title={t("merchantWithdrawal.fields.approvedAt")}
            render={(date: string) =>
              date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
            }
          />
          <Table.Column
            dataIndex="completedAt"
            title={t("merchantWithdrawal.fields.completedAt")}
            render={(date: string) =>
              date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
            }
          />
        </Table>
      </List>
    </>
  );
};
